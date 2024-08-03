"use client";

import CQ2DocumentSkeleton from "@/components/document/document-skeleton";
import CQ2V1DocumentContainer from "@/components/document/v1-container";
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

  const demoCommentsReadData = {
    0: 6,
    1: 4,
    2: 2,
    3: 3,
    4: 1,
    5: 2,
    6: 7,
    7: 0,
    8: 4,
    9: 1,
    10: 1,
    11: 4,
    12: 3,
    13: 1,
    14: 1,
    15: 1,
    16: 11,
    17: 0,
    18: 1,
    19: 6,
    20: 5,
    21: 3,
    22: 0,
    23: 2,
  };

  useEffect(() => {
    if (CQ2Document.user_name === "") {
      if (id === "demo") {
        setNewCQ2Document(DummyCQ2DocumentData);

        if (typeof window !== "undefined") {
          const CQ2DocumentsRead = localStorage.getItem("CQ2DocumentsRead");

          if (!CQ2DocumentsRead) {
            let threadsData = {};

            threadsData = demoCommentsReadData;

            const initCQ2DocumentsRead = {
              CQ2Documents: [
                {
                  _id: DummyCQ2DocumentData._id,
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

            const CQ2DocumentReadFromLS =
              CQ2DocumentsReadJSON.CQ2Documents.filter(
                (CQ2DocumentReadJSON) =>
                  CQ2DocumentReadJSON["_id"] === DummyCQ2DocumentData._id,
              )[0];

            if (CQ2DocumentReadFromLS) {
              let threadsData = CQ2DocumentReadFromLS.threads;

              threadsData = demoCommentsReadData;

              const newCQ2DocumentsReadJSON = {
                CQ2Documents: CQ2DocumentsReadJSON.CQ2Documents.filter(
                  (CQ2DocumentReadJSON) =>
                    CQ2DocumentReadJSON["_id"] !== DummyCQ2DocumentData._id,
                ),
              };

              newCQ2DocumentsReadJSON.CQ2Documents.push({
                _id: DummyCQ2DocumentData._id,
                threads: threadsData,
              });

              localStorage.setItem(
                "CQ2DocumentsRead",
                JSON.stringify(newCQ2DocumentsReadJSON),
              );
            } else {
              let threadsData = {};

              threadsData = demoCommentsReadData;

              CQ2DocumentsReadJSON.CQ2Documents.push({
                _id: DummyCQ2DocumentData._id,
                threads: threadsData,
              });

              localStorage.setItem(
                "CQ2DocumentsRead",
                JSON.stringify(CQ2DocumentsReadJSON),
              );
            }
          }
        }

        setLoading(false);
      } else {
        fetch(`/api/document/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.version1.is_resolved) {
              router.push(`/app/document/${data._id}/v2`);
            } else {
              setNewCQ2Document(data);

              if (typeof window !== "undefined") {
                const CQ2DocumentsRead =
                  localStorage.getItem("CQ2DocumentsRead");

                if (!CQ2DocumentsRead) {
                  let threadsData = {};

                  for (let i = 0; i <= data.version1.threads.length; i++) {
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

                  const CQ2DocumentReadFromLS =
                    CQ2DocumentsReadJSON.CQ2Documents.filter(
                      (CQ2DocumentReadJSON) =>
                        CQ2DocumentReadJSON["_id"] === data._id,
                    )[0];

                  if (CQ2DocumentReadFromLS) {
                    let threadsData = CQ2DocumentReadFromLS.threads;

                    for (let i = 0; i <= data.version1.threads.length; i++) {
                      if (!(i in threadsData)) {
                        threadsData[i] = 0;
                      }
                    }

                    const newCQ2DocumentsReadJSON = {
                      CQ2Documents: CQ2DocumentsReadJSON.CQ2Documents.filter(
                        (CQ2DocumentReadJSON) =>
                          CQ2DocumentReadJSON["_id"] !== data._id,
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
                    let threadsData = {};

                    for (let i = 0; i <= data.version1.threads.length; i++) {
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
  }, [id]);

  if (isLoading) return <CQ2DocumentSkeleton />;

  if (!CQ2Document) router.push("/404");

  return (
    <div
      className="relative hidden h-[calc(100vh-3rem)] overflow-y-hidden overflow-x-scroll scroll-smooth md:flex"
      id="CQ2Document-threads-scrollable-container"
    >
      <CQ2V1DocumentContainer />
    </div>
  );
}
