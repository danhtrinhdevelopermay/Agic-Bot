export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Chính sách quyền riêng tư - Agic Bot
        </h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Thông tin chúng tôi thu thập
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Khi bạn sử dụng Agic Bot trên Facebook Messenger, chúng tôi thu thập:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Tin nhắn bạn gửi cho bot để có thể phản hồi</li>
              <li>Facebook User ID (được mã hóa) để xác định cuộc trò chuyện</li>
              <li>Thời gian gửi tin nhắn để cải thiện dịch vụ</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              2. Cách chúng tôi sử dụng thông tin
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Phản hồi các tin nhắn của bạn thông qua Google Gemini AI</li>
              <li>Cải thiện chất lượng trò chuyện và dịch vụ</li>
              <li>Phân tích thống kê sử dụng (ẩn danh)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              3. Chia sẻ thông tin
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Chúng tôi KHÔNG chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. 
              Tin nhắn chỉ được xử lý bởi:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mt-2">
              <li>Google Gemini AI (để tạo phản hồi)</li>
              <li>Facebook Messenger Platform (để gửi/nhận tin nhắn)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              4. Bảo mật dữ liệu
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Tất cả dữ liệu được mã hóa khi truyền tải</li>
              <li>Tin nhắn được lưu trữ tạm thời để cải thiện dịch vụ</li>
              <li>Chúng tôi tuân thủ các tiêu chuẩn bảo mật của Facebook</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              5. Quyền của bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Bạn có quyền:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Dừng sử dụng bot bất cứ lúc nào</li>
              <li>Yêu cầu xóa dữ liệu của bạn</li>
              <li>Liên hệ chúng tôi về bất kỳ thắc mắc nào</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              6. Dịch vụ của bên thứ ba
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Agic Bot sử dụng:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mt-2">
              <li><strong>Google Gemini AI:</strong> Xử lý và tạo phản hồi intelligent</li>
              <li><strong>Facebook Messenger Platform:</strong> Giao tiếp với người dùng</li>
              <li><strong>Render.com:</strong> Hosting và cơ sở hạ tầng</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              7. Liên hệ
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ:
            </p>
            <ul className="list-none mt-4 text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>Website:</strong> https://agic-bot.onrender.com</li>
              <li><strong>Facebook:</strong> Nhắn tin trực tiếp cho Agic Bot</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              8. Thay đổi chính sách
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo 
              qua trang này và có hiệu lực ngay khi được đăng tải.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Agic Bot - AI Chatbot cho Facebook Messenger<br/>
            Phiên bản 2.0 • Cập nhật {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
}