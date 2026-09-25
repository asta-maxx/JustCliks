import Link from "next/link";
import { FeedCard } from "@/components/FeedCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="wrap grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="t-label text-orange-ink">Error 404</p>
          <h1 className="t-display mt-5 max-w-[12ch]">This post isn&apos;t available.</h1>
          <p className="t-lead mt-6 max-w-[40ch]">
            The link may be broken, or the page has moved. Everything else is still in the feed.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">
              Back to the feed
            </Link>
            <Link href="/#contact" className="btn btn-ghost">
              Start a project
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <div className="w-[min(300px,78vw)] rotate-[-4deg]">
            <div className="aspect-[4/5]">
              <FeedCard item={{ kind: "noise", title: "Nothing to see here", tag: "Removed", tone: "paper" }} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
