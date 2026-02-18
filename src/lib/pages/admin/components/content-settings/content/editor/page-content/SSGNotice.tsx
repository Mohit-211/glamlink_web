'use client';

interface SSGNoticeProps {
  show: boolean;
}

export function SSGNotice({ show }: SSGNoticeProps) {
  if (!show) return null;

  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-blue-900">Static Site Generation Enabled</h4>
          <p className="mt-1 text-sm text-blue-700">
            <strong>Production (glamlink.net):</strong> Requires rebuild to see changes<br/>
            <strong>Preview (preview.glamlink.net):</strong> Updates dynamically (ignores SSG)<br/>
            <strong>Localhost:</strong> Uses 5-minute ISR for testing
          </p>
        </div>
      </div>
    </div>
  );
}
