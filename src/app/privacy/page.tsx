import { satoshi } from "@/app/fonts";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-screen justify-center overflow-y-scroll scroll-smooth rounded-none border-0 bg-[#FFFFFF] pt-28">
      <div className="h-fit w-[48rem] px-5 pb-48">
        <div
          className={`${satoshi.className} text-4xl font-bold leading-[2.5rem] text-neutral-700`}
        >
          Privacy Policy
        </div>
        <div
          className={`${satoshi.className} mb-12 mt-3 flex items-center text-xl font-medium text-neutral-500`}
        >
          Last updated: Mar 26, 2024
        </div>
        <div className={`mt-20 text-lg font-normal text-neutral-500`}>
          <p>
            Hello! Welcome to CQ2. Here's how we protect your data and respect
            your privacy.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Our role in your privacy
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            If you are creating a discussion on CQ2 or commenting on a
            discussion, or just visiting our website, this policy applies to
            you.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Your responsibilities
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <ul className="list-disc">
            <li>Read this Privacy Policy.</li>
            <li>Do not impersonate anyone else on discussions.</li>
          </ul>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          What data we collect
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            Information about discussions and all comments which you add in a
            discussion.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          How and why we use your data
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            Data protection law means that we can only use your data for certain
            reasons and where we have a legal basis to do so. We use the data
            solely to ensure the functionality of CQ2 — which is to help you
            have complex discussions.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Your rights
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <ul className="list-disc">
            <li>
              You have the right to not provide us with any discussion's
              information. If you choose to do this, you can continue browse
              this website's pages, but you won't be able to create discussions
              or comment on discussions.
            </li>
            <li>
              You have the right to turn off cookies in your browser by changing
              its settings. You can block cookies by activating a setting on
              your browser allowing you to refuse cookies. You can also delete
              cookies through your browser settings. If you turn off cookies,
              you can continue to use the website and browse its pages, but
              CQ2's user experience would deteriorate.
            </li>
            <li>
              You have the right to access information we hold about you, which
              is your name, that you provide us. We will provide you with the
              information within one month of your request, unless doing so
              would adversely affect the rights and freedoms of other (e.g.
              another person's personal or event details). We'll tell you if we
              can't meet your request for that reason.
            </li>
            <li>
              You have the right to make us correct any inaccurate personal data
              about you.
            </li>
            <li>
              You have the right to be 'forgotten' by us. You can do this by
              deleting the discussions you created.
            </li>
            <li>
              You have the right to lodge a complaint regarding our use of your
              data. But please tell us first, so we have a chance to address
              your concerns.
            </li>
          </ul>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Where do we store the data?
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            We use MongoDB's Atlas cloud database service to store all your
            discussions.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          How long do we store your data?
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            We will delete every discussion around 1 month after the discussion
            is created.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Cookies
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            We use cookies. Unless you adjust your browser settings to refuse
            cookies, we will issue cookies when you interact with CQ2. These are
            'persistent' cookies which do not delete themselves and help us
            recognise you when you return so we can help you manage your
            discussions without asking you to create an account.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          How can I block cookies?
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            You can block cookies by activating a setting on your browser
            allowing you to refuse the setting of cookies. You can also delete
            cookies through your browser settings. If you use your browser
            settings to disable, reject, or block cookies (including essential
            cookies), certain parts of our website's user experience would
            deteriorate.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Children's privacy
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            We do not address anyone under the age of 13. Personally
            identifiable information is not knowingly collected from children
            under 13. If discovered that a child under 13 has provided us with
            personal information, such information will be immediately deleted
            from the servers. If you are a parent or guardian and you are aware
            that your child has provided us with personal information, please
            contact us using the details below so that this information can be
            removed.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Changes to this privacy policy
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            This privacy policy may be updated from time to time. Thus, you are
            advised to review this page periodically for any changes.
          </p>
        </div>
        <div
          className={`${satoshi.className} mt-10 text-xl font-bold text-neutral-700`}
        >
          Contact us
        </div>
        <div className={`mt-4 text-lg font-normal text-neutral-500`}>
          <p>
            If you have any questions or suggestions about this Privacy Policy,
            do not hesitate to contact us at{" "}
            <Link href="mailto:anand@cq2.co" className="underline">
              anand@cq2.co
            </Link>
            .
          </p>
        </div>
        <div className={`mt-20 text-lg font-normal text-neutral-500`}>
          <p>
            This privacy notice is based on an open-sourced design from{" "}
            <Link href="https://juro.com/" className="underline">
              Juro
            </Link>{" "}
            and{" "}
            <Link href="https://stefaniapassera.com/" className="underline">
              Stefania Passera
            </Link>{" "}
            - get your own{" "}
            <Link
              href="https://juro.com/contract-templates/privacy-policy-template#exit"
              className="underline"
            >
              free privacy policy template
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
