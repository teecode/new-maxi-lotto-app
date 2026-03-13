import React, { useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toPng } from 'html-to-image';
import { Share2, Download, X, MessageCircle, Twitter } from 'lucide-react';
import type { GameResultType } from "@/types/game";
import { fullDateFormat } from "@/lib/utils";
import Ball from "../ball";
import logo from '/maxilotto.png'; 

interface ResultShareModalProps {
  result: GameResultType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResultShareModal: React.FC<ResultShareModalProps> = ({ result, isOpen, onClose }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const exportAsPng = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        backgroundColor: '#f9fafb',
        pixelRatio: 2,
        quality: 1,
        filter: (node: HTMLElement) => node.dataset?.exportHide !== 'true',
      });
      const link = document.createElement('a');
      link.download = `maxilotto-${result?.gameName || 'result'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [result]);

  const shareResults = useCallback((platform: 'twitter' | 'whatsapp') => {
    if (!result) return;
    const winning = [
      result.result.winningBall1,
      result.result.winningBall2,
      result.result.winningBall3,
      result.result.winningBall4,
      result.result.winningBall5,
    ].map(n => n.toString().padStart(2, '0')).join(' - ');
    
    const machine = [
      result.result.machineBall1,
      result.result.machineBall2,
      result.result.machineBall3,
      result.result.machineBall4,
      result.result.machineBall5,
    ].map(n => n.toString().padStart(2, '0')).join(' - ');

    const text = `🎰 MaxiLotto ${result.gameName} Draw Results!\n\n🏆 Winning: ${winning}\n🎲 Machine: ${machine}\n\n#MaxiLotto #Lottery`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  }, [result]);

  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-background border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Share Result</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Action Header */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share Result
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto">
            {/* Visual Preview Area */}
            <div 
              ref={previewRef}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border/40 space-y-6"
            >
              {/* Preview Header */}
              <div className="flex flex-col gap-6 text-center">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <img src="/maxilotto-icon.png" alt="MaxiLotto Icon" className="h-12 md:h-16 object-contain" />
                    <img src={logo} alt="MaxiLotto" className="h-10 md:h-12 object-contain" />
                  </div>
                  <div className="text-center sm:text-right text-[10px] md:text-xs text-muted-foreground leading-tight">
                    <p className="font-semibold uppercase tracking-wider">{fullDateFormat(result.endDateTime)}</p>
                  </div>
                </div>
                
                <div className="border-t border-primary/10 pt-6">
                  <h2 className="font-black text-3xl md:text-4xl text-primary tracking-tight uppercase leading-none mb-1">
                    {result.gameName}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest" data-export-hide="true">
                    Draw Code: {result.gameCode}
                  </p>
                </div>
              </div>

              {/* Numbers Section */}
              <div className="space-y-4">
                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#01B1A8]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Winning Numbers</span>
                   </div>
                   <div className="flex justify-center gap-2 md:gap-3">
                      {[result.result.winningBall1, result.result.winningBall2, result.result.winningBall3, result.result.winningBall4, result.result.winningBall5].map((num, i) => (
                        <Ball key={i} value={num} variant="winning" className="h-10 w-10 md:h-12 md:w-12 text-sm shadow-xl" />
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#FDBF03]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Machine Numbers</span>
                   </div>
                   <div className="flex justify-center gap-2 md:gap-3">
                      {[result.result.machineBall1, result.result.machineBall2, result.result.machineBall3, result.result.machineBall4, result.result.machineBall5].map((num, i) => (
                        <Ball key={i} value={num} variant="machine" className="h-10 w-10 md:h-12 md:w-12 text-sm shadow-xl" />
                      ))}
                   </div>
                </div>
              </div>

              {/* 18+ Warning */}
              <div className="border-t border-border pt-4 flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-destructive font-bold">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full border border-destructive text-[8px]">18+</span>
                   <span className="text-[9px] uppercase tracking-wider">Play Responsibly</span>
                </div>
                <p className="text-[8px] text-muted-foreground text-center max-w-[200px] leading-tight opacity-70">
                  Gambling can be addictive. For help, contact support.
                </p>
              </div>
            </div>

            {/* Sharing Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={exportAsPng} 
                className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2 py-6 rounded-xl"
              >
                <Download className="w-4 h-4" />
                <span>Export PNG</span>
              </Button>
              <Button 
                onClick={() => shareResults('whatsapp')} 
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white flex items-center gap-2 py-6 rounded-xl border-none"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
              <Button 
                onClick={() => shareResults('twitter')} 
                className="w-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white flex items-center gap-2 py-6 rounded-xl border-none"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </Button>
              <Button 
                variant="outline"
                onClick={onClose} 
                className="w-full flex items-center gap-2 py-6 rounded-xl"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
