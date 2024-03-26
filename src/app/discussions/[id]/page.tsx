"use client";

import DiscussionContainer from "@/components/discussion/container";
import useSWR from "swr";
import DiscussionSkeleton from "@/components/discussion/discussion-skeleton";
import { useRouter } from "next/navigation";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(`/api/discussions/${id}`, fetcher);

  if (isLoading) return <DiscussionSkeleton />;

  if (!data) router.push("/404");

  return (
    <div
      className="hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="discussions-threads-scrollable-container"
    >
      <DiscussionContainer discussion={data} />
    </div>
  );
}
