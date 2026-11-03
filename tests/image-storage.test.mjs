import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {writeLocalCache} from '../lib/browser-storage.ts';
afterEach(()=>{delete globalThis.localStorage;delete globalThis.window;});
test('full browser storage preserves previous data and allows execution to continue',()=>{
 const saved=new Map([['reveenorth:app-state','previous']]);let notified=0;
 globalThis.localStorage={setItem(){throw new DOMException('Full','QuotaExceededError');},getItem:key=>saved.get(key)};
 globalThis.window={dispatchEvent(){notified++;}};
 assert.equal(writeLocalCache('reveenorth:app-state','new'),false);
 assert.equal(saved.get('reveenorth:app-state'),'previous');assert.equal(notified,1);
});
test('successful cache write reports success',()=>{
 let value;globalThis.localStorage={setItem(k,v){value=v;}};
 assert.equal(writeLocalCache('state','new'),true);assert.equal(value,'new');
});
const source=fs.readFileSync(new URL('../components/ReveeNorthApp.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('app.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const fn=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='readFileAsDataUrl');
function decoder(valid=true,canvasAvailable=true){
 let dimensions;
 const c={FileReader:class {readAsDataURL(){this.result='raw-large-file';this.onload();}}, Image:class {width=4000;height=2000;set src(v){valid?this.onload():this.onerror();}},document:{createElement(){return {getContext(){return canvasAvailable?{drawImage(...args){dimensions=args.slice(3);}}:null;},toDataURL(type){assert.equal(type,'image/webp');return 'compressed';}};}}};
 vm.createContext(c);vm.runInContext(ts.transpileModule(fn.getText(ast),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,c);
 return {...c,dimensions:()=>dimensions};
}
test('photos are resized before storage',async()=>{
 const c=decoder();assert.equal(await c.readFileAsDataUrl({type:'image/png',size:1000}),'compressed');assert.deepEqual(c.dimensions(),[320,160]);
});
test('invalid, oversized and undecodable images are rejected without storing the original',async()=>{
 await assert.rejects(decoder().readFileAsDataUrl({type:'text/plain',size:1}),/imagem/);
 await assert.rejects(decoder().readFileAsDataUrl({type:'image/png',size:11*1024*1024}),/10 MB/);
 await assert.rejects(decoder(false).readFileAsDataUrl({type:'image/png',size:1}),/Imagem inválida/);
 await assert.rejects(decoder(true,false).readFileAsDataUrl({type:'image/png',size:1}),/preparar/);
});
