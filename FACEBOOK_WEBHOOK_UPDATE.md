# 🎯 Cập nhật Facebook Webhook - BƯỚC CUỐI CÙNG

## ✅ Tình trạng hiện tại:
- Production app đang chạy: `https://agic-bot.onrender.com` 
- Health check OK: App configured và online
- Webhook endpoint sẵn sàng: `/api/webhook`

## 🚀 CẦN LÀM NGAY BÂY GIỜ:

### Bước 1: Mở Facebook Developer Console
1. Truy cập: https://developers.facebook.com/apps
2. Chọn Facebook App của bạn
3. Vào **Products** → **Messenger** → **Settings**

### Bước 2: Cập nhật Webhook Configuration
Trong phần **Webhooks**:

1. Click **"Edit Subscription"** 
2. **Callback URL**: Thay đổi thành:
   ```
   https://agic-bot.onrender.com/api/webhook
   ```
3. **Verify Token**: Giữ nguyên:
   ```
   my_verify_token_2024
   ```
4. **Subscription Fields**: Đảm bảo tích:
   - ✅ **messages**
   - ✅ **messaging_postbacks**

5. Click **"Verify and Save"**

### Bước 3: Chọn Page Subscription
1. Trong phần **Webhooks**, tìm trang Facebook của bạn
2. Click **"Edit"** bên cạnh tên trang
3. Trong hộp thoại **"Edit Page Subscriptions"**:
   - ✅ Tích **messages** 
   - ✅ Tích **messaging_postbacks**
4. Click **"Save"**

## ✅ Kiểm tra thành công:

### Test 1: Webhook Verification
Facebook sẽ gửi GET request để verify:
```
GET https://agic-bot.onrender.com/api/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token_2024&hub.challenge=RANDOM_STRING
```
→ Phải trả về: `RANDOM_STRING`

### Test 2: Nhắn tin thử
1. Vào Facebook Page của bạn
2. Nhắn tin: "Xin chào"
3. Bot sẽ phản hồi trong vài giây

## 🔍 Debug nếu vẫn không hoạt động:

### Lỗi "URL couldn't be validated"
```bash
# Test webhook trực tiếp:
curl "https://agic-bot.onrender.com/api/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token_2024&hub.challenge=test123"
# Expect: test123
```

### Lỗi "Invalid signature" 
- Kiểm tra App Secret có đúng không
- Đảm bảo không có space thừa trong token

### Bot nhận tin nhắn nhưng không phản hồi
```bash
# Kiểm tra logs trên Render:
# Vào Render Dashboard → App → Logs tab
# Tìm message "WEBHOOK RECEIVED" và lỗi nếu có
```

---

## 🎉 SAU KHI CẬP NHẬT WEBHOOK:
Bot sẽ hoạt động ngay lập tức! 

Facebook sẽ gửi tin nhắn từ Messenger → `https://agic-bot.onrender.com/api/webhook` → Bot xử lý và phản hồi qua Gemini AI.

**Thời gian hoàn thành: ~2 phút**