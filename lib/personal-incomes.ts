import type { Income } from "./data";

// Older imports also stored payroll-derived incomes in the personal list.
// Prefer the live payroll entry by identity, never by date/amount alone.
export function mergePersonalIncomes(stored: Income[], payroll: Income[]): Income[] {
  const payrollIds = new Set(payroll.map((income) => income.linkedBusinessPayrollId));
  const incomeIds = new Set(payroll.map((income) => income.id));
  return [
    ...stored.filter((income) =>
      !incomeIds.has(income.id) &&
      !(income.linkedBusinessPayrollId !== undefined && payrollIds.has(income.linkedBusinessPayrollId)),
    ),
    ...payroll,
  ];
}
