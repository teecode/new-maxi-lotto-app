import { FAQ_DATA } from "@/constants/faq";
import { CircleQuestionMark } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const FaqData = () => {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {FAQ_DATA.map((item, index) => (
        <AccordionItem 
          key={index}
          value={`faq-${index}`} 
          className="group border-2 border-slate-100 bg-white rounded-[2rem] px-6 py-2 overflow-hidden transition-all duration-300 data-[state=open]:border-slate-900 data-[state=open]:shadow-2xl data-[state=open]:shadow-slate-200"
        >
          <div className="flex gap-4 items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-data-[state=open]:bg-slate-900 group-data-[state=open]:text-white transition-colors duration-300">
              <CircleQuestionMark size={20} />
            </div>
            <AccordionTrigger className="flex-1 py-4 text-left font-bold text-slate-700 group-data-[state=open]:text-slate-900 hover:no-underline transition-colors duration-300">
              {item.question}
            </AccordionTrigger>
          </div>

          <AccordionContent className="pb-6 pt-2 text-slate-500 font-medium leading-relaxed border-t border-slate-50 mt-2">
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {item.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>

  )
}

export default FaqData