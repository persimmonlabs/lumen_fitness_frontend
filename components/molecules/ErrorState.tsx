export function ErrorState({ message = 'Failed to load data' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
      <div className="text-red-400 mb-2 text-4xl">⚠️</div>
      <p className="text-ocean-300 mb-4">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 text-ocean-400 hover:text-ocean-300 text-sm underline"
      >
        Retry
      </button>
    </div>
  )
}
