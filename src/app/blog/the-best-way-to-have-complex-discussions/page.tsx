import { satoshi } from "@/app/fonts";
import ComparisonSVG from "@/components/comparison-svg";
import QuoteHellSVG from "@/components/quote-hell-svg";
import SiteTopNav from "@/components/site-top-nav";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import commentingAndCreatingThreadsImage from "../../../../public/blog-post-images/commenting-and-creating-threads.png";
import discourseCommentsImage from "../../../../public/blog-post-images/discourse-comment-replies.png";
import endImage from "../../../../public/blog-post-images/end.png";
import navigationImage from "../../../../public/blog-post-images/navigation.png";
import openingThreadsImage from "../../../../public/blog-post-images/opening-threads.png";
import startImage from "../../../../public/blog-post-images/start.png";
import demoImage from "../../../../public/demo.png";

export default function TheBestWayToHaveComplexDiscussions() {
  return (
    <main
      className={`flex h-[100dvh] w-screen justify-center overflow-y-auto scroll-smooth bg-[#FFF] text-base font-normal leading-[1.4rem] text-neutral-800`}
    >
      <div className="flex h-fit min-h-screen w-full flex-col items-center max-md:m-0 max-md:px-6">
        <SiteTopNav />
        <div className="mt-36 h-fit w-full px-2 md:mt-[9rem] md:w-[52rem] md:px-5">
          <div className="w-fit rounded-lg bg-CQ2Orange-600/10 p-3 text-sm text-CQ2Orange-600 md:p-1 md:px-2">
            <span>Update on May 31, 2024:</span>{" "}
            <span className="text-neutral-700">
              CQ2 is now a document collaboration tool, and not just a tool for
              complex discussions.
            </span>
          </div>
          <div
            className={`${satoshi.className} mt-10 text-[2.25rem] font-bold leading-[2.5rem] text-neutral-800 md:text-[2.5rem] md:leading-[3rem]`}
          >
            The best way to have complex discussions
          </div>
          <div className="mt-4 text-sm font-normal text-neutral-600 md:text-base">
            <span className="text-neutral-400">by</span> Anand Baburajan &
            Sreelakshmi Jayarajan
          </div>
          <div className="mt-2 text-sm font-normal text-neutral-600 md:text-base">
            <span className="text-neutral-400">on</span> May 5, 2024
          </div>
        </div>
        <div
          className={`mt-16 flex w-[calc(100vw-2rem)] flex-col items-center justify-between md:mt-20 md:w-full`}
        >
          <Image
            src={demoImage}
            className="flex border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
            priority={true}
            unoptimized={true}
          />
        </div>
        <div className="mt-16 h-fit w-full px-2 md:mt-20 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-600`}>
            <p>We love complex, deep discussions.</p>
            <p className="mt-6">
              We've seen or been part of many discussions — strategic
              discussions at work, discussions on{" "}
              <a
                href="https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities"
                className="underline"
              >
                AI alignment
              </a>
              ,{" "}
              <a
                href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432"
                className="underline"
              >
                technical design documents
              </a>
              , public policy, etc. For us, the most frustrating issues with
              discussions are: impulsive responses and lack of structure.
            </p>
            <p className="mt-6">
              The default way of discussions — in-person ones — are highly
              susceptible to impulsive responses and are extremely hard to
              provide a good structure for, making them the worst for complex
              topics.
            </p>
            <p className="mt-6">
              The first issue of impulsive responses is a hard nut to crack.
              Practicing and advocating for active listening is the ideal
              solution but it's not guaranteed to work every time and in every
              team. That's why we prefer written, async discussions over
              in-person ones for complex topics — they help prevent impulsive
              responses to an extent (and even more with features like slow
              mode) and promote thoughtful responses. But the second issue still
              remains — written, async discussions lack structure too. If you've
              used chat/forum platforms like Slack and Discourse for complex
              discussions, you know how hard it is to follow comments there.
            </p>
            <p className="mt-6">
              <span className="mb-2 block font-semibold text-neutral-700">
                Discourse
              </span>
              In Discourse, discussions are a stream of unorganised comments.
              This way of discussion — where people talk over one another and
              topics get mixed up — doesn't work for deep dives into complex and
              lengthy topics. For such topics, the discussion needs to be
              carefully written and organised.
            </p>
            <p className="mt-6">
              There's no concept of “where” you are in Discourse discussions.
              There's only “when” you are, since the comments are ordered only
              by time. Discourse does provide some organisation to see the
              replies to a comment at one place. However if you need to see the
              replies to a particular reply inside a comment, you need to scroll
              down through other comments, find that particular reply (repeated
              as a comment!) and then check its replies:
            </p>
            <div className="mt-12">
              <Image
                src={discourseCommentsImage}
                className="border border-[#EDEDED]"
                alt="CQ2 demo screenshot"
              />
            </div>
            <p className="mt-12">
              <span className="mb-2 block font-semibold text-neutral-700">
                Slack
              </span>
              Slack is not really built for written, async discussions, but
              since it's widely used, let's talk about it. Discussions there are
              a stream of unorganised comments too, but at least Slack has
              threads to discuss a particular comment in detail in a separate
              pane. However, if you want to discuss a comment inside a thread in
              detail (i.e., create a new thread from a thread), you can't —
              Slack allows only one level of threads. Moreover, Slack feels too
              chatty — it feels impossible to have a long-running async
              discussion there. Its UI encourages sending bursts of fast, short
              comments instead of well-formed thoughts, and the typing indicator
              keeps everyone else distracted while one person tries to form
              their idea.
            </p>
            <p className="mt-6">
              <span className="mb-2 block font-semibold text-neutral-700">
                Quote hell
              </span>
              Now behold the common annoyance in all chat/forum platforms — the
              quote hell. What's that? Let's say Ava puts a comment about
              something. Then Caleb puts a comment with his replies to some
              quotes from Ava's comment. Now Ava puts a comment with her replies
              to Caleb's replies in quotes. What's happening? Replies to a topic
              are spread across different comments and you're forced to mentally
              manage all those quotes and their replies! On top of that, there
              are unrelated comments between that break your flow. These
              problems might not seem big for a discussion between two people,
              but a complex and lengthy discussion with 5+ participants quickly
              turns into a huge mess. Here's what a quote hell looks like:
            </p>
            <div className="mt-12">
              <QuoteHellSVG />
            </div>
            <p className="mt-12">
              After being frustrated with Slack, Discourse, etc., we started
              searching for a tool specifically built for complex discussions.
              We found none, began exploring how such a tool would work and look
              like, and started building:
            </p>
            <p className="mt-6">
              <span className="mb-2 block font-semibold text-neutral-700">
                CQ2
              </span>
              It's a free and open source tool for complex discussions. It's in
              its early stages, but it's the start of something that we think
              will both make discussions immensely enjoyable and radically
              increase productivity. We simulated a{" "}
              <a
                href="https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities#sSfjskRzAuDcWmFWg"
                className="underline"
              >
                small discussion
              </a>{" "}
              from LessWrong on CQ2. Check it out on the live demo,{" "}
              <a
                href="https://cq2.co/app/document/demo/v1"
                className="underline"
              >
                here
              </a>
              ! It turned out to be much better organised and easier to follow.
            </p>
            <p className="mt-6">
              In CQ2, there's no mess of unorganised comments — create threads
              inside threads so that each thread stays on topic and organised.
              Forget quote hell — create threads around specific quotes and find
              all replies related to a topic at one place. Never lose context of
              where you are — see all parent threads of the current thread in
              the same view. Focus on what matters — see which threads have
              unread comments, which are concluded and quickly go to a
              particular thread using CQ2's tree. Conclude threads — add
              conclusions to resolved threads and to the whole discussion once
              it's resolved.
            </p>
          </div>
        </div>
        <div
          className={`my-24 flex w-[calc(100vw-2rem)] flex-row items-center justify-between md:w-[calc(100vw-24rem)]`}
        >
          <ComparisonSVG />
        </div>
        <div className="h-fit w-full px-2 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-800`}>
            <p className="text-xl font-semibold">
              The CQ2 way of having complex discussions:
            </p>
            <p className="mt-10">
              <span className="mb-2 block font-semibold text-neutral-700">
                Starting
              </span>
              Create a discussion by providing a title and a description. The
              description could be short or long, and is used to set the
              context, provide necessary information and/or your thoughts before
              starting the discussion. Then share the link with the
              participants.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={startImage}
            className="border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
          />
        </div>
        <div className="h-fit w-full px-2 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-600`}>
            <p>
              <span className="mb-2 block font-semibold text-neutral-700">
                Commenting and creating threads
              </span>
              General comments about the discussion go in the main (first and
              leftmost) thread. To reply to a particular text from the main
              description or from any comment, select the text, click on the
              popped-up “Comment” button to create a new thread around that
              specific quote, and reply there. You can reply to the whole
              comment as well, instead of a particular text inside it, by using
              the reply button on the top-right of the comment.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={commentingAndCreatingThreadsImage}
            className="border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
          />
        </div>
        <div className="h-fit w-full px-2 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-600`}>
            <p>
              <span className="mb-2 block font-semibold text-neutral-700">
                Opening threads
              </span>
              If someone has already created a thread for a particular quote,
              the quote would appear highlighted. You can click on it to open
              its corresponding thread and continue the discussion there. If
              someone has already created a thread for a whole comment, there
              would be a highlighted comments button on the top-right of the
              comment which you can click on to open the corresponding thread.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={openingThreadsImage}
            className="border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
          />
        </div>
        <div className="h-fit w-full px-2 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-600`}>
            <p>
              <span className="mb-2 block font-semibold text-neutral-700">
                Navigating
              </span>
              To move between different threads, you can scroll using a trackpad
              or using your mouse's scroll wheel with the shift key. You can
              also use the tree from the navigation bar to quickly go to a
              particular thread. The tree also shows the number of comments in a
              thread, the number of unread comments and whether the thread has
              been concluded.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={navigationImage}
            className="border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
          />
        </div>
        <div className="h-fit w-full px-2 md:w-[42rem] md:px-5">
          <div className={`text-base font-normal text-neutral-600`}>
            <p>
              <span className="mb-2 block font-semibold text-neutral-700">
                Concluding
              </span>
              You can conclude a thread by using the “Conclude thread” button on
              top of the thread. Concluded threads have a green badge on top and
              the conclusion comment in green. To conclude the whole discussion,
              use the “Conclude discussion” button in the navigation bar.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={endImage}
            className="border border-[#EDEDED]"
            alt="CQ2 demo screenshot"
          />
        </div>
        <div className="h-fit w-full px-2 pb-24 md:w-[42rem] md:px-5 md:pb-48">
          <div className={`text-base font-normal text-neutral-600`}>
            <Separator />
            <p className="mt-12 md:mt-24">
              Try creating some threads and adding some comments in the demo,{" "}
              <a
                href="https://cq2.co/app/document/demo/v1"
                className="underline"
              >
                here
              </a>
              !
            </p>
            <p className="mt-6">
              We have many more interesting and useful features planned,
              including rich text, workspaces, custom titles for threads,
              mentions, slow mode, useful reactions (and not just emojis) and
              even an AI assistant to help you find overlooked parts of the
              discussion.
            </p>
            <p className="mt-6">
              With CQ2, we want to help people have better discussions, and
              ultimately, systematically arrive at truth, better understand
              others and make better decisions. If you resonate with CQ2's
              mission, we would love for you to try it out, provide your
              feedback{" "}
              <a
                href="https://github.com/orgs/cq2-co/discussions/1"
                className="underline"
              >
                here
              </a>{" "}
              and share this post with your friends!
            </p>
            <p className="mt-6">
              Get early access,{" "}
              <a href="https://tally.so/r/meB0yJ" className="underline">
                here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
