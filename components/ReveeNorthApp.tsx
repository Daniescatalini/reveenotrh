"use client";

import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BadgeDollarSign,
  Bone,
  BookOpen,
  Briefcase,
  Brush,
  Building2,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  Coins,
  Cross,
  CreditCard,
  Database,
  Download,
  Dumbbell,
  Eye,
  EyeOff,
  FileText,
  Flag,
  Folder,
  Fuel,
  GraduationCap,
  Heart,
  HeartPulse,
  HelpCircle,
  Home,
  Landmark,
  LayoutDashboard,
  LineChart,
  Lock,
  LogOut,
  Mail,
  Menu,
  Moon,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Pencil,
  PiggyBank,
  Plane,
  Gift,
  Plus,
  ReceiptText,
  Repeat,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Shield,
  ShoppingCart,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  TvMinimal,
  Utensils,
  Volleyball,
  Medal,
  User,
  UserRound,
  Users,
  Wallet,
  Wifi,
  X,
  Zap,
  Droplets,
} from "lucide-react";
import {
  daysBetween,
  formatCurrency,
  formatDate,
  initialCategories,
  monthKey,
  sum,
  type Bill,
  type BillStatus,
  type Category,
  type Goal,
  type Income,
  type MonthlyObjective,
} from "@/lib/data";
import {
  loadCloudState,
  readSession,
  refreshSession,
  saveCloudState,
  sendPasswordRecovery,
  signInWithPassword,
  signOut,
  signUpWithPassword,
} from "@/lib/supabase-lite";
import type { SupabaseSession } from "@/lib/supabase-lite";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Entradas", icon: ArrowDownLeft },
  { label: "Contas", icon: ReceiptText },
  { label: "Metas", icon: Target },
  { label: "Objetivos do mês", icon: Flag },
  { label: "Planejamento", icon: LineChart },
  { label: "Relatórios", icon: FileText },
];

const DEFAULT_ACCOUNT_CREATED_AT = "2026-06-11";

const statusLabels: Record<BillStatus | "todas", string> = {
  todas: "Todas",
  pendente: "Pendentes",
  paga: "Pagas",
  atrasada: "Atrasadas",
};

const iconMap = {
  Home,
  Zap,
  Droplets,
  Wifi,
  CreditCard,
  ShoppingCart,
  Utensils,
  Sparkles,
  Wallet,
  Briefcase,
  RefreshCw,
  Target,
  PiggyBank,
  CircleDollarSign,
  Shield,
  Palette,
  Database,
  Lock,
  Bell,
  Landmark,
  Gift,
  Folder,
  BarChart3,
  HeartPulse,
  Cross,
  Bone,
  BookOpen,
  ShoppingBag,
  Brush,
  Dumbbell,
  Car,
  Fuel,
  Plane,
  Smartphone,
  GraduationCap,
  Volleyball,
  SoccerBall: SoccerBallIcon,
  BadgeDollarSign,
  Coins,
  TvMinimal,
  CircleAlert,
};

const iconChoices = Object.keys(iconMap);
const visualIconChoices = [
  { id: "Home", Icon: Home, label: "Moradia" },
  { id: "Zap", Icon: Zap, label: "Luz" },
  { id: "Droplets", Icon: Droplets, label: "Água" },
  { id: "Wifi", Icon: Wifi, label: "Internet" },
  { id: "Utensils", Icon: Utensils, label: "Alimentação" },
  { id: "CreditCard", Icon: CreditCard, label: "Dívidas" },
  { id: "Car", Icon: Car, label: "Carro" },
  { id: "Cross", Icon: Cross, label: "Saúde" },
  { id: "BookOpen", Icon: BookOpen, label: "Estudos" },
  { id: "SoccerBall", Icon: SoccerBallIcon, label: "Esporte" },
  { id: "BadgeDollarSign", Icon: BadgeDollarSign, label: "Imposto" },
  { id: "TvMinimal", Icon: TvMinimal, label: "Assinaturas" },
  { id: "ShoppingBag", Icon: ShoppingBag, label: "Compras" },
  { id: "Bone", Icon: Bone, label: "Pet" },
  { id: "Heart", Icon: Heart, label: "Autocuidado" },
  { id: "Dumbbell", Icon: Dumbbell, label: "Fitness" },
  { id: "Fuel", Icon: Fuel, label: "Combustível" },
  { id: "Plane", Icon: Plane, label: "Viagem" },
  { id: "Smartphone", Icon: Smartphone, label: "Celular" },
  { id: "CircleAlert", Icon: CircleAlert, label: "Alerta" },
  { id: "Wallet", Icon: Wallet, label: "Carteira" },
  { id: "Target", Icon: Target, label: "Meta" },
  { id: "Sparkles", Icon: Sparkles, label: "Outro" },
  { id: "Landmark", Icon: Landmark, label: "Banco" },
  { id: "Gift", Icon: Gift, label: "Bônus" },
  { id: "Folder", Icon: Folder, label: "Arquivo" },
  { id: "Coins", Icon: Coins, label: "Moedas" },
  { id: "BarChart3", Icon: BarChart3, label: "Relatório" },
  { id: "GraduationCap", Icon: GraduationCap, label: "Formação" },
];
const colorChoices = ["#d75c27", "#211d19", "#2f80ed", "#27ae60", "#f2a93b", "#9b6bdf", "#e74c3c", "#8a7c72", "#14b8a6", "#64748b", "#db2777", "#f59e0b"];
const onboardingExpenseIcons: Record<string, React.ElementType> = {
  Moradia: Home,
  Água: Droplets,
  Luz: Zap,
  Internet: Wifi,
  Alimentação: ShoppingCart,
  Transporte: Car,
  Dívidas: CreditCard,
  Outro: CircleDollarSign,
};

function SoccerBallIcon({ className = "", strokeWidth = 2, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 3.4 2.5-1.3 4H9.9l-1.3-4L12 7Z" />
      <path d="m8.6 9.5-3.1.1" />
      <path d="m15.4 9.5 3.1.1" />
      <path d="m9.9 13.5-2 2.9" />
      <path d="m14.1 13.5 2 2.9" />
      <path d="M12 7V3.3" />
    </svg>
  );
}

type MonthData = {
  selectedMonth: string;
  incomes: Income[];
  bills: Bill[];
  goals: Goal[];
  objectives: MonthlyObjective[];
  previousBills: Bill[];
  previousIncomes: Income[];
};

type UserProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  plan: string;
  photoUrl?: string;
};

type FinancePreferences = {
  currency: string;
  financialMonthStart: number;
  mainIncomeDay: number;
  minimumReserve: number;
  safetyAmount: number;
  personalLimit: number;
  leisureLimit: number;
  defaultGoal: string;
  weekendIsBusinessDay: boolean;
};

type CalculatorRules = {
  bills: number;
  reserve: number;
  goals: number;
  personal: number;
  smartPriority: boolean;
};

type ReveeNorthCloudState = {
  version: 1;
  onboardingComplete: boolean;
  selectedMonth: string;
  accountCreatedAt: string;
  user: UserProfile;
  realBalance: RealBalance;
  bills: Bill[];
  incomes: Income[];
  goals: Goal[];
  objectives: MonthlyObjective[];
  categories: Category[];
  preferences: FinancePreferences;
  rules: CalculatorRules;
  notifications: NotificationSettings;
  security: SecuritySettings;
  darkMode: boolean;
  sidebarCollapsed: boolean;
};

type FinanceDetail = {
  title: string;
  value: number;
  description: string;
  sections: {
    title: string;
    total?: number;
    items: {
      date?: string;
      label: string;
      helper?: string;
      amount: number;
      tone?: "in" | "out" | "neutral";
    }[];
  }[];
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  type: "pagamento" | "meta" | "reserva" | "score" | "organizacao";
  date: string;
  status: "desbloqueada" | "pendente";
};

type MentalLoad = {
  level: "Baixa" | "Controlada" | "Alta";
  reasons: string[];
};

type Checkup = {
  title: string;
  summary: string;
  positives: string[];
  attentions: string[];
  focus: string;
};

type FeedbackToast = {
  id: number;
  title: string;
  message: string;
  kind?: "success" | "achievement";
};

type AppearanceSettings = {
  theme: "light" | "dark" | "system";
  density: "Compacta" | "Confortável" | "Espaçosa";
  glass: boolean;
  shadows: boolean;
  animations: boolean;
};

type NotificationSettings = {
  dueSoon: boolean;
  overdue: boolean;
  goalProgress: boolean;
  freeMoneyLow: boolean;
  incomeReceived: boolean;
  weeklySummary: boolean;
  daysBeforeDue: number;
  preferredTime: string;
};

type SecuritySettings = {
  autoLock: boolean;
  confirmDelete: boolean;
  dataPrivacy: boolean;
  inactivityMinutes: number;
};

type RealBalance = {
  amount: number;
  date: string;
  note: string;
};

type OnboardingData = {
  profileType: "Pessoa Física" | "Empresa" | "";
  financeScope: string;
  familyStatus: string;
  coupleModel: "Individual" | "Casal Integrado" | "Casal Compartilhado" | "";
  hasChildren: string;
  childrenCount: string;
  children: { id: string; name: string; age: string }[];
  monthlyIncome: number;
  incomeSources: { id: string; name: string; type: string; amount: number; day: string; recurring: boolean }[];
  incomeType: string;
  hasDebt: string;
  debtAmount: number;
  fixedExpenses: { id: string; name: string; category: string; amount: number; dueDay: string; fixed: boolean }[];
  hasReserve: string;
  reserveAmount: number;
  goals: string[];
  priority: string;
  financialBehavior: string;
  helpLevel: string;
  northHelp: string[];
  productMode: "North Personal" | "North Family" | "North Business";
};

function parseCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

function moneyToInput(value: number) {
  return formatCurrency(value);
}

function normalizeCategoryName(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function findCategory(categories: Category[], name: string, type?: Category["type"]) {
  const normalized = normalizeCategoryName(name);
  return categories.find(
    (category) =>
      (!type || category.type === type) &&
      normalizeCategoryName(category.name) === normalized,
  );
}

function SafeBillLogo({
  logoUrl,
  fallback,
  className,
}: {
  logoUrl?: string;
  fallback: React.ReactNode;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  if (!logoUrl || failed) return <>{fallback}</>;

  return (
    <img
      src={logoUrl}
      alt=""
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function CategoryBadgeIcon({
  categoryName,
  categories,
  logoUrl,
}: {
  categoryName: string;
  categories: Category[];
  logoUrl?: string;
}) {
  const category = findCategory(categories, categoryName, "conta");
  const Icon = iconMap[(category?.icon ?? "Sparkles") as keyof typeof iconMap] ?? Sparkles;

  const fallback = (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-full"
      style={{ background: `${category?.color ?? "#d75c27"}18`, color: category?.color ?? "#d75c27" }}
    >
      <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
    </span>
  );

  return (
    <SafeBillLogo
      logoUrl={logoUrl}
      fallback={fallback}
      className="h-9 w-9 rounded-full object-cover"
    />
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-3xl p-4 ${className}`}>{children}</div>;
}

function monthLabel(month: string) {
  const date = new Date(`${month}-01T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function todayDisplayLabel() {
  const now = new Date();
  const day = now.getDate();
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(now);
  return `${day === 1 ? "1º" : day} de ${month} de ${now.getFullYear()}`;
}

function getReferenceDate(month: string) {
  const today = getTodayKey();
  const current = today.slice(0, 7);
  if (month === current) return today;
  return `${month}-01`;
}

function addMonths(month: string, offset: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getAccountCreatedAt() {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT_CREATED_AT;
  const saved = localStorage.getItem("reveenorth:account-created-at");
  if (saved) return saved;
  const createdAt = getTodayKey();
  localStorage.setItem("reveenorth:account-created-at", createdAt);
  return createdAt;
}

function buildMonthOptions(accountCreatedAt: string) {
  const startMonth = monthKey(accountCreatedAt);
  const endMonth = addMonths(monthKey(getTodayKey()), 3);
  const options: { value: string; label: string }[] = [];
  for (let value = startMonth; value <= endMonth; value = addMonths(value, 1)) {
    options.push({ value, label: monthLabel(value) });
  }
  return options;
}

function buildMonthRange(fromMonth: string, toMonth: string) {
  const months: string[] = [];
  if (fromMonth > toMonth) return months;
  for (let value = fromMonth; value <= toMonth; value = addMonths(value, 1)) {
    months.push(value);
  }
  return months;
}

function daysOverdue(bill: Bill, referenceDate = getTodayKey()) {
  if (bill.status === "paga") return 0;
  return Math.max(0, daysBetween(bill.dueDate, referenceDate));
}

function isBillOverdue(bill: Bill, referenceDate = getTodayKey()) {
  return bill.status !== "paga" && daysOverdue(bill, referenceDate) > 0;
}

function normalizeBillStatus(bill: Bill, referenceDate = getTodayKey()): Bill {
  if (bill.status === "paga") return bill;
  return { ...bill, status: isBillOverdue(bill, referenceDate) ? "atrasada" : "pendente" };
}

function sortByPaymentPriority(a: Bill, b: Bill) {
  const aOverdueDays = daysOverdue(a);
  const bOverdueDays = daysOverdue(b);
  if (aOverdueDays !== bOverdueDays) return bOverdueDays - aOverdueDays;
  return new Date(`${a.dueDate}T12:00:00`).getTime() - new Date(`${b.dueDate}T12:00:00`).getTime();
}

function nextDueDateForMonth(dueDate: string, targetMonth: string) {
  const due = new Date(`${dueDate}T12:00:00`);
  const [targetYear, targetMonthNumber] = targetMonth.split("-").map(Number);
  const lastDay = new Date(targetYear, targetMonthNumber, 0).getDate();
  const day = Math.min(due.getDate(), lastDay);
  return `${targetMonth}-${String(day).padStart(2, "0")}`;
}

function ensureFixedBillInstances(sourceBills: Bill[], accountCreatedAt: string) {
  const horizon = addMonths(monthKey(getTodayKey()), 3);
  const nextBills = [...sourceBills];
  const existingKeys = new Set(
    nextBills.map((bill) => `${bill.recurrenceId ?? bill.id}:${monthKey(bill.dueDate)}`),
  );
  const fixedRoots = nextBills
    .filter((bill) => bill.fixed)
    .reduce<Record<string, Bill>>((acc, bill) => {
      const key = bill.recurrenceId ?? String(bill.id);
      const currentRoot = acc[key];
      if (!currentRoot || bill.generatedFromId === undefined || bill.dueDate < currentRoot.dueDate) {
        acc[key] = { ...bill, recurrenceId: key };
      }
      return acc;
    }, {});

  Object.values(fixedRoots).forEach((root) => {
    const recurrenceId = root.recurrenceId ?? String(root.id);
    for (let month = addMonths(monthKey(root.dueDate), 1); month <= horizon; month = addMonths(month, 1)) {
      if (month < monthKey(accountCreatedAt) || existingKeys.has(`${recurrenceId}:${month}`)) continue;
      nextBills.push({
        ...root,
        id: Date.now() + nextBills.length,
        dueDate: nextDueDateForMonth(root.dueDate, month),
        status: "pendente",
        paidDate: undefined,
        paidAmount: undefined,
        recurrenceId,
        generatedFromId: root.id,
      });
      existingKeys.add(`${recurrenceId}:${month}`);
    }
  });

  return nextBills.map((bill) => normalizeBillStatus(bill)).sort(sortByPaymentPriority);
}

function readFileAsDataUrl(file: File, maxSize = 320) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(raw);
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => resolve(raw);
      image.src = raw;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function sanitizeLoadedState(state: Partial<ReveeNorthCloudState>, accountCreatedAt: string) {
  return {
    ...state,
    bills: state.bills ? ensureFixedBillInstances(state.bills, state.accountCreatedAt ?? accountCreatedAt) : undefined,
    selectedMonth: state.selectedMonth ?? monthKey(getTodayKey()),
    accountCreatedAt: state.accountCreatedAt ?? accountCreatedAt,
  };
}

function preserveBillLogos(incomingBills: Bill[], currentBills: Bill[]) {
  const currentById = new Map(currentBills.map((bill) => [bill.id, bill]));
  return incomingBills.map((bill) => {
    const currentLogo = currentById.get(bill.id)?.logoUrl;
    return !bill.logoUrl && currentLogo ? { ...bill, logoUrl: currentLogo } : bill;
  });
}

function buildVisibleBills(allBills: Bill[], selectedMonth: string) {
  const currentMonth = monthKey(getTodayKey());
  const normalized = allBills.map((bill) => normalizeBillStatus(bill));
  const monthBills = normalized.filter((bill) => monthKey(bill.dueDate) === selectedMonth);
  if (selectedMonth !== currentMonth) return monthBills.sort(sortByPaymentPriority);
  const carriedOverdue = normalized.filter(
    (bill) => bill.status !== "paga" && monthKey(bill.dueDate) < selectedMonth && isBillOverdue(bill),
  );
  const ids = new Set(monthBills.map((bill) => bill.id));
  return [...carriedOverdue.filter((bill) => !ids.has(bill.id)), ...monthBills].sort(sortByPaymentPriority);
}

function overdueLabel(bill: Bill) {
  const days = daysOverdue(bill);
  if (!days) return "";
  return `em atraso há ${days} dia${days === 1 ? "" : "s"}`;
}

function isPaidLate(bill: Bill) {
  return paidLateDays(bill) > 0;
}

function paidLateDays(bill: Bill) {
  if (typeof bill.paidLateDays === "number") return Math.max(0, bill.paidLateDays);
  return bill.paidDate ? Math.max(0, daysBetween(bill.dueDate, bill.paidDate)) : 0;
}

function monthsUntil(date: string, referenceDate = getTodayKey()) {
  const start = new Date(`${referenceDate}T12:00:00`);
  const end = new Date(`${date}T12:00:00`);
  const rawMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(1, rawMonths + (end.getDate() >= start.getDate() ? 0 : -1));
}

function mergeDefaultCategories(current: Category[]) {
  const migrated = current.map((category) => {
    const name = normalizeCategoryName(category.name);
    if (category.type === "conta" && name === "esporte" && category.icon === "Volleyball") {
      return { ...category, icon: "SoccerBall" };
    }
    if (category.type === "conta" && name === "autocuidado" && category.icon === "Brush") {
      return { ...category, icon: "Heart" };
    }
    return category;
  });
  const existingKeys = new Set(migrated.map((category) => `${category.type}:${normalizeCategoryName(category.name)}`));
  const additions = initialCategories.filter(
    (category) => !existingKeys.has(`${category.type}:${normalizeCategoryName(category.name)}`),
  );
  return additions.length ? [...migrated, ...additions] : migrated;
}

function buildMetrics(data: MonthData) {
  const paidBills = data.bills.filter((bill) => bill.status === "paga");
  const pendingBills = data.bills.filter((bill) => bill.status === "pendente").sort(sortByPaymentPriority);
  const overdueBills = data.bills.filter((bill) => bill.status === "atrasada").sort(sortByPaymentPriority);
  const paidOnTimeBills = paidBills.filter((bill) => !isPaidLate(bill));
  const paidLateBills = paidBills.filter(isPaidLate);
  const totalBills = data.bills.length;
  const totalExpected = sum(data.bills, (bill) => bill.expectedAmount);
  const totalIncome = sum(data.incomes, (income) => income.amount);
  const totalPaid = sum(
    paidBills,
    (bill) => bill.paidAmount ?? bill.expectedAmount,
  );
  const totalPending = sum(pendingBills, (bill) => bill.expectedAmount);
  const totalOverdue = sum(overdueBills, (bill) => bill.expectedAmount);
  const totalMissing = totalPending + totalOverdue;
  const projectedBalance = totalIncome - totalPaid - totalPending - totalOverdue;
  const reserveGoal = data.goals.find((goal) => normalizeCategoryName(goal.name).includes("reserva"));
  const reserveDestination = reserveGoal?.current ?? 0;
  const goalsDestination = sum(
    data.goals.filter((goal) => !normalizeCategoryName(goal.name).includes("reserva")),
    (goal) => goal.current,
  );
  const freeDestination = 0;
  const totalDirected = Math.min(
    totalIncome,
    totalPaid + totalPending + totalOverdue + reserveDestination + goalsDestination + freeDestination,
  );
  const unassignedValue = Math.max(0, totalIncome - totalDirected);
  const previousPaid = sum(
    data.previousBills.filter((bill) => bill.status === "paga"),
    (bill) => bill.paidAmount ?? bill.expectedAmount,
  );
  const previousIncome = sum(data.previousIncomes, (income) => income.amount);
  const spendingDelta = previousPaid
    ? Math.round(((totalPaid - previousPaid) / previousPaid) * 100)
    : 0;
  const incomeDelta = previousIncome
    ? Math.round(((totalIncome - previousIncome) / previousIncome) * 100)
    : 0;
  const urgent =
    [...overdueBills, ...pendingBills].sort(sortByPaymentPriority)[0] ??
    [...pendingBills].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )[0];

  return {
    paidBills,
    paidOnTimeBills,
    paidLateBills,
    pendingBills,
    overdueBills,
    totalBills,
    totalExpected,
    totalIncome,
    totalPaid,
    totalPending,
    totalOverdue,
    totalMissing,
    projectedBalance,
    totalDirected,
    unassignedValue,
    reserveDestination,
    goalsDestination,
    freeDestination,
    spendingDelta,
    incomeDelta,
    urgent,
  };
}

function buildMonthDataFromLists(
  selectedMonth: string,
  incomes: Income[],
  bills: Bill[],
  goals: Goal[],
  objectives: MonthlyObjective[] = [],
) {
  const previousMonth = addMonths(selectedMonth, -1);
  return {
    selectedMonth,
    incomes: incomes.filter((income) => monthKey(income.receivedDate) === selectedMonth),
    bills: buildVisibleBills(bills, selectedMonth),
    goals,
    objectives,
    previousBills: bills.filter((bill) => monthKey(bill.dueDate) === previousMonth).map((bill) => normalizeBillStatus(bill)),
    previousIncomes: incomes.filter((income) => monthKey(income.receivedDate) === previousMonth),
  };
}

function buildPeriodMonthData(
  fromMonth: string,
  toMonth: string,
  incomes: Income[],
  bills: Bill[],
  goals: Goal[],
) {
  const months = buildMonthRange(fromMonth, toMonth);
  const periodIncomes = incomes.filter((income) => {
    const month = monthKey(income.receivedDate);
    return month >= fromMonth && month <= toMonth;
  });
  const periodBills = bills
    .filter((bill) => {
      const month = monthKey(bill.dueDate);
      return month >= fromMonth && month <= toMonth;
    })
    .map((bill) => normalizeBillStatus(bill));
  const periodGoals = goals.filter((goal) => {
    const month = monthKey(goal.deadline);
    return month >= fromMonth && month <= toMonth;
  });
  const previousStart = addMonths(fromMonth, -months.length || -1);
  const previousEnd = addMonths(fromMonth, -1);
  const previousBills = bills
    .filter((bill) => {
      const month = monthKey(bill.dueDate);
      return month >= previousStart && month <= previousEnd;
    })
    .map((bill) => normalizeBillStatus(bill));
  const previousIncomes = incomes.filter((income) => {
    const month = monthKey(income.receivedDate);
    return month >= previousStart && month <= previousEnd;
  });
  return {
    selectedMonth: toMonth,
    incomes: periodIncomes,
    bills: periodBills,
    goals: periodGoals.length ? periodGoals : goals,
    objectives: [],
    previousBills,
    previousIncomes,
  };
}

function calculateNorthScore(metrics: ReturnType<typeof buildMetrics>, goals: Goal[]) {
  const totalBills = Math.max(metrics.totalBills, 1);
  const totalLateDays = sum(metrics.overdueBills, (bill) => daysOverdue(bill));
  const totalPaidLateDays = sum(metrics.paidLateBills, paidLateDays);
  const averageLateDays = metrics.overdueBills.length ? Math.round(totalLateDays / metrics.overdueBills.length) : 0;
  const onTimeRatio = metrics.paidOnTimeBills.length / totalBills;
  const pendingRatio = metrics.pendingBills.length / totalBills;
  const goalProgress = goals.length
    ? Math.min(16, Math.round((sum(goals, (goal) => goal.current) / Math.max(sum(goals, (goal) => goal.target), 1)) * 16))
    : 0;
  const reserveGoal = goals.find((goal) => normalizeCategoryName(goal.name).includes("reserva"));
  const reserveProgress = reserveGoal
    ? Math.min(12, Math.round((reserveGoal.current / Math.max(reserveGoal.target, 1)) * 12))
    : 0;
  const freeMoneyPenalty = metrics.unassignedValue > metrics.totalIncome * 0.18 ? 6 : metrics.unassignedValue > 0 ? 2 : 0;
  const overduePenalty =
    metrics.overdueBills.length * 13 +
    Math.min(30, Math.round(totalLateDays * 0.75)) +
    Math.min(18, averageLateDays);
  const latePaymentPenalty = metrics.paidLateBills.length * 7 + Math.min(18, Math.round(totalPaidLateDays * 0.6));
  const pendingPenalty = Math.round(pendingRatio * 12);
  const onTimeBonus = Math.round(onTimeRatio * 18);
  return Math.max(0, Math.min(100, 52 + onTimeBonus + reserveProgress + goalProgress - overduePenalty - latePaymentPenalty - pendingPenalty - freeMoneyPenalty));
}

function buildAchievements(data: MonthData, metrics: ReturnType<typeof buildMetrics>): Achievement[] {
  const today = getReferenceDate(data.selectedMonth);
  const paidCount = metrics.paidBills.length;
  const achievements: Achievement[] = [
    {
      id: "primeira_conta_paga",
      title: "Primeira conta paga",
      description: "Você tirou uma preocupação da frente.",
      type: "pagamento",
      date: today,
      status: paidCount >= 1 ? "desbloqueada" : "pendente",
    },
    {
      id: "tres_contas_pagas",
      title: "Três contas pagas",
      description: "Seu mês está ficando mais leve.",
      type: "pagamento",
      date: today,
      status: paidCount >= 3 ? "desbloqueada" : "pendente",
    },
    {
      id: "contas_do_mes_em_dia",
      title: "Contas do mês em dia",
      description: "Você fechou os compromissos do mês.",
      type: "pagamento",
      date: today,
      status: data.bills.length > 0 && paidCount === data.bills.length ? "desbloqueada" : "pendente",
    },
    {
      id: "meta_criada",
      title: "Meta com direção",
      description: "Agora seu dinheiro sabe para onde ir.",
      type: "meta",
      date: today,
      status: data.goals.length > 0 ? "desbloqueada" : "pendente",
    },
    {
      id: "reserva_criada",
      title: "Reserva iniciada",
      description: "Seu futuro ganhou um pouco mais de proteção.",
      type: "reserva",
      date: today,
      status: metrics.reserveDestination > 0 ? "desbloqueada" : "pendente",
    },
    {
      id: "entrada_registrada",
      title: "Entrada registrada",
      description: "O North ganhou mais clareza para orientar você.",
      type: "organizacao",
      date: today,
      status: data.incomes.length > 0 ? "desbloqueada" : "pendente",
    },
    {
      id: "objetivos_criados",
      title: "Objetivos do mês criados",
      description: "Você transformou intenção em próximos passos.",
      type: "organizacao",
      date: today,
      status: data.objectives.length > 0 ? "desbloqueada" : "pendente",
    },
    {
      id: "score_melhorou",
      title: "Evolução North",
      description: "Seu mês ficou mais organizado que o anterior.",
      type: "score",
      date: today,
      status: metrics.paidBills.length > 0 && metrics.overdueBills.length <= data.previousBills.filter((bill) => bill.status === "atrasada").length ? "desbloqueada" : "pendente",
    },
  ];

  return achievements;
}

function buildMentalLoad(metrics: ReturnType<typeof buildMetrics>): MentalLoad {
  const dueSoon = metrics.pendingBills.filter((bill) => {
    const due = new Date(`${bill.dueDate}T12:00:00`).getTime();
    const today = new Date(`${getTodayKey()}T12:00:00`).getTime();
    return due >= today && due - today <= 7 * 24 * 60 * 60 * 1000;
  });
  const reasons: string[] = [];
  if (metrics.overdueBills.length) reasons.push(`${metrics.overdueBills.length} conta(s) atrasada(s)`);
  if (dueSoon.length) reasons.push(`${dueSoon.length} vencimento(s) próximo(s)`);
  if (metrics.unassignedValue > 1000) reasons.push(`${formatCurrency(metrics.unassignedValue)} livre para decidir`);
  if (metrics.reserveDestination > 0) reasons.push("Reserva ativa");

  if (metrics.overdueBills.length || dueSoon.length > 3 || metrics.unassignedValue > 2000) {
    return { level: "Alta", reasons: reasons.slice(0, 3) };
  }
  if (metrics.pendingBills.length || dueSoon.length || metrics.unassignedValue > 0) {
    return { level: "Controlada", reasons: reasons.slice(0, 3) };
  }
  return { level: "Baixa", reasons: reasons.length ? reasons.slice(0, 3) : ["Sem atraso crítico", "Mês planejado", "Reserva ou meta ativa"] };
}

function buildMonthlyCheckup(data: MonthData, metrics: ReturnType<typeof buildMetrics>, goals: Goal[]): Checkup {
  const score = calculateNorthScore(metrics, goals);
  const nextMonth = monthLabel(new Date(`${data.selectedMonth}-01T12:00:00`).getMonth() === 11
    ? `${new Date(`${data.selectedMonth}-01T12:00:00`).getFullYear() + 1}-01`
    : `${new Date(`${data.selectedMonth}-01T12:00:00`).getFullYear()}-${String(new Date(`${data.selectedMonth}-01T12:00:00`).getMonth() + 2).padStart(2, "0")}`);
  const positives = [
    data.incomes.length ? "Você registrou suas entradas." : "",
    metrics.reserveDestination > 0 ? "Você começou ou fortaleceu sua reserva." : "",
    score > 64 ? `Seu North Score melhorou ${score - 64} pontos.` : "",
    metrics.paidBills.length ? `Você pagou ${metrics.paidBills.length} conta(s).` : "",
  ].filter(Boolean);
  const attentions = [
    metrics.overdueBills.length ? `Ainda existem ${metrics.overdueBills.length} conta(s) atrasada(s).` : "",
    metrics.reserveDestination < 500 ? "A reserva ainda está abaixo do ideal." : "",
    metrics.unassignedValue > 0 ? `Você tem ${formatCurrency(metrics.unassignedValue)} livre para decidir.` : "",
  ].filter(Boolean);

  return {
    title: `Encerramento de ${monthLabel(data.selectedMonth).replace(" de 2026", "")}`,
    summary: `Você recebeu ${formatCurrency(metrics.totalIncome)}, pagou ${metrics.paidBills.length} conta(s) e guardou ${formatCurrency(metrics.reserveDestination)}.`,
    positives: positives.length ? positives : ["Você manteve o mês acompanhado pelo North."],
    attentions: attentions.length ? attentions : ["Nenhum ponto crítico neste momento."],
    focus: `Foco de ${nextMonth.replace(" de 2026", "")}: priorize ${metrics.urgent?.name ?? "as próximas contas"} e aumente sua reserva com uma decisão pequena e constante.`,
  };
}

function MiniBars({
  items,
  max,
}: {
  items: { label: string; value: number; color?: string }[];
  max?: number;
}) {
  const top = max ?? Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="flex h-28 items-end gap-3 pt-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-20 w-full items-end rounded-2xl bg-[#211d19]/6 p-1 dark:bg-white/8">
            <div
              className={`w-full rounded-xl ${item.color ?? "bg-[#d75c27]"}`}
              style={{ height: `${Math.max(8, (item.value / top) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-[var(--muted)]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function FinanceBarComparison({
  metrics,
}: {
  metrics: ReturnType<typeof buildMetrics>;
}) {
  const items = [
    {
      label: "Quanto entrou",
      current: metrics.totalIncome,
      previous: metrics.totalIncome / 1.14,
      delta: "+14%",
      helper: "Entradas registradas",
    },
    {
      label: "Quanto saiu",
      current: metrics.totalDirected,
      previous: metrics.totalDirected / 0.92,
      delta: "-8%",
      helper: "Valor direcionado",
    },
    {
      label: "Contas pagas",
      current: metrics.totalPaid,
      previous: Math.max(1, metrics.totalPaid / 1.06),
      delta: "+6%",
      helper: `${metrics.paidBills.length} pagamento(s)`,
    },
    {
      label: "Contas em aberto",
      current: metrics.totalPending + metrics.totalOverdue,
      previous: (metrics.totalPending + metrics.totalOverdue) / 0.78,
      delta: "-22%",
      helper: `${metrics.pendingBills.length + metrics.overdueBills.length} compromisso(s)`,
    },
  ];
  const maxValue = Math.max(...items.flatMap((item) => [item.current, item.previous]), 1);

  return (
    <div className="mt-6">
      <div className="rounded-[28px] border border-[var(--line)] bg-[#fbfaf8]/75 p-5 dark:bg-white/5">
        <div className="space-y-5">
          {items.map((item) => {
            const currentWidth = Math.max(4, (item.current / maxValue) * 100);
            const previousWidth = Math.max(4, (item.previous / maxValue) * 100);
            const positive = item.delta.startsWith("+");
            return (
              <div key={item.label} className="grid gap-3 md:grid-cols-[180px_1fr_112px] md:items-center">
                <div>
                  <p className="text-sm font-extrabold text-[var(--foreground)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--muted)]">
                    {item.helper}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-[#211d19]/8 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#d75c27]"
                      style={{ width: `${currentWidth}%` }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-[#211d19]/5 dark:bg-white/7">
                    <div
                      className="h-full rounded-full bg-[#756b62]/45"
                      style={{ width: `${previousWidth}%` }}
                    />
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-base font-extrabold">
                    {formatCurrency(item.current)}
                  </p>
                  <p
                    className={`mt-1 text-xs font-extrabold ${
                      positive ? "text-emerald-600" : "text-[#d75c27]"
                    }`}
                  >
                    {item.delta} vs mês anterior
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-[var(--muted)]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#d75c27]" />
          Mês atual
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#756b62]/45" />
          Mês anterior
        </span>
      </div>
    </div>
  );
}

function Donut({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const total = Math.max(sum(items, (item) => item.value), 1);
  let current = 0;
  const gradient = items
    .map((item) => {
      const start = current;
      const end = current + (item.value / total) * 100;
      current = end;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-5">
      <div
        className="h-28 w-28 rounded-full"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div className="m-auto h-full w-full rounded-full p-4">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--panel-strong)] text-xs font-extrabold">
            {items.length}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: item.color }}
            />
            <span className="font-semibold text-[var(--muted)]">{item.label}</span>
            <span className="font-bold">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
        checked ? "bg-[#d75c27]" : "bg-[#211d19]/15 dark:bg-white/15"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NorthRecommendation({
  metrics,
  variant = "light",
  actions = ["Ver contas", "Aplicar sugestão", "Ignorar por enquanto"],
}: {
  metrics: ReturnType<typeof buildMetrics>;
  variant?: "light" | "dark";
  actions?: string[];
}) {
  const message = metrics.overdueBills.length
    ? `Você tem ${metrics.overdueBills.length} conta(s) atrasada(s). Priorize quitar antes de separar valor para metas.`
    : metrics.unassignedValue > 0
      ? `Você ainda possui ${formatCurrency(metrics.unassignedValue)} sem destino definido.`
      : "Seu dinheiro recebido já possui um destino financeiro definido.";

  return (
    <div
      className={`rounded-3xl border p-4 ${
        variant === "dark"
          ? "border-white/12 bg-white/10 text-white"
          : "border-[var(--line)] bg-white/35 text-[var(--foreground)] dark:bg-white/7"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#d75c27]/10 p-2">
          <BrandSymbol className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d75c27]">
            Recomendação North
          </p>
          <p className="mt-2 text-sm font-semibold leading-6">{message}</p>
          {actions.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((label, index) => (
              <button
                type="button"
                key={label}
                className={`rounded-2xl px-3 py-2 text-[11px] font-extrabold ${
                  index === 0
                    ? "bg-[#d75c27] text-white"
                    : variant === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-[#211d19]/7 text-[var(--foreground)] dark:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NorthScore({ metrics, goals }: { metrics: ReturnType<typeof buildMetrics>; goals: Goal[] }) {
  const score = calculateNorthScore(metrics, goals);
  const previous = 64;
  const circumference = 2 * Math.PI * 46;
  const dash = circumference - (score / 100) * circumference;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#d75c27]/12 blur-2xl" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
        North Score
      </p>
      <div className="mt-5 flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(33,29,25,.09)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#d75c27"
              strokeLinecap="round"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dash}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-black">{score}</p>
            <p className="-mt-1 text-xs font-bold text-[var(--muted)]">/100</p>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
          Mês passado: {previous} • +{Math.max(0, score - previous)} pontos
        </p>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-[var(--muted)]">
        Seu mês está mais organizado que o anterior.
      </p>
    </Card>
  );
}

function NorthScoreSummaryCard({
  metrics,
  goals,
  onOpen,
}: {
  metrics: ReturnType<typeof buildMetrics>;
  goals: Goal[];
  onOpen: () => void;
}) {
  const score = calculateNorthScore(metrics, goals);
  const previous = 64;
  const circumference = 2 * Math.PI * 38;
  const dash = circumference - (score / 100) * circumference;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="glass group min-h-[148px] rounded-[28px] p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/78 dark:hover:bg-white/10"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
        North Score
      </p>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(33,29,25,.1)" strokeWidth="9" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#d75c27"
              strokeLinecap="round"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={dash}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-black">{score}</p>
            <p className="-mt-1 text-[11px] font-bold text-[var(--muted)]">/100</p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-extrabold text-[#d75c27]">
              +{Math.max(0, score - previous)} pontos
            </p>
            <ChevronRight className="h-4 w-4 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[#d75c27]" />
          </div>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">vs mês anterior</p>
          <p className="mt-3 text-sm font-semibold leading-5 text-[var(--muted)]">
            Seu mês está mais organizado.
          </p>
        </div>
      </div>
    </button>
  );
}

function ReserveSummaryCard({
  metrics,
  data,
  realBalance,
  onOpenFinanceDetail,
}: {
  metrics: ReturnType<typeof buildMetrics>;
  data: MonthData;
  realBalance: RealBalance;
  onOpenFinanceDetail: (detail: FinanceDetail) => void;
}) {
  const target = 800;
  const progress = Math.min(100, Math.round((metrics.reserveDestination / target) * 100));

  return (
    <button
      type="button"
      onClick={() => onOpenFinanceDetail(buildFinanceDetail("Reserva", data, metrics, realBalance))}
      className="glass group min-h-[148px] rounded-[28px] p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/78 dark:hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
          Reserva de emergência
        </p>
        <ChevronRight className="h-4 w-4 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[#d75c27]" />
      </div>
      <p className="mt-5 text-2xl font-black">{formatCurrency(metrics.reserveDestination)}</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#211d19]/8 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d75c27] to-[#f0b59b]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-[var(--muted)]">{progress}%</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-[var(--muted)]">
        Meta: {formatCurrency(target)}
      </p>
    </button>
  );
}

function MonthStatusCard({
  data,
  metrics,
  realBalance,
  onOpenFinanceDetail,
  onOpenRecommendation,
}: {
  data: MonthData;
  metrics: ReturnType<typeof buildMetrics>;
  realBalance: RealBalance;
  onOpenFinanceDetail: (detail: FinanceDetail) => void;
  onOpenRecommendation: () => void;
}) {
  const score = calculateNorthScore(metrics, data.goals);
  const overdueTotal = metrics.totalOverdue;
  const mainGoal = data.goals[0];
  const completedObjectives = data.objectives.filter((objective) => objective.done).length;
  const nextIncome = [...data.incomes].sort(
    (a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime(),
  )[0];
  const nextIncomeDate = nextIncome
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${nextIncome.receivedDate}T12:00:00`))
    : null;
  const scoreLevel = score >= 80 ? "Nível organizado" : score >= 60 ? "Nível em organização" : "Precisa de atenção";

  const items = [
    {
      id: "score",
      icon: Target,
      iconClass: "bg-[#d75c27]/10 text-[#d75c27]",
      title: "North Score",
      helper: scoreLevel,
      badge: String(score),
      onClick: onOpenRecommendation,
    },
    {
      id: "overdue",
      icon: Zap,
      iconClass: "bg-red-500/10 text-red-500",
      title: `${metrics.overdueBills.length} conta${metrics.overdueBills.length === 1 ? "" : "s"} atrasada${metrics.overdueBills.length === 1 ? "" : "s"}`,
      helper: `Total de ${formatCurrency(overdueTotal)}`,
      onClick: () => onOpenFinanceDetail(buildFinanceDetail("Contas atrasadas", data, metrics, realBalance)),
    },
    {
      id: "reserve",
      icon: Shield,
      iconClass: "bg-emerald-500/12 text-emerald-600",
      title: metrics.reserveDestination > 0 ? "Reserva ativa" : "Reserva pendente",
      helper: `${formatCurrency(metrics.reserveDestination)} guardados`,
      onClick: () => onOpenFinanceDetail(buildFinanceDetail("Reserva", data, metrics, realBalance)),
    },
    {
      id: "goal",
      icon: Flag,
      iconClass: "bg-emerald-500/12 text-emerald-600",
      title: mainGoal?.name ? "Meta do mês" : "Meta do mês",
      helper: mainGoal ? `${completedObjectives} de ${Math.max(data.objectives.length, 1)} concluídas` : "Nenhuma meta cadastrada",
      onClick: () => onOpenFinanceDetail(buildFinanceDetail("Metas", data, metrics, realBalance)),
    },
    {
      id: "income",
      icon: CalendarDays,
      iconClass: "bg-indigo-500/12 text-indigo-500",
      title: "Próxima entrada",
      helper: nextIncome ? `${nextIncomeDate} • ${nextIncome.category}` : "Nenhuma entrada registrada",
      onClick: () => onOpenFinanceDetail(buildFinanceDetail("Entrou no mês", data, metrics, realBalance)),
    },
  ];

  return (
    <Card className="flex h-full flex-col">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
        Status do mês
      </p>
      <div className="mt-4 flex-1 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              onClick={item.onClick}
              className="group flex w-full items-center gap-3 rounded-2xl p-1.5 text-left transition hover:bg-[#211d19]/5 dark:hover:bg-white/8"
            >
              <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.iconClass}`}>
                {item.badge ? (
                  <>
                    <span className="absolute inset-1 rounded-full border-4 border-[#d75c27]/22 border-t-[#d75c27]" />
                    <span className="relative text-xs font-black text-[var(--foreground)]">{item.badge}</span>
                  </>
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-[var(--foreground)]">{item.title}</span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--muted)]">{item.helper}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[#d75c27]" />
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Sidebar({
  active,
  setActive,
  darkMode,
  setDarkMode,
  isOpen,
  setIsOpen,
  collapsed,
  setCollapsed,
  user,
  onOpenProfile,
  onOpenSettings,
  onConfirmLogout,
}: {
  active: string;
  setActive: (value: string) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: (section?: string) => void;
  onConfirmLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-50 rounded-full bg-[#211d19] p-2.5 text-white shadow-xl lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-white/10 bg-[#050505] py-4 text-white shadow-2xl transition-all duration-300 lg:translate-x-0 ${
          collapsed ? "w-[76px] px-2" : "w-[min(300px,calc(100vw-1rem))] px-4 sm:w-[280px]"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Fechar menu"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={`flex ${collapsed ? "flex-col items-center gap-3" : "items-start justify-between gap-3 pl-0 pr-1"}`}>
          <div className={`min-w-0 ${collapsed ? "hidden" : "block"}`}>
            <img
              src="/logo-reveenorth-white.png"
              alt="ReveeNorth"
              className="h-9 w-[198px] object-contain object-left"
            />
            <p className="mt-2 text-sm font-medium leading-6 text-white">
              Seu dinheiro com direção
            </p>
          </div>
          {collapsed ? (
            <BrandSymbol className="h-9 w-9" />
          ) : null}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] transition hover:bg-white/15 lg:flex"
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className={`${collapsed ? "mt-7 flex flex-1 flex-col items-center justify-start gap-3.5 overflow-y-auto" : "mt-7 space-y-1.5 overflow-y-auto pr-1"}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => {
                  setActive(item.label);
                  setIsOpen(false);
                }}
                title={collapsed ? item.label : undefined}
                className={`flex items-center text-left text-[13px] font-semibold transition ${
                  collapsed ? "h-11 w-11 justify-center rounded-full px-0 py-0" : "w-full gap-3 rounded-2xl px-3.5 py-2.5"
                } ${
                  selected
                    ? collapsed ? "bg-[#d75c27]/14 text-white ring-1 ring-[#d75c27]/30" : "bg-[#d75c27]/12 text-white"
                    : "text-white hover:bg-[#d75c27]/8"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${selected ? "text-[#d75c27]" : "text-white"}`}
                />
                {!collapsed ? item.label : null}
              </button>
            );
          })}
        </nav>

        <div className="relative mt-auto shrink-0 pt-3">
          {menuOpen && !collapsed ? (
            <div className="app-popover absolute bottom-[76px] left-0 right-0 rounded-3xl border border-white/70 bg-[#f4f1ee]/98 p-2 text-[#211d19] shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#050505] dark:text-white">
              <MenuItem icon={User} label="Meu perfil" onClick={onOpenProfile} />
              <div className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold transition hover:bg-[#211d19]/8 dark:hover:bg-white/10">
                <span className="flex items-center gap-2 text-xs font-semibold text-inherit">
                  <Moon className="h-4 w-4 text-[#d75c27]" />
                  Tema escuro
                </span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                    darkMode ? "bg-[#d75c27]" : "bg-[#211d19]/15"
                  }`}
                  aria-label="Alternar tema escuro"
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white shadow transition ${
                      darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <MenuItem
                icon={Settings}
                label="Configurações"
                onClick={() => {
                  onOpenSettings();
                  setMenuOpen(false);
                }}
              />
              <MenuItem icon={LogOut} label="Sair" danger onClick={onConfirmLogout} />
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex w-full items-center text-left transition ${
              collapsed
                ? "justify-center rounded-full border-0 bg-transparent p-0 hover:bg-transparent"
                : "gap-3 rounded-3xl border border-white/12 bg-white/8 p-3 hover:bg-white/12"
            }`}
          >
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt=""
                className={`${collapsed ? "h-10 w-10" : "h-12 w-12"} rounded-full object-cover`}
              />
            ) : (
              <div className={`flex items-center justify-center rounded-full bg-[#d75c27] font-extrabold ${
                collapsed ? "h-10 w-10 text-sm" : "h-12 w-12 text-sm"
              }`}>
                {user.fullName.charAt(0)}
              </div>
            )}
            {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">{user.fullName}</p>
              <p className="truncate text-[11px] text-white/50">{user.role || user.plan}</p>
            </div>
            ) : null}
            {!collapsed ? (
            <ChevronDown
              className={`h-4 w-4 text-white/60 transition ${menuOpen ? "rotate-180" : ""}`}
            />
            ) : null}
          </button>
        </div>
      </aside>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Fechar menu lateral"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-semibold transition hover:bg-[#211d19]/8 dark:hover:bg-white/10 ${
        danger ? "text-[#d75c27]" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MonthFilter({
  selectedMonth,
  setSelectedMonth,
  accountCreatedAt,
}: {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  accountCreatedAt: string;
}) {
  const options = buildMonthOptions(accountCreatedAt);

  return (
    <label className="app-top-control flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/45 px-3 py-2 text-xs font-bold dark:bg-[#050505] sm:flex-none">
      <CalendarDays className="h-4 w-4 text-[#d75c27]" />
      <select
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        className="min-w-0 bg-transparent text-[var(--foreground)] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PriorityNow({
  metrics,
  onStartPayment,
  onOpenBill,
}: {
  metrics: ReturnType<typeof buildMetrics>;
  onStartPayment: (bill: Bill) => void;
  onOpenBill: (bill: Bill) => void;
}) {
  const tasks = [
    ...metrics.overdueBills,
    ...metrics.pendingBills.filter((bill) => bill.essential || bill.debt),
  ].sort(sortByPaymentPriority).slice(0, 3);

  return (
    <div className="warm-gradient rounded-[30px] border border-white/20 p-5 text-white shadow-[0_24px_70px_rgba(33,29,25,0.18)] md:p-6">
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="flex min-h-72 flex-col justify-center rounded-[26px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl md:p-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12">
            <BrandSymbol className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-extrabold">O que fazer agora</h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
            Resolva primeiro atrasos e contas essenciais. Ao registrar o
            pagamento, os outros campos do sistema atualizam juntos.
          </p>
        </div>
        <div className="space-y-3">
          {tasks.length ? (
            tasks.map((bill, index) => (
              <button
                type="button"
                key={bill.id}
                onClick={() => onOpenBill(bill)}
                className="flex w-full flex-col gap-3 rounded-3xl border border-white/18 bg-white/82 p-4 text-left text-[#211d19] shadow-sm backdrop-blur-xl transition hover:bg-white/95 sm:flex-row sm:items-center"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27] text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[var(--foreground)]">
                    {bill.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {formatCurrency(bill.expectedAmount)} • {bill.status === "atrasada" ? `${overdueLabel(bill)} • venceu em` : "vence"} {formatDate(bill.dueDate)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onStartPayment(bill);
                  }}
                  className="rounded-2xl bg-[#211d19] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d75c27]"
                >
                  Paga
                </button>
              </button>
            ))
          ) : (
            <p className="rounded-3xl border border-white/18 bg-white/72 p-5 text-sm font-semibold text-[#756b62] backdrop-blur-xl">
              Sem contas urgentes neste mês.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-[#d75c27]/13 p-2.5 text-[#d75c27]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">{value}</p>
      <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">{helper}</p>
    </Card>
  );
}

function AchievementsCard({ achievements }: { achievements: Achievement[] }) {
  const unlocked = achievements.filter((achievement) => achievement.status === "desbloqueada");
  const visible = unlocked.slice(0, 4);
  const achievementStyles = [
    { icon: Check, className: "bg-emerald-500/14 text-emerald-600", label: "Primeira\nconta paga" },
    { icon: Shield, className: "bg-emerald-500/14 text-emerald-600", label: "Reserva\niniciada" },
    { icon: Bell, className: "bg-emerald-500/14 text-emerald-600", label: "3 contas\nquitadas" },
    { icon: Sparkles, className: "bg-[#d75c27]/12 text-[#d75c27]", label: "Score\n+14 pontos" },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27]/10 text-[#d75c27]">
          <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
              Conquistas do mês
            </p>
            <h3 className="mt-2 text-lg font-extrabold">Junho</h3>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Você já conquistou:</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1 text-xs font-extrabold text-[#d75c27] transition hover:translate-x-0.5">
          Ver todas
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {visible.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {achievementStyles.map(({ icon: Icon, className, label }, index) => (
            <div key={visible[index]?.id ?? label} className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/52 p-3 shadow-sm dark:bg-white/7">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${className}`}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0">
                {label.split("\n").map((line) => (
                  <span key={line} className="block text-xs font-extrabold leading-4">
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-[#211d19]/5 p-4 dark:bg-white/7">
          <p className="text-sm font-extrabold">Próxima conquista</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--muted)]">
            Organize sua primeira decisão do mês para desbloquear conquistas.
          </p>
        </div>
      )}
      <p className="mt-5 rounded-2xl bg-[#d75c27]/7 px-4 py-3 text-sm font-semibold text-[var(--muted)]">
        Seu mês está mais organizado que o anterior. Continue assim!
      </p>
    </Card>
  );
}

function MentalLoadCard({ mentalLoad }: { mentalLoad: MentalLoad }) {
  const tone = mentalLoad.level === "Alta" ? "text-red-600" : mentalLoad.level === "Controlada" ? "text-[#d75c27]" : "text-emerald-600";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
            Carga mental financeira
          </p>
          <h3 className={`mt-2 text-2xl font-black ${tone}`}>{mentalLoad.level}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#211d19]/6 text-[#211d19] dark:bg-white/8 dark:text-white">
          <Shield className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {mentalLoad.reasons.map((reason) => (
          <div key={reason} className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d75c27]" />
            {reason}
          </div>
        ))}
      </div>
    </Card>
  );
}

function MiniSparkline({ tone = "orange" }: { tone?: "green" | "orange" | "purple" | "red" }) {
  const color = tone === "green" ? "#20a363" : tone === "purple" ? "#9b4ee6" : tone === "red" ? "#ef3f2f" : "#d75c27";
  const points = tone === "green"
    ? "2,28 18,25 34,18 50,20 66,15 82,19 98,12 114,14 130,10 146,12 162,9"
    : tone === "purple"
      ? "2,24 22,24 42,22 62,22 82,19 102,18 122,18 142,16 162,16"
      : "2,26 18,22 34,19 50,13 66,18 82,24 98,15 114,20 130,16 146,22 162,24";

  return (
    <svg viewBox="0 0 164 34" className="mt-4 h-9 w-full" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${points.split(" ").join(" L")} L162 34 L2 34 Z`} fill={color} opacity="0.08" />
    </svg>
  );
}

function DashboardMetricCard({
  label,
  value,
  helper,
  detail,
  icon: Icon,
  tone,
  children,
  onClick,
}: {
  label: string;
  value: string;
  helper: string;
  detail?: string;
  icon: React.ElementType;
  tone: "green" | "orange" | "purple" | "red";
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  const toneClasses = {
    green: "bg-emerald-500/12 text-emerald-600",
    orange: "bg-[#d75c27]/12 text-[#d75c27]",
    purple: "bg-purple-500/12 text-purple-600",
    red: "bg-red-500/12 text-red-500",
  };

  const className = `glass min-h-[190px] rounded-[28px] p-5 text-left ${onClick ? "transition hover:-translate-y-0.5 hover:bg-white/78 dark:hover:bg-white/10" : ""}`;
  const content = (
    <>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
        </div>
      </div>
      {children ?? <MiniSparkline tone={tone} />}
      {detail ? <p className="mt-2 text-xs font-bold text-[#d75c27]">{detail}</p> : null}
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--muted)]">{helper}</p>
    </>
  );

  return onClick ? (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

function CoachCompassNeedle() {
  return (
    <div className="relative hidden min-h-[205px] items-center justify-center md:flex">
      <div className="absolute h-52 w-52 rounded-full bg-[#d75c27]/18 blur-3xl" />
      {[104, 132, 160, 188].map((size, index) => (
        <span
          key={size}
          className="absolute rounded-full border border-[#d75c27]/15"
          style={{ width: size, height: size, opacity: 0.75 - index * 0.12 }}
        />
      ))}
      <svg
        viewBox="0 0 220 220"
        className="relative h-44 w-44 drop-shadow-[0_24px_46px_rgba(215,92,39,.22)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="coachNeedleGradient" x1="54" y1="176" x2="166" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#211d19" />
            <stop offset="0.52" stopColor="#d75c27" />
            <stop offset="1" stopColor="#ffb08a" />
          </linearGradient>
          <filter id="coachNeedleGlow" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.84 0 1 0 0 0.36 0 0 1 0 0.15 0 0 0 0.42 0"
            />
            <feBlend in="SourceGraphic" />
          </filter>
        </defs>
        <g className="coach-needle-spin">
          <path
            d="M44 182 98 98 176 38 122 124Z"
            fill="url(#coachNeedleGradient)"
            filter="url(#coachNeedleGlow)"
          />
          <path
            d="M176 38 122 124 98 98Z"
            fill="rgba(255,255,255,.38)"
          />
          <circle cx="110" cy="110" r="13" fill="#211d19" />
          <circle cx="110" cy="110" r="5" fill="#d75c27" />
        </g>
      </svg>
    </div>
  );
}

function FinancialHealthCard({
  metrics,
  goals,
  onOpenRecommendation,
}: {
  metrics: ReturnType<typeof buildMetrics>;
  goals: Goal[];
  onOpenRecommendation: () => void;
}) {
  const score = calculateNorthScore(metrics, goals);
  const previous = 64;
  const circumference = 2 * Math.PI * 46;
  const dash = circumference - (score / 100) * circumference;

  return (
    <button
      type="button"
      onClick={onOpenRecommendation}
      className="glass group rounded-[28px] p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/78 dark:hover:bg-white/10"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
        Saúde financeira
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(33,29,25,.09)" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#d75c27"
              strokeLinecap="round"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={dash}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-black">{score}</p>
            <p className="-mt-1 text-xs font-bold text-[var(--muted)]">de 100</p>
          </div>
        </div>
        <div>
          <p className="text-base font-extrabold">Nível Organizado</p>
          <p className="mt-1 text-sm font-bold text-emerald-600">
            +{Math.max(0, score - previous)} pontos este mês
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#211d19]/8 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#d75c27] to-[#f0b59b]" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--muted)]">Meta: 85 pontos</p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#d75c27]/8 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d75c27]/12 text-[#d75c27]">
              <Zap className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold text-[var(--muted)]">Próxima conquista</span>
              <span className="block text-sm font-extrabold">Quitar {metrics.urgent?.name ?? "pendência"}</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Dashboard({
  data,
  metrics,
  onStartPayment,
  onOpenBill,
  categories,
  realBalance,
  onOpenRealBalance,
  onOpenFinanceDetail,
  onOpenRecommendation,
}: {
  data: MonthData;
  metrics: ReturnType<typeof buildMetrics>;
  onStartPayment: (bill: Bill) => void;
  onOpenBill: (bill: Bill) => void;
  categories: Category[];
  realBalance: RealBalance;
  onOpenRealBalance: () => void;
  onOpenFinanceDetail: (detail: FinanceDetail) => void;
  onOpenRecommendation: () => void;
}) {
  const [coachUnderstood, setCoachUnderstood] = useState(false);
  const pendingTotal = metrics.totalPending + metrics.totalOverdue;
  const reserveGoal = data.goals.find((goal) => normalizeCategoryName(goal.name).includes("reserva"));
  const reserveTarget = reserveGoal?.target ?? 0;
  const reserveProgress = reserveTarget ? Math.min(100, Math.round((metrics.reserveDestination / reserveTarget) * 100)) : 0;
  const urgentLabel = metrics.urgent
    ? metrics.urgent.status === "atrasada"
      ? `Vencida em ${formatDate(metrics.urgent.dueDate)}`
      : `Vence em ${formatDate(metrics.urgent.dueDate)}`
    : "Sem vencimento urgente";
  const achievements = buildAchievements(data, metrics);
  const urgentDay = metrics.urgent ? new Date(`${metrics.urgent.dueDate}T12:00:00`).getDate() : null;
  const coachCopy = useMemo(() => {
    const name = metrics.urgent?.name ?? "a próxima pendência";
    const dateText = urgentDay ? `até dia ${urgentDay}` : "com calma hoje";
    const free = formatCurrency(metrics.unassignedValue);
    const variants = [
      {
        headline: "Sua próxima decisão constrói seu futuro.",
        body: `Dani, quite ${name} ${dateText}. Depois, olhe para os ${free} livres para decidir e escolha um destino que deixe seu mês mais leve.`,
      },
      {
        headline: "Um passo certo já muda o mês.",
        body: `A prioridade agora é resolver ${name}. Você não precisa organizar tudo hoje, só tirar da frente o que mais pesa no planejamento.`,
      },
      {
        headline: "Menos pendência, mais clareza.",
        body: `Pagar ${name} ${dateText} reduz risco de juros e ajuda seu North Score continuar acima de 80.`,
      },
    ];
    const index = (new Date().getDate() + metrics.overdueBills.length + metrics.pendingBills.length) % variants.length;
    return variants[index];
  }, [metrics.overdueBills.length, metrics.pendingBills.length, metrics.unassignedValue, metrics.urgent?.name, urgentDay]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.42fr_0.9fr]">
        <section className="north-coach-gradient relative overflow-hidden rounded-[32px] border border-white/10 p-6 text-white shadow-[0_28px_80px_rgba(33,29,25,.28)] backdrop-blur-[26px] md:p-7">
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-white/7 blur-3xl" />
          <div className="pointer-events-none absolute -right-14 bottom-0 h-80 w-80 rounded-full bg-[#d75c27]/38 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
            <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#d75c27]">
              North Coach
            </p>
            <h2 className="mt-4 max-w-xl text-xl font-extrabold leading-tight tracking-tight text-white md:text-[26px]">
              {coachCopy.headline}
            </h2>
            <p className="mt-5 max-w-md text-sm font-normal leading-6 text-white/68">
              {coachCopy.body}
            </p>
            {coachUnderstood ? (
              <p className="mt-4 w-fit rounded-2xl bg-[#d75c27]/10 px-4 py-2 text-xs font-bold text-[#b94d20]">
                Orientação marcada como entendida.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {metrics.urgent ? (
                <button
                  type="button"
                  onClick={() => onStartPayment(metrics.urgent!)}
                  className="rounded-2xl bg-[#d75c27] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#d75c27]/20 transition hover:-translate-y-0.5"
                >
                  Marcar como paga
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setCoachUnderstood(true)}
                  className="rounded-2xl border border-white/14 bg-white/92 px-5 py-2.5 text-sm font-bold text-[#211d19] transition hover:-translate-y-0.5"
              >
                Entendi
              </button>
              {metrics.urgent ? (
                <button
                  type="button"
                  onClick={onOpenRecommendation}
                  className="px-4 py-2.5 text-sm font-bold text-[#ff9b6d] underline decoration-[#ff9b6d]/45 underline-offset-4 transition hover:text-white"
                >
                Por que isso?
              </button>
            ) : null}
            </div>
            </div>
            <div className="relative">
              <CoachCompassNeedle />
            </div>
          </div>
        </section>
        <MonthStatusCard
          data={data}
          metrics={metrics}
          realBalance={realBalance}
          onOpenFinanceDetail={onOpenFinanceDetail}
          onOpenRecommendation={onOpenRecommendation}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Entradas do mês"
          value={formatCurrency(metrics.totalIncome)}
          helper="Receitas recebidas"
          detail={`${metrics.incomeDelta >= 0 ? "↑" : "↓"} ${Math.abs(metrics.incomeDelta)}% vs mês anterior`}
          icon={ArrowDownLeft}
          tone="green"
          onClick={() => onOpenFinanceDetail(buildFinanceDetail("Entrou no mês", data, metrics, realBalance))}
        />
        <DashboardMetricCard
          label="Saídas do mês"
          value={formatCurrency(metrics.totalPaid)}
          helper="Pagamentos realizados"
          detail={`${metrics.spendingDelta > 0 ? "↑" : "↓"} ${Math.abs(metrics.spendingDelta)}% vs mês anterior`}
          icon={ArrowUpRight}
          tone="orange"
          onClick={() => onOpenFinanceDetail(buildFinanceDetail("Saiu no mês", data, metrics, realBalance))}
        />
        <DashboardMetricCard
          label="Pendências"
          value={`${metrics.pendingBills.length + metrics.overdueBills.length} contas`}
          helper={`Total: ${formatCurrency(pendingTotal)}`}
          detail={metrics.urgent ? `Próxima: ${metrics.urgent.name} • ${urgentLabel}` : "Sem vencimento urgente"}
          icon={ReceiptText}
          tone="red"
          onClick={() => onOpenFinanceDetail(buildFinanceDetail("Contas atrasadas", data, metrics, realBalance))}
        >
          <div className="mt-5 h-px bg-[#211d19]/8 dark:bg-white/10" />
        </DashboardMetricCard>
        <DashboardMetricCard
          label="Reserva"
          value={formatCurrency(metrics.reserveDestination)}
          helper={reserveGoal ? `Meta: ${formatCurrency(reserveTarget)}` : "Crie uma meta chamada Reserva para acompanhar."}
          detail={reserveGoal ? `${reserveProgress}% da meta` : undefined}
          icon={PiggyBank}
          tone="purple"
          onClick={reserveGoal ? () => onOpenFinanceDetail(buildFinanceDetail("Reserva", data, metrics, realBalance)) : undefined}
        >
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#211d19]/8 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-[#d75c27]"
              style={{ width: `${reserveProgress}%` }}
            />
          </div>
        </DashboardMetricCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <AchievementsCard achievements={achievements} />
        <FinancialHealthCard metrics={metrics} goals={data.goals} onOpenRecommendation={onOpenRecommendation} />
      </div>
    </div>
  );
}

function buildFinanceDetail(
  label: string,
  data: MonthData,
  metrics: ReturnType<typeof buildMetrics>,
  realBalance: RealBalance,
): FinanceDetail {
  const incomeItems = data.incomes.map((income) => ({
    date: income.receivedDate,
    label: income.name,
    helper: income.note || income.category,
    amount: income.amount,
    tone: "in" as const,
  }));
  const paidItems = metrics.paidBills.map((bill) => ({
    date: bill.paidDate ?? bill.dueDate,
    label: bill.name,
    helper: paidLateDays(bill) > 0 ? `${bill.category} • pago com ${paidLateDays(bill)} dia${paidLateDays(bill) === 1 ? "" : "s"} de atraso` : `${bill.category} • pago em dia`,
    amount: bill.paidAmount ?? bill.expectedAmount,
    tone: "out" as const,
  }));
  const pendingItems = [...metrics.pendingBills, ...metrics.overdueBills].map((bill) => ({
    date: bill.dueDate,
    label: bill.name,
    helper: bill.status === "atrasada" ? `Conta atrasada • ${daysOverdue(bill)} dia${daysOverdue(bill) === 1 ? "" : "s"}` : "Conta pendente",
    amount: bill.expectedAmount,
    tone: "neutral" as const,
  }));
  const goalItems = data.goals.map((goal) => ({
    date: goal.deadline,
    label: goal.name,
    helper: `${Math.round((goal.current / Math.max(goal.target, 1)) * 100)}% concluído`,
    amount: goal.current,
    tone: "neutral" as const,
  }));

  if (label === "Saldo atual") {
    return {
      title: "Saldo atual",
      value: realBalance.amount,
      description: "Dinheiro disponível hoje, informado manualmente por você.",
      sections: [
        { title: "Entradas do mês", total: metrics.totalIncome, items: incomeItems },
        { title: "Saídas pagas", total: metrics.totalPaid, items: paidItems },
        {
          title: "Ajustes manuais",
          total: realBalance.amount,
          items: [
            {
              date: realBalance.date,
              label: "Saldo informado",
              helper: realBalance.note || "Atualização manual, sem integração bancária.",
              amount: realBalance.amount,
              tone: "neutral",
            },
          ],
        },
      ],
    };
  }

  if (label === "Entrou no mês" || label === "Recebido") {
    return {
      title: "Entrou no mês",
      value: metrics.totalIncome,
      description: "Histórico de receitas recebidas no período.",
      sections: [{ title: "Histórico de movimentações", total: metrics.totalIncome, items: incomeItems }],
    };
  }

  if (label === "Saiu no mês" || label === "Pago") {
    return {
      title: "Saiu no mês",
      value: metrics.totalPaid,
      description: "Pagamentos realizados no período.",
      sections: [{ title: "Pagamentos realizados", total: metrics.totalPaid, items: paidItems }],
    };
  }

  if (label === "Contas atrasadas") {
    return {
      title: "Contas atrasadas",
      value: metrics.totalOverdue,
      description: "Compromissos que precisam de atenção primeiro.",
      sections: [{ title: "Atrasadas no período", total: metrics.totalOverdue, items: pendingItems.filter((item) => item.helper?.startsWith("Conta atrasada")) }],
    };
  }

  if (label === "Livre para decidir") {
    return {
      title: "Livre para decidir",
      value: metrics.unassignedValue,
      description: "Oportunidade do mês: valor que ainda pode receber uma decisão.",
      sections: [
        { title: "Entradas consideradas", total: metrics.totalIncome, items: incomeItems },
        { title: "Compromissos já considerados", total: metrics.totalPaid + metrics.totalPending + metrics.totalOverdue, items: [...paidItems, ...pendingItems] },
        {
          title: "Disponível para decidir",
          total: metrics.unassignedValue,
          items: [
            {
              label: "Valor livre para decidir",
              helper: "Pode ir para reserva, metas, contas ou qualidade de vida.",
              amount: metrics.unassignedValue,
              tone: "in",
            },
          ],
        },
      ],
    };
  }

  if (label === "Guardado" || label === "Reserva") {
    const reserveGoal = data.goals.find((goal) => normalizeCategoryName(goal.name).includes("reserva"));
    return {
      title: "Reserva",
      value: reserveGoal?.current ?? 0,
      description: reserveGoal
        ? "Valor guardado na meta de reserva cadastrada."
        : "Nenhuma meta de reserva cadastrada ainda.",
      sections: [
        {
          title: "Reserva cadastrada",
          total: reserveGoal?.current ?? 0,
          items: reserveGoal
            ? [
                {
                  date: reserveGoal.deadline,
                  label: reserveGoal.name,
                  helper: `${Math.round((reserveGoal.current / Math.max(reserveGoal.target, 1)) * 100)}% da meta`,
                  amount: reserveGoal.current,
                  tone: "neutral",
                },
              ]
            : [],
        },
      ],
    };
  }

  const categoryItems = data.bills
    .filter((bill) => bill.status === "paga" && normalizeCategoryName(bill.category) === normalizeCategoryName(label))
    .map((bill) => ({
      date: bill.paidDate ?? bill.dueDate,
      label: bill.name,
      helper: isPaidLate(bill) ? `Pago com ${paidLateDays(bill)} dia(s) de atraso` : "Pago em dia",
      amount: bill.paidAmount ?? bill.expectedAmount,
      tone: "out" as const,
    }));

  if (categoryItems.length) {
    return {
      title: label,
      value: sum(categoryItems, (item) => item.amount),
      description: "Contas pagas desta categoria no período.",
      sections: [{ title: "Contas pagas", total: sum(categoryItems, (item) => item.amount), items: categoryItems }],
    };
  }

  if (label === "Metas") {
    return {
      title: "Metas",
      value: sum(data.goals, (goal) => goal.current),
      description: "Valores acumulados nas metas cadastradas.",
      sections: [{ title: "Aportes em metas", total: sum(data.goals, (goal) => goal.current), items: goalItems }],
    };
  }

  return {
    title: label,
    value: 0,
    description: "Detalhamento financeiro do período.",
    sections: [],
  };
}

function FinanceDetailModal({
  detail,
  onClose,
}: {
  detail: FinanceDetail;
  onClose: () => void;
}) {
  return (
    <Modal title={detail.title.toUpperCase()} onClose={onClose}>
      <div className="rounded-[28px] border border-[var(--line)] bg-white/45 p-5 dark:bg-white/6">
        <p className="text-3xl font-black text-[#d75c27]">{formatCurrency(detail.value)}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">{detail.description}</p>
      </div>
      <div className="mt-5 space-y-4">
        {detail.sections.map((section) => (
          <div key={section.title} className="rounded-[26px] border border-[var(--line)] bg-white/35 p-4 dark:bg-white/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold">{section.title}</h3>
              {section.total !== undefined ? (
                <span className="text-sm font-black">{formatCurrency(section.total)}</span>
              ) : null}
            </div>
            <div className="divide-y divide-[#211d19]/8 dark:divide-white/8">
              {section.items.length ? section.items.map((item, index) => (
                <div key={`${item.label}-${index}`} className="grid gap-3 py-3 sm:grid-cols-[72px_1fr_auto] sm:items-center">
                  <div className="text-xs font-black text-[var(--muted)]">
                    {item.date ? formatDate(item.date).replace(" de ", "/").replace(" de ", "/") : "--"}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{item.label}</p>
                    {item.helper ? <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{item.helper}</p> : null}
                  </div>
                  <p className={`text-sm font-black ${item.tone === "out" ? "text-red-600" : item.tone === "in" ? "text-[#d75c27]" : ""}`}>
                    {item.tone === "out" ? "-" : ""}{formatCurrency(item.amount)}
                  </p>
                </div>
              )) : (
                <p className="py-4 text-sm font-semibold text-[var(--muted)]">Nenhuma movimentação encontrada.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function IncomesView({
  incomes,
  onOpenIncome,
}: {
  incomes: Income[];
  onOpenIncome: (income: Income) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const incomeGroups = ["Salário mensal", "Renda extra", "Bônus"];
  const categoryTotals = incomeGroups.map((label) => {
    const items = incomes.filter((income) => income.category === label);
    return {
      label,
      total: sum(items, (income) => income.amount),
      items,
    };
  });
  const selectedItems = selectedCategory
    ? categoryTotals.find((item) => item.label === selectedCategory)?.items ?? []
    : [];
  const selectedTotal = sum(selectedItems, (income) => income.amount);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {categoryTotals.map((category) => (
          <button
            type="button"
            key={category.label}
            onClick={() => setSelectedCategory(category.label)}
            className="rounded-3xl border border-[var(--line)] bg-white/56 p-4 text-left shadow-[0_14px_42px_rgba(33,29,25,0.05)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/82 dark:bg-white/6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#d75c27]">
              {category.label}
            </p>
            <p className="mt-2 text-xl font-black">{formatCurrency(category.total)}</p>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
              {category.items.length} movimentação(ões)
            </p>
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d75c27]">
              Extrato de entradas
            </p>
            <h3 className="mt-2 text-lg font-extrabold">Todas as entradas do mês</h3>
          </div>
          <p className="text-sm font-black text-[#d75c27]">
            {formatCurrency(incomes.reduce((acc, income) => acc + income.amount, 0))}
          </p>
        </div>
        <div className="mt-4 divide-y divide-[#211d19]/8">
          {incomes.map((income) => (
            <button
              type="button"
              key={`statement-${income.id}`}
              onClick={() => onOpenIncome(income)}
              className="grid w-full grid-cols-[64px_1fr_auto] items-center gap-3 py-3 text-left"
            >
              <span className="text-xs font-black text-[var(--muted)]">
                {new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${income.receivedDate}T12:00:00`))}
              </span>
              <span>
                <span className="block text-sm font-extrabold">{income.name}</span>
                <span className="block text-xs font-semibold text-[var(--muted)]">{income.category}</span>
              </span>
              <span className="text-sm font-black text-[#d75c27]">{formatCurrency(income.amount)}</span>
            </button>
          ))}
        </div>
      </Card>

      {selectedCategory ? (
        <FinanceDetailModal
          onClose={() => setSelectedCategory(null)}
          detail={{
            title: selectedCategory,
            value: selectedTotal,
            description: `Histórico de ${selectedCategory.toLowerCase()} recebido no período.`,
            sections: [
              {
                title: "Histórico de movimentações",
                total: selectedTotal,
                items: selectedItems.map((income) => ({
                  date: income.receivedDate,
                  label: income.name,
                  helper: income.note || income.category,
                  amount: income.amount,
                  tone: "in",
                })),
              },
            ],
          }}
        />
      ) : null}
    </div>
  );
}

function StatusPill({ status }: { status: BillStatus }) {
  const classes = {
    pendente: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
    paga: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    atrasada: "bg-red-500/12 text-red-600 dark:text-red-300",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${classes[status]}`}>
      {status}
    </span>
  );
}

function BillsView({
  bills,
  onStartPayment,
  onOpenBill,
  categories,
}: {
  bills: Bill[];
  onStartPayment: (bill: Bill) => void;
  onOpenBill: (bill: Bill) => void;
  categories: Category[];
}) {
  const [status, setStatus] = useState<BillStatus | "todas">("todas");
  const [category, setCategory] = useState("todas");
  const billCategories = [
    "todas",
    ...categories.filter((item) => item.type === "conta").map((item) => item.name),
  ];
  const filteredBills = bills.filter((bill) => {
    const matchesStatus = status === "todas" || bill.status === status;
    const matchesCategory = category === "todas" || normalizeCategoryName(bill.category) === normalizeCategoryName(category);
    return matchesStatus && matchesCategory;
  });
  const alertBills = filteredBills.filter((bill) => bill.status === "atrasada").sort(sortByPaymentPriority);
  const regularBills = filteredBills.filter((bill) => bill.status !== "atrasada").sort(sortByPaymentPriority);
  const paidBills = bills.filter((bill) => bill.status === "paga");
  const pendingOrOverdueBills = bills.filter((bill) => bill.status !== "paga");
  const summaryItems = [
    { label: "Total de contas do mês", value: String(bills.length), helper: "inclui atrasadas antigas", icon: ReceiptText, gradient: "from-[#211d19] via-[#5b4538] to-[#d75c27]", glow: "shadow-[#d75c27]/18" },
    { label: "Contas pagas", value: String(paidBills.length), helper: formatCurrency(sum(paidBills, (bill) => bill.paidAmount ?? bill.expectedAmount)), icon: Check, gradient: "from-emerald-600 via-[#2f9f79] to-[#d75c27]", glow: "shadow-emerald-500/18" },
    { label: "Contas pendentes", value: String(pendingOrOverdueBills.length), helper: `${alertBills.length} em atraso`, icon: CircleAlert, gradient: "from-[#8f1d1d] via-[#d75c27] to-[#f0a24c]", glow: "shadow-red-500/18" },
    { label: "Valor total previsto", value: formatCurrency(sum(bills, (bill) => bill.expectedAmount)), helper: "compromissos do período", icon: CalendarDays, gradient: "from-[#4b382f] via-[#8b5e3c] to-[#d75c27]", glow: "shadow-[#8b5e3c]/18" },
    { label: "Valor já pago", value: formatCurrency(sum(paidBills, (bill) => bill.paidAmount ?? bill.expectedAmount)), helper: "pagamentos registrados", icon: Wallet, gradient: "from-[#1f7a5b] via-[#31b878] to-[#a7d96d]", glow: "shadow-emerald-500/18" },
    { label: "Valor faltante", value: formatCurrency(sum(pendingOrOverdueBills, (bill) => bill.expectedAmount)), helper: "ainda não pago", icon: Coins, gradient: "from-[#d75c27] via-[#f0853f] to-[#f4b840]", glow: "shadow-orange-500/18" },
  ];

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#d75c27]">Filtros</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Organize por status e categoria.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as BillStatus | "todas")}
            className="min-w-[150px] rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm font-extrabold text-[#211d19] shadow-[0_12px_30px_rgba(33,29,25,.06)] outline-none transition focus:border-[#d75c27]/50 dark:border-white/10 dark:bg-white/8 dark:text-white"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-w-[220px] rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm font-extrabold text-[#211d19] shadow-[0_12px_30px_rgba(33,29,25,.06)] outline-none transition focus:border-[#d75c27]/50 dark:border-white/10 dark:bg-white/8 dark:text-white"
          >
            {billCategories.map((item) => (
              <option key={item} value={item}>
                {item === "todas" ? "Todas categorias" : item}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {summaryItems.map(({ icon: Icon, ...item }) => (
          <div
            key={item.label}
            className={`relative min-h-[138px] overflow-hidden rounded-[28px] bg-gradient-to-br ${item.gradient} p-4 text-white shadow-[0_20px_55px_rgba(33,29,25,.12)] ${item.glow}`}
          >
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/18 blur-2xl" />
            <span className="absolute bottom-0 right-0 h-20 w-20 rounded-tl-[42px] bg-white/10" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/16 text-white ring-1 ring-white/18">
              <Icon className="h-4 w-4" />
            </span>
            <p className="relative mt-4 text-[9px] font-black uppercase tracking-[0.14em] text-white/72">{item.label}</p>
            <p className="relative mt-2 text-xl font-black leading-tight text-white">{item.value}</p>
            <p className="relative mt-1 text-[11px] font-bold leading-4 text-white/72">{item.helper}</p>
          </div>
        ))}
      </div>

      {alertBills.length ? (
        <Card className="border-red-500/20 bg-red-500/8 p-4 lg:p-5">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">Alertas de contas atrasadas</p>
              <h3 className="mt-1 text-lg font-extrabold">Pague primeiro a conta mais antiga em atraso.</h3>
            </div>
            <p className="text-xs font-bold text-[var(--muted)]">{alertBills.length} pendência(s)</p>
          </div>
          <div className="space-y-3">
            {alertBills.map((bill, index) => (
              <button
                type="button"
                key={bill.id}
                onClick={() => onOpenBill(bill)}
                className="grid w-full gap-3 rounded-2xl border border-red-500/15 bg-white/75 p-3 text-left shadow-sm transition hover:bg-white dark:bg-white/8 sm:grid-cols-[44px_1fr_auto] sm:items-center"
              >
                <span className="relative">
                  <CategoryBadgeIcon
                    categoryName={bill.category}
                    categories={categories}
                    logoUrl={bill.logoUrl}
                  />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white">
                    {index + 1}
                  </span>
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-extrabold">{bill.name}</span>
                    <StatusPill status={bill.status} />
                    <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-black text-red-600">{overdueLabel(bill)}</span>
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-[var(--muted)]">
                    {formatCurrency(bill.expectedAmount)} • venceu em {formatDate(bill.dueDate)}
                  </span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation();
                    onStartPayment(bill);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();
                      onStartPayment(bill);
                    }
                  }}
                  className="inline-flex justify-center rounded-2xl bg-[#211d19] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d75c27] dark:bg-[#d75c27]"
                >
                  Paga
                </span>
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {regularBills.map((bill) => (
        <Card key={bill.id} className="p-4 lg:p-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onOpenBill(bill)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onOpenBill(bill);
            }}
            className="grid w-full cursor-pointer gap-4 text-left xl:grid-cols-[1.1fr_0.65fr_0.7fr_0.8fr_auto] xl:items-center"
          >
            <div className="flex items-start gap-3">
              <CategoryBadgeIcon
                categoryName={bill.category}
                categories={categories}
                logoUrl={bill.logoUrl}
              />
              <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold">{bill.name}</h3>
                <StatusPill status={bill.status} />
              </div>
              <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                {bill.category} • {bill.notes}
              </p>
              </div>
            </div>
            <Field label="Vencimento" value={formatDate(bill.dueDate)} />
            <Field label="Previsto" value={formatCurrency(bill.expectedAmount)} />
            <Field
              label="Pagamento"
              value={
                bill.paidDate
                  ? `${formatDate(bill.paidDate)} • ${formatCurrency(bill.paidAmount ?? 0)}`
                  : "Ainda não pago"
              }
            />
            {bill.status !== "paga" ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onStartPayment(bill);
                }}
                className="w-full rounded-2xl bg-[#211d19] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d75c27] dark:bg-[#d75c27] sm:w-auto"
              >
                Paga
              </button>
            ) : null}
          </div>
        </Card>
      ))}

      {!filteredBills.length ? (
        <Card className="py-10 text-center text-sm font-semibold text-[var(--muted)]">
          Nenhuma conta encontrada neste filtro.
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1.5 text-xs font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function GoalsView({
  goals,
  onOpenGoal,
  onNewGoal,
}: {
  goals: Goal[];
  onOpenGoal: (goal: Goal) => void;
  onNewGoal: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNewGoal}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Nova meta
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          return (
            <button
              type="button"
              key={goal.id}
              onClick={() => onOpenGoal(goal)}
              className="glass rounded-3xl p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/85 dark:hover:bg-white/10"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
                Prioridade {goal.priority}
              </p>
              <h3 className="mt-2 text-base font-extrabold">{goal.name}</h3>
              <div className="mt-6 flex justify-between text-xs font-bold">
                <span>{formatCurrency(goal.current)}</span>
                <span>{formatCurrency(goal.target)}</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#211d19]/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-[#d75c27]"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">
                {progress}% concluído • prazo em {formatDate(goal.deadline)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ObjectivesView({
  objectives,
  onToggle,
  onRemove,
  onNew,
}: {
  objectives: MonthlyObjective[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onNew: () => void;
}) {
  const done = objectives.filter((objective) => objective.done).length;

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-extrabold">Progresso do mês</h3>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
            {done} de {objectives.length} objetivo(s) concluído(s).
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="rounded-2xl bg-[#d75c27] px-4 py-2 text-xs font-extrabold text-white"
        >
          Novo objetivo
        </button>
      </div>
      <div className="space-y-2">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/30 p-3 transition dark:bg-white/5"
          >
            <button
              type="button"
              onClick={() => onToggle(objective.id)}
              className={`flex h-6 w-6 items-center justify-center rounded-xl ${
                objective.done ? "bg-[#d75c27] text-white" : "bg-[#211d19]/8"
              }`}
            >
              {objective.done ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
            <span
              onClick={() => onToggle(objective.id)}
              className={`flex-1 cursor-pointer text-xs font-bold transition ${
                objective.done ? "text-[var(--muted)] line-through" : ""
              }`}
            >
              {objective.title}
            </span>
            <button
              type="button"
              onClick={() => onRemove(objective.id)}
              className="rounded-xl p-1.5 text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-600"
              aria-label="Remover objetivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {done ? (
        <p className="rounded-2xl bg-[#d75c27]/10 p-3 text-xs font-bold text-[#b94d20]">
          Boa! Mais uma decisão organizada.
        </p>
      ) : null}
    </Card>
  );
}

function ReportsView({
  data,
  metrics,
  categories,
  allIncomes,
  allBills,
  allGoals,
  realBalance,
  onOpenFinanceDetail,
  onOpenDataSettings,
}: {
  data: MonthData;
  metrics: ReturnType<typeof buildMetrics>;
  categories: Category[];
  allIncomes: Income[];
  allBills: Bill[];
  allGoals: Goal[];
  realBalance: RealBalance;
  onOpenFinanceDetail: (detail: FinanceDetail) => void;
  onOpenDataSettings: () => void;
}) {
  const score = calculateNorthScore(metrics, data.goals);
  const previousMetrics = buildMetrics(buildMonthDataFromLists(addMonths(data.selectedMonth, -1), allIncomes, allBills, allGoals, []));
  const previousScore = calculateNorthScore(previousMetrics, allGoals);
  const scoreDelta = score - previousScore;
  const monthDate = new Date(`${data.selectedMonth}-02T12:00:00`);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(monthDate);
  const reportMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const previousMonth = new Date(monthDate);
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousMonthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(previousMonth);
  const paidCount = metrics.paidBills.length;
  const overdueTotal = sum(metrics.overdueBills, (bill) => bill.expectedAmount);
  const totalSaved = sum(data.goals, (goal) => goal.current);
  const reserveGoal = data.goals.find((goal) => normalizeCategoryName(goal.name).includes("reserva"));
  const reserveTarget = (reserveGoal?.target ?? sum(data.goals, (goal) => goal.target)) || 1;
  const reserveProgress = Math.round(((reserveGoal?.current ?? totalSaved) / Math.max(reserveTarget, 1)) * 100);
  const completedObjectives = data.objectives.filter((objective) => objective.done).length;
  const totalObjectives = Math.max(data.objectives.length, 1);
  const moneyDestinationTotal = Math.max(sum(data.bills, (bill) => bill.paidAmount ?? bill.expectedAmount) + totalSaved, 1);
  const categoryTotals = categories
    .filter((category) => category.type === "conta")
    .map((category) => ({
      label: category.name,
      value: sum(
        metrics.paidBills.filter((bill) => normalizeCategoryName(bill.category) === normalizeCategoryName(category.name)),
        (bill) => bill.paidAmount ?? bill.expectedAmount,
      ),
      color: category.color,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  const distributionItems = categoryTotals.slice(0, 5);
  const distributionTotal = Math.max(sum(distributionItems, (item) => item.value), 1);
  let angle = 0;
  const conicGradient = distributionItems.length ? distributionItems.map((item) => {
    const startAngle = angle;
    const endAngle = startAngle + (item.value / distributionTotal) * 360;
    angle = endAngle;
    return `${item.color} ${startAngle}deg ${endAngle}deg`;
  }).join(", ") : "#eee7e1 0deg 360deg";
  const trendMonths = buildMonthRange(addMonths(data.selectedMonth, -5), data.selectedMonth);
  const trendRows = trendMonths.map((month) => {
    const monthData = buildMonthDataFromLists(month, allIncomes, allBills, allGoals, []);
    const monthMetrics = buildMetrics(monthData);
    return {
      label: monthLabel(month).slice(0, 3),
      income: monthMetrics.totalIncome,
      out: monthMetrics.totalPaid + monthMetrics.totalPending + monthMetrics.totalOverdue,
    };
  });
  const maxTrend = Math.max(...trendRows.flatMap((item) => [item.income, item.out]), 1);
  const pointsFor = (key: "income" | "out") => trendRows.map((item, index) => {
    const x = 28 + index * 82;
    const y = 190 - (item[key] / maxTrend) * 150;
    return `${x},${y}`;
  }).join(" ");
  const timelineItems = [
    ...data.incomes.map((income) => ({
      date: income.receivedDate,
      icon: Wallet,
      title: `Entrada: ${income.name}`,
      detail: `+ ${formatCurrency(income.amount)}`,
      tone: "green",
      action: "Entradas",
    })),
    ...metrics.paidBills.map((bill) => ({
      date: bill.paidDate ?? bill.dueDate,
      icon: ReceiptText,
      title: `Pagou ${bill.name}`,
      detail: `- ${formatCurrency(bill.paidAmount ?? bill.expectedAmount)}${isPaidLate(bill) ? ` • ${paidLateDays(bill)} dia(s) de atraso` : ""}`,
      tone: isPaidLate(bill) ? "orange" : "green",
      action: "Contas pagas",
    })),
    ...metrics.overdueBills.map((bill) => ({
      date: bill.dueDate,
      icon: CircleAlert,
      title: `${bill.name} venceu`,
      detail: overdueLabel(bill),
      tone: "orange",
      action: "Contas atrasadas",
    })),
    ...data.goals
      .filter((goal) => goal.current > 0)
      .map((goal) => ({
        date: goal.deadline,
        icon: Flag,
        title: `Meta com saldo: ${goal.name}`,
        detail: `${formatCurrency(goal.current)} guardados`,
        tone: "purple",
        action: "Metas",
      })),
  ]
    .sort((a, b) => new Date(`${a.date}T12:00:00`).getTime() - new Date(`${b.date}T12:00:00`).getTime())
    .slice(0, 8);
  const totalOpenLateDays = sum(metrics.overdueBills, (bill) => daysOverdue(bill));
  const totalPaidLateDays = sum(metrics.paidLateBills, paidLateDays);
  const debtHealth = Math.max(0, 88 - metrics.overdueBills.length * 12 - totalOpenLateDays - metrics.paidLateBills.length * 6 - totalPaidLateDays);
  const organizationHealth = Math.max(0, Math.min(100, 58 + metrics.paidOnTimeBills.length * 9 - metrics.overdueBills.length * 12 - metrics.pendingBills.length * 3));
  const spendingHealth = Math.max(0, Math.min(100, metrics.projectedBalance >= 0 ? 78 : 48));
  const diagnostic = [
    { icon: Target, label: "Organização", helper: "Contas em dia, pendências e planejamento", value: organizationHealth, status: organizationHealth >= 75 ? "Excelente" : organizationHealth >= 55 ? "Em ajuste" : "Atenção", color: "#31b878" },
    { icon: Wallet, label: "Controle de gastos", helper: "Gastos dentro do planejado", value: spendingHealth, status: spendingHealth >= 70 ? "Bom" : "Precisa ajustar", color: "#2f80ed" },
    { icon: PiggyBank, label: "Reserva financeira", helper: "Segurança para imprevistos", value: reserveProgress, status: reserveProgress >= 50 ? "Boa" : "Precisa de atenção", color: "#f4b840" },
    { icon: Zap, label: "Dívidas", helper: `${metrics.overdueBills.length} aberta(s), ${metrics.paidLateBills.length} paga(s) com atraso`, value: debtHealth, status: metrics.overdueBills.length ? "Prioridade alta" : metrics.paidLateBills.length ? "Monitorar" : "Sob controle", color: "#ef4e3e" },
  ];
  const averagePaidLateDays = metrics.paidLateBills.length ? Math.round(totalPaidLateDays / metrics.paidLateBills.length) : 0;
  const largestCategory = categoryTotals[0];
  const stoppedGoals = data.goals.filter((goal) => goal.current <= 0);
  const progressedGoals = data.goals.filter((goal) => goal.current > 0);
  const diagnosticNotes = [
    metrics.overdueBills.length
      ? `Você tem ${metrics.overdueBills.length} conta(s) em atraso, somando ${formatCurrency(overdueTotal)}. A prioridade é ${metrics.overdueBills[0]?.name}.`
      : "Você não tem contas atrasadas abertas neste mês.",
    metrics.paidLateBills.length
      ? `Você pagou ${metrics.paidLateBills.length} conta(s) com atraso médio de ${averagePaidLateDays} dia(s).`
      : "As contas pagas do período não registraram atraso.",
    largestCategory
      ? `Sua maior concentração de gastos foi em ${largestCategory.label}, com ${formatCurrency(largestCategory.value)}.`
      : "Ainda não há gastos por categoria suficientes para leitura.",
    reserveProgress >= 100
      ? "Sua reserva atingiu o alvo configurado."
      : "Sua reserva ainda está abaixo do ideal.",
    progressedGoals.length
      ? `${progressedGoals.length} meta(s) têm valor guardado.`
      : "Suas metas ainda não receberam aporte.",
    stoppedGoals.length ? `${stoppedGoals.length} meta(s) continuam paradas.` : "Nenhuma meta cadastrada está parada.",
  ];
  const insights = [
    { icon: metrics.incomeDelta >= 0 ? TrendingUp : ArrowDownRight, title: `Entradas ${metrics.incomeDelta >= 0 ? "subiram" : "caíram"} ${Math.abs(metrics.incomeDelta)}%`, helper: `Comparado a ${previousMonthName}.`, tone: metrics.incomeDelta >= 0 ? "green" : "orange" },
    { icon: metrics.spendingDelta <= 0 ? ArrowDownRight : ArrowUpRight, title: `Saídas ${metrics.spendingDelta <= 0 ? "caíram" : "subiram"} ${Math.abs(metrics.spendingDelta)}%`, helper: "Conta apenas pagamentos registrados.", tone: metrics.spendingDelta <= 0 ? "green" : "orange" },
    { icon: PiggyBank, title: `${formatCurrency(totalSaved)} guardados`, helper: "Soma real das metas cadastradas.", tone: totalSaved > 0 ? "green" : "orange" },
  ];
  const recommendations = [
    { title: metrics.urgent ? `Quitar ${metrics.urgent.name}` : "Revisar próximas contas", helper: metrics.urgent?.status === "atrasada" ? `${overdueLabel(metrics.urgent)} • maior impacto no North Score` : "Protege o planejamento do mês", action: "Contas atrasadas" },
    reserveProgress < 100
      ? { title: "Reforçar a reserva", helper: "Aumenta segurança e melhora o North Score", action: "Reserva" }
      : { title: "Manter reserva protegida", helper: "Evite usar esse valor para gastos do mês", action: "Reserva" },
    largestCategory
      ? { title: `Revisar ${largestCategory.label}`, helper: "Maior concentração de gastos do período", action: largestCategory.label }
      : { title: "Definir destino para o saldo livre", helper: "Evita dinheiro sem plano", action: "Livre para decidir" },
  ];

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_92%_16%,rgba(215,92,39,.44),transparent_20rem),linear-gradient(135deg,#211d19,#171411)] p-4 text-white shadow-[0_18px_50px_rgba(33,29,25,.16)] sm:p-5 md:p-7">
        <div className="absolute right-0 top-0 hidden h-full w-1/3 opacity-70 sm:block">
          <svg viewBox="0 0 360 180" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="reportHeroLine" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#d75c27" stopOpacity=".08" />
                <stop offset="1" stopColor="#ff6a2a" />
              </linearGradient>
            </defs>
            <path d="M10 135 C 58 88, 78 104, 112 80 S 174 92, 205 48 S 263 60, 334 18" fill="none" stroke="url(#reportHeroLine)" strokeWidth="5" strokeLinecap="round" />
            <path d="M10 158 C 58 128, 96 140, 132 118 S 204 128, 260 98 S 310 114, 350 82" fill="none" stroke="#d75c27" strokeOpacity=".12" strokeWidth="2" />
            <circle cx="334" cy="18" r="8" fill="#ff6a2a" className="drop-shadow-[0_0_18px_rgba(215,92,39,.9)]" />
          </svg>
        </div>
        <div className="relative grid gap-4 lg:grid-cols-[1fr_260px] lg:items-center">
          <div className="flex gap-3 sm:gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d75c27]/40 bg-[#d75c27]/18 text-[#ff8a55] shadow-[0_0_36px_rgba(215,92,39,.18)] sm:h-16 sm:w-16">
              <Sparkles className="h-5 w-5 sm:h-8 sm:w-8" />
            </span>
            <div>
              <h3 className="text-[1.35rem] font-extrabold leading-tight tracking-tight sm:text-2xl">Relatório real de {reportMonth}</h3>
              <p className="mt-2 max-w-2xl text-[0.82rem] font-medium leading-5 text-white/76 sm:mt-3 sm:text-sm sm:font-semibold sm:leading-6">
                Você registrou {formatCurrency(metrics.totalIncome)} em entradas, pagou {paidCount} conta(s), guardou {formatCurrency(totalSaved)} em metas e terminou com {formatCurrency(metrics.projectedBalance)} de saldo previsto.
              </p>
              <button
                type="button"
                onClick={() => onOpenFinanceDetail(buildFinanceDetail(metrics.overdueBills.length ? "Contas atrasadas" : "Livre para decidir", data, metrics, realBalance))}
                className="mt-3 rounded-2xl bg-[#d75c27]/16 px-3 py-2 text-left text-[0.78rem] font-bold leading-5 text-[#ff9b6d] transition hover:bg-[#d75c27]/24 sm:mt-4 sm:px-4 sm:text-xs"
              >
                {metrics.overdueBills.length ? `Prioridade: ${metrics.overdueBills[0]?.name} está ${overdueLabel(metrics.overdueBills[0])}.` : "Nenhuma conta atrasada aberta neste mês."}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenFinanceDetail({
              title: "North Score",
              value: score,
              description: "Pontuação calculada por contas pagas, atrasos, reserva, metas e planejamento.",
              sections: [{ title: "Indicadores considerados", total: score, items: recommendations.map((item, index) => ({ label: item.title, date: `${index + 1}`, amount: index === 0 ? 4 : 0, note: item.helper })) }],
            })}
            className="rounded-3xl border border-white/10 bg-white/8 p-4 text-left backdrop-blur-xl transition hover:bg-white/12 sm:p-5"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/64 sm:text-xs">North Score</p>
            <p className="mt-1 text-4xl font-black sm:mt-2 sm:text-5xl">{score}</p>
            <p className={`mt-1 text-[11px] font-bold sm:mt-2 sm:text-xs ${scoreDelta >= 0 ? "text-emerald-300" : "text-[#ffb08a]"}`}>
              {scoreDelta >= 0 ? "↑" : "↓"} {Math.abs(scoreDelta)} ponto(s) em relação a {previousMonthName}
            </p>
          </button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1fr_1fr]">
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#211d19] dark:text-white">1. Evolução financeira</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Entradas x saídas nos últimos 6 meses</p>
          <div className="mt-5 rounded-3xl bg-white/35 p-3 dark:bg-white/5">
            <svg viewBox="0 0 460 230" className="h-64 w-full" aria-hidden="true">
              {[0, 1, 2, 3].map((line) => <line key={line} x1="28" x2="438" y1={40 + line * 45} y2={40 + line * 45} stroke="rgba(33,29,25,.08)" />)}
              <polyline points={pointsFor("income")} fill="none" stroke="#31b878" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={pointsFor("out")} fill="none" stroke="#d75c27" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {trendRows.map((item, index) => <text key={item.label} x={28 + index * 82} y="218" textAnchor="middle" className="fill-[#756b62] text-[11px] font-bold">{item.label}</text>)}
            </svg>
            <div className="flex justify-center gap-5 text-xs font-bold">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Entradas</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d75c27]" />Saídas</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 2xl:grid-cols-3">
            {insights.map(({ icon: Icon, title, helper, tone }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl bg-[#211d19]/4 p-3 dark:bg-white/6">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone === "green" ? "bg-emerald-500/14 text-emerald-600" : "bg-[#d75c27]/12 text-[#d75c27]"}`}><Icon className="h-4 w-4" /></span>
                <span>
                  <span className="block text-xs font-extrabold leading-4">{title}</span>
                  <span className="mt-1 block text-[10px] font-semibold leading-4 text-[var(--muted)]">{helper}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#211d19] dark:text-white">2. Diagnóstico North</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Como está sua saúde financeira</p>
          <div className="mt-5 space-y-5">
            {diagnostic.map(({ icon: Icon, label, helper, value, status, color }) => (
              <button
                type="button"
                key={label}
                onClick={() => onOpenFinanceDetail(buildFinanceDetail(label, data, metrics, realBalance))}
                className="grid w-full grid-cols-[44px_1fr_70px] items-center gap-3 text-left"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${color}20`, color }}><Icon className="h-5 w-5" /></span>
                <span>
                  <span className="block text-sm font-extrabold">{label}</span>
                  <span className="block text-[11px] font-semibold text-[var(--muted)]">{helper}</span>
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-[#211d19]/8 dark:bg-white/10"><span className="block h-full rounded-full" style={{ width: `${Math.min(value, 100)}%`, background: color }} /></span>
                </span>
                <span className="text-right">
                  <span className="block text-xl font-black">{value}%</span>
                  <span className="block text-[10px] font-bold" style={{ color }}>{status}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-2 rounded-2xl border border-[var(--line)] bg-white/35 p-3 dark:bg-white/5">
            {diagnosticNotes.map((note) => (
              <p key={note} className="text-[11px] font-semibold leading-5 text-[var(--muted)]">{note}</p>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#211d19] dark:text-white">3. Distribuição do dinheiro</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Para onde seu dinheiro foi destinado</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[190px_1fr]">
            <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full" style={{ background: `conic-gradient(${conicGradient})` }}>
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-inner dark:bg-[#211d19]">
                <span className="text-[10px] font-bold text-[var(--muted)]">Total</span>
                <span className="text-sm font-black">{formatCurrency(distributionTotal)}</span>
              </div>
            </div>
            <div className="space-y-3">
              {distributionItems.length ? distributionItems.map((item) => {
                const percent = Math.round((item.value / distributionTotal) * 100);
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => onOpenFinanceDetail(buildFinanceDetail(item.label, data, metrics, realBalance))}
                    className="flex w-full items-center justify-between gap-3 border-b border-[#211d19]/8 pb-2 text-left last:border-b-0 dark:border-white/10"
                  >
                    <span className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} /><span><span className="block text-sm font-extrabold">{item.label}</span><span className="text-xs font-semibold text-[var(--muted)]">{formatCurrency(item.value)}</span></span></span>
                    <span className="text-sm font-black">{percent}%</span>
                  </button>
                );
              }) : (
                <div className="rounded-2xl border border-[var(--line)] bg-white/45 p-4 text-sm font-semibold text-[var(--muted)] dark:bg-white/5">
                  Nenhuma conta paga registrada neste mês.
                </div>
              )}
            </div>
          </div>
          {distributionItems.length ? (
            <button type="button" onClick={() => onOpenFinanceDetail(buildFinanceDetail("Saiu no mês", data, metrics, realBalance))} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[var(--line)] px-4 py-3 text-xs font-extrabold">
              Ver contas pagas <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </Card>
      </div>

      <div className="grid items-start gap-4 2xl:grid-cols-[1.18fr_0.82fr]">
        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#211d19] dark:text-white">4. Linha do tempo do mês</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Principais eventos financeiros de {reportMonth}</p>
          <div className="mt-5 overflow-x-auto pb-1">
            <div className="relative flex min-w-[720px] items-start justify-between gap-3 px-3">
              <span className="absolute left-10 right-10 top-6 z-0 h-px bg-[#211d19]/10 dark:bg-white/10" />
              {timelineItems.length ? timelineItems.map(({ date, icon: Icon, title, detail, tone, action }) => {
                const content = (
                  <>
                    <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_8px_22px_rgba(33,29,25,.06)] ring-8 ring-[var(--background)] dark:ring-[#050505] ${tone === "green" ? "border-emerald-500/20 bg-[#eaf8f1] text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-500/18 dark:text-emerald-200" : tone === "purple" ? "border-purple-500/20 bg-[#f0e6ff] text-purple-600 dark:border-purple-400/25 dark:bg-purple-500/18 dark:text-purple-200" : tone === "dark" ? "border-[#211d19]/20 bg-[#211d19] text-white dark:border-white/15 dark:bg-white dark:text-[#050505]" : "border-[#d75c27]/20 bg-[#fff0e8] text-[#d75c27] dark:border-[#d75c27]/30 dark:bg-[#d75c27]/18 dark:text-[#ffb08a]"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-2 text-[11px] font-bold text-[var(--muted)]">{formatDate(date)}</p>
                    <p className="mt-1 text-[11px] font-extrabold leading-4">{title}</p>
                    <p className={`mt-1 text-[10px] font-black ${detail.includes("+") ? "text-emerald-600" : detail.includes("-") ? "text-[#d75c27]" : "text-[var(--muted)]"}`}>{detail}</p>
                  </>
                );
                return action ? (
                  <button
                    type="button"
                    key={`${date}-${title}`}
                    onClick={() => onOpenFinanceDetail(buildFinanceDetail(action, data, metrics, realBalance))}
                    className="relative z-10 w-24 text-center"
                  >
                    {content}
                  </button>
                ) : (
                  <div key={`${date}-${title}`} className="relative z-10 w-24 text-center">
                    {content}
                  </div>
                );
              }) : (
                <div className="relative z-10 mx-auto rounded-2xl border border-[var(--line)] bg-white/60 px-5 py-4 text-center text-xs font-bold text-[var(--muted)] dark:bg-white/5">
                  Nenhum evento financeiro registrado neste mês.
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#211d19] dark:text-white">5. Recomendações North</p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">O que você pode fazer em {reportMonth}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3 2xl:grid-cols-1">
            {recommendations.map((item, index) => (
              <button
                type="button"
                key={item.title}
                onClick={() => onOpenFinanceDetail(buildFinanceDetail(item.action, data, metrics, realBalance))}
                className="grid w-full grid-cols-[34px_1fr_auto] items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/35 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d75c27] text-xs font-black text-white">{index + 1}</span>
                <span><span className="block text-xs font-extrabold leading-4">{item.title}</span><span className="mt-0.5 block text-[10px] font-semibold leading-4 text-[var(--muted)]">{item.helper}</span></span>
                <ChevronRight className="h-4 w-4 text-[var(--muted)]" />
              </button>
            ))}
          </div>
          <button type="button" onClick={onOpenDataSettings} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-[var(--line)] px-4 py-3 text-xs font-extrabold">
            Gerar relatório PDF <ChevronRight className="h-4 w-4" />
          </button>
        </Card>
      </div>

      <Card className="flex flex-col gap-3 bg-[#d75c27]/7 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d75c27]/12 text-[#d75c27]"><Sparkles className="h-5 w-5" /></span>
          <p className="text-sm font-semibold text-[var(--muted)]">
            Relatórios gerados com inteligência North. Dados atualizados para {reportMonth}.
          </p>
        </div>
        <button type="button" onClick={onOpenDataSettings} className="text-xs font-extrabold text-[#d75c27]">Entenda como calculamos</button>
      </Card>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#211d19]/45 p-4 backdrop-blur-sm">
      <div className="app-modal-panel glass-strong max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[30px] p-5 dark:bg-[#050505]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="app-muted-surface rounded-2xl bg-[#211d19]/8 p-2 dark:bg-[#080808]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-[var(--muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
      />
    </label>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-[var(--muted)]">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={moneyToInput(value)}
        onChange={(event) => onChange(parseCurrency(event.target.value))}
        className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
      />
    </label>
  );
}

function AccountLogoInput({
  logoUrl,
  category,
  color,
  Icon,
  onChange,
}: {
  logoUrl?: string;
  category: string;
  color: string;
  Icon: React.ElementType;
  onChange: (logoUrl: string) => void;
}) {
  return (
    <label className="group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) onChange(await readFileAsDataUrl(file));
        }}
      />
      <SafeBillLogo
        logoUrl={logoUrl}
        className="h-11 w-11 rounded-full object-cover ring-1 ring-[#211d19]/8"
        fallback={
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: `${color}18`, color }}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        }
      />
      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#211d19]/55 text-white opacity-0 transition group-hover:opacity-100" title={`Trocar logo de ${category}`}>
        <Pencil className="h-3.5 w-3.5" />
      </span>
    </label>
  );
}

function BrandSymbol({ className = "" }: { className?: string }) {
  return (
    <img
      src="/simbolo-reveenorth.png"
      alt=""
      className={`object-contain ${className}`}
    />
  );
}

const onboardingDefaults: OnboardingData = {
  profileType: "",
  financeScope: "",
  familyStatus: "",
  coupleModel: "",
  hasChildren: "",
  childrenCount: "",
  children: [],
  monthlyIncome: 0,
  incomeSources: [],
  incomeType: "",
  hasDebt: "",
  debtAmount: 0,
  fixedExpenses: [],
  hasReserve: "",
  reserveAmount: 0,
  goals: [],
  priority: "",
  financialBehavior: "",
  helpLevel: "",
  northHelp: [],
  productMode: "North Personal",
};

function OnboardingFlow({
  user,
  onComplete,
}: {
  user: UserProfile;
  onComplete: (data: OnboardingData) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingData>(onboardingDefaults);
  const [childAges, setChildAges] = useState<string[]>([]);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [expenseMenuFor, setExpenseMenuFor] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseDraft, setExpenseDraft] = useState({
    category: "Moradia",
    amount: 0,
    fixed: true,
  });
  const steps = [
    "welcome",
    "scope",
    "family",
    "children",
    "incomes",
    "expenses",
    "goals",
    "behavior",
    "help",
    "final",
  ];
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = ((step + 1) / steps.length) * 100;
  const totalIncome = answers.monthlyIncome || answers.incomeSources.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = answers.fixedExpenses.reduce((acc, item) => acc + item.amount, 0);
  const canContinue = (() => {
    if (current === "welcome" || current === "final") return true;
    if (current === "scope") return Boolean(answers.financeScope);
    if (current === "family") return Boolean(answers.familyStatus);
    if (current === "children") return Boolean(answers.hasChildren);
    if (current === "incomes") return true;
    if (current === "expenses") return true;
    if (current === "goals") return answers.goals.length > 0;
    if (current === "behavior") return Boolean(answers.financialBehavior);
    if (current === "help") return Boolean(answers.helpLevel);
    return true;
  })();
  const patch = (data: Partial<OnboardingData>) =>
    setAnswers((currentAnswers) => ({ ...currentAnswers, ...data }));
  const next = () => {
    if (current === "final") {
      onComplete(answers);
      return;
    }
    setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  };
  const back = () => setStep((currentStep) => Math.max(0, currentStep - 1));
  const toggleArray = (key: "goals" | "northHelp", value: string) => {
    setAnswers((currentAnswers) => {
      const list = currentAnswers[key];
      const nextList =
        value === "Todas as opções"
          ? list.includes(value)
            ? []
            : ["Todas as opções"]
          : list.includes(value)
            ? list.filter((item) => item !== value && item !== "Todas as opções")
            : [...list.filter((item) => item !== "Todas as opções"), value];
      return { ...currentAnswers, [key]: nextList };
    });
  };
  const chooseChildren = (value: string) => {
    const count = value === "Não" ? 0 : value === "1 filho" ? 1 : value === "2 filhos" ? 2 : 3;
    const nextAges = count ? Array.from({ length: count }, (_, index) => childAges[index] ?? "") : [];
    setChildAges(nextAges);
    patch({
      hasChildren: value,
      childrenCount: String(count),
      children: nextAges.map((age, index) => ({ id: `child-${index + 1}`, name: `Filho ${index + 1}`, age })),
    });
  };
  const updateChildAge = (index: number, age: string) => {
    const nextAges = childAges.map((item, itemIndex) => (itemIndex === index ? age : item));
    setChildAges(nextAges);
    patch({
      children: nextAges.map((childAge, childIndex) => ({
        id: `child-${childIndex + 1}`,
        name: `Filho ${childIndex + 1}`,
        age: childAge,
      })),
    });
  };
  const addFixedExpense = () => {
    if (!expenseDraft.category.trim() || !expenseDraft.amount) return;
    const nextExpense = {
      id: editingExpenseId ?? `expense-${Date.now()}`,
      ...expenseDraft,
      name: expenseDraft.category,
      dueDay: "",
    };
    patch({
      fixedExpenses: editingExpenseId
        ? answers.fixedExpenses.map((expense) => (expense.id === editingExpenseId ? nextExpense : expense))
        : [...answers.fixedExpenses, nextExpense],
    });
    setEditingExpenseId(null);
    setExpenseDraft({ category: "Moradia", amount: 0, fixed: true });
    setExpenseFormOpen(false);
  };
  const editFixedExpense = (expense: OnboardingData["fixedExpenses"][number]) => {
    setEditingExpenseId(expense.id);
    setExpenseDraft({ category: expense.category, amount: expense.amount, fixed: expense.fixed });
    setExpenseFormOpen(true);
    setExpenseMenuFor(null);
  };
  const deleteFixedExpense = (id: string) => {
    patch({ fixedExpenses: answers.fixedExpenses.filter((expense) => expense.id !== id) });
    setExpenseMenuFor(null);
    if (editingExpenseId === id) {
      setEditingExpenseId(null);
      setExpenseDraft({ category: "Moradia", amount: 0, fixed: true });
      setExpenseFormOpen(false);
    }
  };
  const chooseFamily = (familyStatus: string) => {
    const familyMode = familyStatus === "Casada" || familyStatus === "União estável";
    patch({
      familyStatus,
      coupleModel: familyMode ? "Casal Compartilhado" : "Individual",
      productMode: familyMode ? "North Family" : "North Personal",
    });
  };
  const chooseGoal = (goal: string) => {
    setAnswers((currentAnswers) => {
      const goals = currentAnswers.goals.includes(goal)
        ? currentAnswers.goals.filter((item) => item !== goal)
        : [...currentAnswers.goals, goal];
      return { ...currentAnswers, goals, priority: currentAnswers.priority || goal };
    });
  };
  const coupleModeLabel =
    answers.coupleModel ||
    (answers.productMode === "North Family" ? "Casal Compartilhado" : "Individual");
  const darkStep = current === "welcome" || current === "final";

  return (
    <main className={`min-h-[100svh] overflow-hidden text-[#211d19] ${
      darkStep
        ? "bg-[radial-gradient(circle_at_78%_10%,rgba(215,92,39,0.72),transparent_26rem),radial-gradient(circle_at_95%_85%,rgba(215,92,39,0.45),transparent_28rem),linear-gradient(135deg,#211d19,#120f0d_58%,#d75c27_145%)]"
        : "bg-[radial-gradient(circle_at_84%_12%,rgba(215,92,39,0.16),transparent_24rem),linear-gradient(135deg,#f7f5f2,#efefef)]"
    }`}>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl items-stretch">
        <section
          className={`relative flex min-h-[100svh] w-full flex-col overflow-hidden ${
            darkStep
              ? "text-white"
              : "text-[#211d19]"
          }`}
        >
          <OnboardingHeader
            current={step + 1}
            total={steps.length}
            progress={progress}
            dark={darkStep}
          />

          <div className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-2 sm:px-8 sm:pb-4 lg:px-16 lg:pb-5 lg:pt-3">
            <div className="min-h-0 flex-1 overflow-y-auto pr-1 animate-[fadeIn_.28s_ease] sm:overflow-visible sm:pr-0">
              {current === "welcome" ? (
                <OnboardingIntro />
              ) : null}

              {current === "scope" ? (
                <Question eyebrow="Sobre você" title="Como suas finanças funcionam hoje?" subtitle="Isso nos ajuda a entender melhor sua realidade.">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {[
                      ["Apenas eu", Heart],
                      ["Eu e meu parceiro(a)", Users],
                      ["Minha família inteira", Home],
                      ["Sou empresária", Building2],
                    ].map(([label, Icon]) => (
                      <OptionCard
                        key={label as string}
                        icon={Icon as React.ElementType}
                        label={label as string}
                        selected={answers.financeScope === label}
                        onClick={() =>
                          patch({
                            financeScope: label as string,
                            profileType: label === "Sou empresária" ? "Empresa" : "Pessoa Física",
                            productMode:
                              label === "Sou empresária"
                                ? "North Business"
                                : label === "Apenas eu"
                                  ? "North Personal"
                                  : "North Family",
                          })
                        }
                      />
                    ))}
                  </div>
                </Question>
              ) : null}

              {current === "family" ? (
                <Question eyebrow="Situação familiar" title="Qual cenário mais se parece com você?">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {[
                      ["Solteira", UserRound],
                      ["Casada", Heart],
                      ["União estável", Users],
                    ].map(([label, Icon]) => (
                      <OptionCard
                        key={label as string}
                        icon={Icon as React.ElementType}
                        label={label as string}
                        selected={answers.familyStatus === label}
                        onClick={() => chooseFamily(label as string)}
                      />
                    ))}
                  </div>
                </Question>
              ) : null}

              {current === "children" ? (
                <Question eyebrow="Filhos" title="Você possui filhos?" subtitle="Essa informação nos ajuda a planejar melhor o futuro.">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["Não", "1 filho", "2 filhos", "3 ou mais"].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => chooseChildren(value)}
                    className={`min-h-14 rounded-2xl border px-2 text-[11px] font-extrabold transition ${
                          answers.hasChildren === value
                            ? "border-[#d75c27] bg-[#d75c27]/10 text-[#d75c27]"
                            : "border-[#211d19]/10 bg-white/70 text-[#211d19]"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  {answers.hasChildren && answers.hasChildren !== "Não" ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-[#756b62]">Informe apenas a idade de cada filho:</p>
                      {childAges.map((age, index) => (
                        <label key={index} className="block rounded-2xl border border-[#211d19]/8 bg-white/60 p-2.5">
                          <span className="text-xs font-bold text-[#756b62]">Idade do filho {index + 1}</span>
                          <input
                            value={age}
                            onChange={(event) => updateChildAge(index, event.target.value)}
                            placeholder="Ex: 10 anos"
                            className="mt-1.5 w-full rounded-xl border border-[#211d19]/10 bg-white/70 px-3 py-2 text-sm font-semibold outline-none"
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}
                </Question>
              ) : null}

              {current === "incomes" ? (
                <Question eyebrow="Renda" title="Qual é a renda mensal da casa?" subtitle="Informe uma média. Pode ser aproximado.">
                  <label className="block max-w-[430px]">
                    <span className="text-xs font-extrabold text-[#756b62]">
                      Renda familiar mensal
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatCurrency(answers.monthlyIncome)}
                      onChange={(event) => patch({ monthlyIncome: parseCurrency(event.target.value) })}
                      className="mt-2 h-14 w-full rounded-2xl border border-[#211d19]/10 bg-white/70 px-4 text-lg font-extrabold outline-none transition focus:border-[#d75c27] focus:bg-white"
                    />
                  </label>
                </Question>
              ) : null}

              {current === "expenses" ? (
                <Question eyebrow="Despesas" title="Quais são suas despesas fixas mensais?" subtitle="Não se preocupe em lembrar tudo, a North te ajuda.">
                  <div className="max-w-3xl space-y-3">
                    {answers.fixedExpenses.length ? answers.fixedExpenses.map((expense) => (
                      <div key={expense.id} className="relative">
                        <CompactRow
                          icon={onboardingExpenseIcons[expense.category] ?? onboardingExpenseIcons[expense.name] ?? CircleDollarSign}
                          title={expense.name}
                          value={formatCurrency(expense.amount)}
                        />
                        <button
                          type="button"
                          onClick={() => setExpenseMenuFor(expenseMenuFor === expense.id ? null : expense.id)}
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-[#756b62] transition hover:bg-[#211d19]/8"
                          aria-label="Ações da despesa"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {expenseMenuFor === expense.id ? (
                          <div className="absolute right-2 top-12 z-20 w-36 rounded-2xl border border-[#211d19]/10 bg-white p-1.5 text-[#211d19] shadow-xl">
                            <button type="button" onClick={() => editFixedExpense(expense)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold hover:bg-[#211d19]/6">
                              <Pencil className="h-3.5 w-3.5" /> Editar
                            </button>
                            <button type="button" onClick={() => deleteFixedExpense(expense.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-500/8">
                              <Trash2 className="h-3.5 w-3.5" /> Excluir
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )) : (
                      <button
                        type="button"
                        onClick={() => setExpenseFormOpen(true)}
                        className="w-full rounded-2xl border border-dashed border-[#211d19]/14 bg-white/44 p-4 text-left text-sm font-bold text-[#756b62] transition hover:border-[#d75c27]/50 hover:bg-white/70"
                      >
                        Cadastre sua primeira despesa
                      </button>
                    )}
                    {answers.fixedExpenses.length && !expenseFormOpen ? (
                      <button
                        type="button"
                        onClick={() => setExpenseFormOpen(true)}
                        className="rounded-2xl border border-[#211d19]/10 bg-white/62 px-4 py-2.5 text-sm font-extrabold text-[#211d19]"
                      >
                        Adicionar despesa
                      </button>
                    ) : null}
                    {expenseFormOpen ? (
                    <div className="grid items-end gap-3 rounded-3xl border border-[#211d19]/8 bg-white/54 p-3 shadow-[0_14px_42px_rgba(33,29,25,0.05)] md:grid-cols-[1fr_180px_auto]">
                      <label className="block">
                        <span className="text-[11px] font-extrabold text-[#756b62]">Categoria</span>
                        <div className="mt-2 flex h-12 items-center gap-2 rounded-2xl border border-[#211d19]/10 bg-white/70 px-3">
                          {(() => {
                            const DraftIcon = onboardingExpenseIcons[expenseDraft.category] ?? CircleDollarSign;
                            return <DraftIcon className="h-4 w-4 shrink-0 text-[#d75c27]" />;
                          })()}
                          <select value={expenseDraft.category} onChange={(event) => setExpenseDraft((current) => ({ ...current, category: event.target.value }))} className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none">
                            {["Moradia", "Água", "Luz", "Internet", "Alimentação", "Transporte", "Dívidas", "Outro"].map((type) => <option key={type}>{type}</option>)}
                          </select>
                        </div>
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-extrabold text-[#756b62]">Valor</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatCurrency(expenseDraft.amount)}
                          onChange={(event) => setExpenseDraft((current) => ({ ...current, amount: parseCurrency(event.target.value) }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-[#211d19]/10 bg-white/70 px-3 text-sm font-extrabold outline-none focus:border-[#d75c27]"
                        />
                      </label>
                      <button type="button" onClick={addFixedExpense} className="h-12 rounded-2xl bg-[#211d19] px-5 text-sm font-extrabold text-white">{editingExpenseId ? "Salvar" : "Adicionar"}</button>
                    </div>
                    ) : null}
                  </div>
                </Question>
              ) : null}

              {current === "goals" ? (
                <Question eyebrow="Objetivos" title="O que você deseja conquistar primeiro?" subtitle="Selecione quantos quiser.">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Comprar casa", Home],
                      ["Quitar dívidas", Wallet],
                      ["Reserva de emergência", PiggyBank],
                      ["Viajar", Plane],
                      ["Investir", TrendingUp],
                      ["Estudar", GraduationCap],
                    ].map(([label, Icon]) => (
                      <GoalTile
                        key={label as string}
                        icon={Icon as React.ElementType}
                        label={label as string}
                        selected={answers.goals.includes(label as string)}
                        onClick={() => chooseGoal(label as string)}
                      />
                    ))}
                  </div>
                  <button type="button" className="mt-2 w-full rounded-2xl border border-[#211d19]/10 bg-white/62 py-2.5 text-sm font-bold">
                    + Outro objetivo
                  </button>
                </Question>
              ) : null}

              {current === "behavior" ? (
                <Question eyebrow="Comportamento financeiro" title="Quando o dinheiro entra, você normalmente:">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {[
                      ["Guardo primeiro", PiggyBank],
                      ["Pago contas primeiro", ReceiptText],
                      ["Vou decidindo conforme o mês", Wallet],
                      ["Gasto sem muito planejamento", CircleDollarSign],
                    ].map(([label, Icon]) => (
                      <OptionCard
                        key={label as string}
                        icon={Icon as React.ElementType}
                        label={label as string}
                        selected={answers.financialBehavior === label}
                        onClick={() => patch({ financialBehavior: label as string })}
                      />
                    ))}
                  </div>
                </Question>
              ) : null}

              {current === "help" ? (
                <Question eyebrow="Nível de ajuda" title="Quanto você quer de ajuda da North?" subtitle="Você pode mudar isso depois.">
                  <div className="space-y-3">
                    <OptionCard
                      icon={Shield}
                      label="Modo Básico"
                      helper="Organização financeira no seu ritmo."
                      selected={answers.helpLevel === "Modo Básico"}
                      onClick={() => patch({ helpLevel: "Modo Básico", northHelp: ["Organização financeira"] })}
                    />
                    <OptionCard
                      icon={HelpCircle}
                      label="Modo Coach"
                      helper="Sugestões e insights semanais."
                      selected={answers.helpLevel === "Modo Coach"}
                      onClick={() => patch({ helpLevel: "Modo Coach", northHelp: ["Planejamento mensal", "Metas"] })}
                    />
                    <OptionCard
                      icon={Sparkles}
                      label="Modo North IA"
                      helper="Análises completas e recomendações personalizadas."
                      badge="Recomendado"
                      selected={answers.helpLevel === "Modo North IA"}
                      onClick={() => patch({ helpLevel: "Modo North IA", northHelp: ["Todas as opções"] })}
                      dark
                    />
                  </div>
                </Question>
              ) : null}

              {current === "final" ? (
                <OnboardingFinal
                  user={user}
                  answers={answers}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  coupleModeLabel={coupleModeLabel}
                />
              ) : null}
            </div>

            <div className={`mt-3 shrink-0 gap-3 pb-[env(safe-area-inset-bottom)] lg:max-w-3xl ${current === "final" ? "grid grid-cols-2" : "flex items-center justify-between"}`}>
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition disabled:opacity-0 ${
                  darkStep
                    ? "border-white/10 bg-white/5 text-white"
                    : "border-[#211d19]/10 bg-white/60 text-[#211d19]"
                } ${current === "final" ? "w-full min-w-0 text-center" : ""}`}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className={`rounded-xl bg-[#d75c27] px-6 py-2.5 text-xs font-extrabold text-white shadow-[0_16px_34px_rgba(215,92,39,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 ${current === "final" ? "w-full min-w-0 text-center" : ""}`}
              >
                {current === "welcome" ? "Começar" : current === "final" ? "Entrar no Dashboard" : "Continuar"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function OnboardingIntro() {
  return (
    <div className="flex h-full max-w-3xl flex-col justify-center">
      <h1 className="max-w-2xl text-[1.8rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.45rem] lg:text-[3.15rem]">
        Seu novo norte financeiro começa aqui.
      </h1>
      <p className="mt-4 max-w-[17rem] text-sm font-semibold leading-6 text-white/78 lg:max-w-md">
        Em menos de 2 minutos vamos entender sua realidade para criar recomendações personalizadas.
      </p>
      <div className="mt-8 h-1 rounded-full bg-white/12 lg:max-w-lg">
        <div className="h-full w-[12%] rounded-full bg-[#d75c27]" />
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3.5 backdrop-blur-xl lg:max-w-md">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27]/15">
          <BrandSymbol className="h-7 w-7" />
        </span>
        <p className="text-xs font-semibold leading-5 text-white/80">
          A North IA vai te guiar em cada passo.
        </p>
      </div>
    </div>
  );
}

function Question({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-3xl">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d75c27]">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-2xl text-[1.2rem] font-black leading-[1.12] tracking-tight sm:text-[1.45rem] lg:text-[1.85rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-[20rem] text-xs font-semibold leading-5 text-[#756b62] lg:max-w-xl">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-3.5 w-full max-w-3xl">{children}</div>
    </div>
  );
}

function OnboardingHeader({
  current,
  total,
  progress,
  dark,
}: {
  current: number;
  total: number;
  progress: number;
  dark: boolean;
}) {
  return (
    <div className="px-4 pt-4 sm:px-8 lg:px-16 lg:pt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandSymbol className="h-7 w-7" />
          <p className={`text-sm font-black tracking-tight ${dark ? "text-white" : "text-[#211d19]"}`}>
            Revee<span className="text-[#d75c27]">North</span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${dark ? "bg-black/24 text-white" : "bg-white/80 text-[#211d19]"}`}>
          {current}/{total}
        </span>
      </div>
      {!dark ? (
        <div className="mt-4 h-1 rounded-full bg-[#211d19]/8">
          <div className="h-full rounded-full bg-[#d75c27] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function OptionCard({
  icon: Icon,
  label,
  helper,
  badge,
  selected,
  disabled = false,
  dark = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  helper?: string;
  badge?: string;
  selected: boolean;
  disabled?: boolean;
  dark?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-2.5 text-left transition ${
        dark
          ? "border-[#211d19]/20 bg-[#211d19] text-white shadow-[0_18px_44px_rgba(33,29,25,0.2)]"
          : selected
            ? "border-[#d75c27] bg-[#d75c27]/6 shadow-[0_14px_34px_rgba(215,92,39,0.1)]"
            : "border-[#211d19]/9 bg-white/68 hover:bg-white"
      } ${disabled ? "cursor-not-allowed opacity-45" : "hover:-translate-y-0.5"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${dark || selected ? "bg-[#d75c27]/13 text-[#d75c27]" : "bg-[#211d19]/5 text-[#211d19]"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-extrabold">{label}</p>
            {badge ? <span className="rounded-full border border-[#d75c27]/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#d75c27]">{badge}</span> : null}
          </div>
          {helper ? <p className={`mt-1 text-[11px] font-semibold leading-4 ${dark ? "text-white/60" : "text-[#756b62]"}`}>{helper}</p> : null}
        </div>
        {selected ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d75c27] text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
    </button>
  );
}

function CompactRow({
  icon: Icon,
  title,
  value,
  meta,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#211d19]/8 bg-white/72 px-3 py-3 shadow-[0_10px_26px_rgba(33,29,25,0.04)]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d75c27]/10 text-[#d75c27]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="min-w-0 flex-1 truncate text-sm font-extrabold">{title}</p>
      <div className="text-right">
        <p className="text-xs font-bold text-[#211d19]">{value}</p>
        {meta ? <p className="mt-1 text-[10px] font-bold text-[#756b62]">{meta}</p> : null}
      </div>
    </div>
  );
}

function GoalTile({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[76px] rounded-2xl border p-2.5 text-left transition hover:-translate-y-0.5 ${
        selected ? "border-[#d75c27] bg-[#d75c27]/7" : "border-[#211d19]/9 bg-white/68"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d75c27]/10 text-[#d75c27]">
          <Icon className="h-4 w-4" />
        </span>
        {selected ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d75c27] text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[13px] font-extrabold leading-4">{label}</p>
    </button>
  );
}

function OnboardingFinal({
  user,
  answers,
  totalIncome,
  totalExpenses,
  coupleModeLabel,
}: {
  user: UserProfile;
  answers: OnboardingData;
  totalIncome: number;
  totalExpenses: number;
  coupleModeLabel: string;
}) {
  return (
    <div className="flex min-h-full w-full max-w-5xl flex-col justify-center overflow-y-auto pr-1 sm:overflow-hidden sm:pr-0">
      <h2 className="max-w-3xl text-2xl font-black tracking-tight lg:text-4xl">
        Seu perfil está pronto.
      </h2>
      <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-white/70">
        Criamos a base do seu planejamento financeiro.
      </p>
      <div className="mt-5 grid w-full min-w-0 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryItem label="Modelo financeiro" value={coupleModeLabel} />
        <SummaryItem label="Renda estimada" value={formatCurrency(totalIncome || answers.monthlyIncome)} />
        <SummaryItem label="Despesas fixas" value={formatCurrency(totalExpenses)} />
        <SummaryItem label="Objetivo principal" value={answers.priority || answers.goals[0] || "Organizar orçamento"} />
        <SummaryItem label="Ajuda escolhida" value={answers.helpLevel || "Modo Coach"} />
      </div>
      <div className="mt-4 max-w-2xl rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27]/13">
            <BrandSymbol className="h-7 w-7" />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ffb08b]">
              Primeira recomendação North
            </p>
            <p className="mt-2 text-sm font-semibold leading-5 text-white/82">
              {user.firstName}, comece definindo as entradas e despesas fixas do mês. Isso cria clareza antes de direcionar dinheiro para metas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-white/72" />
      <span>{value}</span>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/8 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ffb08b]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-extrabold">{value}</p>
    </div>
  );
}

function LoginScreen({
  onLogin,
  onResetPassword,
}: {
  onLogin: (email: string, password: string, fullName?: string, startOnboarding?: boolean) => Promise<{ ok: boolean; error?: string; message?: string }>;
  onResetPassword: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const isSignup = mode === "signup";
  const canSubmit = isSignup
    ? fullName.trim().length > 2 &&
      email.includes("@") &&
      password.length >= 8 &&
      password === confirmPassword
    : email.includes("@") && password.length >= 1;
  const submit = async () => {
    if (!canSubmit || authLoading) return;
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    const result = await onLogin(email, password, isSignup ? fullName : undefined, isSignup);
    setAuthLoading(false);
    if (!result.ok) {
      setAuthError(result.error ?? "Nao foi possivel acessar.");
      return;
    }
    if (result.message) setAuthMessage(result.message);
  };
  const recover = async () => {
    if (!email.includes("@") || authLoading) {
      setAuthError("Informe seu e-mail para recuperar a senha.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    setAuthMessage("");
    const result = await onResetPassword(email);
    setAuthLoading(false);
    if (!result.ok) {
      setAuthError(result.error ?? "Nao foi possivel enviar o e-mail.");
      return;
    }
    setAuthMessage(result.message ?? "Enviamos o link de recuperacao para seu e-mail.");
  };

  return (
    <main className={`auth-screen min-h-[100svh] overflow-x-hidden bg-[radial-gradient(circle_at_73%_20%,rgba(215,92,39,0.82),transparent_24rem),radial-gradient(circle_at_91%_90%,rgba(215,92,39,0.78),transparent_26rem),radial-gradient(circle_at_18%_22%,rgba(215,92,39,0.3),transparent_28rem),linear-gradient(135deg,#211d19_0%,#2a1f1a_47%,#d75c27_130%)] px-4 py-3 text-white sm:px-7 sm:py-4 lg:px-12 lg:py-4 ${
      isSignup ? "overflow-y-auto" : "overflow-hidden"
    }`}>
      <div className={`auth-layout mx-auto grid w-full max-w-7xl items-center gap-5 lg:grid-cols-[minmax(0,.92fr)_minmax(360px,500px)] lg:gap-10 ${
        isSignup ? "min-h-[calc(100svh-1.5rem)] pb-6" : "min-h-[calc(100svh-1.5rem)]"
      }`}>
        <section className="auth-copy relative flex min-h-0 flex-col justify-center p-2 sm:p-4 lg:h-full lg:p-5">
          <div className="relative">
            <div className="flex items-center gap-3 text-white">
              <BrandSymbol className="h-9 w-9 sm:h-11 sm:w-11" />
              <p className="text-2xl font-semibold tracking-tight sm:text-[27px]">
                Revee<span className="font-extrabold">North</span>
              </p>
            </div>

            <h1 className="mt-9 max-w-lg text-[2.08rem] font-light leading-[1.08] tracking-[-0.06em] sm:mt-11 sm:text-[2.85rem] lg:mt-12 lg:text-[3.34rem]">
              Planeje antes
              <span className="block">
                de <strong className="font-semibold text-[#d75c27]">decidir.</strong>
              </span>
            </h1>
            <div className="mt-5 h-0.5 w-14 rounded-full bg-[#d75c27]" />
            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-white/86 sm:text-[15px]">
              Organize entradas, contas, metas e decisões do mês com uma visão clara e leve.
            </p>
          </div>
        </section>

        <section className="flex min-h-0 justify-center lg:h-full lg:items-center lg:justify-end">
          <div className="auth-card w-full max-w-[430px] rounded-[24px] border border-white/70 bg-white/94 px-5 py-5 text-[#211d19] shadow-[0_30px_90px_rgba(33,29,25,0.18)] backdrop-blur-2xl sm:rounded-[28px] sm:px-7 sm:py-6 lg:px-8 lg:py-7">
            <div className="text-center">
              <h2 className="text-[1.42rem] font-extrabold tracking-tight sm:text-[1.64rem]">
                {isSignup ? "Crie sua conta." : "Bem-vindo(a) de volta!"}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#756b62]">
                {isSignup ? "Cadastre-se para começar seu planejamento." : "Faça login para continuar seu planejamento."}
              </p>
            </div>

            <div className="mt-5 space-y-3.5">
              {isSignup ? (
                <label className="block">
                  <span className="text-xs font-extrabold">Nome completo</span>
                  <div className="mt-2 flex items-center gap-3 rounded-[16px] border border-[#211d19]/14 bg-white px-4 py-2.5">
                    <UserRound className="h-4.5 w-4.5 text-[#d75c27]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8f877f]"
                      placeholder="Seu nome"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="text-xs font-extrabold">E-mail</span>
                <div className="mt-2 flex items-center gap-3 rounded-[16px] border border-[#211d19]/14 bg-white px-4 py-2.5">
                  <Mail className="h-4.5 w-4.5 text-[#d75c27]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8f877f]"
                    placeholder="seu@email.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-extrabold">Senha</span>
                <div className="mt-2 flex items-center gap-3 rounded-[16px] border border-[#211d19]/14 bg-white px-4 py-2.5">
                  <Lock className="h-4.5 w-4.5 text-[#d75c27]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8f877f]"
                    placeholder={isSignup ? "Mínimo 8 caracteres" : "Digite sua senha"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-[#756b62] transition hover:text-[#d75c27]"
                    aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </label>

              {isSignup ? (
                <label className="block">
                  <span className="text-xs font-extrabold">Confirmar senha</span>
                  <div className="mt-2 flex items-center gap-3 rounded-[16px] border border-[#211d19]/14 bg-white px-4 py-2.5">
                    <Lock className="h-4.5 w-4.5 text-[#d75c27]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-[#8f877f]"
                      placeholder="Repita sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="text-[#756b62] transition hover:text-[#d75c27]"
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Visualizar senha"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </label>
              ) : null}
            </div>

            {!isSignup ? (
              <div className="mt-5 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#211d19]">
                  <input type="checkbox" className="h-4 w-4 rounded accent-[#d75c27]" defaultChecked />
                  Manter conectado
                </label>
                <button type="button" onClick={recover} className="text-xs font-semibold text-[#d75c27]">
                  Esqueci minha senha
                </button>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-[#d75c27]/8 px-4 py-3 text-xs font-semibold text-[#9f421f]">
                Depois do cadastro, o onboarding começa automaticamente.
              </p>
            )}
            {authError ? (
              <p className="mt-4 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs font-bold text-red-600">
                {authError}
              </p>
            ) : null}
            {authMessage ? (
              <p className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/8 px-4 py-3 text-xs font-bold text-emerald-700">
                {authMessage}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit || authLoading}
              className="mt-5 w-full rounded-[17px] bg-[#d75c27] px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_38px_rgba(215,92,39,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {authLoading ? "Aguarde..." : isSignup ? "Criar conta" : "Entrar"}
            </button>

            <div className="mt-5 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#211d19]/10" />
              <p className="text-xs font-medium text-[#756b62]">
                {isSignup ? "Já tem uma conta?" : "Ainda não tem uma conta?"}
              </p>
              <span className="h-px flex-1 bg-[#211d19]/10" />
            </div>

            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="mt-4 w-full rounded-[16px] border border-[#d75c27] bg-white px-5 py-3 text-sm font-extrabold text-[#d75c27] transition hover:bg-[#d75c27]/5"
            >
              {isSignup ? "Entrar" : "Cadastre-se"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function AccountModal({
  bill,
  categories,
  onClose,
  onSave,
  onDelete,
  onPay,
}: {
  bill: Bill;
  categories: Category[];
  onClose: () => void;
  onSave: (bill: Bill) => void;
  onDelete: (id: number) => void;
  onPay: (id: number) => void;
}) {
  const [draft, setDraft] = useState(bill);

  const update = (patch: Partial<Bill>) => setDraft((current) => ({ ...current, ...patch }));
  const updateLogo = (logoUrl: string) => {
    const nextDraft = { ...draft, logoUrl };
    setDraft(nextDraft);
    onSave(nextDraft);
  };
  const saveAndClose = () => {
    onSave(draft);
    onClose();
  };
  const currentCategory = findCategory(categories, draft.category, "conta");
  const CurrentIcon = iconMap[(currentCategory?.icon ?? "Sparkles") as keyof typeof iconMap] ?? Sparkles;

  return (
    <Modal title="Editar conta" onClose={onClose}>
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/35 p-3 dark:bg-white/5">
        <AccountLogoInput
          logoUrl={draft.logoUrl}
          category={draft.category}
          color={currentCategory?.color ?? "#d75c27"}
          Icon={CurrentIcon}
          onChange={updateLogo}
        />
        <div className="min-w-0 flex-1">
          <TextInput
            label="Nome da conta"
            value={draft.name}
            onChange={(value) => update({ name: value })}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-[var(--muted)]">Categoria</span>
          <select
            value={draft.category}
            onChange={(event) => update({ category: event.target.value })}
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/55 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
          >
            {categories
              .filter((category) => category.type === "conta" && category.active)
              .map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
        <TextInput
          label="Vencimento"
          type="date"
          value={draft.dueDate}
          onChange={(value) => update({ dueDate: value })}
        />
        <MoneyInput
          label="Valor"
          value={draft.expectedAmount}
          onChange={(value) => update({ expectedAmount: value })}
        />
        <TextInput
          label="Data de pagamento"
          type="date"
          value={draft.paidDate ?? ""}
          onChange={(value) => update({ paidDate: value })}
        />
        <label className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/35 px-3 py-2.5 dark:bg-white/5">
          <span className="text-xs font-bold">Conta fixa</span>
          <Toggle
            checked={Boolean(draft.fixed)}
            onChange={(fixed) => update({ fixed })}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Observações</span>
        <textarea
          value={draft.notes}
          onChange={(event) => update({ notes: event.target.value })}
          className="mt-2 min-h-20 w-full rounded-xl border border-[var(--line)] bg-white/55 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
        />
      </label>

      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onDelete(draft.id);
            onClose();
          }}
          className="rounded-2xl border border-red-500/20 px-4 py-2.5 text-xs font-extrabold text-red-600"
        >
          <Trash2 className="mr-2 inline h-4 w-4" />
          Apagar
        </button>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onPay(draft.id);
              onClose();
            }}
            className="rounded-2xl bg-[#211d19] px-5 py-2.5 text-xs font-extrabold text-white dark:bg-[#d75c27]"
          >
            Paga
          </button>
          <button
            type="button"
            onClick={saveAndClose}
            className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
          >
            <Save className="mr-2 inline h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function IncomeModal({
  categories,
  selectedMonth,
  onClose,
  onCreate,
}: {
  categories: Category[];
  selectedMonth: string;
  onClose: () => void;
  onCreate: (income: Income) => void;
}) {
  const [draft, setDraft] = useState({
    source: "",
    category: categories.find((category) => category.type === "entrada")?.name ?? "Salario",
    amount: 0,
    receivedDate: getReferenceDate(selectedMonth),
    note: "",
  });

  return (
    <Modal title="Nova entrada" onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Origem"
          value={draft.source}
          onChange={(value) => setDraft((current) => ({ ...current, source: value }))}
        />
        <label className="block">
          <span className="text-xs font-bold text-[var(--muted)]">Categoria</span>
          <select
            value={draft.category}
            onChange={(event) =>
              setDraft((current) => ({ ...current, category: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
          >
            {categories
              .filter((category) => category.type === "entrada")
              .map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
        <MoneyInput
          label="Valor"
          value={draft.amount}
          onChange={(value) =>
            setDraft((current) => ({ ...current, amount: value }))
          }
        />
        <TextInput
          label="Data que entrou"
          type="date"
          value={draft.receivedDate}
          onChange={(value) =>
            setDraft((current) => ({ ...current, receivedDate: value }))
          }
        />
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Observação</span>
        <textarea
          value={draft.note}
          onChange={(event) =>
            setDraft((current) => ({ ...current, note: event.target.value }))
          }
          className="mt-2 min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
        />
      </label>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            const source = draft.source.trim() || "Entrada sem origem";
            onCreate({ ...draft, id: Date.now(), name: source, source });
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar entrada
        </button>
      </div>
    </Modal>
  );
}

function BillModalCreate({
  categories,
  selectedMonth,
  onClose,
  onCreate,
}: {
  categories: Category[];
  selectedMonth: string;
  onClose: () => void;
  onCreate: (bill: Bill) => void;
}) {
  const [draft, setDraft] = useState<Bill>({
    id: Date.now(),
    name: "Nova despesa",
    category: categories.find((category) => category.type === "conta")?.name ?? "Moradia",
    dueDate: `${selectedMonth}-10`,
    expectedAmount: 0,
    status: "pendente",
    notes: "",
    fixed: false,
  });
  const update = (patch: Partial<Bill>) => setDraft((current) => ({ ...current, ...patch }));
  const currentCategory = findCategory(categories, draft.category, "conta");
  const CurrentIcon = iconMap[(currentCategory?.icon ?? "Sparkles") as keyof typeof iconMap] ?? Sparkles;

  return (
    <Modal title="Nova despesa" onClose={onClose}>
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/35 p-3 dark:bg-white/5">
        <AccountLogoInput
          logoUrl={draft.logoUrl}
          category={draft.category}
          color={currentCategory?.color ?? "#d75c27"}
          Icon={CurrentIcon}
          onChange={(logoUrl) => update({ logoUrl })}
        />
        <div className="min-w-0 flex-1">
          <TextInput label="Nome da conta" value={draft.name} onChange={(name) => update({ name })} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold text-[var(--muted)]">Categoria</span>
          <select
            value={draft.category}
            onChange={(event) => update({ category: event.target.value })}
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/55 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
          >
            {categories.filter((category) => category.type === "conta" && category.active).map((category) => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <MoneyInput label="Valor previsto" value={draft.expectedAmount} onChange={(expectedAmount) => update({ expectedAmount })} />
        <TextInput label="Vencimento" type="date" value={draft.dueDate} onChange={(dueDate) => update({ dueDate })} />
        <label className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/35 px-3 py-2.5 dark:bg-white/5">
          <span className="text-xs font-bold">Conta fixa</span>
          <Toggle checked={Boolean(draft.fixed)} onChange={(fixed) => update({ fixed })} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Observação</span>
        <textarea
          value={draft.notes}
          onChange={(event) => update({ notes: event.target.value })}
          className="mt-2 min-h-20 w-full rounded-xl border border-[var(--line)] bg-white/55 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
        />
      </label>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            onCreate(draft);
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar despesa
        </button>
      </div>
    </Modal>
  );
}

function ObjectiveModal({
  selectedMonth,
  onClose,
  onCreate,
}: {
  selectedMonth: string;
  onClose: () => void;
  onCreate: (objective: MonthlyObjective) => void;
}) {
  const [title, setTitle] = useState("");
  return (
    <Modal title="Novo objetivo" onClose={onClose}>
      <TextInput label="Objetivo financeiro do mês" value={title} onChange={setTitle} />
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (title.trim()) onCreate({ id: Date.now(), month: selectedMonth, title, done: false });
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar objetivo
        </button>
      </div>
    </Modal>
  );
}

function PaymentModal({
  bill,
  onClose,
  onConfirm,
}: {
  bill: Bill;
  onClose: () => void;
  onConfirm: (id: number, paidAmount: number, paidDate: string, note: string) => void;
}) {
  const [paidAmount, setPaidAmount] = useState(bill.expectedAmount);
  const [paidDate, setPaidDate] = useState(getReferenceDate(monthKey(bill.dueDate)));
  const [note, setNote] = useState("");

  return (
    <Modal title="Confirmar pagamento" onClose={onClose}>
      <div className="app-modal-inner rounded-3xl border border-[var(--line)] bg-white/35 p-4 dark:bg-[#080808]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
          {bill.category}
        </p>
        <h3 className="mt-2 text-xl font-extrabold">{bill.name}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Valor previsto: {formatCurrency(bill.expectedAmount)}
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <MoneyInput
          label="Valor pago"
          value={paidAmount}
          onChange={setPaidAmount}
        />
        <TextInput
          label="Data de pagamento"
          type="date"
          value={paidDate}
          onChange={setPaidDate}
        />
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Observação</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="app-muted-surface mt-2 min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-[#050505]"
        />
      </label>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-[var(--line)] px-5 py-2.5 text-xs font-extrabold"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm(bill.id, paidAmount, paidDate, note);
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Confirmar pagamento
        </button>
      </div>
    </Modal>
  );
}

function IncomeDetailModal({
  income,
  onClose,
  onDelete,
}: {
  income: Income;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Modal title="Detalhes da entrada" onClose={onClose}>
      <div className="rounded-3xl border border-[var(--line)] bg-white/35 p-5 dark:bg-white/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">
          {income.category}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold">{income.name}</h3>
        <p className="mt-4 text-3xl font-extrabold text-[#d75c27]">
          {formatCurrency(income.amount)}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Data de recebimento" value={formatDate(income.receivedDate)} />
          <Field label="Origem" value={income.source || "Não informada"} />
        </div>
        <p className="mt-5 rounded-2xl bg-[#211d19]/6 p-4 text-sm font-semibold leading-6 text-[var(--muted)] dark:bg-white/7">
          {income.note || "Sem observação."}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onDelete(income.id);
            onClose();
          }}
          className="rounded-2xl border border-red-500/20 px-5 py-2.5 text-xs font-extrabold text-red-600"
        >
          Excluir
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-2xl border border-[var(--line)] px-5 py-2.5 text-xs font-extrabold"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[#211d19] px-5 py-2.5 text-xs font-extrabold text-white dark:bg-[#d75c27]"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

function GoalModal({
  goal,
  onClose,
  onSave,
  onDelete,
}: {
  goal: Goal;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  onDelete: (id: number) => void;
}) {
  const [draft, setDraft] = useState(goal);
  const progress = Math.round((draft.current / Math.max(draft.target, 1)) * 100);
  const remaining = Math.max(0, draft.target - draft.current);
  const monthsLeft = monthsUntil(draft.deadline);
  const monthlyNeeded = Math.ceil(remaining / Math.max(monthsLeft, 1));

  return (
    <Modal title={goal.id ? "Detalhes da meta" : "Nova meta"} onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Nome da meta"
          value={draft.name}
          onChange={(name) => setDraft((current) => ({ ...current, name }))}
        />
        <label className="block">
          <span className="text-xs font-bold text-[var(--muted)]">Prioridade</span>
          <select
            value={draft.priority}
            onChange={(event) =>
              setDraft((current) => ({ ...current, priority: event.target.value as Goal["priority"] }))
            }
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baixa</option>
          </select>
        </label>
        <MoneyInput
          label="Valor total desejado"
          value={draft.target}
          onChange={(target) => setDraft((current) => ({ ...current, target }))}
        />
        <MoneyInput
          label="Valor atual"
          value={draft.current}
          onChange={(current) => setDraft((item) => ({ ...item, current }))}
        />
        <TextInput
          label="Data desejada"
          type="date"
          value={draft.deadline}
          onChange={(deadline) => setDraft((current) => ({ ...current, deadline }))}
        />
      </div>
      <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white/35 p-4 dark:bg-white/5">
        <div className="flex justify-between text-xs font-bold">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#211d19]/10 dark:bg-white/10">
          <div className="h-full rounded-full bg-[#d75c27]" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
        <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
          Restam {formatCurrency(remaining)}. Faltam {monthsLeft} mês{monthsLeft === 1 ? "" : "es"}. Precisa juntar {formatCurrency(monthlyNeeded)}/mês.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["Total", formatCurrency(draft.target)],
            ["Já juntou", formatCurrency(draft.current)],
            ["Meses", String(monthsLeft)],
            ["Por mês", formatCurrency(monthlyNeeded)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/55 p-3 dark:bg-white/7">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
              <p className="mt-1 text-xs font-extrabold">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            onDelete(draft.id);
            onClose();
          }}
          className="rounded-2xl border border-red-500/20 px-5 py-2.5 text-xs font-extrabold text-red-600"
        >
          Excluir
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar meta
        </button>
      </div>
    </Modal>
  );
}

function RealBalanceModal({
  balance,
  onClose,
  onSave,
}: {
  balance: RealBalance;
  onClose: () => void;
  onSave: (balance: RealBalance) => void;
}) {
  const [draft, setDraft] = useState(balance);

  return (
    <Modal title="Atualizar saldo real informado" onClose={onClose}>
      <p className="mb-4 rounded-2xl bg-[#d75c27]/10 p-3 text-xs font-bold text-[#d75c27]">
        Este valor é manual. O ReveeNorth não consulta contas externas.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <MoneyInput
          label="Valor atual da conta"
          value={draft.amount}
          onChange={(value) =>
            setDraft((current) => ({ ...current, amount: value }))
          }
        />
        <TextInput
          label="Data"
          type="date"
          value={draft.date}
          onChange={(date) => setDraft((current) => ({ ...current, date }))}
        />
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Observação</span>
        <textarea
          value={draft.note}
          onChange={(event) =>
            setDraft((current) => ({ ...current, note: event.target.value }))
          }
          className="mt-2 min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
        />
      </label>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar saldo informado
        </button>
      </div>
    </Modal>
  );
}

function ProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: UserProfile;
  onClose: () => void;
  onSave: (user: UserProfile) => void;
}) {
  const [draft, setDraft] = useState(user);
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#211d19]/45 p-4 backdrop-blur-md">
      <div className="app-modal-panel relative max-h-[92vh] w-full max-w-xl overflow-auto rounded-[30px] border border-white/60 bg-[#f7f7f6]/94 p-5 shadow-[0_30px_90px_rgba(33,29,25,0.22)] backdrop-blur-2xl dark:border-white/12 dark:bg-[#050505] md:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#211d19]/7 text-[#211d19] transition hover:bg-[#211d19]/12 dark:bg-white/10 dark:text-white"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-16">
          <p className="text-sm font-semibold tracking-[0.06em] text-[var(--muted)]">
            Cadastro rápido
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            Meu perfil
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          <div className="app-modal-inner rounded-[26px] border border-[#211d19]/10 bg-white/48 p-5 dark:border-white/14 dark:bg-[#080808]">
            <div className="grid gap-4 md:grid-cols-[92px_1fr] md:items-center">
              <label className="flex cursor-pointer justify-center md:justify-start">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setDraft((current) => ({ ...current, photoUrl: reader.result as string }));
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {draft.photoUrl ? (
                <img
                  src={draft.photoUrl}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d75c27] text-2xl font-extrabold text-white shadow-xl shadow-[#d75c27]/18">
                  {draft.fullName.charAt(0)}
                </div>
              )}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Nome"
                  value={draft.firstName}
                  onChange={(value) => setDraft((current) => ({ ...current, firstName: value }))}
                />
                <ProfileField
                  label="Sobrenome"
                  value={draft.lastName}
                  onChange={(value) => setDraft((current) => ({ ...current, lastName: value }))}
                />
                <ProfileField
                  label="E-mail"
                  value={draft.email}
                  onChange={() => undefined}
                  readOnly
                />
                <ProfileField
                  label="Profissão"
                  value={draft.role}
                  onChange={(value) => setDraft((current) => ({ ...current, role: value }))}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-center md:justify-start md:pl-[92px]">
              <button
                type="button"
                onClick={() => setDraft((current) => ({ ...current, photoUrl: undefined }))}
                className="text-xs font-semibold text-[#d75c27]"
              >
                Remover
              </button>
            </div>
          </div>
        </div>

        {saved ? (
          <p className="mt-6 rounded-2xl bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700">
            Perfil salvo com sucesso.
          </p>
        ) : null}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onSave({
                ...draft,
                fullName: `${draft.firstName} ${draft.lastName}`.trim(),
              });
              setSaved(true);
            }}
            className="rounded-[20px] bg-[#d75c27] px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-[#d75c27]/18 transition hover:-translate-y-0.5"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold text-[var(--muted)]">{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-[18px] border px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#d75c27] dark:bg-white/8 ${
          readOnly
            ? "border-[#211d19]/10 bg-[#211d19]/7 text-[var(--muted)]"
            : "border-[#211d19]/10 bg-white/70 text-[var(--foreground)]"
        }`}
      />
    </label>
  );
}

function CategoryModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (category: Category) => void;
}) {
  const [draft, setDraft] = useState({
    name: "",
    type: "conta" as Category["type"],
    icon: "Sparkles",
    color: "#d75c27",
    description: "",
  });
  const [iconOpen, setIconOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const DraftIcon = iconMap[draft.icon as keyof typeof iconMap] ?? Sparkles;

  return (
    <Modal title="Nova categoria" onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Nome"
          value={draft.name}
          onChange={(name) => setDraft((current) => ({ ...current, name }))}
        />
        <label className="block">
          <span className="text-xs font-bold text-[var(--muted)]">Tipo</span>
          <select
            value={draft.type}
            onChange={(event) =>
              setDraft((current) => ({ ...current, type: event.target.value as Category["type"] }))
            }
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
          >
            <option value="conta">Conta</option>
            <option value="entrada">Entrada</option>
            <option value="meta">Meta</option>
          </select>
        </label>
        <div className="relative">
          <span className="text-xs font-bold text-[var(--muted)]">Ícone</span>
          <button
            type="button"
            onClick={() => setIconOpen((current) => !current)}
            className="mt-2 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: `${draft.color}18`, color: draft.color }}
            aria-label="Escolher ícone"
          >
            <DraftIcon className="h-5 w-5" strokeWidth={2.2} />
          </button>
          {iconOpen ? (
            <IconPicker
              onSelect={(icon) => {
                setDraft((current) => ({ ...current, icon }));
                setIconOpen(false);
              }}
            />
          ) : null}
        </div>
        <div className="relative">
          <span className="text-xs font-bold text-[var(--muted)]">Cor</span>
          <button
            type="button"
            onClick={() => {
              setIconOpen(false);
              setColorOpen((current) => !current);
            }}
            className="mt-2 block h-8 w-8 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(33,29,25,.1)]"
            style={{ background: draft.color }}
            aria-label="Cor selecionada"
          />
          {colorOpen ? (
            <ColorPickerPopover
              value={draft.color}
              onChange={(color) => {
                setDraft((current) => ({ ...current, color }));
                setColorOpen(false);
              }}
            />
          ) : null}
        </div>
      </div>
      <label className="mt-4 block">
        <span className="text-xs font-bold text-[var(--muted)]">Descrição opcional</span>
        <textarea
          value={draft.description}
          onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
          className="mt-2 min-h-20 w-full rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm font-semibold outline-none focus:border-[#d75c27] dark:bg-white/8"
        />
      </label>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            onCreate({ id: Date.now(), ...draft, active: true });
            onClose();
          }}
          className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
        >
          Salvar categoria
        </button>
      </div>
    </Modal>
  );
}

function ConfirmModal({
  title,
  message,
  onClose,
  onConfirm,
}: {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isLogout = title.toLowerCase().includes("sair");

  return (
    <Modal title={title || "Tem certeza?"} onClose={onClose}>
      <p className="text-sm leading-6 text-[var(--muted)]">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-[var(--line)] px-5 py-2.5 text-xs font-extrabold"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-2xl px-5 py-2.5 text-xs font-extrabold text-white ${
            isLogout ? "bg-[#d75c27] shadow-[0_14px_28px_rgba(215,92,39,.22)]" : "bg-red-600"
          }`}
        >
          {isLogout ? "Sair" : "Excluir"}
        </button>
      </div>
    </Modal>
  );
}

function FeedbackToastView({ toast }: { toast: FeedbackToast }) {
  const Icon = toast.kind === "achievement" ? Medal : Check;
  return (
    <div className="fixed bottom-24 right-6 z-[150] w-[min(360px,calc(100vw-2rem))] rounded-[26px] border border-white/70 bg-[#f5f2ef]/96 p-4 text-[#211d19] shadow-2xl backdrop-blur-2xl dark:border-white/12 dark:bg-[#211d19]/96 dark:text-white">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27]/12 text-[#d75c27]">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-extrabold">{toast.title}</span>
          <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--muted)]">{toast.message}</span>
        </span>
      </div>
    </div>
  );
}

function AchievementUnlockedModal({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#211d19]/35 p-4 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-[30px] border border-white/70 bg-[#f5f2ef]/96 p-6 text-center shadow-[0_30px_90px_rgba(33,29,25,.24)] backdrop-blur-2xl dark:border-white/12 dark:bg-[#211d19]/96">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d75c27]/12 text-[#d75c27] shadow-[0_0_36px_rgba(215,92,39,.18)]">
          <Medal className="h-7 w-7" />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#d75c27]">
          Conquista desbloqueada
        </p>
        <h3 className="mt-2 text-2xl font-black">{achievement.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">{achievement.description}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-2xl bg-[#211d19] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#d75c27]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

function NorthIADrawer({
  open,
  onClose,
  onToggle,
  checkup,
  metrics,
  nextMonthAdvice,
}: {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  checkup: Checkup;
  metrics: ReturnType<typeof buildMetrics>;
  nextMonthAdvice: string;
}) {
  const [answer, setAnswer] = useState("");
  const priorityList = [...metrics.overdueBills, ...metrics.pendingBills].sort(sortByPaymentPriority);
  const firstPriority = priorityList[0];
  const answers: Record<string, string> = {
    "Tenho dinheiro livre?": "Você possui valor livre para decidir, mas a melhor ordem é quitar compromissos essenciais antes de aumentar gastos flexíveis.",
    "Qual conta devo pagar primeiro?": firstPriority
      ? `${firstPriority.name} deve vir primeiro. ${firstPriority.status === "atrasada" ? `Ela está ${overdueLabel(firstPriority)} e venceu em ${formatDate(firstPriority.dueDate)}.` : `Ela vence em ${formatDate(firstPriority.dueDate)}.`} Depois, siga pelas outras atrasadas mais antigas e só então pelas próximas a vencer.`
      : "Você não tem contas pendentes agora. A próxima decisão pode ser reforçar reserva ou metas.",
    "Como foi meu mês?": `${checkup.title}. ${checkup.summary} Pontos positivos: ${checkup.positives.join(" ")} Pontos de atenção: ${checkup.attentions.join(" ")} ${checkup.focus}`,
    "Como melhorar o próximo mês?": nextMonthAdvice,
  };
  const resetAnswer = () => setAnswer("");

  return (
    <>
      <button
        type="button"
        className={`group fixed bottom-4 right-4 z-[70] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/72 bg-[rgba(244,241,237,.62)] shadow-[0_20px_55px_rgba(33,29,25,.16),inset_0_1px_0_rgba(255,255,255,.92),inset_0_-18px_30px_rgba(215,92,39,.08)] backdrop-blur-2xl transition duration-300 hover:scale-105 hover:bg-[rgba(250,247,243,.74)] hover:shadow-[0_24px_70px_rgba(33,29,25,.2),0_0_0_8px_rgba(215,92,39,.08),inset_0_1px_0_rgba(255,255,255,.95)] dark:border-white/16 dark:bg-white/12 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 ${
          open ? "ring-1 ring-[#d75c27]/25 shadow-[0_0_0_8px_rgba(215,92,39,.1),0_24px_70px_rgba(33,29,25,.22),inset_0_1px_0_rgba(255,255,255,.95)]" : ""
        }`}
        aria-label="Abrir North IA"
        onClick={onToggle}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,.94),transparent_1.65rem),radial-gradient(circle_at_76%_86%,rgba(215,92,39,.14),transparent_2.1rem)]" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full sm:h-11 sm:w-11">
          <svg viewBox="0 0 34 34" className="h-7 w-7 drop-shadow-[0_9px_14px_rgba(112,55,33,.28)] transition duration-300 group-hover:drop-shadow-[0_11px_18px_rgba(215,92,39,.34)] sm:h-8 sm:w-8" aria-hidden="true">
            <defs>
              <linearGradient id="north-ia-star" x1="4" y1="4" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff6ef" />
                <stop offset=".25" stopColor="#f0b18f" />
                <stop offset=".58" stopColor="#d75c27" />
                <stop offset="1" stopColor="#6d2f1f" />
              </linearGradient>
              <linearGradient id="north-ia-star-edge" x1="8" y1="6" x2="28" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" stopOpacity=".9" />
                <stop offset=".46" stopColor="#f2a276" stopOpacity=".55" />
                <stop offset="1" stopColor="#211d19" stopOpacity=".35" />
              </linearGradient>
              <filter id="north-ia-star-depth" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#8a3e24" floodOpacity=".34" />
                <feDropShadow dx="0" dy="-1" stdDeviation=".7" floodColor="#ffffff" floodOpacity=".52" />
              </filter>
            </defs>
            <path
              d="M17 2.8c.55 0 1.03.37 1.17.9l1.8 6.86a4.4 4.4 0 0 0 3.16 3.16l6.86 1.8a1.2 1.2 0 0 1 0 2.34l-6.86 1.8a4.4 4.4 0 0 0-3.16 3.16l-1.8 6.86a1.2 1.2 0 0 1-2.34 0l-1.8-6.86a4.4 4.4 0 0 0-3.16-3.16l-6.86-1.8a1.2 1.2 0 0 1 0-2.34l6.86-1.8a4.4 4.4 0 0 0 3.16-3.16l1.8-6.86c.14-.53.62-.9 1.17-.9Z"
              fill="url(#north-ia-star)"
              filter="url(#north-ia-star-depth)"
            />
            <path
              d="M17 4.2c.36 0 .66.24.75.58l1.7 6.45a5.2 5.2 0 0 0 3.72 3.72l6.45 1.7"
              fill="none"
              stroke="url(#north-ia-star-edge)"
              strokeWidth="1.15"
              strokeLinecap="round"
              opacity=".75"
            />
            <path d="M26.5 4.8v5.1M23.95 7.35h5.1" stroke="url(#north-ia-star)" strokeWidth="2.1" strokeLinecap="round" filter="url(#north-ia-star-depth)" />
            <circle cx="8.4" cy="25.7" r="2.1" fill="url(#north-ia-star)" opacity=".92" filter="url(#north-ia-star-depth)" />
          </svg>
        </span>
      </button>
      <aside
        className={`fixed inset-x-3 bottom-3 top-3 z-[90] flex w-auto flex-col rounded-[26px] border border-white/12 bg-[#211d19]/88 p-4 text-white shadow-[0_30px_100px_rgba(0,0,0,.38),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl transition-transform duration-300 sm:inset-x-auto sm:inset-y-4 sm:right-4 sm:w-[min(420px,calc(100vw-2rem))] sm:rounded-[30px] sm:p-5 ${
          open ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-extrabold">North IA</p>
            <p className="mt-1 text-xs font-semibold text-white/50">
              Seu dinheiro com direção.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/8 p-2"
            aria-label="Fechar North IA"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex-1 space-y-3 overflow-auto pb-24">
          <div className="rounded-3xl bg-white/8 p-4">
            <p className="text-sm leading-6 text-white/80">
              Posso te ajudar a reduzir carga mental, entender o mês e escolher a próxima decisão com mais clareza.
            </p>
          </div>
          <div className="grid gap-2">
            {Object.keys(answers).map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => setAnswer(answers[suggestion])}
                className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 text-left text-xs font-bold text-white/78 transition hover:bg-white/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
          {answer ? (
            <div className="rounded-3xl border border-[#d75c27]/25 bg-[#d75c27]/10 p-4">
              <p className="text-sm font-semibold leading-6">{answer}</p>
              <div className="mt-4 rounded-2xl bg-black/14 p-3">
                <p className="text-xs font-bold text-white/62">Isso te ajudou a decidir?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Sim, resolveu", "Quero ajustar", "Me mostre outra opção"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={label === "Sim, resolveu" ? resetAnswer : undefined}
                      className="rounded-xl bg-white/10 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/16"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <button type="button" onClick={resetAnswer} className="mb-2 text-xs font-bold text-white/44 hover:text-white">
            Limpar conversa
          </button>
          <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
            Pergunte à North IA...
          </div>
        </div>
      </aside>
    </>
  );
}

function SettingsView({
  categories,
  setCategories,
  section,
  setSection,
  preferences,
  setPreferences,
  rules,
  setRules,
  appearance,
  setAppearance,
  notifications,
  setNotifications,
  security,
  setSecurity,
  onOpenProfile,
  onOpenCategoryModal,
  onConfirmDanger,
  darkMode,
  setDarkMode,
  allIncomes,
  allBills,
  allGoals,
  realBalance,
  user,
}: {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  section: string | null;
  setSection: (section: string | null) => void;
  preferences: FinancePreferences;
  setPreferences: Dispatch<SetStateAction<FinancePreferences>>;
  rules: CalculatorRules;
  setRules: Dispatch<SetStateAction<CalculatorRules>>;
  appearance: AppearanceSettings;
  setAppearance: Dispatch<SetStateAction<AppearanceSettings>>;
  notifications: NotificationSettings;
  setNotifications: Dispatch<SetStateAction<NotificationSettings>>;
  security: SecuritySettings;
  setSecurity: Dispatch<SetStateAction<SecuritySettings>>;
  onOpenProfile: () => void;
  onOpenCategoryModal: () => void;
  onConfirmDanger: (title: string, message: string, onConfirm?: () => void) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  allIncomes: Income[];
  allBills: Bill[];
  allGoals: Goal[];
  realBalance: RealBalance;
  user: UserProfile;
}) {
  const updateCategory = (id: number, patch: Partial<Category>) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, ...patch } : category,
      ),
    );
  };

  const deleteCategory = (id: number) => {
    onConfirmDanger("Tem certeza?", "Esse dado não poderá ser recuperado.", () => {
      setCategories((current) => current.filter((category) => category.id !== id));
    });
  };

  const titleMap: Record<string, string> = {
    perfil: "Perfil",
    categorias: "Categorias",
    regras: "Regras do planejamento",
    notificacoes: "Notificações",
    seguranca: "Segurança",
    dados: "Dados do sistema",
  };
  const descriptions: Record<string, string> = {
    perfil: "Edite foto, nome e informações da sua conta.",
    categorias: "Organize categorias de contas, entradas e metas.",
    regras: "Configure as porcentagens que guiam o planejamento.",
    notificacoes: "Alertas de vencimento, metas e atrasos.",
    seguranca: "Senha, sessão e privacidade.",
    dados: "Relatórios e exportações.",
  };
  const settingsItems = [
    ["perfil", UserRound],
    ["categorias", ReceiptText],
    ["regras", LineChart],
    ["notificacoes", Bell],
    ["seguranca", Lock],
    ["dados", Database],
  ] as const;
  const selectedSection = section ?? "perfil";

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="h-fit p-3">
        {settingsItems.map(([id, Icon]) => (
          <button
            type="button"
            key={id}
            onClick={() => setSection(id)}
            className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition ${
              selectedSection === id
                ? "bg-[#211d19] text-white shadow-lg shadow-[#211d19]/10 dark:bg-[#d75c27]"
                : "hover:bg-[#211d19]/6 dark:hover:bg-white/8"
            }`}
          >
            <Icon className={`h-5 w-5 ${selectedSection === id ? "text-[#ffb08b]" : "text-[#d75c27]"}`} />
            <div>
              <p className="text-sm font-extrabold">{titleMap[id]}</p>
              <p className={`mt-1 text-[11px] leading-4 ${selectedSection === id ? "text-white/60" : "text-[var(--muted)]"}`}>
                {descriptions[id]}
              </p>
            </div>
          </button>
        ))}
      </Card>

      <div className="space-y-4">
        <Card>
          <h3 className="text-xl font-extrabold">{titleMap[selectedSection]}</h3>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {descriptions[selectedSection]}
          </p>
        </Card>

        {selectedSection === "perfil" ? (
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-extrabold">Perfil da conta</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Foto, nome, e-mail, profissão e plano ficam centralizados aqui.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenProfile}
              className="rounded-2xl bg-[#d75c27] px-5 py-2.5 text-xs font-extrabold text-white"
            >
              Abrir perfil
            </button>
          </Card>
        ) : null}

        {selectedSection === "categorias" ? (
          <CategoriesSettings
            categories={categories}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            onOpenCategoryModal={onOpenCategoryModal}
          />
        ) : null}

        {selectedSection === "regras" ? (
          <RulesSettings rules={rules} setRules={setRules} />
        ) : null}

        {selectedSection === "notificacoes" ? (
          <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />
        ) : null}

        {selectedSection === "seguranca" ? (
          <SecurityPanel security={security} setSecurity={setSecurity} />
        ) : null}

        {selectedSection === "dados" ? (
          <DataPanel
            incomes={allIncomes}
            bills={allBills}
            goals={allGoals}
            realBalance={realBalance}
            user={user}
          />
        ) : null}
      </div>
    </div>
  );
}

function CategoriesSettings({
  categories,
  updateCategory,
  deleteCategory,
  onOpenCategoryModal,
}: {
  categories: Category[];
  updateCategory: (id: number, patch: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  onOpenCategoryModal: () => void;
}) {
  const [tab, setTab] = useState<Category["type"]>("conta");
  const [iconPickerFor, setIconPickerFor] = useState<number | null>(null);
  const [colorPickerFor, setColorPickerFor] = useState<number | null>(null);
  const labels: Record<Category["type"], string> = {
    conta: "Categorias de contas",
    entrada: "Categorias de entradas",
    meta: "Categorias de metas",
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap gap-2">
          {(["conta", "entrada", "meta"] as const).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setTab(type)}
              className={`rounded-full px-3.5 py-2 text-xs font-extrabold ${
                tab === type ? "bg-[#211d19] text-white dark:bg-[#d75c27]" : "bg-white/45 text-[var(--muted)] dark:bg-white/8"
              }`}
            >
              {labels[type]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenCategoryModal}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#d75c27]/20 bg-[#d75c27] px-3.5 py-2 text-xs font-extrabold text-white shadow-sm shadow-[#d75c27]/10 transition hover:bg-[#c65021]"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova categoria
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white/24 dark:bg-white/5">
        {categories
          .filter((category) => category.type === tab)
          .map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <div
                key={category.id}
                className="grid items-center gap-3 border-b border-[var(--line)] px-3 py-2.5 last:border-b-0 md:grid-cols-[44px_minmax(160px,1fr)_70px_130px_40px]"
              >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIconPickerFor(iconPickerFor === category.id ? null : category.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:ring-4 hover:ring-[#211d19]/5"
                  style={{ background: `${category.color}18`, color: category.color }}
                  aria-label="Escolher ícone"
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                </button>
                {iconPickerFor === category.id ? (
                  <IconPicker
                    onSelect={(icon) => {
                      updateCategory(category.id, { icon });
                      setIconPickerFor(null);
                    }}
                  />
                ) : null}
              </div>
                <input
                  value={category.name}
                  onChange={(event) => updateCategory(category.id, { name: event.target.value })}
                  className="h-9 min-w-0 rounded-xl border border-transparent bg-transparent px-2 text-sm font-extrabold outline-none transition focus:border-[var(--line)] focus:bg-white/60 dark:focus:bg-white/8"
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setColorPickerFor(colorPickerFor === category.id ? null : category.id)}
                    className="h-6 w-6 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(33,29,25,.1)] transition hover:scale-105"
                    style={{ background: category.color }}
                    aria-label="Escolher cor"
                  />
                  {colorPickerFor === category.id ? (
                    <ColorPickerPopover
                      value={category.color}
                      onChange={(color) => {
                        updateCategory(category.id, { color });
                        setColorPickerFor(null);
                      }}
                    />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={category.active}
                    onChange={(active) => updateCategory(category.id, { active })}
                  />
                  <span className="text-[11px] font-bold text-[var(--muted)]">
                    {category.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(category.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-600"
                  aria-label="Excluir categoria"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
      </div>
    </Card>
  );
}

function IconPicker({ onSelect }: { onSelect: (icon: string) => void }) {
  return (
    <div className="absolute left-0 top-11 z-20 grid w-64 grid-cols-5 gap-2 rounded-2xl border border-[var(--line)] bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:bg-[#211d19]/95">
      {visualIconChoices.map(({ id, Icon, label }) => (
        <button
          type="button"
          key={id}
          onClick={() => onSelect(id)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#211d19]/5 text-[#211d19] transition hover:bg-[#d75c27] hover:text-white dark:bg-white/8 dark:text-white"
          aria-label={`Selecionar ${label}`}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}

function ColorPickerPopover({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const [custom, setCustom] = useState(value);

  return (
    <div className="absolute right-0 top-9 z-20 w-64 rounded-2xl border border-[var(--line)] bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:bg-[#211d19]/95">
      <div className="grid grid-cols-6 gap-2">
        {colorChoices.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-9 w-9 rounded-full border-2 transition hover:scale-105 ${
              value.toLowerCase() === color.toLowerCase() ? "border-[#211d19] ring-2 ring-[#d75c27]/25" : "border-white/80"
            }`}
            style={{ background: color }}
            aria-label="Selecionar cor"
          />
        ))}
      </div>
      <label className="mt-3 block">
        <span className="text-[11px] font-bold text-[var(--muted)]">Cor personalizada</span>
        <div className="mt-2 flex gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(custom) ? custom : "#d75c27"}
            onChange={(event) => {
              setCustom(event.target.value);
              onChange(event.target.value);
            }}
            className="h-9 w-10 cursor-pointer rounded-xl border border-[var(--line)] bg-white p-1 dark:bg-white/8"
            aria-label="Selecionar cor personalizada"
          />
          <input
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            placeholder="#d75c27"
            className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-2 text-xs font-bold outline-none dark:bg-white/8"
          />
          <button
            type="button"
            onClick={() => /^#[0-9a-fA-F]{6}$/.test(custom) && onChange(custom)}
            className="rounded-xl bg-[#211d19] px-3 py-2 text-[11px] font-extrabold text-white dark:bg-[#d75c27]"
          >
            Aplicar
          </button>
        </div>
      </label>
    </div>
  );
}

function RulesSettings({
  rules,
  setRules,
}: {
  rules: CalculatorRules;
  setRules: Dispatch<SetStateAction<CalculatorRules>>;
}) {
  const total = rules.bills + rules.personal + rules.goals;
  const update = (key: keyof CalculatorRules, value: number | boolean) =>
    setRules((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-4">
      <Card>
        <div>
          <h3 className="text-xl font-extrabold">Regras de distribuição</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Defina como a North divide uma receita prevista antes do mês começar.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["Despesas Essenciais", "bills", "Gastos fixos e obrigatórios, como aluguel, contas, transporte e supermercado."],
          ["Estilo de Vida e Desejos", "personal", "Lazer, viagens, restaurantes, hobbies e compras."],
          ["Futuro e Prioridades", "goals", "Reserva, investimentos, quitação de dívidas e previdência."],
        ].map(([label, key, helper]) => (
          <div key={key} className="rounded-3xl border border-[var(--line)] bg-white/42 p-4 dark:bg-white/5">
            <TextInput
              label={`${label} (%)`}
              value={rules[key as keyof CalculatorRules] as number}
              onChange={(value) => update(key as keyof CalculatorRules, Number(value))}
            />
            <p className="mt-3 text-[11px] font-semibold leading-5 text-[var(--muted)]">{helper}</p>
          </div>
        ))}
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold">Ativar ajuste automático por prioridade</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              A regra prioriza atrasos, essenciais, vencimentos próximos e dívidas urgentes.
            </p>
          </div>
          <Toggle
            checked={rules.smartPriority}
            onChange={(smartPriority) => setRules((current) => ({ ...current, smartPriority }))}
          />
        </div>
        {total !== 100 ? (
          <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-xs font-bold text-red-600">
            A soma atual é {total}%. Ajuste para 100%.
          </p>
        ) : (
          <p className="mt-4 rounded-2xl bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700">
            Regra válida: 100%.
          </p>
        )}
        <button
          type="button"
          onClick={() => setRules({ bills: 50, reserve: 0, goals: 20, personal: 30, smartPriority: true })}
          className="mt-4 rounded-2xl bg-[#211d19] px-4 py-2 text-xs font-extrabold text-white dark:bg-[#d75c27]"
        >
          Restaurar regra recomendada
        </button>
      </Card>
    </div>
  );
}

function AppearancePanel({
  appearance,
  setAppearance,
  darkMode,
  setDarkMode,
}: {
  appearance: AppearanceSettings;
  setAppearance: Dispatch<SetStateAction<AppearanceSettings>>;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  return (
    <Card className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {(["light", "dark", "system"] as const).map((theme) => (
          <button
            type="button"
            key={theme}
            onClick={() => {
              setAppearance((current) => ({ ...current, theme }));
              if (theme !== "system") setDarkMode(theme === "dark");
            }}
            className={`rounded-2xl border p-4 text-left text-xs font-extrabold ${
              appearance.theme === theme ? "border-[#d75c27] bg-[#d75c27]/10" : "border-[var(--line)] bg-white/35 dark:bg-white/5"
            }`}
          >
            {theme === "light" ? "Tema claro" : theme === "dark" ? "Tema escuro" : "Automático pelo sistema"}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {(["Compacta", "Confortável", "Espaçosa"] as const).map((density) => (
          <button
            type="button"
            key={density}
            onClick={() => setAppearance((current) => ({ ...current, density }))}
            className={`rounded-2xl border p-4 text-left text-xs font-extrabold ${
              appearance.density === density ? "border-[#d75c27] bg-[#d75c27]/10" : "border-[var(--line)] bg-white/35 dark:bg-white/5"
            }`}
          >
            {density}
          </button>
        ))}
      </div>
      {[
        ["Glass ativo", "glass"],
        ["Sombras suaves", "shadows"],
        ["Animações", "animations"],
      ].map(([label, key]) => (
        <div key={key} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/35 p-4 dark:bg-white/5">
          <span className="text-xs font-bold">{label}</span>
          <Toggle
            checked={appearance[key as keyof AppearanceSettings] as boolean}
            onChange={(value) => setAppearance((current) => ({ ...current, [key]: value }))}
          />
        </div>
      ))}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/35 p-4 dark:bg-white/5">
        <span className="text-xs font-bold">Tema escuro rápido</span>
        <Toggle checked={darkMode} onChange={setDarkMode} />
      </div>
    </Card>
  );
}

function NotificationsPanel({
  notifications,
  setNotifications,
}: {
  notifications: NotificationSettings;
  setNotifications: Dispatch<SetStateAction<NotificationSettings>>;
}) {
  const toggles: [string, keyof NotificationSettings][] = [
    ["Avisar contas vencendo", "dueSoon"],
    ["Avisar contas atrasadas", "overdue"],
    ["Avisar quando meta evoluir", "goalProgress"],
    ["Avisar quando gasto livre estiver acabando", "freeMoneyLow"],
    ["Avisar quando entrar dinheiro", "incomeReceived"],
    ["Resumo semanal", "weeklySummary"],
  ];

  return (
    <Card className="space-y-3">
      {toggles.map(([label, key]) => (
        <div key={key} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white/35 p-4 dark:bg-white/5">
          <span className="text-xs font-bold">{label}</span>
          <Toggle
            checked={notifications[key] as boolean}
            onChange={(value) => setNotifications((current) => ({ ...current, [key]: value }))}
          />
        </div>
      ))}
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Avisar com quantos dias de antecedência"
          value={notifications.daysBeforeDue}
          onChange={(value) => setNotifications((current) => ({ ...current, daysBeforeDue: Number(value) }))}
        />
        <TextInput
          label="Horário preferido"
          type="time"
          value={notifications.preferredTime}
          onChange={(value) => setNotifications((current) => ({ ...current, preferredTime: value }))}
        />
      </div>
    </Card>
  );
}

function SecurityPanel({
  security,
  setSecurity,
}: {
  security: SecuritySettings;
  setSecurity: Dispatch<SetStateAction<SecuritySettings>>;
}) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold">Alterar senha</h3>
            <p className="mt-2 text-xs text-[var(--muted)]">Atualize sua senha visualmente nesta etapa mockada.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordForm((current) => !current)}
            className="rounded-2xl bg-[#211d19] px-4 py-2 text-xs font-extrabold text-white dark:bg-[#d75c27]"
          >
            Abrir
          </button>
        </div>
        {showPasswordForm ? (
          <div className="mt-5 grid gap-3">
            <TextInput label="Senha atual" type="password" value="" onChange={() => undefined} />
            <TextInput label="Nova senha" type="password" value="" onChange={() => undefined} />
            <TextInput label="Confirmar nova senha" type="password" value="" onChange={() => undefined} />
            <button type="button" className="rounded-2xl bg-[#d75c27] px-4 py-3 text-xs font-extrabold text-white">
              Salvar senha
            </button>
          </div>
        ) : null}
      </Card>
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm font-extrabold">Exigir confirmação para excluir dados</span>
            <span className="mt-1 block text-xs text-[var(--muted)]">Ativo por padrão para proteger ações importantes.</span>
          </span>
          <Toggle
            checked={security.confirmDelete}
            onChange={(confirmDelete) => setSecurity((current) => ({ ...current, confirmDelete }))}
          />
        </div>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-2xl border border-red-500/20 px-4 py-2.5 text-xs font-extrabold text-red-600"
        >
          Testar confirmação
        </button>
      </Card>
      {deleteModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211d19]/45 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[28px] border border-white/50 bg-[#f7f7f6]/95 p-6 shadow-2xl">
            <h3 className="text-xl font-black">Tem certeza?</h3>
            <p className="mt-3 text-sm leading-6 text-[#756b62]">Esse dado não poderá ser recuperado.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="rounded-2xl border border-[#211d19]/10 px-4 py-2.5 text-xs font-extrabold">
                Cancelar
              </button>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="rounded-2xl bg-red-600 px-4 py-2.5 text-xs font-extrabold text-white">
                Excluir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DataPanel({
  incomes,
  bills,
  goals,
  realBalance,
  user,
}: {
  incomes: Income[];
  bills: Bill[];
  goals: Goal[];
  realBalance: RealBalance;
  user: UserProfile;
}) {
  const options = buildMonthOptions(getAccountCreatedAt());
  const [modalOpen, setModalOpen] = useState(false);
  const [fromMonth, setFromMonth] = useState(options[0]?.value ?? "2026-05");
  const [toMonth, setToMonth] = useState(options[options.length - 1]?.value ?? "2026-08");
  const [emptyMessage, setEmptyMessage] = useState(false);
  const inRange = (date: string) => {
    const key = monthKey(date);
    return key >= fromMonth && key <= toMonth;
  };
  const filteredIncomes = incomes.filter((income) => inRange(income.receivedDate));
  const filteredBills = bills.filter((bill) => inRange(bill.dueDate)).map((bill) => normalizeBillStatus(bill));
  const filteredGoals = goals.filter((goal) => inRange(goal.deadline));
  const received = sum(filteredIncomes, (income) => income.amount);
  const paidBills = filteredBills.filter((bill) => bill.status === "paga");
  const pendingBills = filteredBills.filter((bill) => bill.status === "pendente");
  const overdueBills = filteredBills.filter((bill) => bill.status === "atrasada");
  const paid = sum(paidBills, (bill) => bill.paidAmount ?? bill.expectedAmount);
  const pending = sum(pendingBills, (bill) => bill.expectedAmount);
  const overdue = sum(overdueBills, (bill) => bill.expectedAmount);
  const saved = sum(filteredGoals.length ? filteredGoals : goals, (goal) => goal.current);
  const free = Math.max(0, received - paid - pending - overdue - saved);
  const periodMetrics = buildMetrics(buildPeriodMonthData(fromMonth, toMonth, incomes, bills, goals));
  const previousPeriodMetrics = buildMetrics(buildPeriodMonthData(addMonths(fromMonth, -buildMonthRange(fromMonth, toMonth).length || -1), addMonths(fromMonth, -1), incomes, bills, goals));
  const northScore = calculateNorthScore(periodMetrics, goals);
  const previousNorthScore = calculateNorthScore(previousPeriodMetrics, goals);
  const northScoreDelta = northScore - previousNorthScore;
  const categoryTotals = filteredBills.reduce<Record<string, number>>((acc, bill) => {
    acc[bill.category] = (acc[bill.category] ?? 0) + (bill.paidAmount ?? bill.expectedAmount);
    return acc;
  }, {});
  const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const monthSeries = options
    .filter((option) => option.value >= fromMonth && option.value <= toMonth)
    .map((option) => {
      const monthIncomes = incomes.filter((income) => monthKey(income.receivedDate) === option.value);
      const monthBills = bills.filter((bill) => monthKey(bill.dueDate) === option.value);
      const monthGoals = goals.filter((goal) => monthKey(goal.deadline) === option.value);
      return {
        label: option.label.replace(" de ", " "),
        entradas: sum(monthIncomes, (income) => income.amount),
        saidas: sum(monthBills.filter((bill) => bill.status === "paga"), (bill) => bill.paidAmount ?? bill.expectedAmount),
        guardado: sum(monthGoals, (goal) => goal.current),
      };
    });
  const topPriority = [...overdueBills].sort(sortByPaymentPriority)[0] ?? [...pendingBills].sort(sortByPaymentPriority)[0];
  const averagePaidLate = paidBills.filter(isPaidLate).length
    ? Math.round(sum(paidBills.filter(isPaidLate), paidLateDays) / paidBills.filter(isPaidLate).length)
    : 0;

  const exportPdf = () => {
    if (!filteredIncomes.length && !filteredBills.length) {
      setEmptyMessage(true);
      return;
    }
    setEmptyMessage(false);
    const maxSeries = Math.max(...monthSeries.flatMap((item) => [item.entradas, item.saidas, item.guardado]), 1);
    const maxCategory = Math.max(...topCategories.map((item) => item[1]), 1);
    const origin = window.location.origin;
    const logoSrc = `${origin}/logo-reveenorth.png`;
    const symbolSrc = `${origin}/simbolo-reveenorth.png`;
    const html = `
      <html>
        <head>
          <title>Relatório ReveeNorth</title>
          <style>
            *{box-sizing:border-box}
            body{font-family:Montserrat,Arial,sans-serif;margin:0;background:#efefef;color:#211d19}
            .page{max-width:1040px;margin:22px auto;background:#fff;border-radius:30px;padding:30px;box-shadow:0 24px 70px rgba(33,29,25,.12)}
            .top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:18px}
            .brand{display:flex;align-items:center;gap:12px}
            .brand img.symbol{width:38px;height:38px;object-fit:contain}
            .brand img.logo{width:178px;height:auto;object-fit:contain}
            .period{font-size:12px;font-weight:800;color:#8a7c72;text-align:right}
            .hero{position:relative;overflow:hidden;border-radius:24px;background:radial-gradient(circle at 92% 16%,rgba(215,92,39,.72),transparent 240px),linear-gradient(135deg,#171411,#211d19);color:#fff;padding:26px;margin:18px 0 18px}
            .hero:after{content:"";position:absolute;right:24px;top:18px;width:220px;height:120px;border-radius:999px;background:rgba(215,92,39,.22);filter:blur(40px)}
            .heroContent{position:relative;z-index:1;display:grid;grid-template-columns:1fr 190px;gap:24px;align-items:center}
            .hero h1{font-size:28px;line-height:1.12;margin:0}
            .hero p{margin:10px 0 0;color:rgba(255,255,255,.74);font-size:13px;line-height:1.6}
            .scoreBox{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);border-radius:22px;padding:16px;text-align:center;backdrop-filter:blur(18px)}
            .scoreBox strong{display:block;font-size:44px;line-height:1;font-weight:900}
            .scoreBox span{font-size:11px;font-weight:800;color:#86efac}
            .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
            .card{border:1px solid #eee7e1;border-radius:18px;padding:14px;background:#fbfaf8}
            .label{font-size:9px;text-transform:uppercase;letter-spacing:.18em;color:#8a7c72;font-weight:900}
            .value{font-size:19px;font-weight:900;margin-top:7px}
            h2{font-size:20px;margin:24px 0 8px} p{line-height:1.55;color:#756b62}
            .panel{border:1px solid #eee7e1;border-radius:24px;padding:18px;margin-top:12px;background:#fff}
            .row{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;margin:12px 0}
            .track{height:10px;border-radius:999px;background:#efefef;overflow:hidden}.fill{height:100%;border-radius:999px;background:#d75c27}
            .triple{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.mini{height:8px;border-radius:999px;background:#efefef;overflow:hidden;margin-top:6px}
            .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
            .recommendation{border-radius:22px;background:linear-gradient(135deg,#211d19,#5a321f);color:#fff;padding:18px;margin-top:14px}
            .recommendation p{color:rgba(255,255,255,.78);margin:6px 0 0}
            @media print{body{background:white}.page{box-shadow:none;margin:0;max-width:none;border-radius:0}.hero{break-inside:avoid}.card,.panel{break-inside:avoid}}
          </style>
        </head>
        <body>
          <main class="page">
            <div class="top">
              <div class="brand">
                <img class="symbol" src="${symbolSrc}" alt="">
                <img class="logo" src="${logoSrc}" alt="ReveeNorth">
              </div>
              <div class="period">${monthLabel(fromMonth)} até ${monthLabel(toMonth)}<br>Gerado em ${new Date().toLocaleDateString("pt-BR")}</div>
            </div>
            <section class="hero">
              <div class="heroContent">
                <div>
                  <h1>${monthLabel(toMonth).split(" de ")[0]} foi um mês de direção financeira.</h1>
                  <p>${user.fullName}, você recebeu ${formatCurrency(received)}, pagou ${paidBills.length} conta(s), guardou ${formatCurrency(saved)} em metas e ainda possui ${formatCurrency(free)} livre para decidir. ${topPriority ? `Prioridade North: ${topPriority.name}.` : "Nenhuma prioridade crítica no período."}</p>
                </div>
                <div class="scoreBox">
                  <div class="label" style="color:rgba(255,255,255,.62)">North Score</div>
                  <strong>${northScore}</strong>
                  <span>${northScoreDelta >= 0 ? "+" : "-"}${Math.abs(northScoreDelta)} ponto(s) no período</span>
                </div>
              </div>
            </section>
            <section class="grid">
              ${[
                ["Recebido", formatCurrency(received)],
                ["Saídas", formatCurrency(paid)],
                ["Guardado", formatCurrency(saved)],
                ["Livre para decidir", formatCurrency(free)],
                ["Saldo informado", formatCurrency(realBalance.amount)],
                ["Contas pagas", String(paidBills.length)],
                ["Pendentes", String(pendingBills.length + overdueBills.length)],
                ["North Score", `${northScore}/100`],
              ].map(([label, value]) => `<div class="card"><div class="label">${label}</div><div class="value">${value}</div></div>`).join("")}
            </section>
            <div class="two">
              <section>
                <h2>Evolução financeira</h2>
                <div class="panel">
              ${monthSeries.map((item) => `<div class="row"><strong>${item.label}</strong><div class="triple"><div>Entradas<div class="mini"><div class="fill" style="width:${(item.entradas / maxSeries) * 100}%"></div></div></div><div>Saídas<div class="mini"><div class="fill" style="width:${(item.saidas / maxSeries) * 100}%;background:#211d19"></div></div></div><div>Guardado<div class="mini"><div class="fill" style="width:${(item.guardado / maxSeries) * 100}%;background:#27ae60"></div></div></div></div></div>`).join("")}
                </div>
              </section>
              <section>
                <h2>Categorias com maior impacto</h2>
                <div class="panel">
              ${topCategories.map(([label, value]) => `<div class="row"><strong>${label}</strong><div class="track"><div class="fill" style="width:${(value / maxCategory) * 100}%"></div></div></div>`).join("") || "<p>Nenhuma categoria no período.</p>"}
                </div>
              </section>
            </div>
            <h2>Distribuição do dinheiro</h2>
            <section class="grid">
              ${[["Contas pagas", paid],["Contas pendentes", pending],["Contas atrasadas", overdue],["Guardado", saved],["Livre", free]].map(([label, value]) => `<div class="card"><div class="label">${label}</div><div class="value">${formatCurrency(value as number)}</div></div>`).join("")}
            </section>
            <h2>Metas principais</h2>
            <p>${(filteredGoals.length ? filteredGoals : goals).slice(0, 3).map((goal) => `${goal.name}: ${Math.round((goal.current / Math.max(goal.target, 1)) * 100)}%`).join(" • ") || "Nenhuma meta cadastrada."}</p>
            <section class="recommendation">
              <div class="label" style="color:#ffb08c">Recomendações North</div>
              <p>${topPriority ? `Pague primeiro ${topPriority.name}. ` : ""}Existem ${overdueBills.length} conta(s) atrasada(s), ${pendingBills.length} pendente(s) e ${paidBills.filter(isPaidLate).length} paga(s) com atraso médio de ${averagePaidLate} dia(s).</p>
            </section>
          </main>
        </body>
      </html>`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
    setModalOpen(false);
  };

  return (
    <Card className="max-w-2xl">
      <FileText className="h-6 w-6 text-[#d75c27]" />
      <h3 className="mt-4 text-xl font-extrabold">Relatório em PDF</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Gere um relatório financeiro do mês atual com suas principais métricas, metas, North Score e Recomendações North.
      </p>
      <button
        type="button"
        onClick={() => {
          setEmptyMessage(false);
          setModalOpen(true);
        }}
        className="mt-6 rounded-2xl bg-[#d75c27] px-5 py-3 text-xs font-extrabold text-white"
      >
        Exportar relatório em PDF
      </button>
      {modalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211d19]/45 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[30px] border border-white/50 bg-[#f7f7f6]/96 p-6 shadow-2xl">
            <h3 className="text-xl font-black">Selecionar período</h3>
            <p className="mt-2 text-sm text-[#756b62]">Escolha o intervalo que entrará no relatório.</p>
            {emptyMessage ? (
              <p className="mt-4 rounded-2xl border border-[#d75c27]/20 bg-[#d75c27]/10 p-3 text-xs font-bold text-[#b84d1f]">
                Não encontramos dados suficientes para gerar este relatório.
              </p>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-[#756b62]">De</span>
                <select
                  value={fromMonth}
                  onChange={(event) => {
                    setFromMonth(event.target.value);
                    setEmptyMessage(false);
                  }}
                  className="mt-2 w-full rounded-2xl border border-[#211d19]/10 bg-white px-4 py-3 text-sm font-bold"
                >
                  {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-[#756b62]">Até</span>
                <select
                  value={toMonth}
                  onChange={(event) => {
                    setToMonth(event.target.value);
                    setEmptyMessage(false);
                  }}
                  className="mt-2 w-full rounded-2xl border border-[#211d19]/10 bg-white px-4 py-3 text-sm font-bold"
                >
                  {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-[#211d19]/10 px-4 py-2.5 text-xs font-extrabold">Cancelar</button>
              <button type="button" onClick={exportPdf} className="rounded-2xl bg-[#d75c27] px-4 py-2.5 text-xs font-extrabold text-white">Gerar PDF</button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function PlanningView({
  metrics,
  rules,
}: {
  metrics: ReturnType<typeof buildMetrics>;
  rules: CalculatorRules;
}) {
  const initialPlannedIncome = metrics.totalIncome || 6290;
  const [plannedIncome, setPlannedIncome] = useState(initialPlannedIncome);
  const [saved, setSaved] = useState(false);
  const [incomeEditing, setIncomeEditing] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [expenseMenuFor, setExpenseMenuFor] = useState<number | null>(null);
  const [goalMenuFor, setGoalMenuFor] = useState<number | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryIconOpen, setCategoryIconOpen] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState({
    label: "Nova área",
    helper: "Defina para onde esse valor vai",
    value: 0,
    icon: "Wallet",
    tone: "neutral",
  });
  const [style, setStyle] = useState<"equilibrado" | "conservador" | "agressivo">("equilibrado");
  const stylePresets = {
    conservador: { Essenciais: 60, Lazer: 10, Metas: 30 },
    equilibrado: { Essenciais: 50, Lazer: 20, Metas: 30 },
    agressivo: { Essenciais: 45, Lazer: 10, Metas: 45 },
  };
  const [distribution, setDistribution] = useState<Array<{
    id: string;
    label: string;
    helper: string;
    value: number;
    icon: React.ElementType;
    tone: string;
  }>>(() => {
    const billsBudget = initialPlannedIncome * (rules.bills / 100);
    const personalBudget = initialPlannedIncome * (rules.personal / 100);
    const goalsBudget = initialPlannedIncome * (rules.goals / 100);
    const reserveBudget = initialPlannedIncome * (rules.reserve / 100);
    const overdueBudget = Math.min(metrics.totalOverdue, billsBudget * 0.3);
    const remainingBillsBudget = Math.max(0, billsBudget - overdueBudget);
    return [
      { id: "essenciais", label: "Essenciais", helper: "Contas fixas e moradia", value: Math.round(remainingBillsBudget * 0.62), icon: Home, tone: "orange" },
      { id: "alimentacao", label: "Alimentação", helper: "Mercado, restaurantes", value: Math.round(remainingBillsBudget * 0.22), icon: ShoppingCart, tone: "green" },
      { id: "transporte", label: "Transporte", helper: "Combustível, apps, manutenção", value: Math.round(remainingBillsBudget * 0.16), icon: Car, tone: "blue" },
      { id: "lazer", label: "Lazer", helper: "Diversão, hobbies, passeios", value: Math.round(personalBudget), icon: Heart, tone: "red" },
      { id: "reserva", label: "Reserva", helper: "Reserva de emergência", value: Math.round(reserveBudget), icon: Shield, tone: "green" },
      { id: "metas", label: "Metas", helper: "Sonhos e objetivos", value: Math.round(goalsBudget), icon: Target, tone: "purple" },
      { id: "atrasadas", label: "Contas atrasadas", helper: "Dívidas e pendências", value: Math.round(overdueBudget), icon: Zap, tone: "red" },
    ];
  });
  const [monthGoals, setMonthGoals] = useState([
    { id: 1, title: "Guardar na reserva", helper: "Ter mais segurança financeira.", amount: 500, done: true },
    { id: 2, title: "Quitar Energia", helper: "Evitar juros e pendências.", amount: 210, done: true },
    { id: 3, title: "Comprar óculos", helper: "Melhorar minha qualidade de vida.", amount: 450, done: false },
    { id: 4, title: "Trocar celular", helper: "Planejado para o segundo semestre.", amount: 1800, done: false },
  ]);
  const [expectedExpenses, setExpectedExpenses] = useState([
    { id: 1, title: "Festa Junina Davi", amount: 250 },
    { id: 2, title: "Presente aniversário", amount: 120 },
    { id: 3, title: "Manutenção do carro", amount: 300 },
    { id: 4, title: "Mercado extra", amount: 200 },
  ]);
  const totalDistribution = sum(distribution, (item) => item.value);
  const totalGoals = sum(monthGoals.filter((goal) => goal.done), (goal) => goal.amount);
  const totalExpected = sum(expectedExpenses, (expense) => expense.amount);
  const distributionPercent = plannedIncome > 0 ? Math.round((totalDistribution / plannedIncome) * 100) : 0;
  const fixedTotal = distribution.find((item) => item.id === "essenciais")?.value ?? 0;
  const reserveTotal = distribution.find((item) => item.id === "reserva")?.value ?? 0;
  const goalsBudgetTotal = distribution.find((item) => item.id === "metas")?.value ?? 0;
  const otherDistribution = Math.max(0, totalDistribution - fixedTotal - reserveTotal - goalsBudgetTotal);
  const remaining = plannedIncome - totalDistribution - totalExpected;

  const toneClasses: Record<string, string> = {
    orange: "bg-[#d75c27]/10 text-[#d75c27]",
    green: "bg-emerald-500/12 text-emerald-600",
    blue: "bg-blue-500/12 text-blue-600",
    purple: "bg-purple-500/12 text-purple-600",
    red: "bg-red-500/10 text-red-500",
    neutral: "bg-[#211d19]/8 text-[var(--muted)]",
  };

  const applyPreset = (preset: keyof typeof stylePresets) => {
    setStyle(preset);
    const selected = stylePresets[preset];
    const essentialsBudget = plannedIncome * (selected.Essenciais / 100);
    const leisureBudget = plannedIncome * (selected.Lazer / 100);
    const futureBudget = plannedIncome * (selected.Metas / 100);
    const nextValues: Record<string, number> = {
      essenciais: essentialsBudget * 0.52,
      alimentacao: essentialsBudget * 0.2,
      transporte: essentialsBudget * 0.12,
      atrasadas: essentialsBudget * 0.16,
      lazer: leisureBudget * 0.74,
      outros: leisureBudget * 0.26,
      reserva: futureBudget * 0.55,
      metas: futureBudget * 0.45,
    };
    setDistribution((current) => current.map((item) => ({ ...item, value: Math.round(nextValues[item.id] ?? item.value) })));
    setSaved(false);
  };

  const updateDistribution = (id: string, value: number) => {
    setDistribution((current) => current.map((item) => item.id === id ? { ...item, value: Math.max(0, value) } : item));
    setSaved(false);
  };

  const addGoal = () => {
    setMonthGoals((current) => [...current, { id: Date.now(), title: "Nova meta do mês", helper: "Defina o objetivo.", amount: 0, done: false }]);
  };

  const addExpense = () => {
    setExpectedExpenses((current) => [...current, { id: Date.now(), title: "Nova despesa prevista", amount: 0 }]);
  };
  const addDistributionCategory = () => {
    const Icon = iconMap[categoryDraft.icon as keyof typeof iconMap] ?? Wallet;
    setDistribution((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        label: categoryDraft.label || "Nova área",
        helper: categoryDraft.helper || "Valor planejado para o mês",
        value: Math.max(0, categoryDraft.value),
        icon: Icon,
        tone: categoryDraft.tone,
      },
    ]);
    setCategoryDraft({
      label: "Nova área",
      helper: "Defina para onde esse valor vai",
      value: 0,
      icon: "Wallet",
      tone: "neutral",
    });
    setAddingCategory(false);
    setCategoryIconOpen(false);
    setSaved(false);
  };
  const planningTips = remaining < 0
    ? [
      `Você passou ${formatCurrency(Math.abs(remaining))} das entradas previstas.`,
      "Comece revisando lazer e despesas previstas, que costumam ser mais flexíveis.",
      "Mantenha contas atrasadas e essenciais protegidas antes de aumentar metas.",
    ]
    : [
      `Ainda sobraram ${formatCurrency(remaining)} para decidir.`,
      "Uma boa próxima ação é reforçar reserva antes de aumentar compras flexíveis.",
      "Se quiser acelerar metas, mova uma parte pequena do lazer para Futuro e Prioridades.",
    ];
  const DraftIcon = iconMap[categoryDraft.icon as keyof typeof iconMap] ?? Wallet;
  const planStyles: Array<{
    id: keyof typeof stylePresets;
    Icon: React.ElementType;
    title: string;
    helper: string;
  }> = [
    { id: "equilibrado", Icon: SlidersHorizontal, title: "Equilibrado", helper: "Equilibra necessidades, desejos e objetivos." },
    { id: "conservador", Icon: Shield, title: "Conservador", helper: "Prioriza segurança e quitação de dívidas." },
    { id: "agressivo", Icon: TrendingUp, title: "Agressivo", helper: "Foca em metas e crescimento." },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[0.45fr_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[var(--muted)]">Receita prevista do mês</p>
              <input
                id="planned-income-input"
                type="text"
                inputMode="numeric"
                value={formatCurrency(plannedIncome)}
                readOnly={!incomeEditing}
                onChange={(event) => {
                  setPlannedIncome(parseCurrency(event.target.value));
                  setSaved(false);
                }}
                onBlur={() => setIncomeEditing(false)}
                className={`mt-5 w-full rounded-2xl bg-transparent text-3xl font-black outline-none transition ${
                  incomeEditing ? "bg-white/60 px-3 py-2 ring-1 ring-[#d75c27]/30 dark:bg-white/8" : ""
                }`}
              />
              <p className="mt-5 text-xs font-semibold leading-5 text-[var(--muted)]">
                Este é o valor total que você espera receber.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIncomeEditing(true);
                window.setTimeout(() => document.getElementById("planned-income-input")?.focus(), 0);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d75c27]/10 text-[#d75c27] transition hover:bg-[#d75c27] hover:text-white"
              aria-label="Editar receita prevista"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
        </Card>
        <Card className="p-5">
          <div>
            <h3 className="text-base font-extrabold">Como você quer organizar esse mês?</h3>
            <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
              Escolha um estilo de planejamento. Você poderá ajustar tudo manualmente.
            </p>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {planStyles.map(({ id, Icon: PresetIcon, title, helper }) => {
                const selected = style === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => applyPreset(id)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      selected ? "border-[#d75c27] bg-[#d75c27]/8" : "border-[var(--line)] bg-white/35 dark:bg-white/6"
                    }`}
                  >
                    <PresetIcon className="h-7 w-7 text-[#d75c27]" />
                    <p className="mt-3 text-sm font-extrabold">{title}</p>
                    <p className="mt-1 text-[11px] font-semibold leading-5 text-[var(--muted)]">{helper}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
        <Card className="p-5">
          <div className="flex flex-col gap-4 border-b border-[#211d19]/8 pb-5 md:flex-row md:items-start md:justify-between dark:border-white/10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">1. Distribuição do orçamento</p>
              <p className="mt-2 text-xs font-semibold text-[var(--muted)]">Defina quanto do seu dinheiro irá para cada área deste mês.</p>
            </div>
            <div className="min-w-56 text-left md:text-right">
              <p className="text-xs font-bold text-[var(--muted)]">Distribuído</p>
              <p className="mt-1 text-sm font-black">{formatCurrency(totalDistribution)} de {formatCurrency(plannedIncome)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#211d19]/8 dark:bg-white/10">
                <div className={`h-full rounded-full ${totalDistribution > plannedIncome ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(distributionPercent, 100)}%` }} />
              </div>
              <p className="mt-2 text-xs font-bold">{distributionPercent}%</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="hidden grid-cols-[1fr_132px_72px_1fr] gap-4 px-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
              <span>Categoria</span>
              <span>Valor (R$)</span>
              <span>% da receita</span>
              <span />
            </div>
            {distribution.map((item) => {
              const Icon = item.icon as React.ElementType;
              const percent = plannedIncome > 0 ? Math.round((item.value / plannedIncome) * 100) : 0;
              return (
                <div key={item.id} className="grid gap-3 rounded-2xl bg-white/42 p-3 dark:bg-white/6 md:grid-cols-[1fr_132px_72px_1fr] md:items-center">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">{item.label}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-[var(--muted)]">{item.helper}</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(item.value)}
                    onChange={(event) => updateDistribution(item.id, parseCurrency(event.target.value))}
                    className="h-11 rounded-xl border border-[var(--line)] bg-white/65 px-3 text-sm font-bold outline-none focus:border-[#d75c27] dark:bg-white/8"
                  />
                  <div className="h-11 rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-center text-sm font-bold dark:bg-white/8">{percent}%</div>
                  <input
                    type="range"
                    min={0}
                    max={plannedIncome}
                    step={10}
                    value={Math.min(item.value, plannedIncome)}
                    onChange={(event) => updateDistribution(item.id, Number(event.target.value))}
                    className="accent-[#d75c27]"
                  />
                </div>
              );
            })}
            {addingCategory ? (
              <div className="grid gap-3 rounded-3xl border border-[#d75c27]/20 bg-[#d75c27]/6 p-3 md:grid-cols-[1fr_132px_72px_auto] md:items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCategoryIconOpen((current) => !current)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#d75c27]/12 text-[#d75c27]"
                      aria-label="Escolher ícone da área"
                    >
                      <DraftIcon className="h-5 w-5" />
                    </button>
                    {categoryIconOpen ? (
                      <IconPicker
                        onSelect={(icon) => {
                          setCategoryDraft((current) => ({ ...current, icon }));
                          setCategoryIconOpen(false);
                        }}
                      />
                    ) : null}
                  </div>
                  <span className="min-w-0 flex-1">
                    <input
                      value={categoryDraft.label}
                      onChange={(event) => setCategoryDraft((current) => ({ ...current, label: event.target.value }))}
                      className="w-full bg-transparent text-sm font-extrabold outline-none"
                    />
                    <input
                      value={categoryDraft.helper}
                      onChange={(event) => setCategoryDraft((current) => ({ ...current, helper: event.target.value }))}
                      className="mt-0.5 w-full bg-transparent text-[11px] font-semibold text-[var(--muted)] outline-none"
                    />
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(categoryDraft.value)}
                  onChange={(event) => setCategoryDraft((current) => ({ ...current, value: parseCurrency(event.target.value) }))}
                  className="h-11 rounded-xl border border-[var(--line)] bg-white/65 px-3 text-sm font-bold outline-none focus:border-[#d75c27] dark:bg-white/8"
                />
                <div className="h-11 rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-center text-sm font-bold dark:bg-white/8">
                  {plannedIncome > 0 ? Math.round((categoryDraft.value / plannedIncome) * 100) : 0}%
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={addDistributionCategory} className="rounded-xl bg-[#d75c27] px-3 py-2 text-xs font-extrabold text-white">
                    Adicionar
                  </button>
                  <button type="button" onClick={() => setAddingCategory(false)} className="rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-extrabold">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingCategory(true)}
                className="flex w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-[#211d19]/16 bg-white/30 px-4 py-4 text-sm font-extrabold text-[#d75c27] transition hover:border-[#d75c27]/40 hover:bg-[#d75c27]/8 dark:border-white/12 dark:bg-white/5"
              >
                <Plus className="h-4 w-4" />
                Adicionar área do orçamento
              </button>
            )}
          </div>
          <p className="mt-5 text-xs font-bold text-[#b94d20]">
            Ajuste os valores ou mova os sliders. Tudo será salvo no seu plano.
          </p>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">2. Metas do mês</p>
                <p className="mt-2 text-xs font-semibold text-[var(--muted)]">Defina o que você quer conquistar.</p>
              </div>
              <button type="button" onClick={addGoal} className="text-xs font-extrabold text-[#d75c27]">+ Adicionar meta</button>
            </div>
            <div className="mt-5 space-y-3">
              {monthGoals.map((goal) => (
                <div key={goal.id} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-white/45 p-3 dark:bg-white/6 md:grid-cols-[28px_1fr_120px_22px] md:items-center">
                  <button type="button" onClick={() => setMonthGoals((current) => current.map((item) => item.id === goal.id ? { ...item, done: !item.done } : item))} className={`flex h-6 w-6 items-center justify-center rounded-lg border ${goal.done ? "border-[#d75c27] bg-[#d75c27] text-white" : "border-[#211d19]/20"}`}>
                    {goal.done ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                  <div>
                    <input value={goal.title} onChange={(event) => setMonthGoals((current) => current.map((item) => item.id === goal.id ? { ...item, title: event.target.value } : item))} className="w-full bg-transparent text-sm font-extrabold outline-none" />
                    <input value={goal.helper} onChange={(event) => setMonthGoals((current) => current.map((item) => item.id === goal.id ? { ...item, helper: event.target.value } : item))} className="mt-1 w-full bg-transparent text-xs font-semibold text-[var(--muted)] outline-none" />
                  </div>
                  <input type="text" inputMode="numeric" value={formatCurrency(goal.amount)} onChange={(event) => setMonthGoals((current) => current.map((item) => item.id === goal.id ? { ...item, amount: parseCurrency(event.target.value) } : item))} className="bg-transparent text-right text-sm font-black outline-none" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setGoalMenuFor(goalMenuFor === goal.id ? null : goal.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[#211d19]/6 hover:text-[#211d19] dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Ações da meta"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {goalMenuFor === goal.id ? (
                      <div className="absolute right-0 top-9 z-20 w-36 rounded-2xl border border-[var(--line)] bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:bg-[#211d19]/95">
                        <button
                          type="button"
                          onClick={() => {
                            setMonthGoals((current) => current.filter((item) => item.id !== goal.id));
                            setGoalMenuFor(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#d75c27]/7 p-3 text-sm font-bold">
              <span>Total destinado às metas</span>
              <span className="text-[#d75c27]">{formatCurrency(totalGoals)}</span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">3. Despesas previstas</p>
                <p className="mt-2 text-xs font-semibold text-[var(--muted)]">Gastos que você sabe que terá neste mês.</p>
              </div>
              <button type="button" onClick={addExpense} className="text-xs font-extrabold text-[#d75c27]">+ Adicionar</button>
            </div>
            <div className="mt-5 space-y-2">
              {expectedExpenses.map((expense) => (
                <div key={expense.id} className="grid grid-cols-[1fr_110px_34px] items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/45 p-3 dark:bg-white/6">
                  <input value={expense.title} onChange={(event) => setExpectedExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, title: event.target.value } : item))} className="min-w-0 bg-transparent text-sm font-bold outline-none" />
                  <input type="text" inputMode="numeric" value={formatCurrency(expense.amount)} onChange={(event) => setExpectedExpenses((current) => current.map((item) => item.id === expense.id ? { ...item, amount: parseCurrency(event.target.value) } : item))} className="bg-transparent text-right text-sm font-black outline-none" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setExpenseMenuFor(expenseMenuFor === expense.id ? null : expense.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[#211d19]/6 hover:text-[#211d19] dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Ações da despesa prevista"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {expenseMenuFor === expense.id ? (
                      <div className="absolute right-0 top-9 z-20 w-36 rounded-2xl border border-[var(--line)] bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:bg-[#211d19]/95">
                        <button
                          type="button"
                          onClick={() => {
                            setExpectedExpenses((current) => current.filter((item) => item.id !== expense.id));
                            setExpenseMenuFor(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-extrabold text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#d75c27]/7 p-3 text-sm font-bold">
              <span>Total previsto</span>
              <span className="text-[#d75c27]">{formatCurrency(totalExpected)}</span>
            </div>
          </Card>
        </div>
      </div>

      {remaining < 0 ? (
        <p className="rounded-3xl border border-red-500/15 bg-red-500/10 p-4 text-sm font-bold text-red-600">
          Você passou {formatCurrency(Math.abs(remaining))} das entradas previstas. Para manter esse plano, precisa aumentar a renda ou reduzir algum destino.
        </p>
      ) : remaining > 0 ? (
        <p className="rounded-3xl border border-[#d75c27]/15 bg-[#d75c27]/10 p-4 text-sm font-bold text-[#b94d20]">
          Ainda sobraram {formatCurrency(remaining)} para decidir.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d75c27]">4. Resumo do plano</p>
          <p className="mt-2 text-xs font-semibold text-[var(--muted)]">Veja como seu dinheiro será utilizado neste mês.</p>
          <div className="mt-5 space-y-3">
            {[
              ["Receita prevista", plannedIncome],
              ["Total de despesas fixas (essenciais)", fixedTotal],
              ["Outras categorias", otherDistribution],
              ["Despesas previstas", totalExpected],
              ["Metas do orçamento", goalsBudgetTotal],
              ["Reserva", reserveTotal],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-[var(--muted)]">{label as string}</span>
                <span className="font-black">{formatCurrency(value as number)}</span>
              </div>
            ))}
          </div>
          <div className={`mt-6 flex items-center justify-between rounded-2xl p-4 text-lg font-black ${remaining >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
            <span>Saldo livre planejado</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        </Card>

        <div className="overflow-hidden rounded-[30px] border border-white/12 bg-[radial-gradient(circle_at_92%_12%,rgba(215,92,39,.34),transparent_18rem),linear-gradient(135deg,#211d19,#3a2a22)] p-6 text-white shadow-[0_18px_56px_rgba(33,29,25,.12)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff9b6d]">5. Análise do seu plano</p>
          <h3 className="mt-4 text-xl font-extrabold">
            {remaining >= 0 ? "Seu planejamento está equilibrado!" : "Seu planejamento precisa de ajuste."}
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/76">
            {remaining >= 0
              ? "Você está cobrindo suas necessidades, criando reservas e investindo nos seus objetivos."
              : `Você passou ${formatCurrency(Math.abs(remaining))} das entradas previstas. Para manter esse plano, precisa aumentar a renda ou reduzir algum destino.`}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
            <div className="space-y-3">
              {[
                "Todas as categorias foram planejadas",
                reserveTotal > 0 ? "Você destinou para reserva" : "Reserva ainda precisa de valor",
                totalGoals > plannedIncome * 0.08 ? "Suas metas estão sendo financiadas" : "Apenas uma parte pequena foi para metas",
                remaining >= 0 ? "Seu saldo livre está positivo" : "Seu plano está acima da receita",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${index === 3 && remaining < 0 ? "bg-red-500/18 text-red-300" : "bg-emerald-500/18 text-emerald-300"}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-semibold leading-5 text-white/78">{item}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold text-white/64">Previsão de sobra</p>
              <p className={`mt-3 text-3xl font-black ${remaining >= 0 ? "text-emerald-300" : "text-red-300"}`}>{formatCurrency(remaining)}</p>
              <p className="mt-2 text-xs font-bold text-white/64">{plannedIncome > 0 ? Math.round((remaining / plannedIncome) * 100) : 0}% da sua receita</p>
            </div>
          </div>
          {tipsOpen ? (
            <div className="mt-6 space-y-2 rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffb08a]">Dicas North</p>
              {planningTips.map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-sm font-semibold leading-5 text-white/80">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9b6d]" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setTipsOpen((current) => !current)}
            className="mt-6 rounded-2xl bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/16"
          >
            {tipsOpen ? "Ocultar dicas" : "Ver dicas para otimizar meu plano"}
          </button>
        </div>
      </div>

      {saved ? (
        <p className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-700">
          Plano salvo. Você pode revisar e ajustar seu planejamento quantas vezes quiser durante o mês.
        </p>
      ) : null}
    </div>
  );
}

function ActiveView({
  active,
  data,
  metrics,
  onStartPayment,
  onOpenBill,
  categories,
  setCategories,
  settingsSection,
  setSettingsSection,
  preferences,
  setPreferences,
  rules,
  setRules,
  appearance,
  setAppearance,
  notifications,
  setNotifications,
  security,
  setSecurity,
  onOpenProfile,
  onOpenCategoryModal,
  onConfirmDanger,
  darkMode,
  setDarkMode,
  realBalance,
  onOpenRealBalance,
  onOpenFinanceDetail,
  onOpenRecommendation,
  onOpenDataSettings,
  onOpenIncome,
  onOpenGoal,
  onNewGoal,
  onToggleObjective,
  onRemoveObjective,
  onNewObjective,
  allIncomes,
  allBills,
  allGoals,
  user,
}: {
  active: string;
  data: MonthData;
  metrics: ReturnType<typeof buildMetrics>;
  onStartPayment: (bill: Bill) => void;
  onOpenBill: (bill: Bill) => void;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  settingsSection: string | null;
  setSettingsSection: (section: string | null) => void;
  preferences: FinancePreferences;
  setPreferences: Dispatch<SetStateAction<FinancePreferences>>;
  rules: CalculatorRules;
  setRules: Dispatch<SetStateAction<CalculatorRules>>;
  appearance: AppearanceSettings;
  setAppearance: Dispatch<SetStateAction<AppearanceSettings>>;
  notifications: NotificationSettings;
  setNotifications: Dispatch<SetStateAction<NotificationSettings>>;
  security: SecuritySettings;
  setSecurity: Dispatch<SetStateAction<SecuritySettings>>;
  onOpenProfile: () => void;
  onOpenCategoryModal: () => void;
  onConfirmDanger: (title: string, message: string, onConfirm?: () => void) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  realBalance: RealBalance;
  onOpenRealBalance: () => void;
  onOpenFinanceDetail: (detail: FinanceDetail) => void;
  onOpenRecommendation: () => void;
  onOpenDataSettings: () => void;
  onOpenIncome: (income: Income) => void;
  onOpenGoal: (goal: Goal) => void;
  onNewGoal: () => void;
  onToggleObjective: (id: number) => void;
  onRemoveObjective: (id: number) => void;
  onNewObjective: () => void;
  allIncomes: Income[];
  allBills: Bill[];
  allGoals: Goal[];
  user: UserProfile;
}) {
  if (active === "Dashboard") {
    return (
      <Dashboard
        data={data}
        metrics={metrics}
        onStartPayment={onStartPayment}
        onOpenBill={onOpenBill}
        categories={categories}
        realBalance={realBalance}
        onOpenRealBalance={onOpenRealBalance}
        onOpenFinanceDetail={onOpenFinanceDetail}
        onOpenRecommendation={onOpenRecommendation}
      />
    );
  }
  if (active === "Entradas") {
    return <IncomesView incomes={data.incomes} onOpenIncome={onOpenIncome} />;
  }
  if (active === "Contas") {
    return (
      <BillsView
        bills={data.bills}
        onStartPayment={onStartPayment}
        onOpenBill={onOpenBill}
        categories={categories}
      />
    );
  }
  if (active === "Metas") {
    return <GoalsView goals={data.goals} onOpenGoal={onOpenGoal} onNewGoal={onNewGoal} />;
  }
  if (active === "Objetivos do mês") {
    return (
      <ObjectivesView
        objectives={data.objectives}
        onToggle={onToggleObjective}
        onRemove={onRemoveObjective}
        onNew={onNewObjective}
      />
    );
  }
  if (active === "Planejamento") {
    return <PlanningView metrics={metrics} rules={rules} />;
  }
  if (active === "Relatórios") {
    return (
      <ReportsView
        data={data}
        metrics={metrics}
        categories={categories}
        allIncomes={allIncomes}
        allBills={allBills}
        allGoals={allGoals}
        realBalance={realBalance}
        onOpenFinanceDetail={onOpenFinanceDetail}
        onOpenDataSettings={onOpenDataSettings}
      />
    );
  }
  if (active === "Configurações") {
    return (
      <SettingsView
        categories={categories}
        setCategories={setCategories}
        section={settingsSection}
        setSection={setSettingsSection}
        preferences={preferences}
        setPreferences={setPreferences}
        rules={rules}
        setRules={setRules}
        appearance={appearance}
        setAppearance={setAppearance}
        notifications={notifications}
        setNotifications={setNotifications}
        security={security}
        setSecurity={setSecurity}
        onOpenProfile={onOpenProfile}
        onOpenCategoryModal={onOpenCategoryModal}
        onConfirmDanger={onConfirmDanger}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        allIncomes={allIncomes}
        allBills={allBills}
        allGoals={allGoals}
        realBalance={realBalance}
        user={user}
      />
    );
  }
  return null;
}

const viewCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  Dashboard: {
    eyebrow: "Dashboard",
    title: "Dashboard",
    description: "Hoje é 1º de maio de 2026.",
  },
  Entradas: {
    eyebrow: "Fluxo de dinheiro",
    title: "Entradas registradas",
    description: "Recebimentos do mês filtrado.",
  },
  Contas: {
    eyebrow: "Compromissos",
    title: "Contas do mês",
    description: "Filtre, acompanhe e marque pagamentos.",
  },
  Metas: {
    eyebrow: "Construção",
    title: "Metas financeiras",
    description: "Progresso de objetivos prioritários.",
  },
  "Objetivos do mês": {
    eyebrow: "Checklist",
    title: "Objetivos do mês",
    description: "Ações pequenas para reduzir carga mental.",
  },
  Planejamento: {
    eyebrow: "Próximo ciclo",
    title: "Planejamento",
    description: "Antecipe entradas, contas, reserva, metas e riscos do próximo mês.",
  },
  Relatórios: {
    eyebrow: "Análise",
    title: "Relatórios",
    description: "Resumo financeiro com gráficos simples e úteis.",
  },
  Configurações: {
    eyebrow: "Personalização",
    title: "Configurações",
    description: "Crie categorias com ícone e cor para contas e entradas.",
  },
};

export default function ReveeNorthApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authSession, setAuthSession] = useState<SupabaseSession | null>(null);
  const [cloudReady, setCloudReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("reveenorth:onboarding-complete") === "true"
      : false,
  );
  const [active, setActive] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountCreatedAt, setAccountCreatedAt] = useState(() => getAccountCreatedAt());
  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(getTodayKey()));
  const [bills, setBills] = useState<Bill[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [objectives, setObjectives] = useState<MonthlyObjective[]>([]);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [financeDetail, setFinanceDetail] = useState<FinanceDetail | null>(null);
  const [recommendationModalOpen, setRecommendationModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<FeedbackToast | null>(null);
  const [paymentBill, setPaymentBill] = useState<Bill | null>(null);
  const [realBalanceModalOpen, setRealBalanceModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [billCreateModalOpen, setBillCreateModalOpen] = useState(false);
  const [goalCreateModalOpen, setGoalCreateModalOpen] = useState(false);
  const [objectiveModalOpen, setObjectiveModalOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [northIaOpen, setNorthIaOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [settingsSection, setSettingsSection] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({
    firstName: "Daniela",
    lastName: "Escatalini",
    fullName: "Daniela Escatalini",
    email: "daniela@reveenorth.com",
    role: "Founder",
    plan: "Plano North",
  });
  const [realBalance, setRealBalance] = useState<RealBalance>({
    amount: 3200,
    date: getTodayKey(),
    note: "Saldo real informado manualmente.",
  });
  const [preferences, setPreferences] = useState<FinancePreferences>({
    currency: "BRL",
    financialMonthStart: 1,
    mainIncomeDay: 5,
    minimumReserve: 300,
    safetyAmount: 8000,
    personalLimit: 900,
    leisureLimit: 420,
    defaultGoal: "Reserva de emergencia",
    weekendIsBusinessDay: false,
  });
  const [rules, setRules] = useState<CalculatorRules>({
    bills: 50,
    reserve: 0,
    goals: 20,
    personal: 30,
    smartPriority: true,
  });
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "light",
    density: "Confortável",
    glass: true,
    shadows: true,
    animations: true,
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    dueSoon: true,
    overdue: true,
    goalProgress: true,
    freeMoneyLow: true,
    incomeReceived: true,
    weeklySummary: true,
    daysBeforeDue: 3,
    preferredTime: "09:00",
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    autoLock: true,
    confirmDelete: true,
    dataPrivacy: true,
    inactivityMinutes: 15,
  });

  const applyCloudState = (state: Partial<ReveeNorthCloudState>) => {
    const safeState = sanitizeLoadedState(state, accountCreatedAt);
    if (safeState.accountCreatedAt) {
      setAccountCreatedAt(safeState.accountCreatedAt);
      localStorage.setItem("reveenorth:account-created-at", safeState.accountCreatedAt);
    }
    if (safeState.user) setUser(safeState.user);
    if (safeState.realBalance) setRealBalance(safeState.realBalance);
    if (safeState.bills) {
      setBills((current) => preserveBillLogos(safeState.bills!, current));
    }
    if (safeState.incomes) setIncomes(safeState.incomes);
    if (safeState.goals) setGoals(safeState.goals);
    if (safeState.objectives) setObjectives(safeState.objectives);
    if (safeState.categories) setCategories(safeState.categories);
    if (safeState.preferences) setPreferences(safeState.preferences);
    if (safeState.rules) setRules(safeState.rules);
    if (safeState.notifications) setNotifications(safeState.notifications);
    if (safeState.security) setSecurity(safeState.security);
    if (typeof safeState.darkMode === "boolean") setDarkMode(safeState.darkMode);
    if (typeof safeState.sidebarCollapsed === "boolean") setSidebarCollapsed(safeState.sidebarCollapsed);
    if (safeState.selectedMonth) setSelectedMonth(safeState.selectedMonth);
    if (typeof safeState.onboardingComplete === "boolean") setOnboardingComplete(safeState.onboardingComplete);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("reveenorth:user");
    const savedBalance = localStorage.getItem("reveenorth:real-balance");
    const savedCategories = localStorage.getItem("reveenorth:categories");
    const savedState = localStorage.getItem("reveenorth:app-state");
    const savedOnboarding = localStorage.getItem("reveenorth:onboarding-complete");
    const savedLoggedIn = localStorage.getItem("reveenorth:logged-in");
    if (savedState) applyCloudState(JSON.parse(savedState) as ReveeNorthCloudState);
    if (savedUser) setUser(JSON.parse(savedUser) as UserProfile);
    if (savedBalance) setRealBalance(JSON.parse(savedBalance) as RealBalance);
    if (savedCategories) setCategories(JSON.parse(savedCategories) as Category[]);
    if (savedOnboarding === "true") setOnboardingComplete(true);
    if (savedLoggedIn === "true") setLoggedIn(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const storedSession = readSession();
      if (!storedSession) {
        if (mounted) {
          setAuthReady(true);
          setCloudReady(true);
        }
        return;
      }

      try {
        const session =
          storedSession.expires_at && storedSession.expires_at < Math.floor(Date.now() / 1000) + 60
            ? await refreshSession(storedSession)
            : storedSession;
        if (!mounted) return;
        setAuthSession(session);
        setLoggedIn(true);

        try {
          const cloudState = await loadCloudState<ReveeNorthCloudState>(session);
          if (cloudState && mounted) applyCloudState(cloudState);
        } catch {
          // If the Supabase table has not been created yet, keep the local data.
        }
      } catch {
        localStorage.removeItem("reveenorth:logged-in");
      } finally {
        if (mounted) {
          setAuthReady(true);
          setCloudReady(true);
        }
      }
    };
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("reveenorth:user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("reveenorth:real-balance", JSON.stringify(realBalance));
  }, [realBalance]);

  useEffect(() => {
    const merged = mergeDefaultCategories(categories);
    if (merged !== categories) {
      setCategories(merged);
      return;
    }
    localStorage.setItem("reveenorth:categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("reveenorth:account-created-at", accountCreatedAt);
    const options = buildMonthOptions(accountCreatedAt);
    if (!options.some((option) => option.value === selectedMonth)) {
      setSelectedMonth(monthKey(getTodayKey()));
    }
  }, [accountCreatedAt, selectedMonth]);

  useEffect(() => {
    setBills((current) => {
      const next = ensureFixedBillInstances(current, accountCreatedAt);
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [accountCreatedAt]);

  const cloudState = useMemo<ReveeNorthCloudState>(() => ({
    version: 1,
    onboardingComplete,
    selectedMonth,
    accountCreatedAt,
    user,
    realBalance,
    bills,
    incomes,
    goals,
    objectives,
    categories,
    preferences,
    rules,
    notifications,
    security,
    darkMode,
    sidebarCollapsed,
  }), [
    accountCreatedAt,
    bills,
    categories,
    darkMode,
    goals,
    incomes,
    notifications,
    objectives,
    onboardingComplete,
    preferences,
    realBalance,
    rules,
    security,
    selectedMonth,
    sidebarCollapsed,
    user,
  ]);

  useEffect(() => {
    localStorage.setItem("reveenorth:app-state", JSON.stringify(cloudState));
    if (!authSession || !cloudReady) return;
    const timeout = window.setTimeout(() => {
      saveCloudState(authSession, cloudState).catch(() => undefined);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [authSession, cloudReady, cloudState]);

  const persistCloudPatchNow = (patch: Partial<ReveeNorthCloudState>) => {
    const nextState = { ...cloudState, ...patch };
    localStorage.setItem("reveenorth:app-state", JSON.stringify(nextState));
    if (authSession && cloudReady) {
      saveCloudState(authSession, nextState).catch(() => undefined);
    }
  };

  const data = useMemo<MonthData>(() => {
    const selectedDate = new Date(`${selectedMonth}-01T12:00:00`);
    const previousDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() - 1,
      1,
    );
    const previousMonth = `${previousDate.getFullYear()}-${String(
      previousDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    return {
      selectedMonth,
      bills: buildVisibleBills(bills, selectedMonth),
      incomes: incomes.filter((income) => monthKey(income.receivedDate) === selectedMonth),
      goals,
      objectives: objectives.filter((objective) => objective.month === selectedMonth),
      previousBills: bills.filter((bill) => monthKey(bill.dueDate) === previousMonth),
      previousIncomes: incomes.filter((income) => monthKey(income.receivedDate) === previousMonth),
    };
  }, [bills, goals, incomes, objectives, selectedMonth]);

  const metrics = useMemo(() => buildMetrics(data), [data]);
  const achievements = useMemo(() => buildAchievements(data, metrics), [data, metrics]);
  const checkup = useMemo(() => buildMonthlyCheckup(data, metrics, goals), [data, goals, metrics]);
  const nextMonthAdvice = metrics.overdueBills.length
    ? "Para melhorar o próximo mês: quite as contas atrasadas primeiro e evite direcionar dinheiro para metas antes de resolver pendências."
    : "Para melhorar o próximo mês: mantenha o registro das entradas, proteja uma parte para o futuro e revise seus gastos flexíveis antes de novas compras.";
  const copy = viewCopy[active];
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const showFeedback = (title: string, message: string, kind: FeedbackToast["kind"] = "success") => {
    const toast = { id: Date.now(), title, message, kind };
    setFeedbackToast(toast);
    window.setTimeout(() => {
      setFeedbackToast((current) => (current?.id === toast.id ? null : current));
    }, 3000);
  };

  const handlePayBill = (id: number) => {
    setBills((current) =>
      current.map((bill) =>
        bill.id === id && bill.status !== "paga"
          ? (() => {
              const paidDate = getReferenceDate(selectedMonth);
              const lateDays = Math.max(0, daysBetween(bill.dueDate, paidDate));
              return {
              ...bill,
              status: "paga",
              paidDate,
              paidAmount: bill.expectedAmount,
              paidLateDays: lateDays,
              notes: bill.notes.includes("Registrado")
                ? bill.notes
                : `${bill.notes}${bill.notes ? " • " : ""}Registrado como pago${lateDays > 0 ? ` com ${lateDays} dia${lateDays === 1 ? "" : "s"} de atraso` : ""}`,
            };
          })()
          : bill,
      ),
    );
    showFeedback("Conta paga.", "Menos uma preocupação para este mês.");
  };

  const handleConfirmPayment = (
    id: number,
    paidAmount: number,
    paidDate: string,
    note: string,
  ) => {
    setBills((current) =>
      current.map((bill) =>
        bill.id === id
          ? (() => {
              const lateDays = Math.max(0, daysBetween(bill.dueDate, paidDate));
              return {
              ...bill,
              status: "paga",
              paidDate,
              paidAmount,
              paidLateDays: lateDays,
              notes: note
                ? `${bill.notes} • ${note}`
                : bill.notes.includes("Registrado")
                  ? bill.notes
                  : `${bill.notes}${bill.notes ? " • " : ""}Registrado como pago${lateDays > 0 ? ` com ${lateDays} dia${lateDays === 1 ? "" : "s"} de atraso` : ""}`,
            };
          })()
          : bill,
      ),
    );
    showFeedback("Conta paga.", "Menos uma preocupação para este mês.");
  };

  const handleSaveBill = (updatedBill: Bill) => {
    setBills((current) => {
      const nextBills = ensureFixedBillInstances(
        current.map((bill) => {
          const recurrenceId = updatedBill.recurrenceId ?? String(updatedBill.id);
          if (bill.id === updatedBill.id) {
            return normalizeBillStatus({
              ...updatedBill,
              recurrenceId: updatedBill.fixed ? recurrenceId : updatedBill.recurrenceId,
            });
          }
          if (!updatedBill.fixed && bill.recurrenceId === recurrenceId && bill.status !== "paga" && bill.dueDate > updatedBill.dueDate) {
            return { ...bill, fixed: false };
          }
          return bill;
        }),
        accountCreatedAt,
      );
      persistCloudPatchNow({ bills: nextBills });
      return nextBills;
    });
  };

  const handleDeleteBill = (id: number) => {
    setBills((current) => current.filter((bill) => bill.id !== id));
  };

  const handleCreateIncome = (income: Income) => {
    setIncomes((current) => [income, ...current]);
    showFeedback("Entrada registrada.", "Agora o North tem mais clareza para te orientar.");
  };

  const handleCreateBill = (bill: Bill) => {
    setBills((current) =>
      ensureFixedBillInstances(
        [
          normalizeBillStatus({
            ...bill,
            recurrenceId: bill.fixed ? bill.recurrenceId ?? String(bill.id) : bill.recurrenceId,
          }),
          ...current,
        ],
        accountCreatedAt,
      ),
    );
  };

  const handleSaveGoal = (goal: Goal) => {
    const isNew = !goals.some((item) => item.id === goal.id);
    setGoals((current) => {
      const exists = current.some((item) => item.id === goal.id);
      return exists
        ? current.map((item) => (item.id === goal.id ? goal : item))
        : [goal, ...current];
    });
    if (isNew) {
      showFeedback("Meta criada.", "Seu futuro acabou de ganhar direção.");
    }
  };

  const handleDeleteGoal = (id: number) => {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  };

  const handleDeleteIncome = (id: number) => {
    setIncomes((current) => current.filter((income) => income.id !== id));
  };

  const handleToggleObjective = (id: number) => {
    const objective = objectives.find((item) => item.id === id);
    setObjectives((current) =>
      current.map((objective) =>
        objective.id === id ? { ...objective, done: !objective.done } : objective,
      ),
    );
    if (objective && !objective.done) {
      showFeedback("Boa.", "Mais uma decisão organizada.");
    }
  };

  const handleRemoveObjective = (id: number) => {
    setObjectives((current) => current.filter((objective) => objective.id !== id));
  };

  const openSettings = (section?: string) => {
    setActive("Configurações");
    setSettingsSection(section ?? null);
  };

  const confirmDanger = (title: string, message: string, onConfirm?: () => void) => {
    setConfirmModal({ title, message, onConfirm: onConfirm ?? (() => undefined) });
  };

  const handleCompleteOnboarding = (answers: OnboardingData) => {
    localStorage.setItem("reveenorth:onboarding", JSON.stringify(answers));
    localStorage.setItem("reveenorth:onboarding-complete", "true");
    setPreferences((current) => ({
      ...current,
      minimumReserve: answers.hasReserve === "Sim" ? Math.max(300, answers.reserveAmount) : current.minimumReserve,
      defaultGoal: answers.priority || current.defaultGoal,
    }));
    if (answers.fixedExpenses.length) {
      const categoryMap: Record<string, string> = {
        Água: "Água",
        Alimentação: "Alimentação",
        Dívidas: "Dívidas",
      };
      const onboardBills = answers.fixedExpenses.map((expense, index) => ({
        id: Date.now() + index,
        name: expense.name,
        category: categoryMap[expense.category] ?? expense.category,
        dueDate: getReferenceDate(selectedMonth),
        expectedAmount: expense.amount,
        status: "pendente" as BillStatus,
        notes: "Criada no onboarding",
        fixed: expense.fixed,
        recurrenceId: expense.fixed ? `onboarding-${Date.now()}-${index}` : undefined,
      }));
      setBills((current) => ensureFixedBillInstances([...onboardBills, ...current], accountCreatedAt));
    }
    setOnboardingComplete(true);
  };

  const handleLogin = async (email: string, password: string, fullName?: string, startOnboarding = false) => {
    try {
      const session = startOnboarding
        ? await signUpWithPassword(email, password, fullName ?? "")
        : await signInWithPassword(email, password);

      if (!session) {
        return {
          ok: true,
          message: "Conta criada. Confira seu e-mail para confirmar o acesso antes de entrar.",
        };
      }

      setAuthSession(session);
      localStorage.setItem("reveenorth:logged-in", "true");
      if (startOnboarding) {
        const createdAt = getTodayKey();
        setAccountCreatedAt(createdAt);
        setSelectedMonth(monthKey(createdAt));
        setBills([]);
        setIncomes([]);
        setGoals([]);
        setObjectives([]);
        localStorage.setItem("reveenorth:account-created-at", createdAt);
        localStorage.removeItem("reveenorth:onboarding");
        localStorage.removeItem("reveenorth:onboarding-complete");
        setOnboardingComplete(false);
      } else {
        try {
          const remoteState = await loadCloudState<ReveeNorthCloudState>(session);
          if (remoteState) applyCloudState(remoteState);
        } catch {
          // Keeps local state when the cloud table is not ready yet.
        }
      }
      setUser((current) => {
        const cleanName = fullName?.trim() || (session.user.user_metadata?.full_name as string | undefined);
        const [firstName = current.firstName, ...lastParts] = cleanName
          ? cleanName.split(" ")
          : [current.firstName, current.lastName];
        return {
          ...current,
          email: session.user.email ?? email,
          fullName: cleanName || current.fullName,
          firstName,
          lastName: cleanName ? lastParts.join(" ") : current.lastName,
        };
      });
      setLoggedIn(true);
      setCloudReady(true);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Nao foi possivel acessar.",
      };
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordRecovery(email);
      return { ok: true, message: "Enviamos o link de recuperacao para seu e-mail." };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Nao foi possivel enviar o e-mail.",
      };
    }
  };

  const handleLogout = async () => {
    await signOut(authSession);
    setAuthSession(null);
    localStorage.removeItem("reveenorth:logged-in");
    setLoggedIn(false);
    setActive("Dashboard");
  };

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#efefef] text-[#211d19]">
        <div className="text-center">
          <BrandSymbol className="mx-auto h-12 w-12" />
          <p className="mt-4 text-sm font-bold text-[#756b62]">Carregando seu ReveeNorth...</p>
        </div>
      </main>
    );
  }

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} onResetPassword={handleResetPassword} />;
  }

  if (!onboardingComplete) {
    return <OnboardingFlow user={user} onComplete={handleCompleteOnboarding} />;
  }

  return (
    <main className={darkMode ? "dark app-shell min-h-[100svh] bg-[#050505] text-white" : "min-h-[100svh]"}>
      <Sidebar
        active={active}
        setActive={setActive}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenSettings={openSettings}
        onConfirmLogout={() =>
          setConfirmModal({
            title: "Sair do ReveeNorth",
            message: "Deseja encerrar esta sessão visual? Nenhum dado real será perdido.",
            onConfirm: handleLogout,
          })
        }
      />
      <section
        className={`min-h-[100svh] px-3 py-4 pt-20 transition-all duration-300 sm:px-4 lg:px-6 lg:pt-6 ${
          sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[280px]"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <header className="app-page-header relative z-30 mb-4 flex flex-col gap-4 rounded-[28px] border border-[var(--line)] bg-white/28 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505] dark:backdrop-blur-none sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d75c27]">
                {copy.eyebrow}
              </p>
              <h1 className="mt-1 text-[1.55rem] font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
                {active === "Dashboard" ? `${greeting}, ${user.firstName}.` : copy.title}
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--muted)]">
                {active === "Dashboard" ? `Hoje é ${todayDisplayLabel()}.` : copy.description}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
              <MonthFilter
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                accountCreatedAt={accountCreatedAt}
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationMenuOpen((current) => !current)}
                  className="app-top-control rounded-2xl border border-[var(--line)] bg-white/72 p-2.5 text-[var(--foreground)] shadow-sm backdrop-blur-xl transition hover:bg-white dark:bg-[#050505]"
                  aria-label="Notificações"
                >
                  <Bell className="h-4.5 w-4.5" />
                </button>
                {notificationMenuOpen ? (
                  <div className="app-popover absolute right-0 top-14 z-[130] w-80 max-w-[calc(100vw-1.5rem)] rounded-[28px] border border-white/70 bg-[#f5f2ef]/98 p-4 text-[#211d19] shadow-2xl backdrop-blur-2xl dark:border-white/12 dark:bg-[#050505] dark:text-white">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d75c27]">
                      Notificações
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        ["Energia vence em breve", "Priorize pagar para evitar juros."],
                        ["R$ 1.670 livre para decidir", "Você pode direcionar para reserva ou contas."],
                      ].map(([title, text]) => (
                        <div key={title} className="app-muted-surface rounded-2xl bg-white/72 p-3 dark:bg-[#080808]">
                          <p className="text-sm font-extrabold">{title}</p>
                          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNewMenuOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-[22px] bg-[#d75c27] px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-[#d75c27]/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:px-5 sm:py-3"
                >
                  <Plus className="h-4 w-4" />
                  Novo
                </button>
                {newMenuOpen ? (
                  <div className="app-popover absolute right-0 top-14 z-[120] w-72 max-w-[calc(100vw-1.5rem)] rounded-[28px] border border-white/70 bg-[#f5f2ef]/98 p-3 shadow-2xl backdrop-blur-2xl dark:border-white/12 dark:bg-[#050505]">
                    {[
                      [ArrowDownLeft, "Nova entrada", () => setIncomeModalOpen(true)],
                      [ReceiptText, "Nova despesa", () => {
                        setActive("Contas");
                        setBillCreateModalOpen(true);
                      }],
                      [Target, "Nova meta", () => {
                        setActive("Metas");
                        setGoalCreateModalOpen(true);
                      }],
                      [Flag, "Novo objetivo", () => {
                        setActive("Objetivos do mês");
                        setObjectiveModalOpen(true);
                      }],
                    ].map(([Icon, label, action]) => {
                      const MenuIcon = Icon as React.ElementType;
                      return (
                      <button
                        key={label as string}
                        type="button"
                        onClick={() => {
                          (action as () => void)();
                          setNewMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-3xl px-3.5 py-3 text-left text-sm font-semibold text-[var(--foreground)] transition hover:bg-[#211d19]/6 dark:hover:bg-white/8 sm:gap-4 sm:px-4 sm:py-4 sm:text-base"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#211d19]/6 text-[#211d19] dark:bg-white/10 dark:text-white">
                          <MenuIcon className="h-4.5 w-4.5" />
                        </span>
                        {label as string}
                      </button>
                    );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <ActiveView
            active={active}
            data={data}
            metrics={metrics}
            onStartPayment={setPaymentBill}
            onOpenBill={setSelectedBill}
            categories={categories}
            setCategories={setCategories}
            settingsSection={settingsSection}
            setSettingsSection={setSettingsSection}
            preferences={preferences}
            setPreferences={setPreferences}
            rules={rules}
            setRules={setRules}
            appearance={appearance}
            setAppearance={setAppearance}
            notifications={notifications}
            setNotifications={setNotifications}
            security={security}
            setSecurity={setSecurity}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenCategoryModal={() => setCategoryModalOpen(true)}
            onConfirmDanger={confirmDanger}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            realBalance={realBalance}
            onOpenRealBalance={() => setRealBalanceModalOpen(true)}
            onOpenFinanceDetail={setFinanceDetail}
            onOpenRecommendation={() => setRecommendationModalOpen(true)}
            onOpenDataSettings={() => openSettings("dados")}
            onOpenIncome={setSelectedIncome}
            onOpenGoal={setSelectedGoal}
            onNewGoal={() => setGoalCreateModalOpen(true)}
            onToggleObjective={handleToggleObjective}
            onRemoveObjective={handleRemoveObjective}
            onNewObjective={() => setObjectiveModalOpen(true)}
            allIncomes={incomes}
            allBills={bills}
            allGoals={goals}
            user={user}
          />
        </div>
      </section>
      {selectedBill ? (
        <AccountModal
          bill={selectedBill}
          categories={categories}
          onClose={() => setSelectedBill(null)}
          onSave={handleSaveBill}
          onDelete={handleDeleteBill}
          onPay={handlePayBill}
        />
      ) : null}
      {financeDetail ? (
        <FinanceDetailModal
          detail={financeDetail}
          onClose={() => setFinanceDetail(null)}
        />
      ) : null}
      {recommendationModalOpen && metrics.urgent ? (
        <Modal title="Por que essa recomendação?" onClose={() => setRecommendationModalOpen(false)}>
          <div className="space-y-4">
            <div className="rounded-[26px] border border-[var(--line)] bg-white/45 p-5 dark:bg-white/6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d75c27]">
                Próxima ação
              </p>
              <h3 className="mt-2 text-2xl font-black">Pagar {metrics.urgent.name}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">
                {metrics.urgent.name} é uma conta {metrics.urgent.essential ? "essencial" : "do mês"}.
                Ela está com status <strong>{metrics.urgent.status}</strong> e vence em {formatDate(metrics.urgent.dueDate)}.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Tipo da conta", metrics.urgent.category],
                ["Status", metrics.urgent.status],
                ["Vencimento", formatDate(metrics.urgent.dueDate)],
                ["Impacto", metrics.urgent.status === "atrasada" ? "Reduz risco de juros e carga mental." : "Protege o planejamento do mês."],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#211d19]/5 p-4 dark:bg-white/7">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
                  <p className="mt-2 text-sm font-extrabold">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPaymentBill(metrics.urgent!);
                  setRecommendationModalOpen(false);
                }}
                className="rounded-2xl bg-[#d75c27] px-5 py-3 text-xs font-extrabold text-white"
              >
                Marcar como paga
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
      {incomeModalOpen ? (
        <IncomeModal
          categories={categories}
          selectedMonth={selectedMonth}
          onClose={() => setIncomeModalOpen(false)}
          onCreate={handleCreateIncome}
        />
      ) : null}
      {selectedIncome ? (
        <IncomeDetailModal
          income={selectedIncome}
          onClose={() => setSelectedIncome(null)}
          onDelete={handleDeleteIncome}
        />
      ) : null}
      {billCreateModalOpen ? (
        <BillModalCreate
          categories={categories}
          selectedMonth={selectedMonth}
          onClose={() => setBillCreateModalOpen(false)}
          onCreate={handleCreateBill}
        />
      ) : null}
      {selectedGoal ? (
        <GoalModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onSave={handleSaveGoal}
          onDelete={handleDeleteGoal}
        />
      ) : null}
      {goalCreateModalOpen ? (
        <GoalModal
          goal={{
            id: Date.now(),
            name: "Nova meta",
            target: 0,
            current: 0,
            deadline: `${selectedMonth}-28`,
            priority: "Media",
            note: "",
          }}
          onClose={() => setGoalCreateModalOpen(false)}
          onSave={handleSaveGoal}
          onDelete={handleDeleteGoal}
        />
      ) : null}
      {objectiveModalOpen ? (
        <ObjectiveModal
          selectedMonth={selectedMonth}
          onClose={() => setObjectiveModalOpen(false)}
          onCreate={(objective) => setObjectives((current) => [objective, ...current])}
        />
      ) : null}
      {paymentBill ? (
        <PaymentModal
          bill={paymentBill}
          onClose={() => setPaymentBill(null)}
          onConfirm={handleConfirmPayment}
        />
      ) : null}
      {realBalanceModalOpen ? (
        <RealBalanceModal
          balance={realBalance}
          onClose={() => setRealBalanceModalOpen(false)}
          onSave={setRealBalance}
        />
      ) : null}
      {profileModalOpen ? (
        <ProfileModal
          user={user}
          onClose={() => setProfileModalOpen(false)}
          onSave={setUser}
        />
      ) : null}
      {categoryModalOpen ? (
        <CategoryModal
          onClose={() => setCategoryModalOpen(false)}
          onCreate={(category) => setCategories((current) => [...current, category])}
        />
      ) : null}
      {confirmModal ? (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
        />
      ) : null}
      <NorthIADrawer
        open={northIaOpen}
        onClose={() => setNorthIaOpen(false)}
        onToggle={() => setNorthIaOpen((current) => !current)}
        checkup={checkup}
        metrics={metrics}
        nextMonthAdvice={nextMonthAdvice}
      />
      {feedbackToast ? <FeedbackToastView toast={feedbackToast} /> : null}
    </main>
  );
}
