// Gestión de colecciones, proceso creativo e inspiración (usa S.admin de admin.js).
(()=>{
const S=Sera,A=S.admin,D=document,$=s=>D.querySelector(s),E=S.esc,T=S.t,L=S.loc,KS=['col','proc','insp'],TY=['inspiration','strokes','process','final'];
const st={};let cur=null,WK=[];
const uid=p=>p+'-'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const un=fd=>{const o={};for(const[k,v]of fd){const p=k.split('.');let c=o;p.slice(0,-1).forEach(x=>c=c[x]??={});const l=p.at(-1);c[l]=l in c?[].concat(c[l],v):v}return o};
const fl=x=>[].concat(x||[]).filter(f=>f.size),ar=o=>Object.values(o||{}),arr=k=>k==='insp'?st.insp.items:st[k];
const up=async(f,fo)=>{const{b64,ext}=await A.prep(f);return(await A.api('/upload','POST',{folder:fo,image:b64,ext})).path};
const one=(o,n,fo)=>o[n+'_f']?.size?up(o[n+'_f'],fo):o[n]||'';
const inp=(n,k,v,x='')=>`<label>${T(k)}<input name="${n}" value="${E(v)}" ${x}></label>`;
const bi=(n,k,o,ta)=>['es','en'].map(l=>`<label>${T(k)} (${l.toUpperCase()})${ta?`<textarea name="${n}.${l}" rows="3">${E(o?.[l])}</textarea>`:`<input name="${n}.${l}" value="${E(o?.[l])}">`}</label>`).join('');
const ck=(n,k,v)=>`<label class="ck"><input type="checkbox" name="${n}"${v?' checked':''}> ${T(k)}</label>`;
const im=(n,k,v)=>`<label>${T(k)}<input type="file" name="${n}_f" accept="image/jpeg,image/png,image/webp"></label>${v?`<img class="th" src="${E(v)}" alt=""><input type="hidden" name="${n}" value="${E(v)}">`:''}`;
const stg=(s,i)=>`<fieldset class="sg"><select name="st.${i}.type">${TY.map(k=>`<option value="${k}"${s.type===k?' selected':''}>${T('process.'+k)}</option>`).join('')}</select>${inp(`st.${i}.date`,'admin.date',s.date||'','type="date"')}${bi(`st.${i}.text`,'admin.text',s.text,1)}<label>${T('admin.photos')}<input type="file" multiple name="st.${i}.files" accept="image/jpeg,image/png,image/webp"></label><div class="ths">${(s.images||[]).map(p=>`<label class="ck"><input type="checkbox" name="st.${i}.keep" value="${E(p)}" checked><img class="th" src="${E(p)}" alt=""></label>`).join('')}</div><button type="button" class="btn sm ghost" data-x="rm">${T('admin.removeStage')}</button></fieldset>`;
const wr=w=>`<div class="wr"><label class="ck"><input type="checkbox" name="works" value="${E(w.id)}" CK> ${E(w.title)}</label><span><button type="button" class="btn sm ghost" data-mv="-1">↑</button> <button type="button" class="btn sm ghost" data-mv="1">↓</button></span></div>`;
const ENT={
col:{n:'collections',pv:c=>`gallery.html#c=${c.id}&preview`,tt:c=>L(c.name),mk:()=>({id:uid('col'),works:[],published:false}),
 form:c=>bi('name','admin.name',c.name)+bi('description','admin.descF',c.description,1)+bi('intro','admin.text',c.intro,1)+inp('year','admin.year',c.year||'','maxlength="12"')+im('cover','admin.cover',c.cover)+ck('featured','admin.featured',c.featured)+ck('published','admin.publishedF',c.published)+`<label>${T('admin.worksSel')}</label><div class="wl">${[...c.works.map(id=>WK.find(w=>w.id===id)).filter(Boolean),...WK.filter(w=>!c.works.includes(w.id))].map(w=>wr(w).replace('CK',c.works.includes(w.id)?'checked':'')).join('')}</div>`,
 rd:async(f,o,c)=>({...c,name:o.name,description:o.description,intro:o.intro,year:o.year||'',cover:await one(o,'cover','collections'),featured:!!o.featured,published:!!o.published,works:f.getAll('works')})},
proc:{n:'creative-process',pv:()=>'process.html#preview',tt:p=>L(p.title),mk:()=>({id:uid('post'),stages:[],published:false}),
 form:p=>bi('title','admin.titleF',p.title)+inp('date','admin.date',p.date||'','type="date"')+`<label>${T('admin.artwork')}<select name="artwork"><option value="">${T('admin.none')}</option>${WK.map(w=>`<option value="${E(w.id)}"${w.id===p.artwork?' selected':''}>${E(w.title)}</option>`).join('')}</select></label>`+ck('published','admin.publishedF',p.published)+`<h3>${T('admin.stages')}</h3><div id="sgs" data-n="${(p.stages||[]).length}">${(p.stages||[]).map(stg).join('')}</div><button type="button" class="btn sm ghost" data-x="stage">${T('admin.addStage')}</button>`,
 rd:async(f,o,p)=>{const stages=[];for(const s of ar(o.st)){const images=[].concat(s.keep||[]);for(const x of fl(s.files))images.push(await up(x,'creative-process'));stages.push({type:s.type,date:s.date||'',text:s.text,images})}return{...p,title:o.title,date:o.date||'',artwork:o.artwork||'',published:!!o.published,stages}}},
insp:{n:'inspiration',pv:()=>'inspiration.html#preview',tt:i=>L(i.title)||L(i.text),mk:()=>({id:uid('insp'),published:false}),
 form:i=>bi('title','admin.titleF',i.title)+bi('text','admin.text',i.text,1)+`<label>${T('admin.category')}<select name="category">${st.insp.categories.map(c=>`<option value="${E(c.id)}"${c.id===i.category?' selected':''}>${E(L(c.name))}</option>`).join('')}</select></label>`+inp('date','admin.date',i.date||'','type="date"')+im('image','admin.image',i.image)+ck('published','admin.publishedF',i.published),
 rd:async(f,o,i)=>({...i,title:o.title,text:o.text,category:o.category||'',date:o.date||'',image:await one(o,'image','inspiration'),published:!!o.published})}};
const err=x=>A.msg($('#am'),x.message,'err');
const persist=async k=>{try{A.msg($('#am'),'admin.publishing');await A.api('/data/'+ENT[k].n,'PUT',{data:st[k]});A.msg($('#am'),'admin.saved','ok')}catch(x){err(x);throw x}};
const view=async(k,reload=1)=>{cur=k;const e=ENT[k];
 try{if(reload){const d=await A.api('/data/'+e.n);st[k]=k==='insp'?{categories:[],items:[],...d}:d;WK=await S.load()}}catch(x){return err(x)}
 $('#t-'+k).innerHTML=`<div class="bar"><button class="btn sm" data-x="new">${T('admin.new')}</button></div><div id="ed"></div>${k==='insp'?`<form class="card" id="cf"><label>${T('admin.cats')}<textarea name="c" rows="5">${E(st.insp.categories.map(c=>[c.id,c.name.es,c.name.en].join(' | ')).join('\n'))}</textarea></label><button class="btn sm">${T('admin.saveCats')}</button></form>`:''}${arr(k).map((it,i)=>`<article class="row x" data-i="${i}"><div><h3>${E(e.tt(it)||'—')}</h3><small>${it.published===false?T('admin.draft'):T('admin.pub')}</small></div><div class="acts"><button class="btn sm ghost" data-x="up">↑</button><button class="btn sm ghost" data-x="dn">↓</button><a class="btn sm ghost" target="_blank" rel="noopener" href="${E(e.pv(it))}">${T('admin.preview')}</a><button class="btn sm" data-x="edit">${T('admin.edit')}</button><button class="btn sm ghost" data-x="del">${T('admin.del')}</button></div></article>`).join('')||`<p class="st">${T('admin.empty')}</p>`}`};
const hc=k=>async ev=>{const b=ev.target.closest('[data-x],[data-mv]');if(!b)return;const a=arr(k),r=b.closest('.row'),i=r?+r.dataset.i:-1,x=b.dataset.x;
 if(b.dataset.mv){const w=b.closest('.wr');+b.dataset.mv<0?w.previousElementSibling?.before(w):w.nextElementSibling?.after(w);return}
 if(x==='rm')return b.closest('fieldset').remove();
 if(x==='stage'){const s=$('#sgs');s.insertAdjacentHTML('beforeend',stg({},+s.dataset.n));s.dataset.n=+s.dataset.n+1;return}
 if(x==='cancel')return view(k,0);
 if(x==='new'||x==='edit'){$('#ed').innerHTML=`<form class="card" data-i="${i}">${ENT[k].form(x==='new'?ENT[k].mk():a[i])}<div class="acts"><button class="btn">${T('admin.save')}</button><button type="button" class="btn ghost" data-x="cancel">${T('admin.cancel')}</button></div></form>`;$('#ed').scrollIntoView({behavior:'smooth'});return}
 if(x==='del'){if(!confirm(T('admin.confirmDel')))return;a.splice(i,1)}
 else if(x==='up'||x==='dn'){const j=i+(x==='up'?-1:1);if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]]}
 else return;
 try{await persist(k)}catch{}view(k,0)};
const hs=k=>async ev=>{ev.preventDefault();const f=ev.target,a=arr(k);
 if(f.id==='cf'){st.insp.categories=new FormData(f).get('c').split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(c=>c[0]).map(c=>({id:c[0],name:{es:c[1]||c[0],en:c[2]||c[1]||c[0]}}));try{await persist(k)}catch{}return view(k,0)}
 const i=+f.dataset.i,fd=new FormData(f),btn=ev.submitter;btn.disabled=true;
 try{const it=await ENT[k].rd(fd,un(fd),i<0?ENT[k].mk():a[i]);i<0?a.unshift(it):a[i]=it;await persist(k);view(k,0)}catch(x){err(x);btn.disabled=false}};
KS.forEach(k=>{$('#t-'+k).onclick=hc(k);$('#t-'+k).onsubmit=hs(k)});
$('#tabs').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const t=b.dataset.t;$('#tabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));['works',...KS].forEach(k=>$('#t-'+k).hidden=k!==t);$('#am').textContent='';if(t!=='works')view(t)};
S.onLang(()=>cur&&st[cur]&&!$('#t-'+cur).hidden&&view(cur,0));
})();
