(async()=>{
const S=Sera,B=document.getElementById('board'),CH=document.getElementById('chips'),pv=/preview/.test(location.hash),e=S.esc;
let D={categories:[],items:[]},cat='all',V=[],bad=false;
const cn=id=>{const c=D.categories.find(x=>x.id===id);return c?S.loc(c.name):''};
const draw=()=>{V=D.items.filter(i=>(i.published!==false||pv)&&(cat==='all'||i.category===cat));
 CH.innerHTML=D.categories.length?[['all',S.t('insp.all')],...D.categories.map(c=>[c.id,S.loc(c.name)])].map(([v,l])=>`<button class="chip${v===cat?' on':''}" data-c="${e(v)}">${e(l)}</button>`).join(''):'';
 B.innerHTML=bad?`<p class="st">${S.t('gallery.error')}</p>`:V.map((i,k)=>`<button class="it rv r${k%4}${i.image?'':' note'}" data-i="${k}">${i.image?`<img loading="lazy" decoding="async" src="${e(i.image)}" alt="${e(S.loc(i.title))}">${S.loc(i.title)?`<span class="cp">${e(S.loc(i.title))}</span>`:''}`:`<p class="nt">${e(S.loc(i.text))}</p>`}</button>`).join('')||`<p class="st">${S.t('insp.empty')}</p>`;
 S.reveal(B)};
CH.onclick=ev=>{const c=ev.target.closest('.chip');if(c){cat=c.dataset.c;draw()}};
B.onclick=ev=>{const b=ev.target.closest('.it');if(!b)return;S.modal(V.map(i=>({image:i.image,title:S.loc(i.title),description:i.text,meta:[cn(i.category),i.date].filter(Boolean).join(' · ')})),+b.dataset.i)};
try{const r=await fetch('data/inspiration.json?t='+Date.now());if(!r.ok)throw 0;D=await r.json()}catch{bad=true}
draw();S.onLang(draw);
})();
