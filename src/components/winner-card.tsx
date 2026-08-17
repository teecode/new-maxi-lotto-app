import { Separator } from "@/components/ui/separator";
import { formattedDate, maskUsernameIfPhoneNumber } from "@/lib/utils";
import type { WinnerTicket } from "@/types/game";
import { Image } from "@unpic/react";
import { useState } from "react";

interface WinnerCardProps {
  ticket: WinnerTicket
}
const WinnerCard = ({ ticket }: WinnerCardProps) => {

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Adjust the threshold value to control the tilt effect
  const threshold = 12;

  const handleMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer w-full bg-accent-2-900"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <Image width={100} height={100} src="/64x64.png"
        alt="City skyline" className="w-full h-25 object-cover"
      />
      <div className="text-center px-10">
        <h3 className="mt-3 pt-3 mb-4 text-2xl font-bold text-background">
          {ticket.game.name}
        </h3>
        <Separator />
        <p className="text-xl font-semibold py-4 text-background ">
          @{maskUsernameIfPhoneNumber(ticket?.username || ticket?.name)}
        </p>
        <Separator />
        <div className="space-y-1 py-4 text-lg">
          <p className="font-normal text-slate-400">
            Draw took place on:
          </p>

          <p className="font-medium text-background">
            {formattedDate(ticket.date)}
          </p>
        </div>

      </div>

    </div>

  );
};

export default WinnerCard