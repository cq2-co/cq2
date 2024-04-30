"use client";

import DiscussionContainer from "@/components/discussion/container";
import DiscussionSkeleton from "@/components/discussion/discussion-skeleton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/discussions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  if (isLoading) return <DiscussionSkeleton />;

  if (!data) router.push("/404");

  if (typeof window !== "undefined") {
    const cq2DiscussionsRead = localStorage.getItem("cq2DiscussionsRead");

    const threadsData = {};

    for (let i = 0; i <= data.threads.length; i++) {
      threadsData[i] = 0;
    }

    if (!cq2DiscussionsRead) {
      const initCq2DiscussionsRead = {
        discussions: [
          {
            _id: data._id,
            threads: threadsData,
          },
        ],
      };

      localStorage.setItem(
        "cq2DiscussionsRead",
        JSON.stringify(initCq2DiscussionsRead),
      );
    } else {
      let cq2DiscussionsReadJSON = JSON.parse(cq2DiscussionsRead);

      if (
        !cq2DiscussionsReadJSON.discussions.some(
          (cq2DiscussionReadJSON) => cq2DiscussionReadJSON["_id"] === data._id,
        )
      ) {
        cq2DiscussionsReadJSON.discussions.push({
          _id: data._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "cq2DiscussionsRead",
          JSON.stringify(cq2DiscussionsReadJSON),
        );
      }
    }
  }

  return (
    <div
      className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="discussions-threads-scrollable-container"
    >
      <DiscussionContainer discussionFromDB={data} />
    </div>
  );
}
