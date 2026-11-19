const fs=require('node:fs');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const slug='insights/strawberry-runner-propagation-plugs/';
const locales=[['','en'],['cn/','zh-CN'],['es/','es'],['ar/','ar']];
const files=locales.map(([pre])=>pre+slug+'index.html');
files.push('es/insights/index.html','ar/insights/index.html');
const before=files.map(p=>fs.readFileSync(p,'utf8'));
execFileSync(process.execPath,['scripts/sync-strawberry-locales.mjs']);
assert.deepEqual(files.map(p=>fs.readFileSync(p,'utf8')),before,'Generator must be idempotent');
for(const [prefix,lang] of locales){
 const html=fs.readFileSync(prefix+slug+'index.html','utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert(html.includes(`lang="${lang}"`));
 assert(html.includes(`href="https://www.mccsgrowingmedia.com/${prefix}${slug}"`));
 for(const [pre,code] of locales){
  assert(html.includes(`hreflang="${code}" href="https://www.mccsgrowingmedia.com/${pre}${slug}"`));
  assert(html.includes(`href="/${pre}${slug}" lang="${code}"`));
 }
 assert.equal((html.match(/hreflang=/g)||[]).length,5);
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
 assert(html.includes('G-GLM9JS10QN'));
 assert(!html.includes('G-JGR2SQBQHW'));
 for(let i=1;i<=4;i++)assert(html.includes(`/assets/strawberry-runner/strawberry-${i}.webp`));
 if(lang==='ar')assert(html.includes('dir="rtl"'));
}
console.log('PASS: strawberry four-language metadata, links, imagery, schema and generation stability');
