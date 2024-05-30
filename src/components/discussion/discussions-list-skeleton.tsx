import { Skeleton } from "@/components/ui/skeleton";

const DiscussionsListSkeleton = () => {
  return (
    <div>
      <Skeleton className="mt-6 h-12 w-full rounded-2xl bg-neutral-50" />
      <Skeleton className="mt-3 h-12 w-full rounded-2xl bg-neutral-50" />
      <Skeleton className="mt-3 h-12 w-full rounded-2xl bg-neutral-50" />
    </div>
  );
};

export default DiscussionsListSkeleton;
