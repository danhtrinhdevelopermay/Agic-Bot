import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronDown, ExternalLink, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SubscriptionGuide from "./subscription-guide";

interface Step {
  id: string;
  title: string;
  description: string;
  details: string[];
  links?: { text: string; url: string }[];
  code?: string;
  important?: string[];
}

const steps: Step[] = [
  {
    id: "facebook-app",
    title: "1. Tạo Facebook App",
    description: "Tạo ứng dụng Facebook để nhận Page Access Token và App Secret",
    details: [
      "Truy cập Facebook for Developers",
      "Đăng nhập bằng tài khoản Facebook của bạn",
      "Nhấp 'Create App' và chọn 'Business'",
      "Nhập tên ứng dụng và email liên hệ",
      "Thêm sản phẩm 'Messenger' vào app"
    ],
    links: [
      { text: "Facebook for Developers", url: "https://developers.facebook.com/" }
    ]
  },
  {
    id: "page-token",
    title: "2. Lấy Page Access Token",
    description: "Tạo token để bot có thể gửi tin nhắn từ trang Facebook của bạn",
    details: [
      "Trong Facebook App, vào Messenger > Settings",
      "Tại phần 'Access Tokens', nhấp 'Add or Remove Pages'",
      "Chọn trang Facebook bạn muốn kết nối",
      "Copy Page Access Token (bắt đầu bằng 'EAA...')",
      "Lưu token này để nhập vào form cấu hình"
    ],
    important: [
      "Page Access Token cho phép bot gửi tin nhắn thay mặt trang của bạn",
      "Giữ token này bảo mật, không chia sẻ với ai khác"
    ]
  },
  {
    id: "app-secret",
    title: "3. Lấy App Secret",
    description: "App Secret dùng để xác thực webhook từ Facebook",
    details: [
      "Trong Facebook App, vào Settings > Basic",
      "Tìm mục 'App Secret' và nhấp 'Show'",
      "Nhập mật khẩu Facebook để xác nhận",
      "Copy App Secret (chuỗi ký tự ngẫu nhiên)",
      "Lưu secret này để nhập vào form cấu hình"
    ]
  },
  {
    id: "webhook-setup",
    title: "4. Cấu hình Webhook",
    description: "Thiết lập webhook để Facebook gửi tin nhắn đến bot của bạn",
    details: [
      "Sao chép Webhook URL từ form cấu hình Facebook",
      "Trong Facebook App, vào Messenger > Settings",
      "Tại phần 'Webhooks', nhấp 'Add Callback URL'",
      "Dán Webhook URL vào trường 'Callback URL'",
      "Nhập Verify Token (mặc định: 'my_verify_token_2024')",
      "Nhấp 'Verify and Save' để xác thực webhook",
      "Sau khi xác thực thành công, nhấp 'Add Subscriptions'",
      "Chọn trang Facebook bạn muốn kết nối với bot"
    ],
    code: `Webhook URL: ${window.location.origin}/api/webhook
Verify Token: my_verify_token_2024`,
    important: [
      "URL webhook phải là HTTPS và có thể truy cập được từ internet",
      "Verify Token mặc định là 'my_verify_token_2024' - phải khớp chính xác",
      "Nếu verification thất bại, kiểm tra lại URL và token"
    ]
  },
  {
    id: "page-subscriptions",
    title: "5. Chọn Page Subscriptions",
    description: "Chọn các sự kiện mà bot sẽ nhận từ Facebook Messenger",
    details: [
      "Trong phần Webhooks, tìm trang bạn vừa thêm",
      "Nhấp 'Edit' bên cạnh tên trang",
      "Sẽ mở hộp thoại 'Edit Page Subscriptions'",
      "Tích chọn các sự kiện quan trọng cho bot:",
      "• 'messages' - Bắt buộc để nhận tin nhắn từ người dùng",
      "• 'messaging_postbacks' - Cho các nút và menu tương tác",
      "• 'message_reads' - Theo dõi tin nhắn đã đọc (tùy chọn)",
      "Nhấp 'Confirm' để lưu cài đặt"
    ],
    important: [
      "Sự kiện 'messages' là bắt buộc - không có nó bot sẽ không nhận được tin nhắn",
      "Chỉ chọn những sự kiện bot thực sự cần để tránh spam webhook"
    ]
  },
  {
    id: "gemini-api",
    title: "6. Tạo Gemini API Key",
    description: "Lấy API key để bot có thể sử dụng Google Gemini AI",
    details: [
      "Truy cập Google AI Studio",
      "Đăng nhập bằng tài khoản Google của bạn",
      "Nhấp 'Get API Key' trong menu bên trái",
      "Nhấp 'Create API Key' để tạo key mới",
      "Copy API key (bắt đầu bằng 'AIzaSy...')",
      "Lưu key này để nhập vào form cấu hình Gemini"
    ],
    links: [
      { text: "Google AI Studio", url: "https://aistudio.google.com/app/apikey" }
    ]
  },
  {
    id: "test-setup",
    title: "7. Kiểm tra và Test",
    description: "Xác minh cấu hình và test bot",
    details: [
      "Nhập tất cả thông tin vào form cấu hình",
      "Nhấp 'Save Configuration' để lưu cài đặt",
      "Nhấp 'Test Connection' để kiểm tra kết nối Facebook",
      "Nhấp 'Test API' để kiểm tra kết nối Gemini",
      "Sử dụng 'Message Testing' để test phản hồi của bot",
      "Gửi tin nhắn thử nghiệm từ Facebook Messenger",
      "Kiểm tra logs để đảm bảo bot nhận và xử lý tin nhắn đúng"
    ]
  }
];

export default function SetupGuide() {
  const [expandedStep, setExpandedStep] = useState<string>("facebook-app");
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Đã sao chép", description: `${label} đã được sao chép vào clipboard` });
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? "" : stepId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-book text-blue-600"></i>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hướng dẫn cấu hình Bot</h2>
          <p className="text-sm text-gray-500">Làm theo các bước sau để thiết lập bot Messenger</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="border-l-4 border-l-primary-500">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-primary-50 text-primary-600 border-primary-200">
                    Bước {index + 1}
                  </Badge>
                  <div>
                    <CardTitle className="text-base font-medium">{step.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
                {expandedStep === step.id ? 
                  <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                }
              </div>
            </CardHeader>
            
            {expandedStep === step.id && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {step.links && step.links.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Liên kết hữu ích:</h4>
                      {step.links.map((link, idx) => (
                        <a 
                          key={idx}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>{link.text}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {step.code && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Thông tin cần thiết:</h4>
                      <div className="bg-gray-50 rounded-lg p-3 relative">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                          {step.code}
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => copyToClipboard(step.code!, "Thông tin")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step.important && step.important.length > 0 && (
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-warning-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-warning-800">Lưu ý quan trọng:</h4>
                          {step.important.map((note, idx) => (
                            <p key={idx} className="text-sm text-warning-700">{note}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {step.id === "page-subscriptions" && (
                    <div className="mt-4">
                      <SubscriptionGuide />
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-success-800 mb-1">Hoàn tất cấu hình</h4>
            <p className="text-sm text-success-700">
              Sau khi hoàn thành tất cả các bước, bot của bạn sẽ sẵn sàng nhận và trả lời tin nhắn từ Facebook Messenger bằng AI Gemini!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}