# 📚 Hướng Dẫn Sử Dụng Hệ Thống Ôn Tập

## 🎯 Phân Biệt Các Chế Độ Học

### 1. **Luyện Tập (Tất cả thẻ)** 🧠
- **Nút**: "Luyện tập (Tất cả thẻ)" (màu trắng)
- **Mục đích**: Học và ôn lại **TẤT CẢ** thẻ trong deck
- **Chế độ**:
  - 🎯 Trắc nghiệm (MCQ)
  - ⌨️ Gõ phím (WRITTEN)
  - 🎲 Hỗn hợp (MIXED)
  - 🔄 Lật thẻ (FLASHCARD)
- **Khi nào dùng**:
  - Học thẻ mới lần đầu
  - Ôn lại toàn bộ deck
  - Luyện tập kỹ năng gõ phím
  - **KHÔNG** theo lịch SRS

### 2. **Ôn tập SRS (Thẻ đến hạn)** 📅
- **Nút**: "Ôn tập SRS (Thẻ đến hạn)" (màu xanh, primary)
- **Mục đích**: Ôn tập **CHỈ CÁC THẺ ĐẾN HẠN** theo lịch Spaced Repetition
- **Cách hoạt động**:
  - Hệ thống tự động tính toán thẻ nào cần ôn hôm nay
  - Chỉ hiển thị thẻ đã đến hạn ôn tập
  - Sử dụng thuật toán SM-2
- **Khi nào dùng**:
  - Khi thông báo có thẻ đến hạn (🔔 ở góc trên)
  - Ôn tập theo lịch trình khoa học
  - Duy trì kiến thức lâu dài

### 3. **Ôn tập Thẻ Khó** 🔥
- **Nút**: "Ôn tập X thẻ khó" (màu cam)
- **Mục đích**: Ôn tập các thẻ bạn hay quên hoặc đánh giá AGAIN
- **Khi nào dùng**:
  - Tập trung vào thẻ khó
  - Cải thiện điểm yếu

---

## 🔔 Thông Báo Thẻ Đến Hạn

### Hiểu Đúng Thông Báo
Khi bạn thấy thông báo "**2 thẻ cần ôn tập**", nghĩa là:
- Có 2 thẻ đến hạn SRS hôm nay
- Bạn cần click nút **"Ôn tập SRS (Thẻ đến hạn)"** (màu xanh)
- **KHÔNG PHẢI** nút "Luyện tập (Tất cả thẻ)"

### Tại Sao "Luyện Tập" Lại Hiển Thị "Hoàn Thành Xuất Sắc"?
Đây **KHÔNG PHẢI LỖI**! Giải thích:

1. **"Luyện tập"** = Học thẻ MỚI hoặc tất cả thẻ
2. **"Ôn tập SRS"** = Ôn thẻ ĐẾN HẠN

Nếu bạn:
- Đã học hết thẻ mới → "Luyện tập" sẽ báo "Hoàn thành" ✅
- Vẫn có thẻ đến hạn → "Ôn tập SRS" vẫn có 2 thẻ ✅

**Kết luận**: Đây là 2 hệ thống khác nhau!

---

## 📊 Quy Trình Học Tập Đúng

### Bước 1: Học Thẻ Mới
```
Deck Detail → "Luyện tập (Tất cả thẻ)" → Chọn mode → Học hết thẻ
```
- Hệ thống ghi nhận thẻ nào bạn đã biết
- Lên lịch ôn tập cho từng thẻ

### Bước 2: Ôn Tập Hàng Ngày
```
Home → Thông báo 🔔 "X thẻ cần ôn tập" → Click "Ôn ngay"
HOẶC
Deck Detail → "Ôn tập SRS (Thẻ đến hạn)"
```
- Chỉ ôn thẻ đến hạn
- Tiết kiệm thời gian
- Hiệu quả cao

### Bước 3: Tổng Ôn Định Kỳ
```
Deck Detail → "Luyện tập (Tất cả thẻ)" → Chọn mode
```
- Ôn lại toàn bộ deck
- Đảm bảo không quên thẻ nào

---

## 🎨 Giao Diện Đã Cải Thiện

### Labels Mới (Rõ Ràng Hơn)
```
Trước: "Học thuộc lòng"
Sau:  "Luyện tập (Tất cả thẻ)" ← Dễ hiểu hơn

Trước: "Ôn tập SRS"
Sau:  "Ôn tập SRS (Thẻ đến hạn)" ← Nhấn mạnh "đến hạn"
```

### Tooltips Chi Tiết
Hover vào mỗi nút để xem:
- 📚 Mục đích của chế độ
- 🎯 Khi nào nên dùng
- ⚠️ Khác biệt với chế độ khác

---

## ⚡ Cải Thiện Performance

### 1. **SWR Data Caching**
✅ Dữ liệu được cache tự động
- Quay lại trang → Hiển thị **ngay lập tức** (0ms)
- Không còn loading skeleton khi chuyển trang
- Revalidate ngầm ở background

### 2. **Optimistic Updates**
✅ UI cập nhật instant khi tạo/sửa thẻ
- Tạo thẻ → Toast success ngay lập tức
- API gọi ngầm ở background
- Không reload trang

### 3. **Smart Prefetching**
✅ Next.js Link prefetching
- Hover vào link → Prefetch data
- Click → Chuyển trang **siêu nhanh**

---

## 💡 Tips & Best Practices

### ✅ Nên
- Ôn tập SRS hàng ngày (theo thông báo)
- Dùng "Luyện tập" cho thẻ mới
- Xem tooltip để hiểu rõ chức năng
- Quay lại trang cũ → Data hiển thị instant (cached)

### ❌ Không Nên
- Bỏ qua thông báo thẻ đến hạn
- Nhầm lẫn "Luyện tập" với "Ôn tập SRS"
- Reload trang thủ công (app tự động sync)

---

## 🐛 Troubleshooting

### Q: Thông báo có 2 thẻ, nhưng "Luyện tập" báo "Hoàn thành"?
**A**: Đúng rồi! Dùng nút **"Ôn tập SRS (Thẻ đến hạn)"** thay vì "Luyện tập".

### Q: Tại sao trang không reload nhưng data vẫn cập nhật?
**A**: SWR tự động revalidate ở background. Đây là tính năng, không phải bug!

### Q: Làm sao biết thẻ nào đến hạn?
**A**: Xem thông báo 🔔 ở góc trên, hoặc click "Ôn tập SRS".

### Q: Data có bị cũ không khi dùng cache?
**A**: Không! SWR tự động fetch data mới ở background và cập nhật.

---

## 🎯 Kết Luận

Hệ thống hiện tại đang hoạt động **ĐÚNG**:
- "Luyện tập" = Học tất cả thẻ
- "Ôn tập SRS" = Ôn thẻ đến hạn
- Performance đã được tối ưu với SWR
- UI mượt mà, instant updates

**Chỉ cần nhớ**: Thông báo thẻ đến hạn → Click "Ôn tập SRS (Thẻ đến hạn)" (nút màu xanh) 🎯
