# Hướng dẫn Cấu hình AI Magic (Google Gemini API)

## 🚀 Cài đặt API Key

Tính năng **AI Magic** sử dụng Google Gemini API để tạo flashcards tự động. Bạn cần có API key để sử dụng tính năng này.

### 1. Lấy Gemini API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"** để tạo key mới
4. Copy API key (bắt đầu bằng `AIza...`)

### 2. Cấu hình API Key

#### **Cách 1: Sử dụng Environment Variable (Khuyến nghị cho Production)**

**Windows (CMD):**
```cmd
setx GEMINI_API_KEY "AIzaXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

**Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'AIzaXXXXXXXXXXXXXXXXXXXXXXXXXX', 'User')
```

**Linux/Mac (Terminal):**
```bash
export GEMINI_API_KEY="AIzaXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Để lưu vĩnh viễn, thêm vào ~/.bashrc hoặc ~/.zshrc:
echo 'export GEMINI_API_KEY="AIzaXXXXXXXXXXXXXXXXXXXXXXXXXX"' >> ~/.bashrc
source ~/.bashrc
```

**⚠️ Lưu ý:** Sau khi set environment variable, bạn cần **restart terminal** hoặc **restart IDE** để áp dụng.

#### **Cách 2: Cập nhật trực tiếp application.properties (Development Only)**

Mở file `src/main/resources/application.properties` và thay thế:

```properties
# Thay YOUR_ACTUAL_API_KEY bằng key thật của bạn
gemini.api.key=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ Cảnh báo:** 
- **KHÔNG commit API key** vào Git
- Chỉ dùng cách này cho development/testing
- Production nên dùng Environment Variable hoặc Secret Manager

### 3. Kiểm tra cấu hình

Sau khi cấu hình xong:

1. Restart Spring Boot application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. Kiểm tra log khi khởi động:
   - Nếu thấy `gemini.api.key=${GEMINI_API_KEY:your-api-key-here}` → Chưa được cấu hình đúng
   - Nếu thấy `gemini.api.key=AIza...` → Đã cấu hình thành công

3. Test tính năng:
   - Mở frontend: http://localhost:3000
   - Vào một Deck bất kỳ
   - Click nút **"✨ Tạo bằng AI"**
   - Nhập topic và số lượng thẻ
   - Click **"Tạo ngay"**

---

## 📝 Cấu hình AI (Nâng cao)

File `application.properties` có các cấu hình sau:

```properties
# Gemini API Configuration
gemini.api.key=${GEMINI_API_KEY:your-api-key-here}
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
gemini.max.cards=20
```

### Tùy chỉnh cấu hình:

#### Thay đổi số lượng thẻ tối đa:
```properties
gemini.max.cards=50  # Tối đa 50 thẻ mỗi lần generate
```

#### Sử dụng model khác:
```properties
# Gemini 1.5 Pro (chính xác hơn, chậm hơn)
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent

# Gemini 1.5 Flash (nhanh hơn, khuyến nghị)
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

---

## 🔧 Troubleshooting

### Lỗi: "AI service is temporarily unavailable"

**Nguyên nhân:**
- API key chưa được cấu hình
- API key không hợp lệ
- Đã hết quota miễn phí của Google

**Giải pháp:**
1. Kiểm tra API key đã được set chưa:
   ```bash
   echo %GEMINI_API_KEY%  # Windows CMD
   echo $env:GEMINI_API_KEY  # PowerShell
   echo $GEMINI_API_KEY  # Linux/Mac
   ```

2. Kiểm tra API key còn hoạt động:
   - Truy cập: https://aistudio.google.com/app/apikey
   - Xem trạng thái key

3. Kiểm tra quota:
   - Gemini API Free tier: 15 requests/minute, 1500 requests/day
   - Nếu hết quota, đợi 24h hoặc upgrade lên paid plan

### Lỗi: "AI returned invalid format"

**Nguyên nhân:**
- AI trả về format không đúng JSON
- Network timeout

**Giải pháp:**
- Thử lại với topic cụ thể hơn
- Giảm số lượng thẻ xuống 5-10
- Kiểm tra kết nối internet

### Backend không khởi động được

**Kiểm tra:**
1. Java 17 đã được cài đặt:
   ```bash
   java -version  # Phải là Java 17
   ```

2. Maven đã được cài đặt:
   ```bash
   mvn -version
   ```

3. Compile lại project:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

---

## 📚 API Reference

### POST /api/v1/ai/generate

Tạo flashcards bằng AI.

**Request:**
```json
{
  "topic": "IELTS Vocabulary - Environment",
  "quantity": 10,
  "language": "Vietnamese"
}
```

**Response:**
```json
[
  {
    "term": "Deforestation",
    "definition": "Sự phá rừng, chặt phá cây cối quy mô lớn",
    "example": "Deforestation is a major cause of climate change."
  },
  {
    "term": "Renewable energy",
    "definition": "Năng lượng tái tạo (gió, mặt trời, thủy điện)",
    "example": "Many countries are investing in renewable energy."
  }
]
```

**Validation:**
- `topic`: Required, 3-200 characters
- `quantity`: Required, min=1, max=20
- `language`: Required, not blank

---

## 🎯 Best Practices

### 1. Topic nên cụ thể và rõ ràng
✅ **Good:**
- "IELTS Vocabulary - Environment and Climate Change"
- "Vietnamese Cooking - Traditional dishes"
- "Japanese N5 Grammar - Particles"

❌ **Bad:**
- "English" (quá chung chung)
- "Learn stuff" (không rõ ràng)

### 2. Số lượng hợp lý
- **5-10 thẻ**: Tốc độ nhanh, chất lượng cao
- **10-15 thẻ**: Cân bằng giữa tốc độ và số lượng
- **15-20 thẻ**: Nhiều thẻ nhưng có thể chậm hơn

### 3. Language
- Mặc định: `Vietnamese` (định nghĩa tiếng Việt)
- Có thể dùng: `English`, `Japanese`, `Korean`, etc.

### 4. Preview trước khi lưu
- **Luôn review** các thẻ AI tạo ra
- **Edit** những thẻ chưa chính xác
- **Deselect** những thẻ không cần thiết
- Chỉ lưu những thẻ thực sự hữu ích

---

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra lại hướng dẫn này
2. Xem phần Troubleshooting
3. Check backend logs trong terminal
4. Check browser console (F12) để xem lỗi frontend

---

**Happy Learning with AI! 🚀✨**
