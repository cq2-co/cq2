"use client";

import { satoshi } from "@/app/fonts";
import CQ2DocumentsListSkeleton from "@/components/CQ2Document/CQ2Documents-list-skeleton";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CQ2Documents() {
  const [createdCQ2Documents, setCreatedCQ2Documents] = useState([]);
  const [commentedCQ2Documents, setCommentedCQ2Documents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let tempCreatedCQ2Documents = [];

      const createdCQ2DocumentsFromLS = localStorage.getItem(
        "cq2CreatedCQ2Documents",
      );

      if (createdCQ2DocumentsFromLS) {
        const createdCQ2DocumentsFromLSJSON = JSON.parse(
          createdCQ2DocumentsFromLS,
        );

        for (
          let i = 0;
          i < createdCQ2DocumentsFromLSJSON.CQ2Documents.length;
          i += 1
        ) {
          tempCreatedCQ2Documents.push(
            createdCQ2DocumentsFromLSJSON.CQ2Documents[i],
          );
        }
      }

      setCreatedCQ2Documents(tempCreatedCQ2Documents);

      let tempCommentedCQ2Documents = [];

      const commentedCQ2DocumentsFromLS = localStorage.getItem(
        "cq2CommentedCQ2Documents",
      );

      if (commentedCQ2DocumentsFromLS) {
        const commentedCQ2DocumentsFromLSJSON = JSON.parse(
          commentedCQ2DocumentsFromLS,
        );

        for (
          let i = 0;
          i < commentedCQ2DocumentsFromLSJSON.CQ2Documents.length;
          i += 1
        ) {
          tempCommentedCQ2Documents.push(
            commentedCQ2DocumentsFromLSJSON.CQ2Documents[i],
          );
        }
      }

      setCommentedCQ2Documents(tempCommentedCQ2Documents);

      setLoading(false);
    }
  }, [setCreatedCQ2Documents, setCommentedCQ2Documents]);

  return (
    <div className="hidden h-[calc(100vh-2.5rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-xl border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div className="mb-16 flex flex-row justify-between">
          <div
            className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
          >
            Documents
          </div>
          <div className={`${satoshi.className} flex items-center`}>
            <Link
              href="/app/new"
              className={`${satoshi.className} flex items-center rounded-xl bg-[#FF4F00] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF4F00]/90`}
            >
              <SquarePen
                className="mr-2.5 inline-block h-3 w-3"
                strokeWidth={3}
              />
              New
            </Link>
          </div>
        </div>
        <div
          className={`mb-4 flex items-center text-lg font-normal text-neutral-400`}
        >
          You are part of
        </div>
        {loading && <CQ2DocumentsListSkeleton />}
        {commentedCQ2Documents.map((CQ2Document) => (
          <div className={`flex flex-col items-center`} key={CQ2Document._id}>
            <Link
              href={`/app/document/${CQ2Document._id}`}
              className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-xl bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
            >
              <div className="text-md basis-10/12 font-medium text-neutral-700">
                {CQ2Document.title}
              </div>
              <div className="basis-1/12 text-sm font-medium text-neutral-500">
                {CQ2Document.user_name}
              </div>
              <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                {dayjs(CQ2Document.created_on).format("DD/MM/YY")}
              </div>
            </Link>
          </div>
        ))}
        {!loading && commentedCQ2Documents.length === 0 && (
          <span className="text-neutral-700">
            Looks like you haven&#39;t taken part in any documents yet.
          </span>
        )}
        <div
          className={`mb-4 mt-16 flex items-center text-lg font-normal text-neutral-400`}
        >
          You started
        </div>
        {loading && <CQ2DocumentsListSkeleton />}
        {createdCQ2Documents.map((CQ2Document) => (
          <div className={`flex flex-col items-center`} key={CQ2Document._id}>
            <Link
              href={`/app/document/${CQ2Document._id}`}
              className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-xl bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
            >
              <div className="text-md basis-10/12 font-medium text-neutral-700">
                {CQ2Document.title}
              </div>
              <div className="basis-1/12 text-sm font-medium text-neutral-500">
                {CQ2Document.user_name}
              </div>
              <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                {dayjs(CQ2Document.created_on).format("DD/MM/YY")}
              </div>
            </Link>
          </div>
        ))}
        {!loading && createdCQ2Documents.length === 0 && (
          <span className="text-neutral-700">
            Looks like you haven&#39;t created any documents yet.
          </span>
        )}
      </div>
    </div>
  );
}
