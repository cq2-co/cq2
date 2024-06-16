"use client";

import CQ2DocumentContainer from "@/components/CQ2Document/container";
import CQ2DocumentSkeleton from "@/components/CQ2Document/CQ2Document-skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/document/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(function (err) {
        router.push("/404");
      });
  }, [id, router]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  if (!data) router.push("/404");

  if (data && typeof window !== "undefined") {
    const CQ2DocumentsRead = localStorage.getItem("CQ2DocumentsRead");

    if (!CQ2DocumentsRead) {
      const threadsData = {};

      for (let i = 0; i <= data.threads.length; i++) {
        threadsData[i] = 0;
      }

      const initCQ2DocumentsRead = {
        CQ2Documents: [
          {
            _id: data._id,
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
        (CQ2DocumentReadJSON) => CQ2DocumentReadJSON["_id"] === data._id,
      )[0];

      if (CQ2DocumentReadFromLS) {
        const threadsData = CQ2DocumentReadFromLS.threads;

        for (let i = 0; i <= data.threads.length; i++) {
          if (!(i in threadsData)) {
            threadsData[i] = 0;
          }
        }

        const newCQ2DocumentsReadJSON = {
          CQ2Documents: CQ2DocumentsReadJSON.CQ2Documents.filter(
            (CQ2DocumentReadJSON) => CQ2DocumentReadJSON["_id"] !== data._id,
          ),
        };

        newCQ2DocumentsReadJSON.CQ2Documents.push({
          _id: data._id,
          threads: threadsData,
        });

        localStorage.setItem(
          "CQ2DocumentsRead",
          JSON.stringify(newCQ2DocumentsReadJSON),
        );
      } else {
        const threadsData = {};

        for (let i = 0; i <= data.threads.length; i++) {
          threadsData[i] = 0;
        }

        CQ2DocumentsReadJSON.CQ2Documents.push({
          _id: data._id,
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
      id="CQ2Documents-threads-scrollable-container"
    >
      <CQ2DocumentContainer CQ2DocumentFromDB={data} />
    </div>
  );
}
