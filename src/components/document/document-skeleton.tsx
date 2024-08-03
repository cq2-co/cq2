import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const CQ2DocumentSkeleton = () => {
  return (
    <>
      <div
        className={`flex h-full w-screen flex-col items-center overflow-y-scroll bg-[#FFFFFF] pt-32 shadow-none`}
      >
        <div className={`w-[44rem]`}>
          <h5 className={`mx-4 mb-5`}>
            <Skeleton className="h-4 w-1/6 rounded-sm" />
          </h5>
          <h1 className="w-full appearance-none border-none px-4 text-4xl font-semibold leading-tight text-[#37362f]">
            <Skeleton className="h-8 w-full rounded-sm" />
            <Skeleton className="mt-2 h-8 w-1/2 rounded-sm" />
          </h1>
          <div className="mt-10 px-4 text-base font-normal text-neutral-600">
            <Skeleton className="mt-3 h-4 w-1/3 rounded-sm" />
          </div>
          <div className="mt-1 px-4 text-base font-normal text-neutral-600">
            <Skeleton className="mt-3 h-4 w-1/4 rounded-sm" />
          </div>
          <div className="px-4">
            <Separator className="mt-16" />
          </div>
          <div className="relative px-4 pb-16 pt-16">
            <div>
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-1/2 rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-1/2 rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-1/2 rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-8 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-full rounded-sm" />
              <Skeleton className="mt-3 h-4 w-1/2 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CQ2DocumentSkeleton;
