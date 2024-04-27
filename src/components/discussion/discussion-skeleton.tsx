import { Skeleton } from "@/components/ui/skeleton";

const DiscussionSkeleton = () => {
  return (
    <div className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex">
      <div className="flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-neutral-200 bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
        <div className="h-full overflow-y-scroll px-5 pb-0 pt-4">
          <div>
            <Skeleton className="h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-8 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded-none" />
          </div>
          <div className="mt-32 w-full rounded-none border bg-[#FFFFFF] p-5">
            <Skeleton className="mt-3 h-3 w-1/6 rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
          </div>
          <div className="mt-3 w-full rounded-none border bg-[#FFFFFF] p-5">
            <Skeleton className="mt-3 h-3 w-1/6 rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
            <Skeleton className="mt-3 h-4 w-full rounded-none" />
          </div>
        </div>
        <div className="mx-5 mb-5 mt-auto h-[5.7rem] w-auto border"></div>
      </div>
    </div>
  );
};

export default DiscussionSkeleton;
