(()=>{
const C=SERA_CONFIG,D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>[...r.querySelectorAll(s)];
let lang;try{lang=localStorage.getItem('sera-lang')}catch{}
if(!I18N[lang])lang=(navigator.language||'').startsWith('en')?'en':'es';
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
const S=window.Sera={C,lang,cbs:[],
 t:k=>String(I18N[S.lang][k]??k).replace('{mb}',C.maxMB).replace('{name}',C.artist).replace('{y}',new Date().getFullYear()),
 onLang:f=>S.cbs.push(f),
 loc:o=>(o&&(o[S.lang]||o.es))||'',
 esc:s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),
 load:async()=>{const r=await fetch('data/artworks.json?t='+Date.now());if(!r.ok)throw Error('load');return r.json()},
 reveal:(r=D)=>$$('.rv:not(.in)',r).forEach(e=>io.observe(e))};

// Cabecera y navegación
const pg=D.body.dataset.page;
$('#hdr').innerHTML=`<a class="logo" href="index.html" data-artist></a><button class="burger" aria-label="Menu" aria-expanded="false">☰</button><nav id="nav">${[['home','index'],['about','about'],['gallery','gallery'],['process','process'],['inspiration','inspiration'],['contact','contact']].map(([k,f])=>`<a href="${f}.html" data-i18n="nav.${k}"${pg===k?' class="on" aria-current="page"':''}></a>`).join('')}<span class="lang"><button data-l="es" aria-label="Español">🇪🇸</button><button data-l="en" aria-label="English">🇬🇧</button></span></nav>`;
$('.burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
$$('.lang button').forEach(b=>b.onclick=()=>{S.lang=b.dataset.l;try{localStorage.setItem('sera-lang',S.lang)}catch{}apply()});

// Transiciones suaves entre páginas
D.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.target||e.metaKey||e.ctrlKey||a.origin!==location.origin||(a.hash&&a.pathname===location.pathname))return;e.preventDefault();D.body.classList.add('out');setTimeout(()=>location.href=a.href,350)});
addEventListener('pageshow',e=>e.persisted&&D.body.classList.remove('out'));

// Visor modal de obras
let L=[],i=0,on=false,back;
const M=D.createElement('div');M.className='modal';M.setAttribute('role','dialog');M.setAttribute('aria-modal','true');
M.innerHTML=`<button class="nv" data-d="-1" data-i18n-al="modal.prev">‹</button><figure><img alt=""><figcaption><p class="y"></p><h3></h3><p class="ds"></p></figcaption></figure><button class="nv" data-d="1" data-i18n-al="modal.next">›</button><button class="x" data-i18n-al="modal.close">×</button>`;
D.body.append(M);
const draw=()=>{const a=L[i],q=s=>$(s,M);const im=q('img');im.hidden=!a.image;if(a.image)im.src=a.image;im.alt=a.title||'';q('h3').textContent=a.title||'';q('.y').textContent=a.meta??a.year??'';q('.ds').textContent=S.loc(a.description);$$('.nv',M).forEach(b=>b.style.visibility=L.length>1?'':'hidden')};
const go=d=>{i=(i+d+L.length)%L.length;draw()},close=()=>{on=false;M.classList.remove('on');D.body.style.overflow='';back&&back.focus()};
S.modal=(l,k)=>{L=l;i=k;back=D.activeElement;draw();M.classList.add('on');on=true;D.body.style.overflow='hidden';$('.x',M).focus()};
M.onclick=e=>{if(e.target===M||e.target.closest('.x'))close();const n=e.target.closest('.nv');n&&go(+n.dataset.d)};
D.addEventListener('keydown',e=>{if(!on)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
let tx;M.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});M.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>60)go(d<0?1:-1)});
S.onLang(()=>on&&draw());

// Idioma
function apply(){
 D.documentElement.lang=S.lang;
 $$('[data-i18n]').forEach(e=>e.textContent=S.t(e.dataset.i18n));
 $$('[data-i18n-al]').forEach(e=>e.setAttribute('aria-label',S.t(e.dataset.i18nAl)));
 $$('[data-artist]').forEach(e=>e.textContent=C.artist);
 $$('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===S.lang));
 D.title=(pg==='admin'?S.t('admin.title'):S.t('nav.'+pg))+' · '+C.artist;
 $('meta[name=description]').content=S.t('meta.'+pg);
 S.cbs.forEach(f=>f());
}
$$('[data-cfg]').forEach(e=>{e.src=C[e.dataset.cfg];e.alt=e.dataset.alt?C.artist:''});
apply();S.reveal();
})();
