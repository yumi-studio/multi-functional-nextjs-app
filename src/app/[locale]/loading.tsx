export default function Loading() {
  return (
    <div className="flex items-center justify-center bg-gray-50 fixed z-[9999] top-0 left-0 w-svw h-svh">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
