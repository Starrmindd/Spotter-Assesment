function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-slate-600">Calculating route and ELD logs...</p>
    </div>
  )
}

export default LoadingSpinner
