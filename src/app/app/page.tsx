"use client";

import { manrope } from "@/app/fonts";
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
import Image from "next/image";
import { useEffect, useState } from "react";
import demoImage from "../../../public/demo.png";
import onboarding1 from "../../../public/onboarding/1.png";
import onboarding2 from "../../../public/onboarding/2.png";
import onboarding3 from "../../../public/onboarding/3.png";
import onboarding4 from "../../../public/onboarding/4.png";
import onboarding5 from "../../../public/onboarding/5.png";
import onboarding6 from "../../../public/onboarding/6.png";
import onboarding7 from "../../../public/onboarding/7.png";

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
      version1: {
        thread_id: 0,
        title: "",
        content: "",
        created_on: -1,
        is_resolved: false,
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
    <div className="hidden h-[calc(100vh-3rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-sm border-0 bg-[#FFFFFF] pt-28 md:flex">
      <div className="h-fit w-[48rem] px-5 pb-24">
        <div className="mb-24 flex flex-row justify-between">
          <div
            className={`text-4xl font-medium leading-[2.5rem] text-neutral-800`}
          >
            {!loading &&
              cq2UserName &&
              `Welcome back, ${cq2UserName.split(" ")[0]}`}
            {!loading && !cq2UserName && "Welcome"}
          </div>
          {!loading &&
            (createdCQ2Documents.length > 0 ||
              commentedCQ2Documents.length > 0) && (
              <div className={`${manrope.className} flex items-center`}>
                <NVTLink
                  href="/app/new"
                  className={`${manrope.className} flex items-center rounded-sm bg-CQ2Orange-600 px-2 py-1 text-sm font-medium text-white transition duration-200 hover:bg-CQ2Orange-500`}
                >
                  <Pencil
                    className="mr-2.5 inline-block h-3 w-3"
                    strokeWidth={3}
                  />
                  New RFC
                </NVTLink>
              </div>
            )}
        </div>
        {!loading && createdCQ2Documents.length > 0 && (
          <div className="mb-16">
            <div
              className={`mb-4 flex items-center text-base font-normal text-neutral-500`}
            >
              RFCs you created
            </div>
            {createdCQ2Documents.map((_CQ2Document) => (
              <div
                className={`flex flex-col items-center`}
                key={_CQ2Document._id}
              >
                <NVTLink
                  href={`/app/document/${_CQ2Document._id}`}
                  className={`${manrope.className} mt-2 flex w-full flex-row items-center rounded-sm bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
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
              RFCs you're part of
            </div>
            {commentedCQ2Documents.map((_CQ2Document) => (
              <div
                className={`flex flex-col items-center`}
                key={_CQ2Document._id}
              >
                <NVTLink
                  href={`/app/document/${_CQ2Document._id}`}
                  className={`${manrope.className} mt-2 flex w-full flex-row items-center rounded-sm bg-neutral-50 p-3 transition duration-200 hover:bg-neutral-100`}
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
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Ready to learn how to use CQ2?
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          CQ2 is a tool which offers a better way to discuss
                          RFCs and finish with clear, well-documented decisions.
                          Click the right arrow to learn how to use it.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={demoImage}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding demo screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={1}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Create the RFC
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          Provide the title and the content, and click the
                          "Publish" button. The draft of the document is now
                          published. It's locked and cannot be edited further;
                          only the final version can be created later after the
                          discussion.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding1}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 1 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={2}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Share the RFC
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          Click the "Share" button in the navigation bar to copy
                          the link and share it with the participants for
                          discussion.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding2}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 2 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={3}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Commenting and creating threads
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          General comments go below the RFC. To reply to a
                          particular text from the RFC or from any comment in a
                          new thread, select the text, click on the popped-up
                          "Comment in new thread" button, and comment there.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding3}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 3 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={4}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Opening threads
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          If someone has already created a thread for a
                          particular quote, the quote would appear highlighted
                          yellow. You can click on it to open the corresponding
                          thread and continue the discussion there.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding4}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 4 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={5}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Navigation
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          To move between different threads, you can scroll
                          using a trackpad or using your mouse's scroll wheel
                          with the shift key. You can also use the "Threads"
                          tree from the navigation bar to quickly go to a
                          particular thread. The tree also tells you the number
                          of comments in a thread, unread comments if any and
                          whether the thread has been resolved or not.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding5}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 5 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={6}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Resolve threads
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          When a discussion on a thread is complete, it can be
                          resolved to make it easier to find threads that need
                          to be addressed. You can resolve a thread both with or
                          without a new comment using the options in the
                          thread's menu.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding6}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 6 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem key={7}>
                  <Card className="h-full rounded-sm border border-neutral-200 shadow-sm">
                    <CardContent className="relative flex h-full flex-col justify-between p-6">
                      <X
                        className="absolute right-6 h-4 w-4 cursor-pointer text-neutral-500"
                        strokeWidth={3}
                        onClick={() => {
                          localStorage.setItem("cq2OnboardingClosed", "true");
                          setOnboardingClosed("true");
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          Final version
                        </span>
                        <span className="mt-1 w-11/12 text-sm font-normal text-neutral-500">
                          After the discussion is over, click the "Create final
                          version" button in navigation bar to create the final
                          version for the RFC. Update the RFC with the changes.
                          Use the "Show draft" button to see the draft version
                          along with the comments if needed. Once done, click
                          the "Publish" button at the bottom to publish the new
                          version.
                        </span>
                      </div>
                      <div className="mt-10 flex w-full">
                        <Image
                          src={onboarding7}
                          className="rounded-sm border border-[#EDEDED]"
                          alt="Onboarding 7 screenshot"
                          priority={false}
                          unoptimized={true}
                        />
                      </div>
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
              className={`flex flex-col rounded-sm border border-neutral-200 px-6 py-8 shadow-sm transition duration-200 hover:shadow-md`}
            >
              <FileText
                className="h-8 w-8 text-neutral-200"
                strokeWidth={1.5}
              />
              <span className="ml-1 mt-10 text-lg font-semibold text-neutral-700">
                Start
              </span>
              <span className="ml-1 mt-1 text-sm font-normal text-neutral-500">
                Create a new RFC
              </span>
            </NVTLink>
          )}
      </div>
    </div>
  );
}
