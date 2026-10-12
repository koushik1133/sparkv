import { SparkVAgent } from "@/components/v2/sparkv-agent";
import { MotionEnhancements } from "@/components/v2/motion-enhancements";
import { SiteHeader } from "@/components/v2/home-header";
import { Hero } from "@/components/v2/hero";
import { Sections, Footer } from "@/components/v2/sections";
import { RevealObserver, HeroObserver } from "@/components/v2/effects";

export default function Home() {
  return (
    <div>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Sections />
      </main>
      <MotionEnhancements />
      <SparkVAgent />
      <Footer />
      <HeroObserver />
      <RevealObserver />
    </div>
  );
}
