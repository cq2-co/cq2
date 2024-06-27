"use client";

import { satoshi } from "@/app/fonts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCQ2DocumentStore } from "@/state";
import dayjs from "dayjs";
import { FileText, Pencil, X } from "lucide-react";
import { Link as NVTLink } from "next-view-transitions";
import { useEffect, useState } from "react";

export default function CQ2Documents() {
  const { CQ2Document, setNewCQ2Document } = useCQ2DocumentStore();
  const [createdCQ2Documents, setCreatedCQ2Documents] = useState([]);
  const [commentedCQ2Documents, setCommentedCQ2Documents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cq2UserName, setCq2UserName] = useState("");
  const [onboardingClosed, setOnboardingClosed] = useState("false");

  useEffect(() => {
    setNewCQ2Document({
      user_name: "",
      read_only: false,
      version1: {
        thread_id: 0,
        title: "",
        content: "",
        created_on: -1,
        is_concluded: false,
        highlights: [],
        comments: [],
        threads: [],
      },
    });

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

      if (localStorage.getItem("cq2UserName")) {
        setCq2UserName(localStorage.getItem("cq2UserName"));
      }

      if (localStorage.getItem("cq2OnboardingClosed")) {
        setOnboardingClosed(localStorage.getItem("cq2OnboardingClosed"));
      }

      setLoading(false);
    }
  }, [setCreatedCQ2Documents, setCommentedCQ2Documents, setNewCQ2Document]);

  const [CQ2CarouselAPI, setCQ2CarouselAPI] = useState<CarouselApi>();
  const [CQ2CarouselCurrent, setCQ2CarouselCurrent] = useState(0);
  const [CQ2CarouselCount, setCQ2CarouselCount] = useState(0);

  useEffect(() => {
    if (!CQ2CarouselAPI) {
      return;
    }

    setCQ2CarouselCount(CQ2CarouselAPI.scrollSnapList().length);
    setCQ2CarouselCurrent(CQ2CarouselAPI.selectedScrollSnap() + 1);

    CQ2CarouselAPI.on("select", () => {
      setCQ2CarouselCurrent(CQ2CarouselAPI.selectedScrollSnap() + 1);
    });
  }, [CQ2CarouselAPI]);

  return (
    <div className="hidden h-[calc(100vh-2.5rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-lg border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div className="mb-24 flex flex-row justify-between">
          <div
            className={`text-4xl font-medium leading-[2.5rem] text-neutral-800`}
          >
            {cq2UserName ? `Welcome back, ${cq2UserName}` : `Welcome`}
          </div>
          {!loading &&
            (createdCQ2Documents.length > 0 ||
              commentedCQ2Documents.length > 0) && (
              <div className={`${satoshi.className} flex items-center`}>
                <NVTLink
                  href="/app/new"
                  className={`${satoshi.className} flex items-center rounded-lg bg-gradient-to-b from-CQ2Orange-500 to-CQ2Orange-600 px-2 py-1 text-sm font-medium text-white transition duration-200`}
                >
                  <Pencil
                    className="mr-2.5 inline-block h-3 w-3"
                    strokeWidth={3}
                  />
                  New document
                </NVTLink>
              </div>
            )}
        </div>
        {!loading && createdCQ2Documents.length > 0 && (
          <div className="mb-16">
            <div
              className={`mb-4 flex items-center text-base font-normal text-neutral-500`}
            >
              Documents you created
            </div>
            {createdCQ2Documents.map((_CQ2Document) => (
              <div
                className={`flex flex-col items-center`}
                key={_CQ2Document._id}
              >
                <NVTLink
                  href={`/app/document/${_CQ2Document._id}`}
                  className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-lg bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
                >
                  <div className="text-md basis-10/12 font-medium text-neutral-700">
                    {_CQ2Document.title}
                  </div>
                  <div className="basis-1/12 text-sm font-medium text-neutral-500">
                    {_CQ2Document.user_name.split(" ")[0]}
                  </div>
                  <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                    {dayjs(_CQ2Document.created_on).format("DD/MM/YY")}
                  </div>
                </NVTLink>
              </div>
            ))}
          </div>
        )}
        {!loading && commentedCQ2Documents.length > 0 && (
          <div className="mb-16">
            <div
              className={`mb-4 flex items-center text-base font-normal text-neutral-500`}
            >
              Documents you're part of
            </div>
            {commentedCQ2Documents.map((_CQ2Document) => (
              <div
                className={`flex flex-col items-center`}
                key={_CQ2Document._id}
              >
                <NVTLink
                  href={`/app/document/${_CQ2Document._id}`}
                  className={`${satoshi.className} mt-2 flex w-full flex-row items-center rounded-lg bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
                >
                  <div className="text-md basis-10/12 font-medium text-neutral-700">
                    {_CQ2Document.title}
                  </div>
                  <div className="basis-1/12 text-sm font-medium text-neutral-500">
                    {_CQ2Document.user_name.split(" ")[0]}
                  </div>
                  <div className="ml-3 basis-1/12 text-xs font-medium text-neutral-500">
                    {dayjs(_CQ2Document.created_on).format("DD/MM/YY")}
                  </div>
                </NVTLink>
              </div>
            ))}
          </div>
        )}
        {!loading && onboardingClosed === "false" && (
          <div>
            <Carousel setApi={setCQ2CarouselAPI} className="w-full">
              <CarouselContent>
                <CarouselItem key={0}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">
                        Ready to learn how to use CQ2?
                      </span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        CQ2 is a document collaboration tool which offers a
                        better way to discuss documents and finish with clear,
                        well-documented decisions. Click the right arrow to
                        learn how it works.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={1}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">
                        Create a document
                      </span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        Provide the title and the content, and click the
                        "Publish" button. The Version 1 of the document is now
                        ready. It's locked and cannot be edited further; only a
                        new version can be created later.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={2}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">
                        Share the document
                      </span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        Click the "Share" button in the navigation bar to copy
                        the link and share it with the participants for
                        discussion.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={3}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">
                        Commenting and creating threads
                      </span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        General comments about the document go below the
                        document. To reply to a particular text from the
                        document or from any comment in a new thread, select the
                        text, click on the popped-up "Comment in new thread"
                        button, and reply in the new thread.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={4}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">
                        Opening threads
                      </span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        If someone has already created a thread for a particular
                        quote, the quote would appear highlighted yellow. You
                        can click on it to open the corresponding thread and
                        continue the discussion there.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={5}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">Navigation</span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        To move between different threads, you can scroll using
                        a trackpad or using your mouse's scroll wheel with the
                        shift key. You can also use the Threads tree from the
                        navigation bar to quickly go to a particular thread. The
                        tree also shows the number of comments in a thread, the
                        number of unread comments and whether the thread has
                        been concluded or not.
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={6}>
                  <Card className="h-full rounded-xl border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex flex-col p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <span className="text-base font-medium">Conclusion</span>
                      <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                        You can conclude threads by using the “Conclude thread”
                        button in the thread's menu. After the discussion is
                        over, click the "New version" button in the navigation
                        bar to start working on Version 2's draft. Click "Show
                        Version 1" to refer to the previous version and its
                        discussion. Update the draft with the changes, and click
                        on the "Publish" button to publish Version 2.
                      </span>
                      <span className="mt-8 text-sm font-normal text-neutral-500">
                        You're all set!
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              {CQ2CarouselCurrent > 1 && <CarouselPrevious />}
              {CQ2CarouselCurrent <= CQ2CarouselCount - 1 && <CarouselNext />}
            </Carousel>
            <div className="mb-16 py-2 text-center text-sm text-muted-foreground">
              {CQ2CarouselCurrent} of {CQ2CarouselCount}
            </div>
          </div>
        )}
        {!loading &&
          createdCQ2Documents.length === 0 &&
          commentedCQ2Documents.length === 0 && (
            <NVTLink
              href="/app/new"
              className={`flex flex-col rounded-xl border border-neutral-200 px-6 py-8 shadow-sm transition duration-200 hover:shadow-md`}
            >
              <FileText
                className="h-8 w-8 text-neutral-200"
                strokeWidth={1.5}
              />
              <span className="ml-1 mt-10 text-lg font-semibold text-neutral-700">
                Start
              </span>
              <span className="ml-1 mt-1 text-sm font-normal text-neutral-500">
                Create a new document
              </span>
            </NVTLink>
          )}
      </div>
    </div>
  );
}
