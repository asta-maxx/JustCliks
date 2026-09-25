import { Brief } from "@/components/Brief";
import { ClientBand } from "@/components/ClientBand";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { MobileCTA } from "@/components/MobileCTA";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero />
        <ClientBand />
        <Manifesto />
        <Services />
        <Work />
        <Stats />
        <Brief />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
