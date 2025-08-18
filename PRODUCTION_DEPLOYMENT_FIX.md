# 🚨 Khắc phục Bot không phản hồi trên Production

## Vấn đề hiện tại:
- ✅ Bot hoạt động hoàn hảo trên development (localhost)  
- ✅ Webhook test thành công ở local environment
- ❌ Bot không phản hồi tin nhắn từ Messenger thật

## Nguyên nhân chính:

### 1. **Environment Mismatch**
Facebook webhook đang trỏ tới development server (localhost) thay vì production URL trên Render.

### 2. **Missing Production Config**
Render app có thể thiếu environment variables hoặc đang ở trạng thái sleep.

## Cách khắc phục:

### Bước 1: Kiểm tra Render App Status
1. Vào https://dashboard.render.com/
2. Tìm app `facebook-messenger-bot` 
3. Kiểm tra status: `Live` hay `Sleeping`
4. Copy chính xác Production URL (VD: `https://facebook-messenger-bot-xyz.onrender.com`)

### Bước 2: Cấu hình Environment Variables trên Render

Vào app → Settings → Environment Variables và ADD đầy đủ:

```bash
NODE_ENV=production
pageAccessToken=EAAJ901cZAQYIBPN4uZAQBbAWDkYZBtqI7IfRoOPZCM6OEc4LgyVMpGmk0eD3eLi27NqzMDVJRJgmWLUVfSNzGoSVTqCVPUk3KusHR6SQAiWKPmBiEtnCHAaJgh2T4BZCuYmiDXSDZARCyzWRXaCZB9a0ikTV0dAajblqNEkvcGJeblEIVqRw0qVzyFVN4SZBIukdCYOeQiUBSgZDZD
appSecret=2dc8fd6f712cc891c410590683e944e8
pageId=775431008983105
geminiApiKey=AIzaSyBRDRtTyyedD7he5OSj87ELaq0DSfkUIsw
verifyToken=my_verify_token_2024
geminiModel=gemini-2.0-flash-exp
temperature=0.7
maxTokens=1000
safetySettings=BLOCK_MEDIUM_AND_ABOVE
systemPrompt=Bạn là trợ lý AI thông minh cho Facebook Messenger. Hãy trả lời bằng tiếng Việt một cách tự nhiên, thân thiện và hữu ích.
```

### Bước 3: Update Facebook Webhook URL

1. Vào [Facebook Developer Console](https://developers.facebook.com/)
2. App của bạn → Products → Messenger → Settings  
3. Webhooks section → Edit Subscription
4. **Callback URL**: `https://your-render-app-name.onrender.com/api/webhook`
5. **Verify Token**: `my_verify_token_2024`
6. **Fields**: ✅ messages, ✅ messaging_postbacks
7. Click "Verify and Save"

### Bước 4: Test Production Webhook

Sau khi update, test ngay:
```bash
curl https://your-render-app-name.onrender.com/api/health
```

Nếu thấy response JSON với `status: "ok"` = app đang chạy!

### Bước 5: Wake Up Sleeping App (Nếu cần)

Render Free tier apps sleep sau 15 phút không active:
- Solution 1: Upgrade to Paid plan ($7/month)  
- Solution 2: Setup cron job ping app mỗi 10 phút
- Solution 3: Dùng UptimeRobot để ping định kỳ

## Kiểm tra nhanh:

### Test 1: Production Health Check
```bash
curl https://your-app-name.onrender.com/api/health
```
Expect: `{"status":"ok","configured":true}`

### Test 2: Production Webhook  
```bash
curl -X GET "https://your-app-name.onrender.com/api/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token_2024&hub.challenge=test123"
```
Expect: `test123`

### Test 3: Live Message Test
Nhắn tin trực tiếp cho Facebook Page

## 🔥 Các lỗi thường gặp:

### "Webhook URL couldn't be validated"
- App đang sleep → Wake up bằng cách truy cập URL
- Wrong URL → Check lại production URL  
- Missing env vars → Add đầy đủ environment variables

### "Invalid verify token"  
- Token sai → Phải là CHÍNH XÁC `my_verify_token_2024`
- Case sensitive → Không được có space thừa

### Bot nhận tin nhắn nhưng không reply
- Check Render logs: App Settings → Logs
- Thường là Gemini API key hoặc Facebook API error
- Add logging để debug

---

**Tóm lại: Vấn đề chính là Facebook webhook đang trỏ tới localhost thay vì production URL. Update webhook URL và restart app là xong!**