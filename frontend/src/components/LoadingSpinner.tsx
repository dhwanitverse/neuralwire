export default function LoadingSpinner({
  size = 'md',
  dark = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}) {
  const sizes = { sm: 'h-5 w-5', md: 'h-9 w-9', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-[3px] ${
          dark ? 'border-white/10 border-t-indigo-400' : 'border-slate-200 border-t-indigo-600'
        }`}
      />
      <p className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Loading...</p>
    </div>
  );
}
