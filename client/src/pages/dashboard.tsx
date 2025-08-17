import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FacebookConfig from "@/components/facebook-config";
import GeminiConfig from "@/components/gemini-config";
import MessageTesting from "@/components/message-testing";
import ConnectionStatus from "@/components/connection-status";
import ActivityStats from "@/components/activity-stats";
import RecentLogs from "@/components/recent-logs";
import SetupGuide from "@/components/setup-guide";
import TroubleshootingGuide from "@/components/troubleshooting-guide";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'troubleshooting'>('guide');
  const { data: config } = useQuery({
    queryKey: ['/api/config'],
  });

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <i className="fab fa-facebook-messenger text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Messenger Bot Configuration</h1>
                <p className="text-sm text-gray-500">Gemini AI Integration Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === 'guide' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('guide')}
                  className="h-8"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Hướng dẫn
                </Button>
                <Button
                  variant={activeTab === 'config' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('config')}
                  className="h-8"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Cấu hình
                </Button>
                <Button
                  variant={activeTab === 'troubleshooting' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('troubleshooting')}
                  className="h-8"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Xử lý lỗi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'guide' ? (
          <div className="max-w-4xl mx-auto">
            <SetupGuide />
          </div>
        ) : activeTab === 'troubleshooting' ? (
          <div className="max-w-4xl mx-auto">
            <TroubleshootingGuide />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <FacebookConfig config={config} />
              <GeminiConfig config={config} />
              <MessageTesting />
            </div>
            
            {/* Right Column: Status & Monitoring */}
            <div className="space-y-6">
              <ConnectionStatus />
              <ActivityStats />
              <RecentLogs />
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button 
                    data-testid="button-restart-bot"
                    className="w-full flex items-center justify-center px-4 py-3 bg-warning-500 hover:bg-warning-600 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <i className="fas fa-redo mr-2"></i>Restart Bot
                  </button>
                  
                  <button 
                    data-testid="button-download-logs"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                  >
                    <i className="fas fa-download mr-2"></i>Download Logs
                  </button>
                  
                  <button 
                    data-testid="button-export-config"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
                  >
                    <i className="fas fa-file-export mr-2"></i>Export Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
