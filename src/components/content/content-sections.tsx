import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { splitLinks, type ContentBlock, type ContentSection } from "@/content/types";

type Tone = "light" | "dark";

export const RichText = ({ text, tone = "light" }: { text: string; tone?: Tone }) => {
  const linkClass = tone === "dark" ? "text-amber-300 underline hover:text-amber-200" : "text-[#0185B6] font-semibold underline hover:text-[#0A4B7F]";
  return (
    <>
      {splitLinks(text).map((part, i) =>
        !part.href ? (
          <span key={i}>{part.text}</span>
        ) : part.href.startsWith("/") ? (
          <Link key={i} to={part.href as any} className={linkClass}>
            {part.text}
          </Link>
        ) : (
          <a key={i} href={part.href} className={linkClass} target="_blank" rel="noopener">
            {part.text}
          </a>
        ),
      )}
    </>
  );
};

const Block = ({ block, tone }: { block: ContentBlock; tone: Tone }) => {
  const dark = tone === "dark";
  const body = dark ? "text-gray-300" : "text-slate-600";

  switch (block.type) {
    case "p":
      return (
        <p className={cn("leading-relaxed", body)}>
          <RichText text={block.text} tone={tone} />
        </p>
      );
    case "list":
      return (
        <ul className={cn("space-y-2 leading-relaxed", body)}>
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", dark ? "bg-amber-400" : "bg-[#01B1A8]")} />
              <span>
                <RichText text={item} tone={tone} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className={cn("space-y-3 leading-relaxed", body)}>
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  dark ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white" : "bg-[#0A4B7F] text-white",
                )}
              >
                {i + 1}
              </span>
              <span className="pt-0.5">
                <RichText text={item} tone={tone} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "terms":
      return (
        <dl className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <div
              key={item.term}
              id={item.id}
              className={cn("scroll-mt-28 rounded-2xl p-5 border", dark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100")}
            >
              <dt className={cn("font-bold mb-1.5", dark ? "text-white" : "text-[#0A4B7F]")}>{item.term}</dt>
              <dd className={cn("text-sm leading-relaxed", body)}>
                <RichText text={item.text} tone={tone} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div className={cn("overflow-x-auto rounded-2xl border", dark ? "border-white/10" : "border-slate-200")}>
          <table className="w-full text-left text-sm">
            <thead className={dark ? "bg-white/10 text-white" : "bg-[#0A4B7F] text-white"}>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="p-3 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={cn("divide-y", dark ? "divide-white/10" : "divide-slate-100")}>
              {block.rows.map((row, i) => (
                <tr key={i} className={dark ? "" : "even:bg-slate-50/60"}>
                  {row.map((cell, j) => (
                    <td key={j} className={cn("p-3 align-top", j === 0 ? cn("font-semibold", dark ? "text-white" : "text-slate-800") : body)}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <p
          className={cn(
            "flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
            dark ? "border-amber-400/30 bg-amber-400/10 text-amber-100" : "border-amber-200 bg-amber-50 text-amber-900",
          )}
        >
          <Info className="size-4 shrink-0 mt-0.5" />
          <span>
            <RichText text={block.text} tone={tone} />
          </span>
        </p>
      );
  }
};

export const ContentSections = ({
  sections,
  tone = "light",
  after,
}: {
  sections: ContentSection[];
  tone?: Tone;
  /** Extra content to show straight after the section with that id (a calculator, a download button). */
  after?: Record<string, ReactNode>;
}) => {
  const dark = tone === "dark";
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="space-y-6">
        <section
          id={section.id}
          className={cn(
            "scroll-mt-28 rounded-3xl p-6 sm:p-8 space-y-4 border",
            dark ? "bg-slate-900/50 border-white/10" : "bg-white shadow-sm border-slate-100",
          )}
        >
          <h2 className={cn("text-xl sm:text-2xl font-bold", dark ? "text-white" : "text-[#0A4B7F]")}>{section.heading}</h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} tone={tone} />
          ))}
        </section>
        {after?.[section.id]}
        </div>
      ))}
    </div>
  );
};
