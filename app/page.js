import Script from "next/script";
import markup from "./markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
