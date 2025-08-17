import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function SubscriptionGuide() {
  const requiredEvents = [
    { name: "messages", description: "Nhận tin nhắn từ người dùng", required: true },
    { name: "messaging_postbacks", description: "Phản hồi từ nút và menu", required: true }
  ];

  const optionalEvents = [
    { name: "message_reads", description: "Thông báo tin nhắn đã đọc", required: false },
    { name: "messaging_optins", description: "Đồng ý nhận tin nhắn", required: false },
    { name: "messaging_optouts", description: "Từ chối nhận tin nhắn", required: false },
    { name: "message_deliveries", description: "Xác nhận tin nhắn đã gửi", required: false }
  ];

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-600" />
          <span>Hướng dẫn chọn Page Subscriptions</span>
        </CardTitle>
        <CardDescription>
          Sau khi cấu hình webhook, bạn cần chọn các sự kiện mà bot sẽ nhận từ Facebook
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Bước thực hiện */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Các bước thực hiện:</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <p className="text-sm text-gray-700">
                Trong Facebook App, vào <strong>Messenger &gt; Settings &gt; Webhooks</strong>
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <p className="text-sm text-gray-700">
                Tìm trang Facebook của bạn trong danh sách, nhấp <strong>"Edit"</strong> bên cạnh tên trang
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <p className="text-sm text-gray-700">
                Hộp thoại <strong>"Edit Page Subscriptions"</strong> sẽ mở ra với danh sách các sự kiện
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">4</span>
              </div>
              <p className="text-sm text-gray-700">
                Chọn các sự kiện cần thiết và nhấp <strong>"Confirm"</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Sự kiện bắt buộc */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            Sự kiện bắt buộc
          </h4>
          <div className="space-y-2">
            {requiredEvents.map((event) => (
              <div key={event.name} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-red-600" />
                  <div>
                    <code className="font-mono text-sm bg-red-100 px-2 py-1 rounded text-red-700">
                      {event.name}
                    </code>
                    <p className="text-xs text-red-600 mt-1">{event.description}</p>
                  </div>
                </div>
                <Badge variant="destructive" className="bg-red-500 text-white">
                  Bắt buộc
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Sự kiện tùy chọn */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Info className="h-4 w-4 text-blue-500 mr-2" />
            Sự kiện tùy chọn (khuyên chọn)
          </h4>
          <div className="space-y-2">
            {optionalEvents.map((event) => (
              <div key={event.name} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <code className="font-mono text-sm bg-blue-100 px-2 py-1 rounded text-blue-700">
                      {event.name}
                    </code>
                    <p className="text-xs text-blue-600 mt-1">{event.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Tùy chọn
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Lưu ý quan trọng:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>messages</strong> là sự kiện bắt buộc - không có nó bot sẽ không nhận được tin nhắn</li>
                <li>• <strong>messaging_postbacks</strong> cần thiết nếu bot có menu hoặc nút tương tác</li>
                <li>• Chỉ chọn những sự kiện bot thực sự cần để tránh nhận quá nhiều webhook không cần thiết</li>
                <li>• Sau khi chọn xong, nhấp <strong>"Confirm"</strong> để lưu cài đặt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kết quả mong đợi */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-green-800 mb-2">Sau khi hoàn thành:</h5>
              <p className="text-sm text-green-700">
                Bot của bạn sẽ có thể nhận tin nhắn từ trang Facebook và trả lời tự động bằng AI Gemini. 
                Hãy thử gửi tin nhắn đến trang để kiểm tra!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}