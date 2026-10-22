const DEFAULT_SUPABASE_URL = "https://azwxwcjalbuhyqtziava.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pp83WOrd4BP5Tm_rhgX5Ig_xiadWZCn";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
};

type SupabaseAuthResponse = SupabaseSession & {
  expires_in?: number;
};

const sessionKey = "reveenorth:supabase-session";

class SupabaseRequestError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function headers(accessToken?: string) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

async function request<T>(path: string, init: RequestInit = {}, accessToken?: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase nao configurado.");
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      ...headers(accessToken),
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || "Nao foi possivel concluir a acao.";
    throw new SupabaseRequestError(message, response.status);
  }

  return data as T;
}

function normalizeSession(data: SupabaseAuthResponse): SupabaseSession {
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at ?? (data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : undefined),
    user: data.user,
  };
}

export function saveSession(session: SupabaseSession | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(sessionKey);
    return;
  }
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

export function readSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(sessionKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SupabaseSession;
  } catch {
    return null;
  }
}

const refreshing = new Map<string, Promise<SupabaseSession>>();

export async function refreshSession(session: SupabaseSession) {
  let pending = refreshing.get(session.refresh_token);
  if (!pending) {
    pending = (async () => {
      const data = await request<SupabaseAuthResponse>("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: JSON.stringify({ refresh_token: session.refresh_token }),
      });
      const nextSession = normalizeSession(data);
      saveSession(nextSession);
      return nextSession;
    })();
    refreshing.set(session.refresh_token, pending);
  }
  try {
    return await pending;
  } finally {
    if (refreshing.get(session.refresh_token) === pending) refreshing.delete(session.refresh_token);
  }
}

async function authenticatedRequest<T>(session: SupabaseSession, path: string, init: RequestInit) {
  const stored = readSession();
  let current = stored?.user.id === session.user.id ? stored : session;
  if (current.expires_at && current.expires_at < Math.floor(Date.now() / 1000) + 60) {
    current = await refreshSession(current);
  }
  try {
    return await request<T>(path, init, current.access_token);
  } catch (error) {
    if (!(error instanceof SupabaseRequestError) || error.status !== 401) throw error;
    current = await refreshSession(current);
    return request<T>(path, init, current.access_token);
  }
}

export async function signInWithPassword(email: string, password: string) {
  const data = await request<SupabaseAuthResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const session = normalizeSession(data);
  saveSession(session);
  return session;
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const data = await request<SupabaseAuthResponse>("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName },
    }),
  });
  const session = data.access_token ? normalizeSession(data) : null;
  saveSession(session);
  return session;
}

export async function sendPasswordRecovery(email: string) {
  await request("/auth/v1/recover", {
    method: "POST",
    body: JSON.stringify({
      email,
      redirect_to: typeof window !== "undefined" ? window.location.origin : undefined,
    }),
  });
}

export async function signOut(session: SupabaseSession | null) {
  if (session?.access_token) {
    await request("/auth/v1/logout", { method: "POST" }, session.access_token).catch(() => undefined);
  }
  saveSession(null);
}

export async function loadCloudState<T>(session: SupabaseSession) {
  const rows = await authenticatedRequest<{ state: T }[]>(
    session,
    `/rest/v1/reveenorth_app_state?user_id=eq.${session.user.id}&select=state`,
    { method: "GET" },
  );
  return rows[0]?.state ?? null;
}

const pendingSaves = new Map<string, Promise<unknown>>();

export async function saveCloudState<T>(session: SupabaseSession, state: T) {
  const body = JSON.stringify({ user_id: session.user.id, state, updated_at: new Date().toISOString() });
  const previous = pendingSaves.get(session.user.id) ?? Promise.resolve();
  const pending = previous.catch(() => undefined).then(() => authenticatedRequest(
    session,
    "/rest/v1/reveenorth_app_state?on_conflict=user_id",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body,
    },
  ));
  pendingSaves.set(session.user.id, pending);
  try {
    await pending;
  } finally {
    if (pendingSaves.get(session.user.id) === pending) pendingSaves.delete(session.user.id);
  }
}
