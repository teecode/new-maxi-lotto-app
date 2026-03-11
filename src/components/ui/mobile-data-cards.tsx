import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface CardField<T> {
  label: string;
  value: (item: T) => ReactNode;
  /** If true, the value text is rendered bold */
  bold?: boolean;
  /** If true, this field spans the full width (no label beside it) */
  fullWidth?: boolean;
}

interface MobileDataCardsProps<T> {
  data: T[];
  fields: CardField<T>[];
  /** Unique key accessor */
  keyAccessor: (item: T) => string | number;
  isLoading?: boolean;
  loadingCount?: number;
  emptyMessage?: string;
  /** Optional header rendered inside each card (e.g. ID + status row) */
  cardHeader?: (item: T) => ReactNode;
  /** Optional footer rendered inside each card (e.g. action buttons) */
  cardFooter?: (item: T) => ReactNode;
  className?: string;
}

function MobileDataCardSkeleton({ fieldCount }: { fieldCount: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="border-t border-border/50 pt-3 space-y-2.5">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileDataCards<T>({
  data,
  fields,
  keyAccessor,
  isLoading = false,
  loadingCount = 4,
  emptyMessage = 'No data found.',
  cardHeader,
  cardFooter,
  className,
}: MobileDataCardsProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: loadingCount }).map((_, i) => (
          <MobileDataCardSkeleton key={i} fieldCount={fields.length} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('py-12 text-center text-muted-foreground text-sm', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {data.map((item) => (
        <div
          key={keyAccessor(item)}
          className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-primary to-teal-400" />

          <div className="p-4 space-y-3">
            {/* Card header (e.g. ID + badge) */}
            {cardHeader && (
              <div className="flex items-center justify-between">
                {cardHeader(item)}
              </div>
            )}

            {/* Field rows */}
            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className={cn(
                    'flex items-center justify-between text-sm',
                    field.fullWidth && 'flex-col items-start gap-0.5'
                  )}
                >
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">
                    {field.label}
                  </span>
                  <span className={cn('text-foreground', field.bold && 'font-semibold')}>
                    {field.value(item)}
                  </span>
                </div>
              ))}
            </div>

            {/* Card footer (e.g. action buttons) */}
            {cardFooter && (
              <div className="pt-2 border-t border-border/40">
                {cardFooter(item)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
