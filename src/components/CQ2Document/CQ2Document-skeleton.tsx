import { Skeleton } from "@/components/ui/skeleton";

const CQ2DocumentSkeleton = () => {
  return (
    <div className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex">
      <div className="flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
        <div className="h-full overflow-y-scroll px-5 pb-0 pt-4">
          <div>
            <Skeleton className="h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-8 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded-2xl" />
            <Skeleton className="mt-8 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded-2xl" />
          </div>
          <div className="mt-32 w-full rounded-2xl border bg-[#FFFFFF] p-5">
            <Skeleton className="mt-3 h-3 w-1/6 rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
          </div>
          <div className="mt-5 w-full rounded-2xl border bg-[#FFFFFF] p-5">
            <Skeleton className="mt-3 h-3 w-1/6 rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-full rounded-2xl" />
          </div>
        </div>
        <div className="mx-5 mb-5 h-[6rem] w-auto rounded-2xl border"></div>
      </div>
    </div>
  );
};

export default CQ2DocumentSkeleton;
