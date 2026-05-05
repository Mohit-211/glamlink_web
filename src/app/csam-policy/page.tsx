import React from "react";

const CsamPolicy: React.FC = () => {
  return (
    <div className="bg-[#f5f5f5] py-10 px-4 mt-20">
      <div className="max-w-[900px] mx-auto text-[#333] leading-7 text-[15px]">
        
        <h2 className="text-[22px] font-semibold mb-2">
          GlamLink CSAE (Child Sexual Abuse and Exploitation) Policy
        </h2>

        <p className="text-[14px] mb-4">
          <span className="font-semibold">Last updated:</span> June 10, 2025
        </p>

        <p className="mb-4">
          At GlamLink, we are committed to maintaining a safe and respectful
          platform for all users. We strictly prohibit any form of child sexual
          abuse and exploitation (CSAE), including the sharing, promotion, or
          distribution of child sexual abuse material (CSAM), grooming, or any
          content that depicts or encourages sexual exploitation of minors.
        </p>

        <p className="mb-4">
          This policy applies to all users and content on both{" "}
          <b>GlamLink (User App)</b> and <b>GlamLink Pro</b>
        </p>

        <h4 className="mt-5 font-semibold text-[16px]">
          1. Zero-Tolerance Policy
        </h4>
        <p className="mt-1">
          GlamLink maintains a zero-tolerance stance toward CSAM. Any user found
          engaging in such activity will be subject to immediate removal from
          the platform and potential legal consequences.
        </p>

        <h4 className="mt-5 font-semibold text-[16px]">
          2. Prohibited Content
        </h4>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Child sexual abuse material (CSAM)</li>
          <li>
            Sexualized content involving minors (including real, animated, or
            simulated)
          </li>
          <li>Grooming or sexual exploitation behavior toward minors</li>
          <li>
            Any post, message, image, or video involving children in a sexually
            suggestive context
          </li>
        </ul>

        <h4 className="mt-5 font-semibold text-[16px]">
          Reporting and Moderation
        </h4>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Our moderation team reviews the content promptly.</li>
          <li>If CSAM or CSAE content is identified, it is immediately removed.</li>
          <li>The associated user account may be suspended or permanently banned.</li>
          <li>
            We retain logs and media to cooperate with legal counsel for
            appropriate action.
          </li>
        </ul>

        <h4 className="mt-5 font-semibold text-[16px]">
          4. Enforcement
        </h4>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Remove the offending content immediately</li>
          <li>Suspend or permanently ban the user account</li>
          <li>
            Notify our legal counsel for further investigation and potential
            escalation
          </li>
        </ul>

        <h4 className="mt-5 font-semibold text-[16px]">
          5. Cooperation with Authorities
        </h4>
        <p className="mt-1">
          While GlamLink is not currently integrated with formal reporting
          agencies (e.g., NCMEC), we consult with our legal team in the event of
          any CSAE-related reports and follow the appropriate legal course of
          action under applicable law.
        </p>

        <h4 className="mt-5 font-semibold text-[16px]">
          Storage and Detection
        </h4>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            All user-uploaded media (photos, videos, clips) is stored securely
            on third-party servers.
          </li>
          <li>
            While we currently do not use automated content scanning
            technologies, we are exploring options to enhance proactive detection
            and prevention of CSAM.
          </li>
        </ul>

        <h4 className="mt-5 font-semibold text-[16px]">
          7. Future Commitments
        </h4>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Introducing content moderation guidelines for beauticians and users</li>
          <li>Implementing age verification at signup</li>
          <li>Exploring automated content detection tools</li>
        </ul>

        <h4 className="mt-5 font-semibold text-[16px]">
          8. How to Report
        </h4>
        <p className="mt-1">
          If you encounter any content you believe may involve child exploitation:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Use the in-app "Report" feature available on each post</li>
          <li>
            Or contact us directly at:{" "}
            <a
              href="mailto:support@glamlink.com"
              className="text-blue-600 underline"
            >
              support@glamlink.com
            </a>
          </li>
        </ul>

        <p className="mt-6 font-semibold">
          GlamLink is committed to building a safe space for self-expression,
          beauty, and creativity — free from abuse, exploitation, and harm.
        </p>
      </div>
    </div>
  );
};

export default CsamPolicy;