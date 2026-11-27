(async()=>{
const S=Sera,T=document.getElementById('trk');let L=[],bad=false;
const draw=()=>{T.innerHTML=bad?`<p class="st">${S.t('gallery.error')}</p>`:L.map((a,i)=>`<button class="card" data-i="${i}"><div class="im"><img loading="lazy" decoding="async" src="${S.esc(a.image)}" alt="${S.esc(a.title)}"></div><h3>${S.esc(a.title)}</h3><p>${S.esc(S.loc(a.description))}</p></button>`).join('')||`<p class="st">${S.t('gallery.empty')}</p>`};
T.onclick=e=>{const c=e.target.closest('.card');c&&S.modal(L,+c.dataset.i)};
document.querySelectorAll('.ar').forEach(b=>b.onclick=()=>T.scrollBy({left:b.dataset.d*T.clientWidth*.8,behavior:'smooth'}));
try{L=(await S.load()).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,8)}catch{bad=true}
draw();S.onLang(draw);
})();
