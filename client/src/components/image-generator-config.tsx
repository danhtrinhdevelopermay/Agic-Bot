import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, TestTube, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageGeneratorConfigProps {
  className?: string;
}

export function ImageGeneratorConfig({ className }: ImageGeneratorConfigProps) {
  const [testPrompt, setTestPrompt] = useState("Một con mèo dễ thương đang chơi với bóng len màu xanh");
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập prompt test",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTestResult("");
    
    try {
      const response = await fetch('/api/test-image-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `tạo hình ảnh ${testPrompt}` }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestResult(data.response || "Không có phản hồi từ server");
      
      toast({
        title: "Test thành công",
        description: "Đã nhận được phản hồi từ service tạo hình ảnh",
      });
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult("Lỗi: " + (error instanceof Error ? error.message : String(error)));
      toast({
        title: "Test thất bại",
        description: "Có lỗi xảy ra khi test service tạo hình ảnh",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <CardTitle>Tạo Hình Ảnh từ Văn Bản</CardTitle>
            <Badge variant="secondary">AI Generator</Badge>
          </div>
          <CardDescription>
            Cấu hình và test tính năng tạo hình ảnh từ mô tả văn bản bằng Gemini AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thông tin tính năng */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tính Năng Hiện Có</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Nhận diện yêu cầu tạo hình ảnh</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Trích xuất prompt từ tin nhắn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Phản hồi thông minh bằng tiếng Việt</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Gợi ý prompt tiếng Anh cải thiện</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-amber-500" />
                <span>Tạo hình ảnh trực tiếp (đang phát triển)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Tích hợp với Facebook Messenger</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Từ khóa nhận diện */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Từ Khóa Nhận Diện</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'tạo hình ảnh', 'tạo ảnh', 'vẽ', 'vẽ cho tôi',
                'generate image', 'create image', 'draw', 'thiết kế',
                'tạo tranh', 'làm ảnh', 'illustration'
              ].map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Test tính năng */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <h3 className="text-sm font-medium">Test Tính Năng</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="test-prompt">Prompt Test</Label>
                <Textarea
                  id="test-prompt"
                  placeholder="Nhập mô tả hình ảnh muốn tạo..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Bot sẽ tự động phát hiện yêu cầu tạo hình ảnh và đưa ra phản hồi thông minh
                </p>
              </div>

              <Button 
                onClick={handleTest} 
                disabled={isLoading || !testPrompt.trim()}
                className="w-full"
                data-testid="button-test-image-generation"
              >
                <TestTube className="mr-2 h-4 w-4" />
                {isLoading ? "Đang test..." : "Test Tạo Hình Ảnh"}
              </Button>

              {testResult && (
                <div className="space-y-2">
                  <Label>Kết Quả Test:</Label>
                  <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                    {testResult}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Hướng dẫn sử dụng */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Hướng Dẫn Sử Dụng</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Cách người dùng sử dụng trên Messenger:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>"Tạo hình ảnh một con mèo dễ thương"</li>
                <li>"Vẽ cho tôi cảnh hoàng hôn trên biển"</li>
                <li>"Generate image of a futuristic city"</li>
                <li>"Thiết kế logo cho công ty ABC"</li>
              </ul>
              <p className="mt-3"><strong>Bot sẽ:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Nhận diện yêu cầu tạo hình ảnh</li>
                <li>Mô tả chi tiết hình ảnh họ muốn</li>
                <li>Đưa ra prompt tiếng Anh cải thiện</li>
                <li>Gợi ý các công cụ AI tạo hình ảnh phù hợp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}