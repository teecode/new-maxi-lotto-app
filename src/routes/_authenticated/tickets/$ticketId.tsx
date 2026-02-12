import {createFileRoute, Link} from '@tanstack/react-router'
import {fetchTicketById} from "@/services/GameService.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DownloadIcon, Share2, Loader2} from "lucide-react";
import {formatCurrency, fullDateTimeFormat} from "@/lib/utils.ts";
import Ball from "@/components/ball.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useRef, useCallback, useState} from "react";
import {toast} from "sonner";

export const Route = createFileRoute('/_authenticated/tickets/$ticketId')({
  loader: async ({params}) => {
    const id = Number(params.ticketId)
    return await fetchTicketById(id)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const ticket = Route.useLoaderData();
  const ticketCardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const isAccumulator = ticket.ticketType === 2;
  const totalOdds = isAccumulator 
    ? ticket.betslips.reduce((acc, slip) => acc * (slip.betType.winFactor || 1), 1)
    : 0;

  const handleDownload = useCallback(async () => {
    if (!ticketCardRef.current) return;
    setDownloading(true);

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(ticketCardRef.current, {
        backgroundColor: '#f9fafb',
        pixelRatio: 2,
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = `ticket-${ticket.id}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Ticket downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [ticket.id]);

  const handleShare = useCallback(async () => {
    const statusEmoji = ticket.status.name === 'Won' ? '🏆' : ticket.status.name === 'Lost' ? '❌' : '⏳';
    const shareText = [
      `${statusEmoji} MaxiLotto Ticket #${ticket.id}`,
      `🎮 Game: ${ticket.game.name}`,
      `💰 Stake: ${formatCurrency(ticket.amount)}`,
      ticket.status.name === 'Won' 
        ? `🏆 Won: ${formatCurrency(ticket.wonAmount)}` 
        : `🎯 Potential Win: ${formatCurrency(ticket.possibleWin)}`,
      `📊 Status: ${ticket.status.name}`,
      `📅 Date: ${fullDateTimeFormat(ticket.dateRegistered).split(',')[0]}`,
      '',
      `Bet Slips:`,
      ...ticket.betslips.map((slip, i) => 
        `  ${i + 1}. ${slip.betType.code} - Numbers: [${slip.bet1.join(', ')}] - ${slip.status.name}`
      ),
    ].join('\n');

    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `MaxiLotto Ticket #${ticket.id}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled share — not an error
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success("Ticket details copied to clipboard!");
      } catch {
        toast.error("Failed to copy ticket details.");
      }
    }
  }, [ticket]);

  return (
    <>
      <section className="py-8 sm:py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          
          <div ref={ticketCardRef}>
          <Card className="bg-white border-0 shadow-xl overflow-hidden rounded-2xl">
            {/* Header */}
            <CardHeader className="p-0 border-b border-gray-100">
              <div className="bg-[#0A4B7F] w-full p-6 text-white text-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <h1 className="text-2xl font-bold font-poppins">Ticket Details</h1>
                  <p className="text-blue-100 text-sm font-medium opacity-90">
                    ID: #{ticket.id}
                  </p>
                  <Badge 
                    className={`mt-2 px-4 py-1 text-xs font-bold uppercase tracking-wider ${
                      ticket.status.name === 'Won' ? 'bg-teal-500 hover:bg-teal-600' :
                      ticket.status.name === 'Lost' ? 'bg-red-500 hover:bg-red-600' :
                      'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {ticket.status.name}
                  </Badge>
                </div>
                
                {/* Decorational Circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
              </div>
            </CardHeader>

            {/* Summary Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-blue-50/50 border-b border-blue-100">
               <div>
                 <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                 <p className="text-sm font-medium text-[#0A4B7F]">{fullDateTimeFormat(ticket.dateRegistered).split(',')[0]}</p>
               </div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Stake</p>
                  <p className="text-sm font-bold text-[#0A4B7F]">{formatCurrency(ticket.amount)}</p>
               </div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    {ticket.status.name === 'Won' ? 'Won Amount' : 'Potential Win'}
                  </p>
                  <p className={`text-sm font-bold ${ticket.status.name === 'Won' ? 'text-teal-600' : 'text-[#0A4B7F]'}`}>
                    {ticket.status.name === 'Won' ? formatCurrency(ticket.wonAmount) : formatCurrency(ticket.possibleWin)}
                  </p>
               </div>
               {isAccumulator && (
                 <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Odds</p>
                    <p className="text-sm font-bold text-[#0A4B7F]">{totalOdds.toFixed(2)}</p>
                 </div>
               )}
            </div>

            <CardContent className="p-6">
              <h4 className="flex items-center gap-2 font-bold text-[#0A4B7F] mb-4">
                <span className="w-1 h-6 bg-[#FFF100] rounded-full block"></span>
                {isAccumulator ? 'Accumulator Legs' : 'Bet Slips'}
              </h4>

              <div className="space-y-4">
                {ticket.betslips.map((betslip, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                    {/* Betslip Header */}
                    <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0A4B7F] text-sm">{betslip.betType.code}</span>
                        {isAccumulator && <Badge variant="outline" className="text-xs bg-white text-gray-600 border-gray-200">Odds: {(betslip.betType.winFactor || 1).toFixed(2)}</Badge>}
                      </div>
                      <Badge variant={betslip.status.name === 'Won' ? 'default' : 'secondary'} className={betslip.status.name === 'Won' ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                         {betslip.status.name}
                      </Badge>
                    </div>

                    <div className="p-4">
                       {/* Game Info for Accumulator context, or generally useful */}
                       <div className="mb-3 flex justify-between items-center text-xs text-gray-500">
                          <span>Game: <span className="font-medium text-gray-700">{ticket.game.name}</span></span>
                          {!isAccumulator && <span>Lines: {betslip.lines}</span>}
                       </div>

                       {/* Selections */}
                       <div className="space-y-3">
                         {/* Bet 1 / Selection */}
                         <div>
                            <div className="flex justify-between items-end">
                              <div>
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                                  {isAccumulator ? 'Selection' : 'Selected Numbers'}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {betslip.bet1 && betslip.bet1.length > 0 ? (
                                     betslip.bet1.map((ball) => (
                                        isAccumulator && ball === 0 ? 
                                        <span className="text-sm font-medium text-[#0A4B7F]"> Standard - {betslip.betType.description} </span> :
                                        <Ball key={ball} className="h-8 w-8 text-xs font-bold" value={ball}/> 
                                     ))
                                  ) : (
                                    <span className="text-sm text-gray-400 italic">None</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Big Stake Display for Singles - ONLY for Singles */}
                              {!isAccumulator && (
                                <div className="text-right">
                                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Stake</span>
                                  <span className="text-2xl font-bold font-mono text-teal-600 bg-teal-50 px-2 py-1 rounded border border-teal-100 inline-block shadow-sm">
                                    {betslip.stakePerLine}
                                  </span>
                                </div>
                              )}
                            </div>
                         </div>

                         {/* Bet 2 / Against (Only if present) */}
                         {betslip.bet2 && betslip.bet2.length > 0 && (
                           <div>
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                                Against
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {betslip.bet2.map((ball) => (
                                  <Ball key={ball} className="h-8 w-8 text-xs bg-red-50 text-red-600 border-red-100" value={ball}/>
                                ))}
                              </div>
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>

            <CardFooter className="bg-gray-50 p-6 flex flex-col gap-4 border-t border-gray-100">
              <div className="flex justify-between gap-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#0A4B7F]/20 text-[#0A4B7F] hover:bg-[#0A4B7F]/5"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <DownloadIcon className="mr-2 h-4 w-4" />
                  )}
                  {downloading ? 'Saving...' : 'Download'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#0A4B7F]/20 text-[#0A4B7F] hover:bg-[#0A4B7F]/5"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
              
              <Button size="lg" asChild className="w-full bg-[#0A4B7F] hover:bg-[#093e6b] text-white rounded-xl shadow-lg shadow-blue-900/10">
                <Link to="/tickets">Back to Tickets</Link>
              </Button>
            </CardFooter>
          </Card>
          </div>
        </div>
      </section>
    </>
  )
}

