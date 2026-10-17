import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/layouts/page-header.tsx";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/faq-data";
import { ContentSections, RichText } from "@/components/content/content-sections";
import type { GuideContent } from "@/content/types";

const PlayCta = () => (
  <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold">Ready to play 5/90 online?</h2>
      <p className="text-white/80 text-sm mt-1">Pick your numbers for today's MaxiLotto draws in under a minute. 18+ only.</p>
    </div>
    <div className="flex flex-wrap gap-3 shrink-0">
      <Button asChild className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold px-6">
        <Link to="/play" className="flex items-center gap-2">
          Play 5/90 <ArrowRight className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white px-6">
        <Link to="/auth/signup">Create free account</Link>
      </Button>
    </div>
  </div>
);

/**
 * A long-form page built from src/content (the same data the build plugin turns
 * into the page's static HTML, so the two always say the same thing).
 */
export function GuidePage({
  guide,
  id,
  top,
  after,
}: {
  guide: GuideContent;
  /** Used for the FAQ's id. */
  id: string;
  /** Shown straight after the intro, e.g. a download button. */
  top?: ReactNode;
  /** Extra content after a given section id. */
  after?: Record<string, ReactNode>;
}) {
  return (
    <>
      <PageHeader title={guide.title} subtitle={guide.subtitle} />

      <section className="py-8 sm:py-12 bg-slate-50/50">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            <RichText text={guide.intro} />
          </p>

          {top}

          {guide.toc && (
            <nav aria-label="On this page" className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">On this page</h2>
              <ol className="grid gap-2 sm:grid-cols-2 text-sm">
                {guide.sections.map((section, i) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="flex gap-2 text-[#0185B6] hover:text-[#0A4B7F] hover:underline">
                      <span className="text-slate-400">{i + 1}.</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <ContentSections sections={guide.sections} after={after} />

          <PlayCta />

          {guide.faq && (
            <section aria-labelledby={`${id}-faq`} className="space-y-5">
              <h2 id={`${id}-faq`} className="text-xl sm:text-2xl font-bold text-[#0A4B7F]">
                Frequently asked questions
              </h2>
              <FaqList items={guide.faq} name={`${id}-faq`} />
            </section>
          )}

          {guide.disclaimer && <p className="text-xs text-slate-400 leading-relaxed">{guide.disclaimer}</p>}
        </div>
      </section>
    </>
  );
}
