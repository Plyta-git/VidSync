export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary" aria-label="Loading" />
    </div>
  );
}