// GSAP ve eklentileri tek yerden kaydedilir; bileşenler buradan içe aktarır.
// GSAP 3.13'ten beri bütün eklentiler (SplitText, MotionPath) ücretsiz ve npm paketinde.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);
}

/** Hareket azaltma tercihi olmayanlar için (gsap.matchMedia koşulu). */
export const HAREKET_ACIK = "(prefers-reduced-motion: no-preference)";
/** Fare kullanan masaüstü (mıknatıs düğme, imleç ışığı). */
export const FARE = "(prefers-reduced-motion: no-preference) and (pointer: fine)";
/** Tailwind `md` kırılımı. */
export const GENIS = "(min-width: 768px)";

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, useGSAP };
