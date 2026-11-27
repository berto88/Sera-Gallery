(async()=>{
const S=Sera,D=document,W=D.getElementById('wall'),CH=D.getElementById('chips'),DR=D.getElementById('doors');
let all=[],yr='all',view=[],bad=false;
const SP=[7,5,4,8,5,7],AL=['start','end','center','start','center','end'];
// Puertas de entrada
if(matchMedia('(prefers-reduced-motion:reduce)').matches){DR.remove();W.classList.add('in')}
else{const open=()=>{if(DR.classList.contains('open'))return;DR.classList.add('open');W.classList.add('in');setTimeout(()=>DR.remove(),3200)};DR.onclick=open;setTimeout(open,900)}
const draw=()=>{
 const ys=[...new Set(all.map(a=>a.year).filter(Boolean))].sort((a,b)=>b-a);
 CH.innerHTML=ys.length>1?[['all',S.t('gallery.all')],...ys.map(y=>[y,y])].map(([v,l])=>`<button class="chip${String(v)===String(yr)?' on':''}" data-y="${v}">${l}</button>`).join(''):'';
 view=all.filter(a=>yr==='all'||String(a.year)===String(yr));
 W.innerHTML=bad?`<p class="st">${S.t('gallery.error')}</p>`:view.map((a,i)=>`<figure class="art rv" style="--s:${SP[i%6]};--a:${AL[i%6]}"><button data-i="${i}" aria-label="${S.esc(a.title)}"><img loading="lazy" decoding="async" src="${S.esc(a.image)}" alt="${S.esc(a.title)}"></button><figcaption><h3>${S.esc(a.title)}</h3><span>${a.year||''}</span></figcaption></figure>`).join('')||`<p class="st">${S.t('gallery.empty')}</p>`;
 S.reveal(W)};
CH.onclick=e=>{const b=e.target.closest('.chip');if(b){yr=b.dataset.y;draw()}};
W.onclick=e=>{const b=e.target.closest('button[data-i]');b&&S.modal(view,+b.dataset.i)};
try{all=await S.load()}catch{bad=true}
draw();S.onLang(draw);
})();
