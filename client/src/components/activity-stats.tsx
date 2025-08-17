import { useQuery } from "@tanstack/react-query";

export default function ActivityStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 60000, // Refresh every minute
  });

  const todayStats = stats?.today || {
    messageCount: 0,
    successCount: 0,
    errorCount: 0,
    avgResponseTime: 0
  };

  const successRate = todayStats.messageCount > 0 
    ? ((todayStats.successCount / todayStats.messageCount) * 100).toFixed(1)
    : "0.0";

  const responseTimeFormatted = todayStats.avgResponseTime > 0
    ? (todayStats.avgResponseTime / 1000).toFixed(1) + "s"
    : "0.0s";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Messages Today</span>
          <span className="text-lg font-semibold text-gray-900" data-testid="text-messages-total">
            {todayStats.messageCount}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Response Time</span>
          <span className="text-lg font-semibold text-success-600" data-testid="text-response-time">
            {responseTimeFormatted}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Success Rate</span>
          <span className="text-lg font-semibold text-success-600" data-testid="text-success-rate">
            {successRate}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Errors</span>
          <span className="text-lg font-semibold text-error-500" data-testid="text-errors">
            {todayStats.errorCount}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          data-testid="button-view-detailed-stats"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View Detailed Analytics <i className="fas fa-arrow-right ml-1"></i>
        </button>
      </div>
    </div>
  );
}
