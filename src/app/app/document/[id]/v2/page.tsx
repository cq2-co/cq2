"use client";

import CQ2DocumentSkeleton from "@/components/CQ2Document/CQ2Document-skeleton";
import CQ2V2DocumentContainer from "@/components/CQ2Document/v2-container";
import { useCQ2DocumentStore } from "@/state";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (CQ2Document.user_name === "") {
      if (id === "demo") {
        router.push(`/app/document/demo/v2/draft`);
      } else {
        fetch(`/api/document/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setNewCQ2Document(data);

            if (!data.version1.is_concluded) {
              router.push(`/app/document/${data._id}/v2/draft`);
            } else {
              setLoading(false);
            }
          })
          .catch(function (err) {
            router.push("/404");
          });
      }
    } else {
      if (!CQ2Document.version1.is_concluded) {
        router.push(`/app/document/${CQ2Document._id}/v2/draft`);
      } else {
        setLoading(false);
      }
    }
  }, [id, router, setNewCQ2Document, CQ2Document]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  if (!CQ2Document) router.push("/404");

  if (CQ2Document && typeof window !== "undefined") {
    const CQ2DocumentsRead = localStorage.getItem("CQ2DocumentsRead");

    if (!CQ2DocumentsRead) {
      const threadsData = {};

      for (let i = 0; i <= CQ2Document.version1.threads.length; i++) {
        threadsData[i] = 0;
      }

      const initCQ2DocumentsRead = {
        CQ2Documents: [
          {
            _id: CQ2Document._id,
            threads: threadsData,
          },
        ],
      };

      localStorage.setItem(
        "CQ2DocumentsRead",
        JSON.stringify(initCQ2DocumentsRead),
      );
    } else {
      let CQ2DocumentsReadJSON = JSON.parse(CQ2DocumentsRead);

      const CQ2DocumentReadFromLS = CQ2DocumentsReadJSON.CQ2Documents.filter(
        (CQ2DocumentReadJSON) => CQ2DocumentReadJSON["_id"] === CQ2Document._id,
      )[0];

      if (CQ2DocumentReadFromLS) {
        const threadsData = CQ2DocumentReadFromLS.threads;

        for (let i = 0; i <= CQ2Document.version1.threads.length; i++) {
          if (!(i in threadsData)) {
            threadsData[i] = 0;
          }
        }

        const newCQ2DocumentsReadJSON = {
          CQ2Documents: CQ2DocumentsReadJSON.CQ2Documents.filter(
            (CQ2DocumentReadJSON) =>
              CQ2DocumentReadJSON["_id"] !== CQ2Document._id,
          ),
        };

        newCQ2DocumentsReadJSON.CQ2Documents.push({
          _id: CQ2Document._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(newCQ2DocumentsReadJSON),
        );
      } else {
        const threadsData = {};

        for (let i = 0; i <= CQ2Document.version1.threads.length; i++) {
          threadsData[i] = 0;
        }

        CQ2DocumentsReadJSON.CQ2Documents.push({
          _id: CQ2Document._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(CQ2DocumentsReadJSON),
        );
      }
    }
  }

  return (
    <div
      className="relative hidden h-[calc(100vh-2.5rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="CQ2Document-threads-scrollable-container"
    >
      <CQ2V2DocumentContainer />
    </div>
  );
}
