(async()=>{
const S=Sera,B=document.getElementById('posts'),pv=/preview/.test(location.hash),e=S.esc;let P=[],V=[],bad=false;
const draw=()=>{V=P.filter(p=>p.published!==false||pv);
 B.innerHTML=bad?`<p class="st">${S.t('gallery.error')}</p>`:V.map((p,pi)=>`<article class="post"><header class="rv"><h2>${e(S.loc(p.title))}</h2>${p.date?`<time>${e(p.date)}</time>`:''}</header><div class="tl">${(p.stages||[]).map((s,si)=>`<section class="sb rv${si%2?' flip':''}"><i class="dot"></i><div class="tx"><h3>${S.t('process.'+s.type)}</h3>${s.date?`<time>${e(s.date)}</time>`:''}<p>${e(S.loc(s.text))}</p></div><div class="ph">${(s.images||[]).map((im,j)=>`<button data-p="${pi}" data-s="${si}" data-j="${j}"><img loading="lazy" decoding="async" src="${e(im)}" alt=""></button>`).join('')}</div></section>`).join('')}</div>${p.artwork?`<a class="btn" href="gallery.html#w=${encodeURIComponent(p.artwork)}">${S.t('process.discover')}</a>`:''}</article>`).join('')||`<p class="st">${S.t('process.empty')}</p>`;
 S.reveal(B)};
B.onclick=ev=>{const b=ev.target.closest('button[data-j]');if(!b)return;const p=V[+b.dataset.p],s=p.stages[+b.dataset.s];
 S.modal(s.images.map(image=>({image,title:S.loc(p.title),meta:S.t('process.'+s.type),description:s.text})),+b.dataset.j)};
try{const r=await fetch('data/creative-process.json?t='+Date.now());if(!r.ok)throw 0;P=await r.json()}catch{bad=true}
draw();S.onLang(draw);
})();
