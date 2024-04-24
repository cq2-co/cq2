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

  return (
    <div
      className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="discussions-threads-scrollable-container"
    >
      <DiscussionContainer discussionFromDB={data} />
    </div>
  );
}
