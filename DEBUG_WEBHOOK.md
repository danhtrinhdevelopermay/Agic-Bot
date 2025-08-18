# 🔍 Debug Bot Không Phản Hồi

## ✅ Đã cấu hình đúng:
- Webhook URL: `https://agic-bot.onrender.com/api/webhook` ✅
- Page Subscription: `messages và messaging_postbacks` ✅
- Production app: Online và configured ✅

## 🚨 Vẫn không hoạt động → CÁC NGUYÊN NHÂN CÓ THỂ:

### 1. App Review Status
Facebook App có thể cần được review để hoạt động với pages bên ngoài:
- App chỉ hoạt động với Admin/Developer/Tester roles
- Tin nhắn từ người dùng thường có thể bị block

### 2. Page Access Token Scope
Token có thể thiếu permissions:
- `pages_messaging`
- `pages_manage_metadata`

### 3. App Mode
- App đang ở **Development Mode**?
- Cần switch sang **Live Mode** để nhận tin nhắn từ public

### 4. Signature Verification Issue
- Facebook gửi signature khác với expected
- Có thể cần whitelist một số test messages

## 🛠️ CÁCH KIỂM TRA:

### Test 1: Manual Message Test
```bash
# Test trực tiếp production webhook
curl -X POST https://agic-bot.onrender.com/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"page","entry":[{"messaging":[{"sender":{"id":"123"},"message":{"text":"hello"}}]}]}'
```

### Test 2: Check App Status
1. Facebook Developer Console → App Dashboard
2. Kiểm tra **App Mode**: Development vs Live
3. Nếu Development → Switch to Live Mode

### Test 3: Permissions Check  
1. App Dashboard → App Review → Permissions and Features
2. Đảm bảo có `pages_messaging` permission

### Test 4: Token Debugging
1. Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Paste Page Access Token
3. Check permissions: GET /me/permissions

## 🎯 NEXT STEPS:

### Option 1: Switch to Live Mode
Nếu app đang Development:
1. App Dashboard → App Mode
2. Switch to Live Mode
3. Test lại bot

### Option 2: Add Test User
Nếu vẫn Development Mode:
1. App Dashboard → Roles → Test Users
2. Add Facebook account làm test user
3. Test với account đó

### Option 3: Temporary Disable Signature Check
Để debug, có thể tạm thời bypass signature verification:
- Trong code, comment signature check
- Deploy lại
- Test xem webhook có nhận tin nhắn không

---

## 🚀 MOST LIKELY ISSUE:
**App đang ở Development Mode** → Chỉ Admin/Developer có thể chat với bot

**Solution**: Switch app sang **Live Mode** trong Developer Console!