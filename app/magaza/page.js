import Script from "next/script";
import markup from "./markup";
import { top, bottom } from "../parts";
import "./magaza.css";

export const metadata = {
  title: "Mağaza · Gardaşlar Arıcılık",
  description: "Yayla balları, petek bal, polen, propolis ve arıcılık malzemeleri. Hasat takvimiyle hangi balın ne zaman taze olduğunu görün.",
};

export default function Magaza() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: top("shop") + markup + bottom() }} />
      <Script src="/shared.js" strategy="afterInteractive" />
      <Script src="/magaza.js" strategy="afterInteractive" />
    </>
  );
}
