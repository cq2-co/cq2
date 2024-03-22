"use client";

import dayjs from "dayjs";
import { satoshi } from "@/app/fonts";
import Link from "next/link";
import { SquarePen } from "lucide-react";

export default function Discussions() {
  return (
    <div className="hidden h-[calc(100vh-3.25rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div className="mb-12 flex flex-row justify-between">
          <div
            className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
          >
            Discussions
          </div>
          <div className={`${satoshi.className} flex items-center`}>
            <Link
              href="/new"
              className={`${satoshi.className} flex items-center rounded-lg bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
            >
              <SquarePen
                className="mr-2 inline-block h-3 w-3"
                strokeWidth={3}
              />
              New
            </Link>
          </div>
        </div>
        <div
          className={`mb-2 mt-3 flex items-center text-lg font-normal text-neutral-400`}
        >
          You are part of
        </div>
        <div className={`mb-12 flex flex-col items-center`}>
          <Link
            href="/discussions/13242"
            className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-lg bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
          >
            <div className="text-md basis-10/12 font-medium text-neutral-700">
              Generative AI for our filmmaking?
            </div>
            <div className="basis-1/12 text-sm font-medium text-neutral-500">
              Caleb
            </div>
            <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
              {dayjs(1708620881590).format("DD/MM/YY")}
            </div>
          </Link>
        </div>
        <div
          className={`mb-2 mt-3 flex items-center text-lg font-normal text-neutral-400`}
        >
          You created
        </div>
        <div className={`mb-12 flex flex-col items-center`}>
          <Link
            href="/discussions/13242"
            className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-lg bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
          >
            <div className="text-md basis-10/12 font-medium text-neutral-700">
              Generative AI for our filmmaking?
            </div>
            <div className="basis-1/12 text-sm font-medium text-neutral-500">
              Caleb
            </div>
            <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
              {dayjs(1708620881590).format("DD/MM/YY")}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
