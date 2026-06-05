export type BillStatus = "pendente" | "paga" | "atrasada";
export type Priority = "Alta" | "Media" | "Baixa";

export type Bill = {
  id: number;
  name: string;
  category: string;
  logoUrl?: string;
  dueDate: string;
  expectedAmount: number;
  status: BillStatus;
  paidDate?: string;
  paidAmount?: number;
  notes: string;
  essential?: boolean;
  debt?: boolean;
  fixed?: boolean;
  repeatMonths?: number | "indefinido";
};

export type Income = {
  id: number;
  name: string;
  receivedDate: string;
  amount: number;
  source: string;
  category: string;
  note: string;
};

export type Goal = {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  priority: Priority;
  note?: string;
};

export type MonthlyObjective = {
  id: number;
  month: string;
  title: string;
  done: boolean;
};

export type SuggestionItem = {
  label: string;
  amount: number;
  detail: string;
  billIds?: number[];
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "conta" | "entrada" | "meta";
  description?: string;
  active: boolean;
};

export const initialCategories: Category[] = [
  { id: 1, name: "Moradia", icon: "Home", color: "#d75c27", type: "conta", active: true },
  { id: 2, name: "Luz", icon: "Zap", color: "#f2a23a", type: "conta", active: true },
  { id: 3, name: "Agua", icon: "Droplets", color: "#4f8fd8", type: "conta", active: true },
  { id: 4, name: "Internet", icon: "Wifi", color: "#8a6dd8", type: "conta", active: true },
  { id: 5, name: "Dividas", icon: "CreditCard", color: "#d94836", type: "conta", active: true },
  { id: 6, name: "Alimentacao", icon: "ShoppingCart", color: "#2f9f73", type: "conta", active: true },
  { id: 7, name: "Pessoal", icon: "Sparkles", color: "#c56a37", type: "conta", active: true },
  { id: 8, name: "Salário mensal", icon: "Wallet", color: "#2f9f73", type: "entrada", active: true },
  { id: 9, name: "Renda extra", icon: "Briefcase", color: "#d75c27", type: "entrada", active: true },
  { id: 10, name: "Bônus", icon: "Gift", color: "#4f8fd8", type: "entrada", active: true },
  { id: 11, name: "Reserva", icon: "PiggyBank", color: "#d75c27", type: "meta", active: true },
  { id: 12, name: "Viagem", icon: "Target", color: "#8a6dd8", type: "meta", active: true },
];

export const initialIncomes: Income[] = [
  {
    id: 1,
    name: "Salario mensal",
    receivedDate: "2026-04-05",
    amount: 5000,
    source: "Salário mensal",
    category: "Salário mensal",
    note: "Entrada principal",
  },
  {
    id: 2,
    name: "Renda Extra",
    receivedDate: "2026-04-18",
    amount: 520,
    source: "Renda extra",
    category: "Renda extra",
    note: "Ajustes de identidade visual",
  },
  {
    id: 3,
    name: "Salario mensal",
    receivedDate: "2026-05-05",
    amount: 5200,
    source: "Salário mensal",
    category: "Salário mensal",
    note: "Entrada principal do mes",
  },
  {
    id: 4,
    name: "Renda Extra",
    receivedDate: "2026-05-18",
    amount: 850,
    source: "Renda extra",
    category: "Renda extra",
    note: "Design de landing page",
  },
  {
    id: 5,
    name: "Bônus",
    receivedDate: "2026-05-22",
    amount: 240,
    source: "Bônus",
    category: "Bônus",
    note: "Bonificação recebida",
  },
  {
    id: 6,
    name: "Salario mensal",
    receivedDate: "2026-06-05",
    amount: 5300,
    source: "Salário mensal",
    category: "Salário mensal",
    note: "Planejamento futuro",
  },
];

export const initialBills: Bill[] = [
  {
    id: 1,
    name: "Aluguel",
    category: "Moradia",
    dueDate: "2026-04-10",
    expectedAmount: 1450,
    status: "paga",
    paidDate: "2026-04-06",
    paidAmount: 1450,
    notes: "Pago no inicio do mes",
    essential: true,
  },
  {
    id: 2,
    name: "Energia",
    category: "Luz",
    dueDate: "2026-04-22",
    expectedAmount: 184,
    status: "paga",
    paidDate: "2026-04-20",
    paidAmount: 184,
    notes: "Consumo menor",
    essential: true,
  },
  {
    id: 3,
    name: "Cartao de credito",
    category: "Dividas",
    dueDate: "2026-04-06",
    expectedAmount: 760,
    status: "paga",
    paidDate: "2026-04-05",
    paidAmount: 760,
    notes: "Fatura fechada",
    debt: true,
  },
  {
    id: 4,
    name: "Aluguel",
    category: "Moradia",
    dueDate: "2026-05-10",
    expectedAmount: 1450,
    status: "paga",
    paidDate: "2026-05-06",
    paidAmount: 1450,
    notes: "Pago no inicio do mes",
    essential: true,
  },
  {
    id: 5,
    name: "Energia",
    category: "Luz",
    dueDate: "2026-05-23",
    expectedAmount: 210,
    status: "atrasada",
    notes: "Priorizar para evitar juros",
    essential: true,
  },
  {
    id: 6,
    name: "Agua",
    category: "Agua",
    dueDate: "2026-05-26",
    expectedAmount: 78,
    status: "atrasada",
    notes: "Conta essencial atrasada",
    essential: true,
  },
  {
    id: 7,
    name: "Internet",
    category: "Internet",
    dueDate: "2026-05-30",
    expectedAmount: 139,
    status: "pendente",
    notes: "Venceu recentemente",
    essential: true,
  },
  {
    id: 8,
    name: "Cartao de credito",
    category: "Dividas",
    dueDate: "2026-05-28",
    expectedAmount: 940,
    status: "pendente",
    notes: "Fatura com juros altos se atrasar",
    debt: true,
  },
  {
    id: 9,
    name: "Mercado",
    category: "Alimentacao",
    dueDate: "2026-05-12",
    expectedAmount: 680,
    status: "paga",
    paidDate: "2026-05-11",
    paidAmount: 654,
    notes: "Compra do mes",
    essential: true,
  },
  {
    id: 10,
    name: "Assinaturas",
    category: "Pessoal",
    dueDate: "2026-05-18",
    expectedAmount: 96,
    status: "paga",
    paidDate: "2026-05-18",
    paidAmount: 96,
    notes: "Revisar no proximo mes",
  },
  {
    id: 11,
    name: "Aluguel",
    category: "Moradia",
    dueDate: "2026-06-10",
    expectedAmount: 1450,
    status: "pendente",
    notes: "Planejado para junho",
    essential: true,
  },
  {
    id: 12,
    name: "Internet",
    category: "Internet",
    dueDate: "2026-06-03",
    expectedAmount: 139,
    status: "pendente",
    notes: "Vence nos proximos dias",
    essential: true,
  },
  {
    id: 13,
    name: "Cartao de credito",
    category: "Dividas",
    dueDate: "2026-06-06",
    expectedAmount: 820,
    status: "pendente",
    notes: "Previsao de fatura",
    debt: true,
  },
  {
    id: 14,
    name: "Mercado",
    category: "Alimentacao",
    dueDate: "2026-06-12",
    expectedAmount: 700,
    status: "pendente",
    notes: "Separar envelope do mes",
    essential: true,
  },
];

export const initialGoals: Goal[] = [
  {
    id: 1,
    name: "Reserva de emergencia",
    target: 8000,
    current: 3150,
    deadline: "2026-12-31",
    priority: "Alta",
  },
  {
    id: 2,
    name: "Viagem de julho",
    target: 2600,
    current: 980,
    deadline: "2026-07-10",
    priority: "Media",
  },
  {
    id: 3,
    name: "Curso profissional",
    target: 1200,
    current: 420,
    deadline: "2026-08-15",
    priority: "Baixa",
  },
];

export const initialObjectives: MonthlyObjective[] = [
  { id: 1, month: "2026-05", title: "Pagar contas atrasadas", done: false },
  { id: 2, month: "2026-05", title: "Guardar R$ 300", done: true },
  { id: 3, month: "2026-05", title: "Reduzir delivery", done: false },
  { id: 4, month: "2026-05", title: "Separar dinheiro para mercado", done: true },
  { id: 5, month: "2026-06", title: "Reservar aluguel antes do dia 5", done: false },
  { id: 6, month: "2026-06", title: "Guardar R$ 400", done: false },
  { id: 7, month: "2026-06", title: "Planejar mercado do mes", done: false },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));

export const monthKey = (date: string) => date.slice(0, 7);

export const sum = <T,>(items: T[], getValue: (item: T) => number) =>
  items.reduce((total, item) => total + getValue(item), 0);

export const daysBetween = (from: string, to: string) => {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
};

const pendingAmount = (items: Bill[]) =>
  sum(items, (bill) => bill.expectedAmount);

export function calculateSuggestion(
  entryAmount: number,
  monthBills: Bill[],
  allGoals: Goal[],
  referenceDate: string,
): SuggestionItem[] {
  const overdue = monthBills.filter((bill) => bill.status === "atrasada");
  const nextSevenDays = monthBills.filter((bill) => {
    const days = daysBetween(referenceDate, bill.dueDate);
    return bill.status === "pendente" && days >= 0 && days <= 7;
  });
  const nextSevenIds = new Set(nextSevenDays.map((bill) => bill.id));
  const essentials = monthBills.filter(
    (bill) =>
      bill.status === "pendente" && bill.essential && !nextSevenIds.has(bill.id),
  );
  const debts = monthBills.filter(
    (bill) =>
      bill.status === "pendente" &&
      bill.debt &&
      !nextSevenIds.has(bill.id),
  );
  const topGoal =
    allGoals.find((goal) => goal.priority === "Alta") ?? allGoals[0];

  let remaining = entryAmount;
  const use = (wanted: number) => {
    const amount = Math.max(0, Math.min(remaining, wanted));
    remaining -= amount;
    return amount;
  };

  const overdueAmount = use(pendingAmount(overdue));
  const essentialAmount = use(pendingAmount(essentials));
  const nextAmount = use(pendingAmount(nextSevenDays));
  const debtAmount = use(pendingAmount(debts));
  const reserveAmount = use(entryAmount * (overdue.length ? 0.06 : 0.1));
  const goalAmount = use(
    Math.min(entryAmount * 0.1, Math.max(0, topGoal.target - topGoal.current)),
  );

  return [
    {
      label: "Contas atrasadas",
      amount: overdueAmount,
      detail: `${overdue.length} pendencia(s) com prioridade maxima`,
      billIds: overdue.map((bill) => bill.id),
    },
    {
      label: "Essenciais do mes",
      amount: essentialAmount,
      detail: "Moradia, agua, luz, internet e transporte",
      billIds: essentials.map((bill) => bill.id),
    },
    {
      label: "Vencem em ate 7 dias",
      amount: nextAmount,
      detail: `${nextSevenDays.length} conta(s) perto do vencimento`,
      billIds: nextSevenDays.map((bill) => bill.id),
    },
    {
      label: "Dividas",
      amount: debtAmount,
      detail: "Evitar juros antes de distribuir sobra",
      billIds: debts.map((bill) => bill.id),
    },
    {
      label: "Reserva",
      amount: reserveAmount,
      detail: overdue.length ? "Ajustada por existir atraso" : "Regra base de 10%",
    },
    {
      label: "Meta principal",
      amount: goalAmount,
      detail: topGoal.name,
    },
    {
      label: "Livre para uso",
      amount: Math.max(0, remaining),
      detail: "Sobra depois das prioridades",
    },
  ];
}
