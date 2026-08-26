/**
 * Full-page generic preloader.
 */
export function PagePreloader({ message = 'Loading' }) {
  return (
    <div className="preloader-overlay" role="status" aria-live="polite">
      <div className="preloader-shell">
        <div className="preloader-orbit" aria-hidden="true">
          <span className="preloader-ring preloader-ring-outer" />
          <span className="preloader-ring preloader-ring-inner" />
          <span className="preloader-core" />
        </div>

        <span className="preloader-title">Please wait</span>

        <div className="preloader-line" />

        <div className="preloader-status">
          <span>{message}</span>
          <div className="preloader-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline section loader - used inside content areas
 * while data is being fetched (e.g. Browse grid, Featured section).
 */
export function SectionPreloader({ message = 'Finding the best options for you' }) {
  return (
    <div className="section-preloader animate-fade-in-up" role="status" aria-live="polite">
      <div className="preloader-orbit preloader-orbit-sm" aria-hidden="true">
        <span className="preloader-ring preloader-ring-outer" />
        <span className="preloader-ring preloader-ring-inner" />
        <span className="preloader-core" />
      </div>

      <div className="preloader-line" />

      <div className="preloader-status">
        <span>{message}</span>
        <div className="preloader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton card placeholder - mimics the institute card shape
 * with shimmering placeholder blocks.
 */
export function SkeletonCard() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[22px] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="w-full h-[220px] bg-slate-200 animate-pulse shrink-0" />
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-7 w-3/4 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-4 w-full bg-slate-200 animate-pulse rounded-md" />
        </div>
        <div className="space-y-2.5 pt-1">
          <div className="flex gap-3">
            <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-7 w-24 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-7 w-28 bg-slate-200 animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
          <div className="h-6 w-28 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of skeleton cards - for Browse and Featured sections.
 */
export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[24px] lg:gap-[32px]">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Profile page skeleton - large banner + content blocks.
 */
export function ProfileSkeleton() {
  return (
    <div className="container max-w-6xl px-4 py-8 animate-fade-in-up">
      <div className="skeleton h-4 w-32 mb-5" />

      <div className="skeleton h-[280px] md:h-[420px] w-full rounded-3xl mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-border/40 space-y-4">
            <div className="skeleton h-5 w-28 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-6 w-20" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-6 w-12" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border/40 space-y-3">
            <div className="skeleton h-6 w-48" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border/40 space-y-3">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-16 w-full rounded-2xl" />
          </div>
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-border/40 space-y-4">
            <div className="skeleton h-5 w-36" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-12 w-full rounded-lg" />
            <div className="skeleton h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
