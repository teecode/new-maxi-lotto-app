import { FAQ_DATA } from "@/constants/faq";
import { CircleQuestionMark, ChevronDown } from "lucide-react";
import type { FaqEntry } from "@/content/types";
import { RichText } from "@/components/content/content-sections";
import { cn } from "@/lib/utils";

// Native <details> rather than the Radix accordion: Radix does not render a
// closed item's answer at all, so search engines only ever saw the questions.
// A shared `name` keeps one item open at a time, as the accordion did.
export const FaqList = ({ items, name, tone = "light" }: { items: FaqEntry[]; name: string; tone?: "light" | "dark" }) => {
  const dark = tone === "dark";
  return (
    <div className="w-full space-y-4">
      {items.map((item, index) => (
        <details
          key={index}
          name={name}
          className={cn(
            "group border-2 rounded-[2rem] px-6 py-2 overflow-hidden transition-all duration-300",
            dark
              ? "border-white/10 bg-white/5 open:border-white/30"
              : "border-slate-100 bg-white open:border-slate-900 open:shadow-2xl open:shadow-slate-200",
          )}
        >
          <summary className="flex gap-4 items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span
              className={cn(
                "flex shrink-0 items-center justify-center w-10 h-10 rounded-xl transition-colors duration-300",
                dark
                  ? "bg-white/10 text-gray-300 group-open:bg-white group-open:text-slate-900"
                  : "bg-slate-50 text-slate-400 group-open:bg-slate-900 group-open:text-white",
              )}
            >
              <CircleQuestionMark size={20} />
            </span>
            <h3
              className={cn(
                "flex-1 py-4 text-left text-base font-bold transition-colors duration-300",
                dark ? "text-gray-200 group-open:text-white" : "text-slate-700 group-open:text-slate-900",
              )}
            >
              {item.question}
            </h3>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform duration-200 group-open:rotate-180",
                dark ? "text-gray-400" : "text-slate-400",
              )}
            />
          </summary>

          <div
            className={cn(
              "pb-6 pt-4 text-sm font-medium leading-relaxed border-t mt-2",
              dark ? "text-gray-300 border-white/10" : "text-slate-500 border-slate-50",
            )}
          >
            <RichText text={item.answer} tone={tone} />
          </div>
        </details>
      ))}
    </div>
  );
};

const FaqData = () => <FaqList items={FAQ_DATA} name="faq" />;

export default FaqData
