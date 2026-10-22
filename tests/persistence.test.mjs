import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mergePersonalIncomes } from '../lib/personal-incomes.ts';
import { saveCloudState, loadCloudState } from '../lib/supabase-lite.ts';

const originalFetch = globalThis.fetch;
const session = { user: { id: 'test-user' }, access_token: 'test-token', refresh_token: 'test-refresh' };
afterEach(() => { globalThis.fetch = originalFetch; delete globalThis.window; delete globalThis.localStorage; });
const response = (value, status = 200) => new Response(JSON.stringify(value), { status });

test('payroll appears once, preserving independent same-day same-value income and source records', () => {
  const linked = { id: -10, linkedBusinessPayrollId: 10, amount: 200, receivedDate: '2026-09-02' };
  const independent = { id: 20, amount: 200, receivedDate: '2026-09-02' };
  const historical = { id: 30, amount: 300, receivedDate: '2026-08-01' };
  const stored = [linked, independent, historical];
  const before = JSON.stringify(stored);
  assert.deepEqual(mergePersonalIncomes(stored, [linked]), [independent, historical, linked]);
  assert.equal(JSON.stringify(stored), before);
});

test('a linked record remains when its payroll source is absent', () => {
  const stored = [{ id: -10, linkedBusinessPayrollId: 10, amount: 200 }];
  assert.deepEqual(mergePersonalIncomes(stored, []), stored);
});

test('cloud writes are serialized so a slow older request cannot overwrite a newer one', async () => {
  const starts = [], finishes = [];
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  globalThis.fetch = async (_url, init) => {
    const revision = JSON.parse(init.body).state.revision;
    starts.push(revision);
    if (revision === 1) await gate;
    finishes.push(revision);
    return response(null);
  };
  const first = saveCloudState(session, { revision: 1 });
  const second = saveCloudState(session, { revision: 2 });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(starts, [1]);
  release();
  await Promise.all([first, second]);
  assert.deepEqual(finishes, [1, 2]);
});

test('failed save reports its error and does not block the next save', async () => {
  let calls = 0;
  globalThis.fetch = async () => ++calls === 1 ? response({ message: 'database unavailable' }, 503) : response(null);
  const first = saveCloudState(session, { revision: 1 });
  const second = saveCloudState(session, { revision: 2 });
  await assert.rejects(first, /database unavailable/);
  await second;
  assert.equal(calls, 2);
});

test('an expired session is renewed before writing and the renewed session is retained', async () => {
  const storage = new Map();
  globalThis.window = {};
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, authorization: init.headers.Authorization });
    return url.includes('/auth/')
      ? response({ ...session, access_token: 'renewed-token', expires_in: 3600 })
      : response(null);
  };
  await saveCloudState({ ...session, expires_at: 1 }, { revision: 1 });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].authorization, 'Bearer renewed-token');
  assert.equal(JSON.parse(storage.get('reveenorth:supabase-session')).access_token, 'renewed-token');
});

test('401 is retried once after renewal; persistent failures remain visible', async () => {
  let calls = 0;
  globalThis.fetch = async url => {
    calls++;
    return url.includes('/auth/') ? response({ ...session, access_token: 'renewed-token', expires_in: 3600 }) : response({message: 'unauthorized'}, 401);
  };
  await assert.rejects(saveCloudState(session, {}), /unauthorized/);
  assert.equal(calls, 3);
});

test('read-back returns the full saved state including previous months', async () => {
  const state = { incomes: [{ receivedDate: '2026-08-01', amount: 10 }], variableExpenses: [{ date: '2026-09-01', amount: 5 }] };
  let saved;
  globalThis.fetch = async (_url, init) => {
    if (init.method === 'POST') { saved = JSON.parse(init.body).state; return response(null); }
    return response([{ state: saved }]);
  };
  await saveCloudState(session, state);
  assert.deepEqual(await loadCloudState(session), state);
});
