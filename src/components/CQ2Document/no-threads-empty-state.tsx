import { Columns3 } from "lucide-react";

const NoThreadsEmptyState = () => {
  return (
    <div className="flex w-[calc((100vw)/2)] flex-col items-center justify-center 2xl:w-[calc(100vw-48.5rem)]">
      <Columns3 className="h-8 w-8 text-neutral-100" strokeWidth={1.5} />
      <span className="mt-3 font-light text-neutral-300">No open threads</span>
    </div>
  );
};

export default NoThreadsEmptyState;
