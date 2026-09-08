const requestedPost={
  title:'Công tắc thông minh FPT Smart Home - Đẳng cấp và tiện lợi gói gọn trong một chạm',
  slug:'cong-tac-thong-minh-fpt-smart-home-dang-cap-va-tien-loi-goi-gon-trong-mot-cham',
  excerpt:'Khám phá công tắc cảm ứng FPT Smart Home với thiết kế mặt kính hiện đại, khả năng điều khiển linh hoạt và các kịch bản sống tiện nghi.',
  content_html:`<p>Công tắc thông minh không chỉ thay thế thao tác bật và tắt truyền thống, mà còn giúp ngôi nhà phản hồi linh hoạt theo nhu cầu của từng thành viên.</p>
  <h2>Thiết kế tinh tế cho không gian hiện đại</h2><p>Công tắc cảm ứng FPT Smart Home sử dụng mặt kính cường lực, kiểu dáng tối giản và đèn LED hỗ trợ định vị trong bóng tối. Thiết bị phù hợp với nhiều phong cách nội thất, từ căn hộ đến nhà phố và biệt thự.</p>
  <h2>Cá nhân hóa bằng kịch bản sống</h2><p>Người dùng có thể kết hợp công tắc với rèm, đèn và các thiết bị khác để tạo kịch bản thư giãn, tiếp khách hoặc rời nhà. Nhiều thao tác được thực hiện đồng thời chỉ bằng một lần chạm trên bảng điều khiển hoặc ứng dụng.</p>
  <h2>Điều khiển linh hoạt và giám sát từ xa</h2><p>Hệ thống hỗ trợ điều khiển bằng điện thoại và giọng nói tiếng Việt. Khi kết hợp cùng camera và cảm biến, gia chủ có thể theo dõi ngôi nhà từ xa, kiểm tra thiết bị đang hoạt động và hạn chế điện năng sử dụng không cần thiết.</p>
  <h2>Hỗ trợ an toàn cho gia đình</h2><p>Các kịch bản ánh sáng ban đêm có thể giúp người cao tuổi và trẻ nhỏ di chuyển thuận tiện hơn. Hệ thống cũng có thể phối hợp với điều hòa và cảm biến để duy trì môi trường sống dễ chịu.</p>
  <h2>Tư vấn FPT Smart Home tại Đắk Lắk</h2><p>STC CROP cung cấp giải pháp FPT Smart Home phù hợp theo nhu cầu thực tế của từng công trình.</p><p><strong>Hotline:</strong> 0917 07 1717<br><strong>Địa chỉ:</strong> 104 Nguyễn Thượng Hiền, phường Tân An, Đắk Lắk.</p><p><a href="https://smarthomedaklak.com/blogs/news/cong-tac-thong-minh-fpt-smart-home-dang-cap-va-tien-loi-goi-gon-trong-mot-cham" target="_blank" rel="noopener">Xem bài viết nguồn trên STC Telecom</a></p>`,
  cover_url:null,status:'published',published_at:'2026-08-11T00:00:00+07:00'
};
async function ensureRequestedPost(){
  if(!session())return;
  const rows=await req('/rest/v1/posts?select=id&slug=eq.'+encodeURIComponent(requestedPost.slug)+'&limit=1',{token:session().access_token});
  if(!rows.length)await req('/rest/v1/posts',{method:'POST',body:JSON.stringify(requestedPost),token:session().access_token,headers:{'Content-Type':'application/json','Prefer':'return=minimal'}});
}
showApp=async function(){$('loginView').hidden=true;$('appView').hidden=false;try{await ensureRequestedPost()}catch(e){console.warn('Không thể nhập bài tự động:',e.message)}showPosts()};
if(session())ensureRequestedPost().then(showPosts).catch(()=>{});
