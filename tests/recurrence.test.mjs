import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { monthKey, daysBetween } from '../lib/data.ts';

// Exercise the actual component functions without mounting React or touching live data.
const source = fs.readFileSync(new URL('../components/ReveeNorthApp.tsx', import.meta.url), 'utf8');
const ast = ts.createSourceFile('app.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const names = new Set(['addMonths', 'monthDistance', 'daysOverdue', 'isBillOverdue', 'normalizeBillStatus', 'sortByPaymentPriority', 'nextDueDateForMonth', 'fixedRepeatEndMonth', 'billRecurrenceKey', 'stopBillRecurrenceFromMonth', 'removeBillsAndFutureRepeats', 'ensureFixedBillInstances']);
let snippets = [];
function visit(node) {
  if (ts.isFunctionDeclaration(node) && names.has(node.name?.text)) snippets.push(node.getText(ast));
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'handleSaveBill') snippets.push(`var handleSaveBill = ${node.initializer.getText(ast)};`);
  ts.forEachChild(node, visit);
}
visit(ast);
const js = ts.transpileModule(snippets.join('\n'), {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
function app(bills) {
  const context = { monthKey, daysBetween, getTodayKey: () => '2026-10-29', workspaceMode:'personal', accountCreatedAt:'2026-01-01', bills:structuredClone(bills), persistCloudPatchNow: () => {} };
  context.setBills = callback => { context.bills = callback(context.bills); };
  vm.createContext(context); vm.runInContext(js, context);
  return context;
}
const root = {id:1, name:'Nova despesa', category:'Esporte', dueDate:'2026-09-10', expectedAmount:150, status:'paga', paidDate:'2026-09-12', paidAmount:160, paidLateDays:2, fixed:true, repeatMonths:'indefinido', recurrenceId:'1', notes:''};
const child = { ...root, id:2, generatedFromId:1, dueDate:'2026-10-10', status:'pendente', paidDate:undefined, paidAmount:undefined, paidLateDays:undefined };

test('editing recurring name preserves past payments and individual future amounts, including after reload', () => {
 const future = {...child,id:3,dueDate:'2026-11-10',expectedAmount:180};
 const paidFuture = {...child,id:4,dueDate:'2026-12-10',status:'paga',paidAmount:170};
 const a=app([root,child,future,paidFuture]);
 a.handleSaveBill({...child,name:'Futebol',logoUrl:'new-logo'});
 assert.equal(a.bills.find(b=>b.id===1).name,root.name);
 assert.equal(a.bills.find(b=>b.id===1).paidAmount,160);
 assert.equal(a.bills.find(b=>b.id===3).name,'Futebol');
 assert.equal(a.bills.find(b=>b.id===3).expectedAmount,180);
 assert.equal(a.bills.find(b=>b.id===4).name,paidFuture.name);
 const reloaded=app(JSON.parse(JSON.stringify(a.bills)));
 const generated=reloaded.ensureFixedBillInstances(reloaded.bills,'2026-01-01');
 const jan=generated.find(b=>b.dueDate==='2027-01-10');
 assert.equal(jan.name,'Futebol'); assert.equal(jan.logoUrl,'new-logo');
 assert.equal(jan.paidAmount,undefined); assert.equal(jan.paidLateDays,undefined);
 assert.equal(generated.length,a.bills.length);
});
test('shortening repetition on a generated month does not regenerate deleted future months',()=>{
 const a=app([root,child]); a.handleSaveBill({...child,repeatMonths:2});
 assert.deepEqual(Array.from(a.bills,b=>b.dueDate).sort(),['2026-09-10','2026-10-10','2026-11-10']);
});
test('stopping and deleting recurrence preserves earlier paid history',()=>{
 const a=app([root,child]); a.handleSaveBill({...child,fixed:false});
 assert.equal(a.bills.length,2); assert.equal(a.bills.find(b=>b.id===1).paidAmount,160);
 const b=app([root,child]); const result=b.removeBillsAndFutureRepeats(b.bills,[2],'2026-01-01');
 assert.equal(result.length,1); assert.equal(result[0].id,1);
});
test('month-end repetition clamps days and does not duplicate existing instances',()=>{
 const a=app([{...root,dueDate:'2026-08-31'}]);
 const once=a.ensureFixedBillInstances(a.bills,'2026-01-01');
 assert.ok(once.some(b=>b.dueDate==='2026-09-30'));
 assert.equal(a.ensureFixedBillInstances(once,'2026-01-01').length,once.length);
});
test('loading never restores the persisted navigation month or deletes football bills',()=>{
 assert.ok(!source.includes('setSelectedMonth(safeState.selectedMonth)'));
 assert.ok(!source.includes('cleanupStuckFootballBillsOnce'));
});

test('bill summary counts payments in their payment month, including old debts paid now',()=>{
 const billsView=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='BillsView');
 const variables=new Set(['pendingOrOverdueBills','paidThisMonth','totalPaid','totalMissing','totalOverall']);
 const snippets=[];
 function scan(n){if(ts.isVariableDeclaration(n)&&variables.has(n.name.getText(ast)))snippets.push(`var ${n.getText(ast)};`);ts.forEachChild(n,scan);}
 scan(billsView);
 const c={bills:[{id:1,status:'paga',expectedAmount:100,paidAmount:110},{id:2,status:'pendente',expectedAmount:50}],paymentHistoryBills:[{id:3,status:'paga',expectedAmount:200,paidAmount:220}],sum:(rows,fn)=>rows.reduce((n,r)=>n+fn(r),0)};
 vm.createContext(c);vm.runInContext(ts.transpileModule(snippets.join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,c);
 assert.equal(c.totalPaid,220);assert.equal(c.totalMissing,50);assert.equal(c.totalOverall,270);
 assert.equal(c.paidThisMonth.length+c.pendingOrOverdueBills.length,2);
});
