"use client";

import dayjs from "dayjs";
import { satoshi } from "@/app/fonts";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { useState, useEffect } from "react";

export default function Discussions() {
  const [createdDiscussions, setCreatedDiscussions] = useState([]);
  const [commentedDiscussions, setCommentedDiscussions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let tempCreatedDiscussions = [];

      const createdDiscussionsFromLS = localStorage.getItem(
        "cq2CreatedDiscussions",
      );

      if (createdDiscussionsFromLS) {
        const createdDiscussionsFromLSJSON = JSON.parse(
          createdDiscussionsFromLS,
        );

        for (
          let i = 0;
          i < createdDiscussionsFromLSJSON.discussions.length;
          i += 1
        ) {
          tempCreatedDiscussions.push(
            createdDiscussionsFromLSJSON.discussions[i],
          );
        }
      }

      setCreatedDiscussions(tempCreatedDiscussions);

      let tempCommentedDiscussions = [];

      const commentedDiscussionsFromLS = localStorage.getItem(
        "cq2CommentedDiscussions",
      );

      if (commentedDiscussionsFromLS) {
        const commentedDiscussionsFromLSJSON = JSON.parse(
          commentedDiscussionsFromLS,
        );

        for (
          let i = 0;
          i < commentedDiscussionsFromLSJSON.discussions.length;
          i += 1
        ) {
          tempCommentedDiscussions.push(
            commentedDiscussionsFromLSJSON.discussions[i],
          );
        }
      }

      setCommentedDiscussions(tempCommentedDiscussions);

      setLoading(false);
    }
  }, [setCreatedDiscussions, setCommentedDiscussions]);

  return (
    <div className="hidden h-[calc(100vh-2.5rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div className="mb-16 flex flex-row justify-between">
          <div
            className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
          >
            Discussions
          </div>
          <div className={`${satoshi.className} flex items-center`}>
            <Link
              href="/app/new"
              className={`${satoshi.className} flex items-center rounded-none bg-[#FF5F1F] px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-[#FF5F1F]/90`}
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
        {commentedDiscussions.map((discussion) => (
          <div className={`flex flex-col items-center`} key={discussion._id}>
            <Link
              href={`/app/discussions/${discussion._id}`}
              className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-none bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
            >
              <div className="text-md basis-10/12 font-medium text-neutral-700">
                {discussion.title}
              </div>
              <div className="basis-1/12 text-sm font-medium text-neutral-500">
                {discussion.user_name}
              </div>
              <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                {dayjs(discussion.created_on).format("DD/MM/YY")}
              </div>
            </Link>
          </div>
        ))}
        {!loading && commentedDiscussions.length === 0 && (
          <span className="text-neutral-700">
            Looks like you haven&#39;t taken part in any discussions yet.
          </span>
        )}
        <div
          className={`mb-4 mt-16 flex items-center text-lg font-normal text-neutral-400`}
        >
          You started
        </div>
        {createdDiscussions.map((discussion) => (
          <div className={`flex flex-col items-center`} key={discussion._id}>
            <Link
              href={`/app/discussions/${discussion._id}`}
              className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-none bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
            >
              <div className="text-md basis-10/12 font-medium text-neutral-700">
                {discussion.title}
              </div>
              <div className="basis-1/12 text-sm font-medium text-neutral-500">
                {discussion.user_name}
              </div>
              <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                {dayjs(discussion.created_on).format("DD/MM/YY")}
              </div>
            </Link>
          </div>
        ))}
        {!loading && createdDiscussions.length === 0 && (
          <span className="text-neutral-700">
            Looks like you haven&#39;t created any discussions yet.
          </span>
        )}
      </div>
    </div>
  );
}
