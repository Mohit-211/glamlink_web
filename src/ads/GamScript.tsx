"use client";
import Script from "next/script";

export default function GamScript() {
  return (
    <>
      <Script
        id="gpt-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(function () {
              window.googletag.pubads().enableSingleRequest();
              window.googletag.enableServices();
            });
          `,
        }}
      />
      <Script
        id="gpt-lib"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log(
            "[GAM] gpt.js loaded — window.googletag defined:",
            typeof window !== "undefined" && !!(window as any).googletag
          );
        }}
      />
    </>
  );
}
