export default function BlogCardSkeleton() {
  return (
    <div className="nw-card-premium overflow-hidden rounded-2xl">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-24 rounded-full" />
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
        <div className="flex items-center gap-3 border-t border-white/[0.04] pt-4">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-28 rounded" />
            <div className="skeleton h-2.5 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
