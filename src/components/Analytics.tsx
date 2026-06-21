"use client";

import Script from "next/script";

export default function Analytics() {
  const GA_ID = "G-XXXXXXXXXX"; // ← غيّر هذا بمعرّف Google Analytics

  if (GA_ID === "G-XXXXXXXXXX") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}