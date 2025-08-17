import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({ className = "" }: ConnectionStatusProps) {
  const { data: facebookStatus } = useQuery({
    queryKey: ['/api/test-facebook'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: geminiStatus } = useQuery({
    queryKey: ['/api/test-gemini'],
    refetchInterval: 30000,
  });

  const getStatusIcon = (connected?: boolean) => {
    if (connected === undefined) return <Clock className="h-4 w-4 text-warning-500" />;
    if (connected) return <CheckCircle className="h-4 w-4 text-success-500" />;
    return <AlertCircle className="h-4 w-4 text-error-500" />;
  };

  const getStatusColor = (connected?: boolean) => {
    if (connected === undefined) return "bg-warning-50";
    if (connected) return "bg-success-50";
    return "bg-error-50";
  };

  const getStatusTextColor = (connected?: boolean) => {
    if (connected === undefined) return "text-warning-700";
    if (connected) return "text-success-700";
    return "text-error-700";
  };

  const getStatusDotColor = (connected?: boolean) => {
    if (connected === undefined) return "bg-warning-500 animate-pulse";
    if (connected) return "bg-success-500";
    return "bg-error-500";
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
      
      <div className="space-y-4">
        <div className={`flex items-center justify-between p-3 ${getStatusColor(facebookStatus?.connected)} rounded-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 ${getStatusDotColor(facebookStatus?.connected)} rounded-full`}></div>
            <span className={`text-sm font-medium ${getStatusTextColor(facebookStatus?.connected)}`}>
              Facebook Webhook
            </span>
          </div>
          {getStatusIcon(facebookStatus?.connected)}
        </div>
        
        <div className={`flex items-center justify-between p-3 ${getStatusColor(geminiStatus?.connected)} rounded-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 ${getStatusDotColor(geminiStatus?.connected)} rounded-full`}></div>
            <span className={`text-sm font-medium ${getStatusTextColor(geminiStatus?.connected)}`}>
              Gemini API
            </span>
          </div>
          {getStatusIcon(geminiStatus?.connected)}
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Rate Limiting</span>
          </div>
          <span className="text-xs text-gray-500" data-testid="text-rate-limit">Active</span>
        </div>
      </div>
    </div>
  );
}
