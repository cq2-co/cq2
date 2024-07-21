"use client";

import CQ2DocumentSkeleton from "@/components/document/document-skeleton";
import { DummyCQ2DocumentData } from "@/lib/dummy-CQ2Document-data";
import { useCQ2DocumentStore } from "@/state";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (id === "demo") {
      setNewCQ2Document(DummyCQ2DocumentData);
      setLoading(false);
    } else {
      fetch(`/api/document/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setNewCQ2Document(data);
          setLoading(false);
        })
        .catch(function (err) {
          router.push("/404");
        });
    }
  }, [id, router, setNewCQ2Document]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  if (!CQ2Document) router.push("/404");

  if (CQ2Document.version1.is_concluded) {
    router.push(`/app/document/${CQ2Document._id}/v2`);
  } else {
    router.push(`/app/document/${CQ2Document._id}/v1`);
  }
}
