import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Info, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function TroubleshootingGuide() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Đã sao chép", description: "Đã sao chép vào clipboard" });
  };

  const commonIssues = [
    {
      id: "webhook-verification",
      title: "Lỗi xác thực webhook",
      symptoms: ["Không thể xác thực URL gọi lại hoặc mã xác minh", "Status 403 hoặc 500"],
      solutions: [
        {
          step: "Kiểm tra URL webhook",
          details: "Đảm bảo URL webhook chính xác và có thể truy cập",
          code: `${window.location.origin}/api/webhook`
        },
        {
          step: "Xác nhận Verify Token",
          details: "Token phải khớp chính xác (phân biệt hoa thường)",
          code: "my_verify_token_2024"
        },
        {
          step: "Kiểm tra HTTPS",
          details: "Facebook chỉ chấp nhận webhook HTTPS, không phải HTTP"
        },
        {
          step: "Test từ browser",
          details: "Thử truy cập URL webhook trực tiếp để kiểm tra",
          action: () => window.open(`${window.location.origin}/api/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token_2024&hub.challenge=test`, '_blank')
        }
      ]
    },
    {
      id: "no-messages",
      title: "Bot không nhận được tin nhắn",
      symptoms: ["Gửi tin nhắn nhưng bot không phản hồi", "Không có log tin nhắn"],
      solutions: [
        {
          step: "Kiểm tra Page Subscriptions",
          details: "Đảm bảo đã chọn 'messages' trong Page Subscriptions"
        },
        {
          step: "Xác nhận Page Access Token",
          details: "Token phải có quyền truy cập vào trang Facebook"
        },
        {
          step: "Kiểm tra App Secret",
          details: "App Secret cần chính xác để xác thực webhook"
        },
        {
          step: "Test cấu hình",
          details: "Sử dụng các nút 'Test Connection' trong dashboard"
        }
      ]
    },
    {
      id: "gemini-errors",
      title: "Lỗi Gemini API",
      symptoms: ["Bot nhận tin nhắn nhưng không phản hồi", "Lỗi API key hoặc quota"],
      solutions: [
        {
          step: "Kiểm tra API Key",
          details: "Đảm bảo Gemini API key hợp lệ và chưa hết hạn"
        },
        {
          step: "Xác nhận quota",
          details: "Kiểm tra giới hạn sử dụng API tại Google AI Studio",
          action: () => window.open('https://aistudio.google.com/app/apikey', '_blank')
        },
        {
          step: "Test API riêng lẻ",
          details: "Sử dụng 'Message Testing' để test trực tiếp"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Xử lý sự cố thường gặp</span>
          </CardTitle>
          <CardDescription>
            Hướng dẫn khắc phục các lỗi phổ biến khi thiết lập bot
          </CardDescription>
        </CardHeader>
      </Card>

      {commonIssues.map((issue, index) => (
        <Card key={issue.id} className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  Sự cố {index + 1}
                </Badge>
                <span className="text-base font-medium">{issue.title}</span>
              </div>
            </CardTitle>
            <CardDescription>
              <strong>Triệu chứng:</strong> {issue.symptoms.join(", ")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Cách khắc phục:
              </h5>
              
              {issue.solutions.map((solution, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-900 mb-1">{solution.step}</h6>
                      <p className="text-sm text-gray-600 mb-2">{solution.details}</p>
                      
                      {solution.code && (
                        <div className="bg-gray-50 rounded p-2 relative">
                          <code className="text-sm font-mono text-gray-800">{solution.code}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => copyToClipboard(solution.code!)}
                          >
                            📋
                          </Button>
                        </div>
                      )}
                      
                      {solution.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={solution.action}
                          className="mt-2"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Kiểm tra
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick diagnostic */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Info className="h-5 w-5" />
            <span>Chẩn đoán nhanh</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span>1. Webhook URL có trả về 200?</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`${window.location.origin}/api/webhook?hub.mode=subscribe&hub.verify_token=my_verify_token_2024&hub.challenge=test123`, '_blank')}
              >
                Test
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span>2. Facebook có thể kết nối?</span>
              <Button variant="outline" size="sm">Test Connection</Button>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border">
              <span>3. Gemini API hoạt động?</span>
              <Button variant="outline" size="sm">Test API</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}