// GSAP ve her sayfada gereken eklentileri: bu dosya ayrı bir parça olarak, gerektiğinde yüklenir (gsap.ts ›
// hareketYukle). Doğrudan içe aktarılmaz; açılıştaki JavaScript'e girmesin diye.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const hareket = { gsap, ScrollTrigger, SplitText };
