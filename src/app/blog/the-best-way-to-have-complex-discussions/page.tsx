import { satoshi } from "@/app/fonts";
import ComparisonSVG from "@/components/comparison-svg";
import LogoSVG from "@/components/logo-svg";
import QuoteHellSVG from "@/components/quote-hell-svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
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
        <div
          className={`absolute z-[9999] mt-2 flex w-[calc(100vw-2rem)] flex-row items-center justify-between border border-neutral-200/75 bg-white/80 p-1 shadow-sm backdrop-blur-md md:mt-5 md:w-[52rem]`}
        >
          <div>
            <Link href="/" id="cq2-main-logo">
              <LogoSVG className="ml-2 w-10 md:ml-3" />
            </Link>
          </div>
          <div className="flex flex-row">
            <div className="mr-2 flex md:mr-0">
              <Link href="/blog/the-best-way-to-have-complex-discussions">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Manifesto
                </Button>
              </Link>
            </div>
            <div className="mr-2 hidden md:flex">
              <Link href="https://github.com/cq2-co/cq2">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  GitHub
                </Button>
              </Link>
            </div>
            <div className="mr-2 hidden md:flex">
              <Link href="https://github.com/orgs/cq2-co/discussions/1">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Feedback
                </Button>
              </Link>
            </div>
            <div className="mr-2 hidden md:flex">
              <Link href="mailto:anand@cq2.co">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Contact
                </Button>
              </Link>
            </div>
            <div className="mr-2 hidden md:flex">
              <Link href="/privacy">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-transparent bg-transparent p-3 text-xs text-neutral-700 shadow-none duration-100 hover:bg-neutral-200 md:h-8 md:px-3 md:py-4 md:text-sm`}
                >
                  Privacy
                </Button>
              </Link>
            </div>
            <div className="mr-2">
              <Link href="/app/demo">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-transparent p-3 text-xs text-[#FF5F1F] shadow-none duration-100 hover:bg-[#FF5F1F]/5 md:h-8 md:p-4 md:text-sm`}
                >
                  Try demo
                </Button>
              </Link>
            </div>
            <div>
              <Link href="/app">
                <Button
                  className={`${satoshi.className} h-8 rounded-none border border-[#FF5F1F] bg-[#FF5F1F] p-3 text-xs text-neutral-50 shadow-none duration-100 hover:bg-[#FF5F1F]/90 md:h-8 md:p-4 md:text-sm`}
                >
                  Go to app
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-36 h-fit w-full px-2 md:mt-[15rem] md:w-[52rem] md:px-5">
          <div
            className={`${satoshi.className} text-[2.25rem] font-bold leading-[2.5rem] text-neutral-800 md:text-[2.5rem] md:leading-[3rem]`}
          >
            The best way to have complex discussions
          </div>
          <div className="mt-4 text-sm font-normal text-neutral-600 md:text-base">
            <span className="text-neutral-400">by</span> Anand Baburajan &
            Sreelakshmi Jayarajan
          </div>
        </div>
        <div
          className={`mt-16 flex w-[calc(100vw-2rem)] flex-row items-center justify-between md:mt-20 md:w-full`}
        >
          <Image
            src={demoImage}
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            priority={true}
            quality={100}
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
              , on{" "}
              <a
                href="https://discuss.python.org/t/pep-736-shorthand-syntax-for-keyword-arguments-at-invocation/43432"
                className="underline"
              >
                technical design documents
              </a>
              , etc. For us, the most frustrating issues with complex
              discussions are (1){" "}
              <span className="font-semibold">impulsive responses</span> and (2){" "}
              <span className="font-semibold">lack of structure</span>.
            </p>
            <p className="mt-6">
              In-person discussions are the worst for complex topics. They are
              the most susceptible to impulsive responses and they make it
              extremely hard to have a good structure. They are essentially
              hit-or-miss, and most often go nowhere. They favour speaking
              ability. Instead of well-formed thoughts, you often get impulsive
              responses and hot takes. Many discussions benefit from taking a
              break to gather evidence or think more but there's never enough
              time.
            </p>
            <p className="mt-6">
              There's not much one can do about impulsive responses in a
              discussion. Practising and advocating for active listening is the
              ideal solution but it requires a tremendous effort from everyone.
              That's why we love written, async discussions more than in-person
              ones for complex topics — they help prevent impulsive responses to
              an extent and promote thoughtful responses. But written, async
              discussions aren't perfect — they lack structure too. If you've
              used chat/forum platforms like Slack and Discourse for complex
              discussions, you know how hard it is to follow comments there.
            </p>
            <p className="mt-6">
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
                className="border border-neutral-200"
                alt="CQ2 demo screenshot"
                unoptimized={true}
                quality={100}
              />
            </div>
            <p className="mt-12">
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
              Now behold the common annoyance in all chat/forum platforms — the
              quote hell. What's that? Let's say Ava puts a comment about
              something. Then Caleb puts a comment with his replies to some
              quotes from Ava's comment. Now Ava puts a comment with her replies
              to Caleb's replies in quotes. What's happening? Replies to a topic
              are spread across different comments and you're forced to mentally
              manage all those quotes and their replies! On top of that, there
              are unrelated comments that break your flow. These problems might
              not seem big for a discussion between two people, but a complex
              and lengthy discussion with 5+ participants quickly turns into a
              huge mess. Here's what a quote hell looks like:
            </p>
            <div className="mt-12">
              <QuoteHellSVG />
            </div>
            <p className="mt-12">
              After being frustrated with Slack, Discourse, etc., we began the
              search for a tool specifically built for complex discussions. When
              we found none, we began exploring how such a tool would work and
              look like, and started building CQ2. It's a free and open source
              tool for complex discussions. It's in its early stages, but it's
              the start of something that we think will both make discussions
              immensely enjoyable and radically increase productivity. We tried
              out a small discussion from LessWrong on CQ2. It turned out to be
              much better organised and easier to follow. Check it out on the
              live demo,{" "}
              <a href="https://cq2.co/app/demo" className="underline">
                here
              </a>
              !
            </p>
            <p className="mt-6">
              In CQ2, there's no mess of unorganised comments — create threads
              inside threads so that each thread stays on topic and organised.
              Forget quote hell — create threads around specific quotes and find
              all replies related to a topic at one place. Never lose context of
              where you are — see all parent threads of the current thread in
              the same view. Focus on what matters — CQ2's tree lets you see
              which threads have unread comments and which are concluded, and
              lets you quickly go to a particular thread. Conclude threads — add
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
            <p className="text-lg font-semibold">
              How to have a complex discussion on CQ2:
            </p>
            <p className="mt-10">
              <span className="mb-2 block font-semibold text-neutral-700">
                Starting
              </span>
              Create a discussion by providing a title and a description. No
              login required, just your name. The description could be short or
              long, and is used to set the context, provide necessary
              information and/or your thoughts before starting the discussion.
              Then share the link with the participants.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={startImage}
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            quality={100}
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
              popped-up “Reply in new thread” button to create a new thread
              around that specific quote, and reply there. You can reply to the
              whole comment as well, instead of a particular text inside it, by
              using the reply button on the top-right of the comment.
            </p>
          </div>
        </div>
        <div
          className={`mb-12 mt-6 flex w-[calc(100vw-2rem)] flex-row items-center justify-center md:mb-24 md:mt-6 md:w-[56rem]`}
        >
          <Image
            src={commentingAndCreatingThreadsImage}
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            quality={100}
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
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            quality={100}
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
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            quality={100}
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
            className="border border-neutral-200"
            alt="CQ2 demo screenshot"
            unoptimized={true}
            quality={100}
          />
        </div>
        <div className="h-fit w-full px-2 pb-24 md:w-[42rem] md:px-5 md:pb-48">
          <div className={`text-base font-normal text-neutral-600`}>
            <Separator />
            <p className="mt-12 md:mt-24">
              Try creating some threads and adding some comments in the demo,{" "}
              <a href="https://cq2.co/app/demo" className="underline">
                here
              </a>
              !
            </p>
            <p className="mt-6">
              We have many more interesting and useful features planned,
              including custom titles for threads, mentions, useful reactions
              (and not just emojis) and even an AI assistant to help you find
              overlooked parts of the discussion.
            </p>
            <p className="mt-6">
              With CQ2, we want to help people have better discussions, and
              ultimately, systematically arrive at truth, better understand
              others and make better decisions. If you resonate with CQ2’s
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
          </div>
        </div>
      </div>
    </main>
  );
}
