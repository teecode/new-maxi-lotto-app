import {cn} from "@/lib/utils.ts";

interface PageHeaderProps {
  title: string;
  className?: string;
}

const PageHeader = ({title, className}: PageHeaderProps) => {
  return (
    <section
      className={cn("pt-24 sm:pt-28 pb-12 sm:pb-16 flex justify-center items-center relative bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] overflow-hidden", className)}>
      {/* Abstract shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <h3
        className="font-montserrat capitalize text-3xl sm:text-4xl text-white font-bold z-10 tracking-tight">{title}</h3>
    </section>
  );
};

export default PageHeader;