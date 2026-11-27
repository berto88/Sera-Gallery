(()=>{
const S=Sera,D=document,$=s=>D.querySelector(s),T=S.t,E=S.esc;
let tok=sessionStorage.getItem('sera-tok'),data=[];
const msg=(el,k,c)=>{el.className='msg '+(c||'');el.dataset.k=k;el.textContent=k?T(k):''};
const api=async(p,m='GET',b)=>{let r;try{r=await fetch(S.C.api+p,{method:m,headers:{'Content-Type':'application/json',...(tok?{Authorization:'Bearer '+tok}:{})},body:b&&JSON.stringify(b)})}catch{throw Error('admin.net')}
 const j=await r.json().catch(()=>({}));if(r.status===401&&tok){out();throw Error('admin.expired')}if(!r.ok)throw Error(j.error||'admin.err');return j};
const show=()=>{$('#login').hidden=!!tok;$('#dash').hidden=!tok;if(tok)refresh()};
const out=()=>{tok=null;sessionStorage.removeItem('sera-tok');show()};
const refresh=async()=>{try{data=await S.load()}catch{data=[]}draw()};
const draw=()=>{$('#list').innerHTML=data.map(a=>`<article class="row" data-id="${E(a.id)}"><img src="${E(a.image)}" alt=""><div><h3>${E(a.title)}</h3><small>${a.year||''}</small><p>${E(S.loc(a.description))}</p></div><div class="acts"><button class="btn sm" data-a="edit">${T('admin.edit')}</button><button class="btn sm ghost" data-a="del">${T('admin.del')}</button></div></article>`).join('')||`<p class="st">${T('admin.empty')}</p>`};
// Tras publicar, GitHub Actions y Pages tardan ~1-2 min: se consulta el JSON hasta detectar el cambio.
const poll=async prev=>{const m=$('#am');msg(m,'admin.publishing');for(let k=0;k<24;k++){await new Promise(r=>setTimeout(r,10000));try{const d=await S.load();if(JSON.stringify(d)!==prev){data=d;draw();return msg(m,'admin.published','ok')}}catch{}}msg(m,'admin.slow','ok')};
const prep=f=>new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const k=Math.min(1,2000/Math.max(im.width,im.height)),c=D.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>{const r=new FileReader();r.onload=()=>res({b64:r.result.split(',')[1],ext:b.type==='image/webp'?'webp':'png'});r.readAsDataURL(b)},'image/webp',.88)};im.onerror=()=>rej(Error('admin.badType'));im.src=URL.createObjectURL(f)});
const check=f=>!f?'admin.needImg':!/^image\/(jpe?g|png|webp)$/.test(f.type)?'admin.badType':f.size>S.C.maxMB*1048576?'admin.big':'';

$('#lf').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),m=$('#lm');msg(m,'admin.signing');
 try{tok=(await api('/login','POST',{username:f.get('u'),password:f.get('p')})).token;sessionStorage.setItem('sera-tok',tok);e.target.reset();msg(m,'');show()}catch(x){tok=null;msg(m,x.message,'err')}};
$('#lo').onclick=out;
$('#fi').onchange=e=>{const f=e.target.files[0],p=$('#pv');p.hidden=!f;if(f)p.src=URL.createObjectURL(f)};
$('#af').onsubmit=async e=>{e.preventDefault();const m=$('#am'),f=$('#fi').files[0],v=new FormData(e.target),title=v.get('title').trim(),er=check(f)||(!title&&'admin.needTitle');
 if(er)return msg(m,er,'err');const b=e.submitter;b.disabled=true;msg(m,'admin.publishing');
 try{const{b64,ext}=await prep(f),prev=JSON.stringify(data);await api('/artworks','POST',{title,es:v.get('es'),en:v.get('en'),year:v.get('year'),image:b64,ext});e.target.reset();$('#pv').hidden=true;poll(prev)}catch(x){msg(m,x.message,'err')}b.disabled=false};
$('#list').onclick=async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const r=b.closest('.row'),id=r.dataset.id,a=data.find(x=>x.id===id),m=$('#am');
 if(b.dataset.a==='cancel')return draw();
 if(b.dataset.a==='del'){if(!confirm(T('admin.confirmDel')))return;const prev=JSON.stringify(data);try{msg(m,'admin.publishing');await api('/artworks/'+id,'DELETE');poll(prev)}catch(x){msg(m,x.message,'err')}}
 if(b.dataset.a==='edit')r.innerHTML=`<form class="ef"><label>${T('admin.titleF')}<input name="title" value="${E(a.title)}" required></label><label>${T('admin.descEs')}<textarea name="es" rows="3">${E(a.description?.es)}</textarea></label><label>${T('admin.descEn')}<textarea name="en" rows="3">${E(a.description?.en)}</textarea></label><label>${T('admin.year')}<input name="year" inputmode="numeric" maxlength="4" value="${a.year||''}"></label><div class="acts"><button class="btn sm">${T('admin.save')}</button><button type="button" class="btn sm ghost" data-a="cancel">${T('admin.cancel')}</button></div></form>`};
$('#list').onsubmit=async e=>{e.preventDefault();const id=e.target.closest('.row').dataset.id,v=new FormData(e.target),m=$('#am'),prev=JSON.stringify(data);
 try{msg(m,'admin.publishing');await api('/artworks/'+id,'PUT',{title:v.get('title').trim(),es:v.get('es'),en:v.get('en'),year:v.get('year')});draw();poll(prev)}catch(x){msg(m,x.message,'err')}};
S.onLang(()=>{D.querySelectorAll('.msg[data-k]').forEach(m=>m.textContent=m.dataset.k?T(m.dataset.k):'');draw()});
show();
})();
