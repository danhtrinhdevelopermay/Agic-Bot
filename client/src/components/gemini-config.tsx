import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface GeminiConfigProps {
  config?: any;
}

export default function GeminiConfig({ config }: GeminiConfigProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    geminiApiKey: "",
    geminiModel: "gemini-2.5-flash",
    temperature: 0.7,
    maxTokens: 1000,
    safetySettings: "BLOCK_MEDIUM_AND_ABOVE",
    systemPrompt: "You are a helpful assistant for Facebook Messenger.",
  });

  // Update form data when config changes
  useEffect(() => {
    if (config) {
      setFormData(prev => ({
        geminiApiKey: config.geminiApiKey === '***masked***' ? prev.geminiApiKey : config.geminiApiKey || "",
        geminiModel: config.geminiModel || "gemini-2.5-flash",
        temperature: parseFloat(config.temperature || "0.7"),
        maxTokens: config.maxTokens || 1000,
        safetySettings: config.safetySettings || "BLOCK_MEDIUM_AND_ABOVE",
        systemPrompt: config.systemPrompt || "You are a helpful assistant for Facebook Messenger.",
      }));
    }
  }, [config]);

  const saveConfigMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/config', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Gemini configuration saved" });
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
      const response = await apiRequest('POST', '/api/test-gemini');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: data.connected ? "Success" : "Error", 
        description: data.connected ? "Gemini API connection successful" : "Gemini API connection failed",
        variant: data.connected ? "default" : "destructive"
      });
    },
  });

  const handleSave = () => {
    // Only send the Gemini fields that are being updated
    const geminiConfig = {
      geminiApiKey: formData.geminiApiKey,
      geminiModel: formData.geminiModel,
      temperature: formData.temperature.toString(),
      maxTokens: formData.maxTokens,
      safetySettings: formData.safetySettings,
      systemPrompt: formData.systemPrompt,
    };

    saveConfigMutation.mutate(geminiConfig);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-sm"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Gemini AI Configuration</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-warning-600 font-medium">Ready</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-700 mb-2">API Key</Label>
          <div className="relative">
            <Input
              data-testid="input-gemini-api-key"
              type={showApiKey ? "text" : "password"}
              placeholder={config?.geminiApiKey === '***masked***' ? "••••••••••••• (đã lưu)" : "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx..."}
              value={formData.geminiApiKey}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              className="pr-10 font-mono text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Model</Label>
          <Select value={formData.geminiModel} onValueChange={(value) => setFormData({ ...formData, geminiModel: value })}>
            <SelectTrigger data-testid="select-gemini-model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash">gemini-2.5-flash</SelectItem>
              <SelectItem value="gemini-2.5-pro">gemini-2.5-pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Temperature</Label>
          <div className="flex items-center space-x-3">
            <Slider
              data-testid="slider-temperature"
              value={[formData.temperature]}
              onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
              max={1}
              min={0}
              step={0.1}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-600 w-10" data-testid="text-temperature">
              {formData.temperature.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</Label>
          <Input
            data-testid="input-max-tokens"
            type="number"
            value={formData.maxTokens}
            onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 1000 })}
            min={1}
            max={2048}
          />
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Safety Setting</Label>
          <Select value={formData.safetySettings} onValueChange={(value) => setFormData({ ...formData, safetySettings: value })}>
            <SelectTrigger data-testid="select-safety-settings">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BLOCK_MEDIUM_AND_ABOVE">Block Medium and Above</SelectItem>
              <SelectItem value="BLOCK_ONLY_HIGH">Block Only High</SelectItem>
              <SelectItem value="BLOCK_NONE">Block None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</Label>
          <Textarea
            data-testid="textarea-system-prompt"
            rows={3}
            placeholder="You are a helpful assistant for Facebook Messenger..."
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            className="resize-none"
          />
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 space-x-3">
        <Button
          data-testid="button-save-gemini-config"
          onClick={handleSave}
          disabled={saveConfigMutation.isPending}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <i className="fas fa-save mr-2"></i>
          {saveConfigMutation.isPending ? "Saving..." : "Save Configuration"}
        </Button>
        
        <Button
          data-testid="button-test-gemini-api"
          onClick={() => testConnectionMutation.mutate()}
          disabled={testConnectionMutation.isPending}
          variant="outline"
        >
          <i className="fas fa-flask mr-2"></i>
          {testConnectionMutation.isPending ? "Testing..." : "Test API"}
        </Button>
      </div>
    </div>
  );
}
