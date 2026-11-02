export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--raised)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--line)] border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[var(--faint)] font-medium">Loading Admin Panel...</p>
      </div>
    </div>
  );
}
