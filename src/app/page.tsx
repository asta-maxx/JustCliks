import { BoxOffice } from "@/components/BoxOffice";
import { Brief } from "@/components/Brief";
import { ClientBand } from "@/components/ClientBand";
import { FeedSection } from "@/components/FeedSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Nav } from "@/components/Nav";
import { Services } from "@/components/Services";
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
        <FeedSection />
        <Work />
        <BoxOffice />
        <Brief />
      </main>
      <Footer />
    </>
  );
}
