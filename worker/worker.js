// Backend ligero (Cloudflare Workers, plan gratuito). Valida el login, emite una sesión firmada (2 h)
// y publica en GitHub con un token que vive SOLO aquí como secreto.
const E=new TextEncoder(),B=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
const sig=async(d,s)=>{const k=await crypto.subtle.importKey('raw',E.encode(s),{name:'HMAC',hash:'SHA-256'},false,['sign']);return B(await crypto.subtle.sign('HMAC',k,E.encode(d)))};
const MAGIC={webp:'UklGR',png:'iVBORw0K',jpg:'/9j/'};
export default{async fetch(req,env){
 const cors={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN,'Access-Control-Allow-Headers':'Content-Type,Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',Vary:'Origin'};
 const out=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{...cors,'Content-Type':'application/json'}});
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 const gh=(path,o={})=>fetch(`https://api.github.com/repos/${env.REPO}${path}`,{...o,headers:{Authorization:`Bearer ${env.GH_TOKEN}`,Accept:'application/vnd.github+json','User-Agent':'sera-gallery','Content-Type':'application/json'}});
 const run=inputs=>gh('/actions/workflows/publish-artwork.yml/dispatches',{method:'POST',body:JSON.stringify({ref:env.BRANCH,inputs})});
 try{
  const{pathname:p}=new URL(req.url);let b={};try{b=await req.json()}catch{}
  const S=env.SESSION_SECRET;
  if(p==='/login'&&req.method==='POST'){
   const ok=(await sig(String(b.username),S))===(await sig(env.ADMIN_USER,S))&&(await sig(String(b.password),S))===(await sig(env.ADMIN_PASSWORD,S));
   if(!ok){await new Promise(r=>setTimeout(r,800));return out({error:'admin.loginErr'},401)}
   const d=btoa(JSON.stringify({exp:Date.now()+72e5}));return out({token:d+'.'+await sig(d,S)});
  }
  const[d,s]=(req.headers.get('Authorization')||'').slice(7).split('.');
  if(!d||!s||s!==await sig(d,S)||JSON.parse(atob(d)).exp<Date.now())return out({error:'admin.expired'},401);
  const dm=p.match(/^\/data\/(collections|creative-process|inspiration)$/),FO=['collections','creative-process','inspiration'];
  if(dm){const path=`data/${dm[1]}.json`,r=await gh(`/contents/${path}?ref=${env.BRANCH}`),cur=r.ok?await r.json():null;
   if(req.method==='GET')return out(cur?JSON.parse(decodeURIComponent(escape(atob(cur.content.replace(/\n/g,''))))):dm[1]==='inspiration'?{categories:[],items:[]}:[]);
   if(req.method==='PUT'){const s=JSON.stringify(b.data,null,1);if(!b.data||typeof b.data!=='object'||s.length>9e5)return out({error:'admin.err'},400);
    const w=await gh(`/contents/${path}`,{method:'PUT',body:JSON.stringify({message:`Update ${dm[1]}`,content:btoa(unescape(encodeURIComponent(s))),branch:env.BRANCH,...(cur?{sha:cur.sha}:{})})});
    return w.ok?out({ok:1}):out({error:'admin.err'},502)}}
  if(p==='/upload'&&req.method==='POST'){const ext=b.ext==='webp'?'webp':b.ext==='png'?'png':'jpg',img=String(b.image||'');
   if(!FO.includes(b.folder)||!img.startsWith(MAGIC[ext]))return out({error:'admin.badType'},400);if(img.length>11e6)return out({error:'admin.big'},400);
   const path=`assets/${b.folder}/${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}.${ext}`;
   const u=await gh(`/contents/${path}`,{method:'PUT',body:JSON.stringify({message:`Add image ${path}`,content:img,branch:env.BRANCH})});
   return u.ok?out({path}):out({error:'admin.err'},502)}
  const m=p.match(/^\/artworks(?:\/(obra-[a-z0-9]+))?$/);if(!m)return out({error:'admin.err'},404);
  const f={title:String(b.title||'').trim().slice(0,120),desc_es:String(b.es||'').slice(0,2000),desc_en:String(b.en||'').slice(0,2000),year:String(b.year||'').trim()};
  if(req.method!=='DELETE'&&(!f.title||!/^\d{0,4}$/.test(f.year)))return out({error:'admin.needTitle'},400);
  if(req.method==='POST'&&!m[1]){
   const ext=b.ext==='webp'?'webp':b.ext==='png'?'png':'jpg',img=String(b.image||'');
   if(!img.startsWith(MAGIC[ext]))return out({error:'admin.badType'},400);
   if(img.length>11e6)return out({error:'admin.big'},400);
   const id='obra-'+Date.now().toString(36),path=`assets/artworks/${id}.${ext}`;
   const up=await gh(`/contents/${path}`,{method:'PUT',body:JSON.stringify({message:`Add artwork ${id}`,content:img,branch:env.BRANCH})});
   if(!up.ok)return out({error:'admin.err'},502);
   if(!(await run({op:'add',id,image:path,...f})).ok)return out({error:'admin.err'},502);
   return out({id},202);
  }
  if(req.method==='PUT'&&m[1]){if(!(await run({op:'update',id:m[1],...f})).ok)return out({error:'admin.err'},502);return out({id:m[1]},202)}
  if(req.method==='DELETE'&&m[1]){if(!(await run({op:'delete',id:m[1]})).ok)return out({error:'admin.err'},502);return out({id:m[1]},202)}
  return out({error:'admin.err'},405);
 }catch{return out({error:'admin.err'},500)}
}};
