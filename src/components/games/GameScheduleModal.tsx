import React, { useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, X, Loader2 } from "lucide-react";
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import type { Game } from '@/types/game';
import moment from 'moment';
import { cn } from '@/lib/utils';

interface GameScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
}

export const GameScheduleModal: React.FC<GameScheduleModalProps> = ({ isOpen, onClose, games }) => {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // Group and sort games
  const scheduleGames = React.useMemo(() => {
    return [...games].sort((a, b) => 
      moment(a.endDateTime).format('HH:mm').localeCompare(moment(b.endDateTime).format('HH:mm'))
    );
  }, [games]);

  const lastGameTime = scheduleGames.length > 0 
    ? moment(scheduleGames[scheduleGames.length - 1].endDateTime).format('h:mm A')
    : '';

  const exportAsPng = useCallback(async () => {
    if (!scheduleRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(scheduleRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        quality: 1,
      });
      const link = document.createElement('a');
      link.download = `maxilotto-schedule-${moment().format('YYYY-MM-DD')}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Schedule exported successfully!");
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export schedule.");
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!scheduleRef.current) return;
    try {
      const dataUrl = await toPng(scheduleRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        quality: 1,
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'schedule.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'MaxiLotto Game Schedule',
          text: `Check out today's game schedule on MaxiLotto!`,
        });
      } else {
        await navigator.clipboard.writeText("Check out today's game schedule on MaxiLotto!");
        toast.success("Link copied to clipboard. Share the exported image!");
        exportAsPng();
      }
    } catch (error) {
       if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
          toast.error("Sharing failed.");
        }
    }
  }, [exportAsPng]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-0 sm:rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Game Schedule</DialogTitle>
          <div className="sr-only">Daily game schedule and timetable for export and sharing.</div>
        </DialogHeader>

        <div className="flex flex-col h-full max-h-[90vh]">
            {/* Action Bar (Not Exported) */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0A4B7F]">Schedule Preview</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 gap-2 border-[#0A4B7F]/20 text-[#0A4B7F] hover:bg-[#0A4B7F]/5"
                        onClick={exportAsPng}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                        <span className="hidden sm:inline">Export PNG</span>
                    </Button>
                    <Button 
                        size="sm" 
                        className="h-9 gap-2 bg-[#0A4B7F] hover:bg-[#0A4B7F]/90"
                        onClick={handleShare}
                    >
                        <Share2 className="size-4" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400" onClick={onClose}>
                        <X className="size-5" />
                    </Button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 bg-gray-100 p-4 sm:p-8 flex justify-center">
              {/* THE EXPORTABLE AREA */}
              <div 
                ref={scheduleRef}
                className="w-full max-w-[500px] bg-white shadow-xl flex flex-col items-center relative overflow-hidden"
                style={{ minHeight: '650px' }}
              >
                {/* Header Section */}
                <div className="w-full p-6 flex flex-col items-center gap-6 relative z-10 bg-white">
                  {/* Logo */}
                  <div className="w-full flex justify-end px-4">
                    <img src="/logo.png" alt="Maxi Lotto" className="h-10 w-auto" />
                  </div>

                  {/* Title Visual */}
                  <div className="flex flex-col items-center relative py-4">
                    <div className="flex items-center -space-x-2 mb-[-10px] relative z-20 translate-x-[-40px]">
                      {/* Balls */}
                      <div className="size-10 sm:size-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg border-2 border-white flex items-center justify-center text-white font-bold text-lg rotate-[-15deg]">5</div>
                      <div className="size-12 sm:size-14 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-lg border-2 border-white flex items-center justify-center text-white font-bold text-xl scale-110 z-10">8</div>
                      <div className="size-10 sm:size-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg border-2 border-white flex items-center justify-center text-white font-bold text-lg rotate-[15deg] translate-y-3">2</div>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <h2 className="text-4xl sm:text-5xl font-black text-[#FFF100] italic tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">
                        {moment().format('dddd').toUpperCase()}'S
                      </h2>
                      <div className="mt-[-10px] bg-[#0A4B7F] px-4 py-1 skew-x-[-12deg] shadow-lg">
                        <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-wide uppercase skew-x-[12deg]">
                          GAME SCHEDULE
                        </h3>
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-[#FFF100]/20 blur-2xl rounded-full" />
                  </div>
                </div>

                {/* Table Section */}
                <div className="w-full px-6 flex-1">
                  <div className="bg-[#F0F7FF] rounded-xl p-2 sm:p-4 border border-blue-50">
                    <div className="overflow-hidden rounded-lg shadow-sm">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#0A4B7F] text-white">
                            <th className="py-3 px-4 text-left font-black tracking-wider uppercase text-sm border-r border-white/20">GAME</th>
                            <th className="py-3 px-4 text-left font-black tracking-wider uppercase text-sm">CLOSES AT</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {scheduleGames.map((game, i) => (
                            <tr key={game.gameID} className={cn("border-b border-gray-100", i === scheduleGames.length - 1 && "border-0")}>
                              <td className="py-3 px-4 bg-[#28A745] text-white font-bold text-sm tracking-wide border-r border-white/20 uppercase">
                                {game.gameName}
                              </td>
                              <td className="py-3 px-4 bg-[#28A745] text-white font-bold text-sm tracking-wide uppercase">
                                {moment(game.endDateTime).format('h:mmA')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="w-full p-6 flex flex-col items-center gap-4">
                    <div className="w-full border-y border-dashed border-gray-300 py-3 text-center">
                        <p className="text-sm sm:text-base font-black text-gray-800 uppercase tracking-widest">
                            TODAY'S DRAW CLOSES AT {lastGameTime}
                        </p>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-500 italic">
                        Entries are processed electronically
                    </p>
                </div>

                {/* Footer Section */}
                <div className="w-full bg-[#0A4B7F] p-4 flex items-center gap-4 text-white mt-auto">
                    <div className="size-12 rounded-full bg-white flex items-center justify-center shrink-0">
                        <div className="size-10 rounded-full border-2 border-[#0A4B7F] flex items-center justify-center">
                            <span className="text-[#0A4B7F] font-black text-lg">18+</span>
                        </div>
                    </div>
                    <div className="flex flex-col text-[9px] leading-tight opacity-90">
                        <p className="font-bold mb-1">MAXI LOTTO is a regulated lottery operator licensed by Delta State Internal Revenue Service.</p>
                        <p>MAXI LOTTO supports responsible gambling. Winners know when to stop.</p>
                    </div>
                </div>

                {/* Lighting effects */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-b from-white/20 to-transparent" />
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5 skew-x-[-20deg]" />
                    <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5 skew-x-[20deg]" />
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
