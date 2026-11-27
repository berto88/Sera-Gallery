(async()=>{
const S=Sera,D=document,ST=D.getElementById('stage'),DR=D.getElementById('doors'),sl=ms=>new Promise(r=>setTimeout(r,ms));
let W=[],C=[],yr='all',view=[],mode={};
const pv=()=>/preview/.test(location.hash),H=()=>new URLSearchParams(location.hash.slice(1)),e=S.esc;
// Puertas → vestíbulo (si se llega con enlace directo a una exposición/obra no se reproducen)
if(location.hash||matchMedia('(prefers-reduced-motion:reduce)').matches){DR.remove();ST.classList.add('in')}
else{const open=()=>{if(DR.classList.contains('open'))return;DR.classList.add('open');ST.classList.add('in');setTimeout(()=>DR.remove(),3200)};DR.onclick=open;setTimeout(open,900)}
const col=id=>C.find(c=>c.id===id),items=c=>c?c.works.map(i=>W.find(w=>w.id===i)).filter(Boolean):W;
const cnt=a=>`${a.length} ${S.t(a.length===1?'lobby.one':'lobby.many')}`,cov=(c,a)=>c.cover||a[0]?.image||'';
const LS=[7,5,5,7,6,6],AR=['4/3','3/4','1/1','3/4','4/3','1/1'],SP=[7,5,4,8,5,7],AL=['start','end','center','start','center','end'];
const lobby=()=>{
 const cs=C.filter(c=>c.published!==false||pv()).sort((a,b)=>!!b.featured-!!a.featured).map(c=>{const a=items(c);return{id:c.id,t:S.loc(c.name),d:S.loc(c.description),i:cov(c,a),n:cnt(a),y:c.year||'',f:c.featured}});
 cs.push({id:'all',t:S.t('lobby.all'),d:S.t('lobby.allDesc'),i:W[0]?.image||'',n:cnt(W),y:''});
 ST.innerHTML=`<div class="hd"><h1>${S.t('lobby.title')}</h1><p>${S.t('lobby.intro')}</p></div><div class="lobby">${cs.map((c,k)=>`<a class="poster rv${c.f?' ft':''}" href="#c=${c.id}${pv()?'&preview':''}" style="--s:${c.f?12:LS[k%6]};--r:${AR[k%6]}"><div class="im">${c.i?`<img loading="lazy" decoding="async" src="${e(c.i)}" alt="">`:''}</div><div class="pl"><h2>${e(c.t)}</h2><p>${e(c.d)}</p><span class="mt">${e([c.n,c.y].filter(Boolean).join(' · '))}</span><span class="go">${S.t('lobby.enter')}</span></div></a>`).join('')}</div>`;
 S.reveal(ST)};
const exh=id=>{
 const c=col(id),a=items(c),ys=[...new Set(a.map(x=>x.year).filter(Boolean))].sort((x,y)=>y-x);
 view=a.filter(x=>yr==='all'||String(x.year)===String(yr));
 const im=c?cov(c,a):a[0]?.image||'';
 ST.innerHTML=`<div class="crumbs"><a href="#${pv()?'preview':''}">${S.t('lobby.back')}</a><a href="index.html">${S.t('lobby.main')}</a></div><div class="exh"><div><h1>${e(c?S.loc(c.name):S.t('lobby.all'))}</h1><p class="lead">${e(c?S.loc(c.description):S.t('lobby.allDesc'))}</p><p>${e(c?S.loc(c.intro):'')}</p><span class="mt">${e([cnt(a),c?.year].filter(Boolean).join(' · '))}</span></div>${im?`<img src="${e(im)}" alt="">`:''}</div><div class="chips">${ys.length>1?[['all',S.t('gallery.all')],...ys.map(y=>[y,y])].map(([v,l])=>`<button class="chip${String(v)===String(yr)?' on':''}" data-y="${v}">${l}</button>`).join(''):''}</div><div class="wall">${view.map((a,i)=>`<figure class="art rv" style="--s:${SP[i%6]};--a:${AL[i%6]}"><button data-i="${i}" aria-label="${e(a.title)}"><img loading="lazy" decoding="async" src="${e(a.image)}" alt="${e(a.title)}"></button><figcaption><h3>${e(a.title)}</h3><span>${a.year||''}</span></figcaption></figure>`).join('')||`<p class="st">${S.t('gallery.empty')}</p>`}</div>`;
 S.reveal(ST)};
const draw=()=>mode.c?exh(mode.c):lobby();
const route=async first=>{const h=H(),w=h.get('w');yr='all';
 if(!first){ST.classList.add('fade');await sl(450)}
 mode={c:h.get('c')||(w?'all':null)};draw();ST.classList.remove('fade');
 if(w){const i=view.findIndex(x=>x.id===w);i>=0&&S.modal(view,i)}else if(!first)scrollTo(0,0)};
ST.onclick=ev=>{const c=ev.target.closest('.chip'),b=ev.target.closest('.art button');if(c){yr=c.dataset.y;draw()}if(b)S.modal(view,+b.dataset.i)};
try{[W,C]=await Promise.all([S.load(),fetch('data/collections.json?t='+Date.now()).then(r=>r.ok?r.json():[]).catch(()=>[])]);route(true)}catch{ST.innerHTML=`<p class="st">${S.t('gallery.error')}</p>`;return}
addEventListener('hashchange',()=>route());S.onLang(draw);
})();
