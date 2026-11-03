import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {sum,monthKey,daysBetween} from '../lib/data.ts';
const source=fs.readFileSync(new URL('../components/ReveeNorthApp.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('app.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const names=new Set(['saleReceivedTotal','saleOpenTotal','buildBusinessMonthData','buildBusinessMetrics','buildVisibleBills','normalizeBillStatus','daysOverdue','isBillOverdue','sortByPaymentPriority','addMonths','endOfYearMonth','monthDistance','monthsRemainingInYear','buildMetrics','buildMonthDataFromLists','buildPeriodMonthData','buildMonthRange','isPaidLate','paidLateDays','normalizeCategoryName','isShortTermRdbMovement','nextDueDateForMonth']);
const snippets=[];
function visit(n){if(ts.isFunctionDeclaration(n)&&names.has(n.name?.text))snippets.push(n.getText(ast));if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='buildInstallments')snippets.push(`var buildInstallments=${n.initializer.getText(ast)};`);ts.forEachChild(n,visit);}
visit(ast);
export const c={sum,monthKey,daysBetween,getTodayKey:()=> '2026-11-02'};
vm.createContext(c);vm.runInContext(ts.transpileModule(snippets.join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,c);
const bill=(id,dueDate,paidDate,amount)=>({id,name:'Conta',dueDate,paidDate,status:paidDate?'paga':'pendente',expectedAmount:amount,paidAmount:paidDate?amount:undefined});
const emptyBusiness=()=>({sales:[],expenses:[],payroll:[],investments:[],settings:{annualRevenueGoal:10000}});
test('business expenses follow payment date, not due date',()=>{
 const business=emptyBusiness();business.expenses=[bill(1,'2026-10-10','2026-11-01',120),bill(2,'2026-11-10','2026-12-01',80)];
 assert.equal(c.buildBusinessMetrics(business,'2026-10').expensesPaid,0);
 assert.equal(c.buildBusinessMetrics(business,'2026-11').expensesPaid,120);
 assert.equal(c.buildBusinessMetrics(business,'2026-12').expensesPaid,80);
});
test('card money entered is already net of its fee and is not charged twice',()=>{
 const business=emptyBusiness();business.sales=[{closedAmount:1000,receivedAmount:970,cardFee:30,paymentMethod:'Cartão de crédito',closedDate:'2026-11-01',receivedDate:'2026-11-01',installments:[]}];
 const m=c.buildBusinessMetrics(business,'2026-11');assert.equal(m.received,970);assert.equal(m.fees,30);assert.equal(m.netRevenue,970);assert.equal(m.profit,970);assert.equal(m.open,0);
});
test('partially received installments only leave their remaining amount open',()=>{
 const business=emptyBusiness();business.sales=[{closedAmount:100,receivedAmount:0,cardFee:0,paymentMethod:'Boleto',closedDate:'2026-10-01',installments:[{amount:100,received:true,receivedAmount:40,receivedDate:'2026-11-01',dueDate:'2026-11-01'}]}];
 const m=c.buildBusinessMetrics(business,'2026-11');assert.equal(m.received,40);assert.equal(m.open,60);
});
test('installments preserve every cent and clamp invalid month-end dates',()=>{
 const rows=c.buildInstallments(3,100,'2026-01-31');
 assert.deepEqual(Array.from(rows,x=>x.amount),[33.34,33.33,33.33]);assert.equal(rows[1].dueDate,'2026-02-28');assert.equal(sum(rows,x=>Math.round(x.amount*100)),10000);
});
test('personal monthly and period totals agree with independent cash-flow arithmetic',()=>{
 const incomes=[{amount:1000,receivedDate:'2026-10-01'},{amount:500,receivedDate:'2026-11-01'}];
 const bills=[bill(1,'2026-09-10','2026-10-01',120),bill(2,'2026-10-10','2026-11-01',80),bill(3,'2026-11-10',undefined,50)];
 const expenses=[{name:'Mercado',category:'Mercado',amount:40,date:'2026-10-01'},{name:'Aplicacao RDB',category:'Outros',amount:100,date:'2026-10-01'},{name:'Mercado',category:'Mercado',amount:10,date:'2026-11-01'},{name:'Duplicado',amount:25,date:'2026-11-01',ignored:true}];
 const october=c.buildMetrics(c.buildMonthDataFromLists('2026-10',incomes,bills,[],[],expenses));
 const november=c.buildMetrics(c.buildMonthDataFromLists('2026-11',incomes,bills,[],[],expenses));
 assert.equal(october.totalOut,160);assert.equal(november.totalOut,90);assert.equal(november.projectedBalance,360);assert.equal(november.spendingDelta,-44);
 const period=c.buildMetrics(c.buildPeriodMonthData('2026-10','2026-11',incomes,bills,[],expenses));
 assert.equal(period.totalIncome,1500);assert.equal(period.totalOut,250);assert.equal(period.totalIncome,october.totalIncome+november.totalIncome);
});
