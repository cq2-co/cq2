"use client";

import { manrope } from "@/app/fonts";
import { Separator } from "@/components/ui/separator";
import { useCQ2DocumentStore, useShowOldVersionStore } from "@/state";
import dayjs from "dayjs";
import parse from "html-react-parser";

const V2DocThread = () => {
  const { showOldVersion, setShowOldVersion } = useShowOldVersionStore();
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();

  return (
    <div
      className={`flex flex-col items-center overflow-y-scroll bg-[#FFFFFF] shadow-none ${
        !showOldVersion
          ? "h-full w-screen pt-32"
          : "mr-0 h-[calc(100vh-4rem)] w-[calc(((100vw)/2)-0.5rem)] pt-8 2xl:w-[45.5rem]"
      }
      `}
      data-is-full={!showOldVersion ? "true" : "false"}
    >
      <div className="w-[44rem]">
        <h5
          className={`${manrope.className} mx-4 mb-5 w-fit rounded-sm bg-blue-50 px-1 py-0 text-xs font-medium tracking-wider text-blue-600`}
        >
          FINAL
        </h5>
        <h1 className="cq2-title-h1 w-full appearance-none border-none px-4 text-4xl font-semibold leading-tight text-[#37362f] focus:outline-none">
          {CQ2Document.version1.title}
        </h1>
        <div className="mt-5 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">by</span>
          {CQ2Document.user_name}
        </div>
        <div className="mt-1 px-4 text-base font-normal text-neutral-600">
          <span className="mr-2 text-neutral-400">on</span>
          {dayjs(CQ2Document.version1.created_on).format("MMM DD YYYY")}
          {", "}
          {dayjs(CQ2Document.version1.created_on).format("hh:mm A")}
        </div>
        <div className="px-4">
          <Separator className="mt-16" />
        </div>
        <div className="relative px-4 pb-16 pt-16">
          {parse(CQ2Document.version2.content)}
        </div>
      </div>
    </div>
  );
};

export default V2DocThread;
