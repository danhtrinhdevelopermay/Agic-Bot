import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, Zap, Globe, Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  success: boolean;
  timestamp: string;
  tests?: {
    facebookAPI: boolean;
    geminiAPI: boolean;
    webhookReceived: boolean;
  };
  message?: string;
  sampleResponse?: string;
  error?: string;
}

export function WebhookTest() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const testWebhookMutation = useMutation({
    mutationFn: async (): Promise<TestResult> => {
      const response = await fetch('/api/test-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'webhook-connection' })
      });
      return response.json();
    },
    onSuccess: (data: TestResult) => {
      setTestResult(data);
      if (data.success) {
        toast({
          title: "Test thành công!",
          description: "Webhook và tất cả services đều hoạt động bình thường",
        });
      }
    },
    onError: (error: any) => {
      const errorResult: TestResult = {
        success: false,
        timestamp: new Date().toISOString(),
        error: error.message || 'Có lỗi xảy ra khi test webhook'
      };
      setTestResult(errorResult);
      toast({
        title: "Test thất bại",
        description: errorResult.error,
        variant: "destructive",
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Test Webhook Connection</span>
        </CardTitle>
        <CardDescription>
          Kiểm tra kết nối webhook và tất cả services (Facebook API, Gemini AI)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => testWebhookMutation.mutate()}
            disabled={testWebhookMutation.isPending}
            className="w-full"
          >
            {testWebhookMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang test...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Test Webhook
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <div className="space-y-3">
            <Alert className={testResult.success ? "border-green-500" : "border-red-500"}>
              <AlertDescription className="flex items-center space-x-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span>
                  {testResult.success ? testResult.message : testResult.error}
                </span>
              </AlertDescription>
            </Alert>

            <div className="text-xs text-gray-500">
              Test lúc: {new Date(testResult.timestamp).toLocaleString('vi-VN')}
            </div>

            {testResult.tests && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Kết quả chi tiết:</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Webhook Reception</span>
                    </div>
                    <Badge variant={testResult.tests.webhookReceived ? "default" : "destructive"}>
                      {testResult.tests.webhookReceived ? "✓ OK" : "✗ Fail"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Facebook API</span>
                    </div>
                    <Badge variant={testResult.tests.facebookAPI ? "default" : "destructive"}>
                      {testResult.tests.facebookAPI ? "✓ Connected" : "✗ Failed"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Gemini AI</span>
                    </div>
                    <Badge variant={testResult.tests.geminiAPI ? "default" : "destructive"}>
                      {testResult.tests.geminiAPI ? "✓ Working" : "✗ Error"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {testResult.sampleResponse && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Sample AI Response:</h4>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                  {testResult.sampleResponse}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
            Cách sử dụng:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-200 mt-1 space-y-1">
            <li>• Test này kiểm tra webhook endpoint có hoạt động không</li>
            <li>• Xác minh kết nối Facebook API và Gemini AI</li>
            <li>• Nếu tất cả OK = bot sẵn sàng nhận tin nhắn từ Messenger</li>
            <li>• Nếu có lỗi = kiểm tra configuration hoặc network</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}