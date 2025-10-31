export function StatusIndicator({ isInitialized }: { isInitialized: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${
          isInitialized ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span className="text-sm font-medium text-gray-700">
        {isInitialized ? 'fhEVM Ready' : 'Initializing...'}
      </span>
    </div>
  );
}
