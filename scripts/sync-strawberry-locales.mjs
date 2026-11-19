import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const locales=JSON.parse(fs.readFileSync(path.join(root,'data/strawberry-locales.json'),'utf8'));
const slug='strawberry-runner-propagation-plugs';
const origin='https://www.mccsgrowingmedia.com';
const all=[{lang:'en',prefix:'',label:'EN'},{lang:'zh-CN',prefix:'/cn',label:'中文'},{lang:'es',prefix:'/es',label:'ES'},{lang:'ar',prefix:'/ar',label:'AR'}];
const route=l=>`${l.prefix}/insights/${slug}/`;
const file=url=>path.join(root,url.replace(/^\//,''),'index.html');
const read=url=>fs.readFileSync(file(url),'utf8');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const alternates=all.map(l=>`<link rel="alternate" hreflang="${l.lang}" href="${origin}${route(l)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${origin}${route(all[0])}">`;
const switcher=lang=>`<div class="language-switcher" aria-label="${lang==='ar'?'اللغة':lang==='es'?'Idioma':'Language'}">${all.map(l=>`<a href="${route(l)}" lang="${l.lang}"${lang===l.lang?' aria-current="page"':''}>${l.label}</a>`).join('')}</div>`;
const required=(source,re,label)=>{const m=source.match(re);if(!m)throw Error('Missing '+label);return m[0];};
const english=read(route(all[0]));
const style=required(english,/<style>[\s\S]*?<\/style>/,'article style');
const figure=(l,i,lead=false)=>`<figure><a href="/assets/strawberry-runner/strawberry-${i+1}.webp"><img src="/assets/strawberry-runner/strawberry-${i+1}.webp" width="1411" height="1058" alt="${esc(l.captions[i])}" loading="${lead?'eager':'lazy'}"${lead?' fetchpriority="high"':''} decoding="async"></a><figcaption>${esc(l.captions[i])}</figcaption></figure>`;

for(const l of Object.values(locales)) {
 const template=read(`${l.prefix}/insights/yunnan-rooted-cuttings-molded-plugs/`);
 const header=required(template,/<header class="site-header">[\s\S]*?<\/header>/,'localized header').replace(/<div[^>]*class="language-switcher"[^>]*>[\s\S]*?<\/div>/,switcher(l.lang));
 let footer=required(template,/<footer class="site-footer">[\s\S]*?<\/footer>/,'localized footer');
 const footerLabels=l.lang==='ar'?{'CF Series Catalog':'كتالوج سلسلة CF','Compare Models':'قارن النماذج','Privacy Policy':'سياسة الخصوصية'}:{'CF Series Catalog':'Catálogo de la serie CF','Compare Models':'Comparar modelos','Privacy Policy':'Política de privacidad'};
 for(const [from,to] of Object.entries(footerLabels))footer=footer.replaceAll(from,to);
 footer=footer.replace(/<a href="tel:/g,'<a dir="ltr" href="tel:');
 const tracking=required(english,/<script id="mccs-consent-default">[\s\S]*?gtag\('config','G-[A-Z0-9]+'\);<\/script>/,'existing tracking');
 const schema={'@context':'https://schema.org','@type':'Article',headline:l.title,description:l.description,inLanguage:l.lang,datePublished:'2026-11-20',dateModified:'2026-11-20',mainEntityOfPage:origin+route(l),author:{'@type':'Organization',name:'MCCS Growing Media'},publisher:{'@type':'Organization',name:'MCCS Growing Media'},image:[1,2,3,4].map(i=>`${origin}/assets/strawberry-runner/strawberry-${i}.webp`)};
 const sourceSchemas=[...template.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const operator=sourceSchemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Organization'&&s.legalName);
 if(!operator)throw Error('Missing approved operator schema');
 schema.publisher=operator;
 schema.author={'@id':operator['@id']};
 let body=`<nav aria-label="${esc(l.insights)}"><a href="${l.prefix}/insights/">${esc(l.insights)}</a></nav><p>${esc(l.record)}</p><h1>${esc(l.title)}</h1><p>${esc(l.description)}</p><section class="strawberry-lead">${figure(l,1,true)}</section>`;
 l.sections.forEach(([heading,text],i)=>{body+=`<h2>${esc(heading)}</h2><p>${esc(text)}</p>`;if(i===2)body+=`<div class="strawberry-gallery">${[0,2,3].map(n=>figure(l,n)).join('')}</div>`;});
 body+=`<h2>${esc(l.references)}</h2><p><a href="https://cea.cals.cornell.edu/crops/cea-strawberry-runner-propagation-for-deep-water-culture/">Cornell CEA</a></p><p><a class="btn btn-primary" href="${l.prefix}/contact/#quoteForm">${esc(l.sample)}</a> <a href="${l.prefix}/products/">${esc(l.products)}</a></p><p><a href="${l.prefix}/sample-shipping/">${esc(l.shipping)}</a> · <a href="${l.prefix}/insights/cutting-propagation-root-observations/">${esc(l.related)}</a></p>`;
 const html=`<!DOCTYPE html>\n<html lang="${l.lang}" dir="${l.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(l.title)} | MCCS</title><meta name="description" content="${esc(l.description)}"><link rel="canonical" href="${origin}${route(l)}">${alternates}<meta property="og:type" content="article"><meta property="og:title" content="${esc(l.title)}"><meta property="og:description" content="${esc(l.description)}"><meta property="og:url" content="${origin}${route(l)}"><meta property="og:image" content="${origin}/assets/strawberry-runner/strawberry-2.webp"><meta property="og:image:alt" content="${esc(l.captions[1])}"><meta property="og:image:width" content="1411"><meta property="og:image:height" content="1058"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/assets/yunnan-rooting.css"><link rel="stylesheet" href="/assets/vendor/photoswipe/photoswipe.css">${tracking}<script type="application/ld+json">${JSON.stringify(schema)}</script>${style}</head><body class="yunnan-article">${header}<main><article class="container strawberry-story yunnan-story">${body}</article></main>${footer}<a class="whatsapp-float" href="https://wa.me/8618922290417" rel="noopener" target="_blank">WhatsApp</a><script defer src="/assets/mobile-ux.js"></script><script defer src="/assets/ai-referral-tracking.js"></script><script type="module" src="/assets/root-lightbox.js"></script></body></html>\n`;
 fs.mkdirSync(path.dirname(file(route(l))),{recursive:true});fs.writeFileSync(file(route(l)),html);
 const indexFile=file(`${l.prefix}/insights/`);
 let index=fs.readFileSync(indexFile,'utf8');
 const card=`<!-- strawberry-record:start --><section class="section"><div class="container"><h2><a href="${route(l)}">${esc(l.title)}</a></h2><p>${esc(l.description)}</p><a href="${route(l)}"><img src="/assets/strawberry-runner/strawberry-2.webp" width="1411" height="1058" loading="lazy" decoding="async" alt="${esc(l.captions[1])}" style="display:block;width:100%;max-width:480px;height:auto"></a></div></section><!-- strawberry-record:end -->`;
 index=index.replace(/<!-- strawberry-record:start -->[\s\S]*?<!-- strawberry-record:end -->/,'');
 index=index.replace('</main>',card+'</main>');fs.writeFileSync(indexFile,index);
}
for(const l of all){
 const p=file(route(l));let source=fs.readFileSync(p,'utf8');
 source=source.replace(/<link\b(?=[^>]*\brel="alternate")(?=[^>]*\bhreflang=)[^>]*>/g,'');
 source=source.replace('</head>',alternates+'</head>');
 source=source.replace(/<div[^>]*class="language-switcher"[^>]*>[\s\S]*?<\/div>/,switcher(l.lang));
 fs.writeFileSync(p,source);
}
console.log('Synchronized strawberry ES/AR articles and indexes, and four-language article links.');
