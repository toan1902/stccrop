# Cài đặt trang quản trị STC CROP

## 1. Tạo cơ sở dữ liệu

1. Tạo dự án tại Supabase.
2. Mở **SQL Editor**, dán toàn bộ nội dung `supabase-setup.sql`, rồi chọn **Run**.
3. Vào **Authentication > Users > Add user** để tạo email và mật khẩu quản trị.
4. Tắt đăng ký công khai trong **Authentication > Sign In / Providers > Email** nếu chỉ quản trị viên được sử dụng.

## 2. Kết nối website

1. Trong Supabase, vào **Project Settings > API**.
2. Sao chép **Project URL** và **anon public key**.
3. Mở `stc-config.js`, thay hai giá trị mẫu bằng thông tin vừa sao chép.
4. Đưa các file lên nhánh chính và chờ Vercel triển khai.

## 3. Sử dụng

- Quản trị: `https://stccrop.com/admin/`
- Trang tin công khai: `https://stccrop.com/tin-tuc.html`
- Đăng nhập bằng tài khoản đã tạo ở bước 1.

Không đưa `service_role key` vào bất kỳ file nào. Website chỉ sử dụng `anon public key`; quyền ghi được bảo vệ bằng đăng nhập và Row Level Security.
