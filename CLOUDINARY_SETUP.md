# Hướng dẫn cấu hình Cloudinary

## Bước 1: Đăng ký tài khoản Cloudinary

1. Truy cập: https://cloudinary.com/users/register_free
2. Đăng ký tài khoản miễn phí (Free tier: 25 GB storage, 25 GB bandwidth/tháng)

## Bước 2: Lấy Cloud Name

1. Đăng nhập vào Cloudinary Dashboard
2. Tìm **Cloud Name** ở góc trên bên trái (ví dụ: `dxyz123abc`)
3. Copy giá trị này

## Bước 3: Tạo Upload Preset

1. Vào **Settings** (icon bánh răng góc phải trên)
2. Chọn tab **Upload**
3. Scroll xuống phần **Upload presets**
4. Click **Add upload preset**
5. Cấu hình:
   - **Preset name**: `flashcards_preset` (hoặc tên bạn muốn)
   - **Signing mode**: **Unsigned** (quan trọng!)
   - **Folder**: `flashcards` (tùy chọn)
   - **Access mode**: `public`
6. Click **Save**
7. Copy **Preset name** vừa tạo

## Bước 4: Cấu hình trong Next.js

1. Tạo file `.env.local` trong thư mục `web/`:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=flashcards_preset
```

2. Thay `dxyz123abc` bằng Cloud Name của bạn
3. Thay `flashcards_preset` bằng Upload Preset của bạn

## Bước 5: Restart Next.js Development Server

```bash
# Trong terminal web/
npm run dev
```

## Kiểm tra

1. Vào trang Deck Detail
2. Click "Thêm thẻ" hoặc "Chỉnh sửa thẻ"
3. Click nút "Upload hình ảnh"
4. Chọn một file ảnh (JPEG, PNG, GIF, WebP, tối đa 5MB)
5. Đợi upload hoàn thành
6. Xem ảnh preview trong form
7. Lưu thẻ và kiểm tra trong Review Mode hoặc Learn Mode

## Lưu ý bảo mật

- ✅ **Unsigned Upload Preset** phù hợp cho client-side upload
- ✅ Giới hạn upload: 5MB/file
- ✅ Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)
- ⚠️ **Không commit file `.env.local`** vào Git (đã có trong .gitignore)

## Giới hạn Free Tier

- 25 GB storage
- 25 GB bandwidth/tháng
- 5,000 transformations/tháng

Đủ cho ứng dụng học tập cá nhân hoặc demo!
