import { Skeleton } from "@/components/ui/skeleton";

const CQ2DocumentsListSkeleton = () => {
  return (
    <div>
      <Skeleton className="mt-6 h-12 w-full rounded-lg bg-neutral-50" />
      <Skeleton className="mt-3 h-12 w-full rounded-lg bg-neutral-50" />
      <Skeleton className="mt-3 h-12 w-full rounded-lg bg-neutral-50" />
    </div>
  );
};

export default CQ2DocumentsListSkeleton;
