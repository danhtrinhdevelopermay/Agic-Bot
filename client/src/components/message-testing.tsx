import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface TestMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function MessageTesting() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TestMessage[]>([]);

  const sendTestMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/test-message', { message: text });
      return response.json();
    },
    onSuccess: (data) => {
      const now = new Date().toLocaleTimeString();
      
      // Add user message
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        text: message,
        isUser: true,
        timestamp: now,
      }]);
      
      // Add bot response
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        text: data.response,
        isUser: false,
        timestamp: now,
      }]);
      
      setMessage("");
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to send test message",
        variant: "destructive" 
      });
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendTestMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-comments text-green-600"></i>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Message Testing</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-3">
          <Input
            data-testid="input-test-message"
            type="text"
            placeholder="Type a test message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            data-testid="button-send-test-message"
            onClick={handleSend}
            disabled={sendTestMessageMutation.isPending || !message.trim()}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Send className="h-4 w-4 mr-2" />
            {sendTestMessageMutation.isPending ? "Sending..." : "Send"}
          </Button>
        </div>
        
        {/* Message History */}
        <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p data-testid="text-no-messages">No test messages yet. Send a message to start testing.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isUser 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm" data-testid={`text-message-${msg.id}`}>{msg.text}</p>
                  <span className={`text-xs ${msg.isUser ? 'opacity-75' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
