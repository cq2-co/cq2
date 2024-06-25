import { Skeleton } from "@/components/ui/skeleton";

const CQ2DocumentSkeleton = () => {
  return (
    <div className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex">
      <div className="flex h-full w-[calc((100vw)/2)] flex-col gap-5 rounded-none border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
        <div
          className={`sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm`}
        >
          <div className={`flex`}>
            <Skeleton className="h-[1.2rem] w-48 rounded-lg" />
          </div>
          <div className={`flex`}>
            <Skeleton className="h-[1.2rem] w-96 rounded-lg" />
          </div>
        </div>
        <div className="h-full overflow-y-scroll px-5 pb-0 pt-2">
          <div>
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="mt-2 h-8 w-1/2 rounded-lg" />
            <Skeleton className="mt-8 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-8 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded-lg" />
            <Skeleton className="mt-8 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-1/2 rounded-lg" />
            <Skeleton className="mt-8 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
            <Skeleton className="mt-3 h-4 w-full rounded-lg" />
          </div>
        </div>
        <div className="mx-5 mb-5 h-[3rem] w-auto rounded-lg bg-[#f7f7f5]"></div>
      </div>
    </div>
  );
};

export default CQ2DocumentSkeleton;
