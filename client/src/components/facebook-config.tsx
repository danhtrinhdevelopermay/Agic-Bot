import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Copy } from "lucide-react";

interface FacebookConfigProps {
  config?: any;
}

export default function FacebookConfig({ config }: FacebookConfigProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState({
    pageAccessToken: "",
    appSecret: "",
    verifyToken: "my_verify_token_2024",
    pageId: "",
  });

  // Update form data when config changes
  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        pageAccessToken: config.pageAccessToken === '***masked***' ? prev.pageAccessToken : config.pageAccessToken || "",
        appSecret: config.appSecret === '***masked***' ? prev.appSecret : config.appSecret || "",
        verifyToken: config.verifyToken || "my_verify_token_2024",
        pageId: config.pageId || "",
      }));
    }
  }, [config]);

  const saveConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/config', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Facebook configuration saved" });
      queryClient.invalidateQueries({ queryKey: ['/api/config'] });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save configuration",
        variant: "destructive" 
      });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/test-facebook');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: data.connected ? "Success" : "Error", 
        description: data.connected ? "Facebook connection successful" : "Facebook connection failed",
        variant: data.connected ? "default" : "destructive"
      });
    },
  });

  const handleSave = () => {
    // Only send the Facebook fields that are being updated
    const facebookConfig = {
      pageAccessToken: formData.pageAccessToken,
      appSecret: formData.appSecret,
      verifyToken: formData.verifyToken,
      pageId: formData.pageId,
    };

    saveConfigMutation.mutate(facebookConfig);
  };

  const copyWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/api/webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast({ title: "Copied", description: "Webhook URL copied to clipboard" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="fab fa-facebook text-blue-600"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Facebook Messenger Configuration</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
          <span className="text-xs text-success-600 font-medium">Configured</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Page Access Token</Label>
          <div className="relative">
            <Input
              data-testid="input-page-access-token"
              type={showToken ? "text" : "password"}
              placeholder={config?.pageAccessToken === '***masked***' ? "••••••••••••• (đã lưu)" : "EAAxxxxxxxxxxxxxxxxx..."}
              value={formData.pageAccessToken}
              onChange={(e) => setFormData({ ...formData, pageAccessToken: e.target.value })}
              className="pr-10 font-mono text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">App Secret</Label>
          <div className="relative">
            <Input
              data-testid="input-app-secret"
              type={showSecret ? "text" : "password"}
              placeholder={config?.appSecret === '***masked***' ? "••••••••••••• (đã lưu)" : "a1b2c3d4e5f6..."}
              value={formData.appSecret}
              onChange={(e) => setFormData({ ...formData, appSecret: e.target.value })}
              className="pr-10 font-mono text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</Label>
          <div className="flex space-x-2">
            <Input
              data-testid="input-webhook-url"
              type="text"
              readOnly
              value={`${window.location.origin}/api/webhook`}
              className="flex-1 bg-gray-50 font-mono text-sm"
            />
            <Button
              data-testid="button-copy-webhook"
              variant="outline"
              size="sm"
              onClick={copyWebhookUrl}
              className="px-3"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Verify Token</Label>
          <Input
            data-testid="input-verify-token"
            type="text"
            value={formData.verifyToken}
            onChange={(e) => setFormData({ ...formData, verifyToken: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Page ID</Label>
          <Input
            data-testid="input-page-id"
            type="text"
            value={formData.pageId}
            onChange={(e) => setFormData({ ...formData, pageId: e.target.value })}
            className="font-mono text-sm"
          />
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 space-x-3">
        <Button
          data-testid="button-save-facebook-config"
          onClick={handleSave}
          disabled={saveConfigMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <i className="fas fa-save mr-2"></i>
          {saveConfigMutation.isPending ? "Saving..." : "Save Configuration"}
        </Button>
        
        <Button
          data-testid="button-test-facebook-connection"
          onClick={() => testConnectionMutation.mutate()}
          disabled={testConnectionMutation.isPending}
          variant="outline"
        >
          <i className="fas fa-plug mr-2"></i>
          {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
        </Button>
      </div>
    </div>
  );
}
