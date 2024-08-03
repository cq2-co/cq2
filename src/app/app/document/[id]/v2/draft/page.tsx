"use client";

import CQ2DocumentSkeleton from "@/components/document/document-skeleton";
import CQ2V2EditDocumentContainer from "@/components/document/v2-edit-container";
import { DummyCQ2DocumentData } from "@/lib/dummy-CQ2Document-data";
import { useCQ2DocumentStore } from "@/state";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const [isLoading, setLoading] = useState(
    CQ2Document.user_name === "" ? true : false,
  );

  const router = useRouter();

  useEffect(() => {
    if (CQ2Document.user_name === "") {
      if (id === "demo") {
        setNewCQ2Document(DummyCQ2DocumentData);
        setLoading(false);
      } else {
        fetch(`/api/document/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.version1.is_resolved) {
              router.push(`/app/document/${data._id}/v2`);
            } else {
              setNewCQ2Document(data);
              setLoading(false);
            }
          })
          .catch(function (err) {
            router.push("/404");
          });
      }
    } else {
      setLoading(false);
    }
  }, [id, router, setNewCQ2Document, CQ2Document]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  if (!CQ2Document) router.push("/404");

  return (
    <div
      className="relative hidden h-[calc(100vh-3rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="CQ2Document-threads-scrollable-container"
    >
      <CQ2V2EditDocumentContainer />
    </div>
  );
}
