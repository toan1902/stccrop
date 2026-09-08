const SUPABASE_URL='https://sepntgvollrdlbfzlbfq.supabase.co';
const SUPABASE_KEY='sb_publishable_L54dww2B1NiaFkqJ5Uj4hg_o7Pj2281';

module.exports=async function handler(req,res){
  const path=String(req.query.path||'');
  const allowed=/^\/auth\/v1\/token\?grant_type=password$/.test(path)||/^\/rest\/v1\/posts(?:\?|$)/.test(path)||/^\/storage\/v1\/object\/post-images\/[A-Za-z0-9._-]+$/.test(path);
  if(!allowed)return res.status(403).json({message:'Đường dẫn không được phép.'});
  try{
    let body=req.method==='GET'||req.method==='HEAD'?undefined:req.body;
    const headers={apikey:SUPABASE_KEY,Authorization:req.headers.authorization||`Bearer ${SUPABASE_KEY}`};
    if(path.startsWith('/storage/')){
      if(!body?.base64)return res.status(400).json({message:'Thiếu dữ liệu ảnh.'});
      body=Buffer.from(body.base64,'base64');headers['Content-Type']=req.body.type||'application/octet-stream';headers['x-upsert']='false';
    }else if(body!==undefined){
      body=typeof body==='string'?body:JSON.stringify(body);headers['Content-Type']='application/json';
      if(req.headers.prefer)headers.Prefer=req.headers.prefer;
    }
    const upstream=await fetch(SUPABASE_URL+path,{method:req.method,headers,body});
    const text=await upstream.text();
    res.status(upstream.status);res.setHeader('Content-Type',upstream.headers.get('content-type')||'application/json');return res.send(text);
  }catch(error){return res.status(502).json({message:'Không kết nối được máy chủ dữ liệu.',detail:error.message});}
};
