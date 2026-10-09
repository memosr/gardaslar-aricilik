import Script from "next/script";
import markup from "./markup";
import { top, bottom } from "./parts";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: top("home") + markup + bottom() }} />
      <Script src="/shared.js" strategy="afterInteractive" />
      <Script src="/site.js" strategy="afterInteractive" />
    </>
  );
}
