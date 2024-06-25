"use client";

import { useCQ2DocumentStore } from "@/state";
import dayjs from "dayjs";
import parse from "html-react-parser";

const V2DocThread = () => {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();

  return (
    <div className="relative flex h-full w-[calc((100vw)/2)] flex-col rounded-none border-r border-[#EDEDED] bg-[#FFFFFF] pt-0 shadow-none 2xl:w-[48.5rem]">
      <div className="sticky top-0 z-40 flex flex-row justify-between border-b border-[#EDEDED] bg-[#FFFFFF] px-5 py-2 text-sm font-normal">
        <div className={`flex items-center font-normal text-neutral-400`}>
          <span className="rounded-lg bg-blue-50 px-2 py-0 font-medium text-blue-600">
            Version 2
          </span>
          <span className="mx-2">·</span>
          {CQ2Document.user_name}
          <span className="mx-2">·</span>
          {dayjs(CQ2Document.version2.created_on).format("MMM DD, YYYY")}
        </div>
      </div>
      <div className="h-full overflow-y-scroll">
        <div className="relative p-5">
          <h1 className="cq2-title-h1 w-full appearance-none border-none pb-5 text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none">
            {CQ2Document.version2.title}
          </h1>
          <div className="cq2-text-container text-neutral-700">
            {parse(CQ2Document.version2.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default V2DocThread;
