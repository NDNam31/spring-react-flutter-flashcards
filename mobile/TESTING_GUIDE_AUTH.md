# 🧪 Testing Guide - Authentication & Sync

## Prerequisites

1. **Backend Running**: Ensure Spring Boot backend is running on `http://localhost:8080`
2. **Test User Created**: Default test user should exist:
   - Email: `user@example.com`
   - Password: `password123`

## Setup

```bash
cd mobile
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

---

## Test Cases

### ✅ Test 1: Login Flow

**Steps**:
1. Launch the app → HomeScreen should appear
2. Tap **Login** icon (person icon) in top-right AppBar
3. LoginScreen should appear with email & password fields
4. Enter credentials:
   - Email: `user@example.com`
   - Password: `password123`
5. Tap **Đăng nhập** button

**Expected Result**:
- ✅ Loading indicator appears on button
- ✅ Navigate back to HomeScreen
- ✅ Green snackbar: "Đăng nhập thành công!"
- ✅ **Account icon** appears in AppBar (instead of Login icon)

**Actual Result**: _______________

---

### ✅ Test 2: Invalid Login

**Steps**:
1. Tap **Login** icon
2. Enter wrong credentials:
   - Email: `wrong@example.com`
   - Password: `wrongpass`
3. Tap **Đăng nhập**

**Expected Result**:
- ✅ Red snackbar: "Đăng nhập thất bại: ..."
- ✅ Remain on LoginScreen
- ✅ No navigation

**Actual Result**: _______________

---

### ✅ Test 3: Form Validation

**Steps**:
1. Open LoginScreen
2. Leave email empty, tap **Đăng nhập**
3. Enter invalid email: `notanemail`
4. Enter short password: `12345` (less than 6 chars)

**Expected Result**:
- ✅ "Vui lòng nhập email" error
- ✅ "Email không hợp lệ" error
- ✅ "Mật khẩu phải có ít nhất 6 ký tự" error

**Actual Result**: _______________

---

### ✅ Test 4: User Account Menu

**Steps**:
1. Login successfully (Test 1)
2. Tap **Account icon** (circle) in AppBar
3. Dropdown menu should appear

**Expected Result**:
- ✅ Menu shows user email: `user@example.com` (greyed out)
- ✅ Divider line
- ✅ "Logout" option with logout icon

**Actual Result**: _______________

---

### ✅ Test 5: Logout Flow

**Steps**:
1. Login (if not logged in)
2. Tap **Account icon** → **Logout**
3. Confirmation dialog appears
4. Tap **Logout** button

**Expected Result**:
- ✅ Dialog: "Are you sure you want to logout?"
- ✅ Navigate back to HomeScreen
- ✅ Snackbar: "Logged out successfully"
- ✅ **Login icon** appears (instead of Account icon)

**Actual Result**: _______________

---

### ✅ Test 6: Token Persistence

**Steps**:
1. Login successfully
2. **Hot restart** the app (stop and restart, not hot reload)
3. App should open to HomeScreen

**Expected Result**:
- ✅ User remains logged in
- ✅ **Account icon** visible (not Login icon)
- ✅ No need to login again

**Actual Result**: _______________

---

### ✅ Test 7: Sync Button (Not Logged In)

**Steps**:
1. Logout (if logged in)
2. Tap **Sync** button (cloud upload icon) in AppBar

**Expected Result**:
- ✅ Dialog appears: "Login Required"
- ✅ Message: "You need to login to sync your data with the server."
- ✅ Two buttons: **Cancel** and **Login**
- ✅ Tapping **Login** → Opens LoginScreen

**Actual Result**: _______________

---

### ✅ Test 8: Sync Button (Logged In)

**Steps**:
1. Login successfully
2. Tap **Sync** button (cloud upload icon)

**Expected Result**:
- ✅ Snackbar appears: "Syncing data..."
- ✅ Loading spinner in snackbar
- ✅ Deck list refreshes (pull from local DB)
- ✅ Duration: 2 seconds

**Note**: SyncService not yet implemented, so no actual server sync occurs.

**Actual Result**: _______________

---

### ✅ Test 9: Password Visibility Toggle

**Steps**:
1. Open LoginScreen
2. Type password: `password123`
3. Observe field shows: `••••••••••••`
4. Tap **eye icon** (visibility toggle)
5. Observe field shows: `password123`
6. Tap eye icon again

**Expected Result**:
- ✅ Initially: Password hidden as dots
- ✅ After tap: Password visible as text
- ✅ Icon changes: `visibility` ↔ `visibility_off`

**Actual Result**: _______________

---

### ✅ Test 10: Logout Cancellation

**Steps**:
1. Login
2. Tap **Account icon** → **Logout**
3. Tap **Cancel** in dialog

**Expected Result**:
- ✅ Dialog closes
- ✅ User remains logged in
- ✅ **Account icon** still visible

**Actual Result**: _______________

---

## 🐛 Bug Reporting

If any test fails, report:
- **Test Number**: ___
- **Error Message**: ___
- **Steps to Reproduce**: ___
- **Screenshots** (if applicable)

---

## 🔍 Debugging Tips

### Check Stored Token
```bash
# Android
adb shell
run-as com.example.flashcards_mobile
cd app_flutter
cat flutter_secure_storage.json
```

### Check Network Logs
Add to `lib/core/network/api_client.dart`:
```dart
_dio.interceptors.add(LogInterceptor(
  requestBody: true,
  responseBody: true,
));
```

### Verify Backend
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "userId": "123e4567-...",
  "email": "user@example.com"
}
```

---

## ✅ Test Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Login Flow | ☐ | |
| 2. Invalid Login | ☐ | |
| 3. Form Validation | ☐ | |
| 4. User Account Menu | ☐ | |
| 5. Logout Flow | ☐ | |
| 6. Token Persistence | ☐ | |
| 7. Sync (Not Logged In) | ☐ | |
| 8. Sync (Logged In) | ☐ | |
| 9. Password Toggle | ☐ | |
| 10. Logout Cancel | ☐ | |

---

**Tester**: _______________  
**Date**: _______________  
**Pass Rate**: ___ / 10
