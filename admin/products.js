/* STC CROP Admin — Quản trị sản phẩm (file bổ sung, không sửa app-v4.js) */
let products=[];

function pSwitch(view){
  $('postsView').hidden=true;$('editorView').hidden=true;
  $('productsListView').hidden=view!=='list';
  $('productEditorView').hidden=view!=='editor';
  $('pageTitle').textContent=view==='list'?'Sản phẩm':($('pId').value?'Sửa sản phẩm':'Thêm sản phẩm');
  document.querySelectorAll('.nav[data-view]').forEach(x=>x.classList.remove('active'));
  $('navProducts').classList.add('active');
}
document.querySelectorAll('.nav[data-view]').forEach(x=>x.addEventListener('click',()=>{
  $('productsListView').hidden=true;$('productEditorView').hidden=true;$('navProducts').classList.remove('active');
}));

const catLabel={'cong-tac':'Công tắc','o-cam':'Ổ cắm','khoa-cua':'Khóa cửa','camera':'Camera','cam-bien':'Cảm biến','khac':'Khác'};
function money(n){return n==null||n===''?'—':Number(n).toLocaleString('vi-VN')+'đ'}

async function loadProducts(){products=await req('/rest/v1/products?select=*&order=updated_at.desc',{token:session().access_token})||[];renderProducts()}

function renderProducts(){
  const q=$('pSearch').value.toLowerCase(),f=$('pStatusFilter').value;
  const a=products.filter(p=>(f==='all'||p.status===f)&&p.name.toLowerCase().includes(q));
  $('pTotalCount').textContent=products.length;
  $('pPublishedCount').textContent=products.filter(p=>p.status==='published').length;
  $('pDraftCount').textContent=products.filter(p=>p.status==='draft').length;
  $('productRows').innerHTML=a.map(p=>`<tr><td><strong>${esc(p.name)}</strong><br><small>/${esc(p.slug)}</small></td><td>${esc(catLabel[p.category]||p.category||'')}</td><td>${money(p.price)}</td><td><span class="status ${p.status}">${p.status==='published'?'Đang bán':'Ẩn/nháp'}</span></td><td><div class="actions"><button data-pedit="${p.id}">Sửa</button><button class="danger" data-pdelete="${p.id}">Xóa</button></div></td></tr>`).join('');
  $('pEmptyState').hidden=!!a.length;
  document.querySelectorAll('[data-pedit]').forEach(b=>b.onclick=()=>editProduct(b.dataset.pedit));
  document.querySelectorAll('[data-pdelete]').forEach(b=>b.onclick=()=>deleteProduct(b.dataset.pdelete));
}

async function showProducts(){
  pSwitch('list');
  try{await loadProducts()}
  catch(e){if(/JWT|token|401/i.test(e.message)){localStorage.removeItem('stc_admin_session');showLogin('Phiên đăng nhập hết hạn.')}else alert('Không tải được sản phẩm: '+e.message)}
}

function slugifyP(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}

function newProduct(){$('productForm').reset();$('pId').value='';$('pImagePreview').hidden=true;$('pSaveMessage').textContent='';pSwitch('editor')}

function editProduct(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  $('pId').value=p.id;$('pName').value=p.name;$('pSlug').value=p.slug;$('pCategory').value=p.category||'khac';
  $('pPrice').value=p.price??'';$('pDescription').value=p.description||'';$('pStatus').value=p.status;
  $('pImageUrl').value=p.image_url||'';previewP(p.image_url);pSwitch('editor');
}
function previewP(url){$('pImagePreview').src=url||'';$('pImagePreview').hidden=!url}

async function uploadProductImage(){
  const f=$('pImageFile').files[0];
  if(!f)return $('pImageUrl').value.trim()||null;
  if(f.size>3145728)throw new Error('Ảnh phải nhỏ hơn 3 MB.');
  const path=`${Date.now()}-${crypto.randomUUID()}.${f.name.split('.').pop().toLowerCase()}`,
    base64=await new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(String(r.result).split(',')[1]);r.onerror=no;r.readAsDataURL(f)});
  await req(`/storage/v1/object/product-images/${path}`,{method:'POST',body:JSON.stringify({base64,type:f.type}),token:session().access_token,headers:{'Content-Type':'application/json'}});
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

$('pName').oninput=()=>{if(!$('pId').value)$('pSlug').value=slugifyP($('pName').value)};
$('pImageUrl').oninput=()=>previewP($('pImageUrl').value);
$('navProducts').onclick=showProducts;
$('pNewBtn').onclick=newProduct;
$('pCancelEdit').onclick=showProducts;
$('pSearch').oninput=renderProducts;
$('pStatusFilter').onchange=renderProducts;

$('productForm').addEventListener('submit',async e=>{
  e.preventDefault();const b=e.submitter;b.disabled=true;$('pSaveMessage').textContent='Đang lưu...';
  try{
    const status=$('pStatus').value,
      p={name:$('pName').value.trim(),slug:$('pSlug').value.trim(),category:$('pCategory').value,price:$('pPrice').value?Number($('pPrice').value):null,description:$('pDescription').value.trim(),image_url:await uploadProductImage(),status},
      id=$('pId').value;
    await req(id?`/rest/v1/products?id=eq.${encodeURIComponent(id)}`:'/rest/v1/products',{method:id?'PATCH':'POST',body:JSON.stringify(p),token:session().access_token,headers:{'Content-Type':'application/json','Prefer':'return=minimal'}});
    $('pSaveMessage').textContent='Đã lưu thành công.';setTimeout(showProducts,500);
  }catch(err){$('pSaveMessage').textContent='Lỗi: '+err.message}
  finally{b.disabled=false}
});

async function deleteProduct(id){
  const p=products.find(x=>x.id===id);
  if(!confirm(`Xóa sản phẩm "${p?.name||''}"?`))return;
  try{await req(`/rest/v1/products?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',token:session().access_token});showProducts()}
  catch(e){alert('Không thể xóa: '+e.message)}
}
