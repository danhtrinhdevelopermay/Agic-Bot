import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Globe, ExternalLink, Copy, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductionUrlStatus {
  url: string;
  reachable: boolean;
  configured: boolean;
  error?: string;
}

export function ProductionConfig() {
  const [productionUrl, setProductionUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<ProductionUrlStatus | null>(null);
  const { toast } = useToast();

  const checkProductionUrl = async () => {
    if (!productionUrl.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập production URL",
        variant: "destructive",
      });
      return;
    }

    setChecking(true);
    try {
      const healthUrl = `${productionUrl.replace(/\/$/, '')}/api/health`;
      const response = await fetch(healthUrl);
      const data = await response.json();
      
      setStatus({
        url: productionUrl,
        reachable: response.ok,
        configured: data.configured || false,
        error: response.ok ? undefined : `HTTP ${response.status}`
      });

      if (response.ok && data.configured) {
        toast({
          title: "Thành công!",
          description: "Production app đang chạy và đã được cấu hình",
        });
      }
    } catch (error) {
      setStatus({
        url: productionUrl,
        reachable: false,
        configured: false,
        error: 'Không thể kết nối - App có thể đang sleep hoặc URL sai'
      });
    } finally {
      setChecking(false);
    }
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `${productionUrl.replace(/\/$/, '')}/api/webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Đã copy!",
      description: "Webhook URL đã được copy vào clipboard",
    });
  };

  const generateRenderUrl = () => {
    const appName = "facebook-messenger-bot";
    const generatedUrl = `https://${appName}.onrender.com`;
    setProductionUrl(generatedUrl);
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-orange-600" />
          <span>Production Configuration</span>
        </CardTitle>
        <CardDescription>
          Kiểm tra và cấu hình URL production để Facebook webhook có thể kết nối
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="production-url">Production URL (Render App)</Label>
          <div className="flex space-x-2">
            <Input
              id="production-url"
              placeholder="https://your-app-name.onrender.com"
              value={productionUrl}
              onChange={(e) => setProductionUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={generateRenderUrl}
              className="whitespace-nowrap"
            >
              Auto Generate
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            URL của app Render deployment (không phải localhost)
          </p>
        </div>

        <Button
          onClick={checkProductionUrl}
          disabled={checking || !productionUrl.trim()}
          className="w-full"
        >
          {checking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Check Production Status
            </>
          )}
        </Button>

        {status && (
          <div className="space-y-3">
            <Alert className={status.reachable ? "border-green-500" : "border-red-500"}>
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status.reachable ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>
                    {status.reachable 
                      ? (status.configured ? "Production app hoạt động bình thường" : "App chạy nhưng chưa được cấu hình")
                      : (status.error || "Không thể kết nối")
                    }
                  </span>
                </div>
                <Badge variant={status.reachable ? "default" : "destructive"}>
                  {status.reachable ? "Online" : "Offline"}
                </Badge>
              </AlertDescription>
            </Alert>

            {status.reachable && (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
                    Facebook Webhook Configuration:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 dark:text-blue-200">Callback URL:</span>
                      <div className="flex items-center space-x-1">
                        <code className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                          {status.url}/api/webhook
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyWebhookUrl}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 dark:text-blue-200">Verify Token:</span>
                      <code className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">
                        my_verify_token_2024
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 dark:text-blue-200">Fields:</span>
                      <span className="text-blue-700 dark:text-blue-200 text-xs">
                        messages, messaging_postbacks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${status.url}/api/health`, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Health Check
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://developers.facebook.com/apps', '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Facebook Dev Console
                  </Button>
                </div>
              </div>
            )}

            {!status.reachable && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <h4 className="font-medium text-sm text-red-900 dark:text-red-100 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Cần khắc phục:
                </h4>
                <ul className="text-xs text-red-700 dark:text-red-200 space-y-1">
                  <li>• Kiểm tra URL có chính xác không</li>
                  <li>• App Render có thể đang sleep (Free tier)</li>
                  <li>• Thêm Environment Variables trên Render</li>
                  <li>• Deploy lại nếu code có thay đổi</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            Lưu ý quan trọng:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
            <li>• Production URL phải là HTTPS và có thể truy cập từ internet</li>
            <li>• Render Free tier apps sẽ sleep sau 15 phút không hoạt động</li>
            <li>• Facebook webhook phải trỏ tới production URL, không phải localhost</li>
            <li>• Cần cấu hình đầy đủ Environment Variables trên Render</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}