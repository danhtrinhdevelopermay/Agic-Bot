import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function RecentLogs() {
  const { data: logs } = useQuery({
    queryKey: ['/api/logs'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (success: boolean) => {
    return success ? "bg-success-500" : "bg-error-500";
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button 
          data-testid="button-clear-logs"
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {!logs || logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p data-testid="text-no-logs">No activity logs yet.</p>
          </div>
        ) : (
          logs.slice(0, 10).map((log: any, index: number) => (
            <div key={log.id || index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 ${getStatusColor(log.success)} rounded-full mt-2 flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900" data-testid={`text-log-message-${index}`}>
                  {log.success 
                    ? `Message processed: "${log.messageText?.substring(0, 30)}${log.messageText?.length > 30 ? '...' : ''}"`
                    : `Error: ${log.error || 'Unknown error'}`
                  }
                </p>
                <p className="text-xs text-gray-500" data-testid={`text-log-timestamp-${index}`}>
                  {log.timestamp ? formatTimestamp(log.timestamp) : 'Unknown time'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          data-testid="button-view-full-logs"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View Full Logs <i className="fas fa-external-link-alt ml-1"></i>
        </button>
      </div>
    </div>
  );
}
