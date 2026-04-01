/// <reference types="vite/client" />
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

interface DrawReadyData {
    gameName: string;
    videoUrl: string;
    timestamp: string;
}

export const LiveDrawOverlay: React.FC = () => {
    const [drawData, setDrawData] = useState<DrawReadyData | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const timerRef = useRef<any | null>(null);

    useEffect(() => {
        // Initialize socket connection with reconnection limits
        socketRef.current = io(SOCKET_URL, {
            reconnectionAttempts: 5,
            timeout: 10000,
        });

        socketRef.current.on('connect', () => {
            console.log('[LIVE_DRAW] Connected to notification server');
        });

        socketRef.current.on('connect_error', (err) => {
            console.warn('[LIVE_DRAW] Connection error:', err.message);
        });

        socketRef.current.on('draw_ready', (data: DrawReadyData) => {
            // Defensive validation: Ensure we have the required fields
            if (!data?.gameName || !data?.videoUrl) {
                console.error('[LIVE_DRAW] Malformed draw_ready payload received', data);
                return;
            }

            console.log('[LIVE_DRAW] Draw ready event received:', data);
            setDrawData(data);
            setCountdown(10); // Start 10-second countdown
            setShowVideo(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            timerRef.current = setInterval(() => {
                setCountdown(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (countdown === 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowVideo(true);

            // Safety timeout: Auto-close after 5 minutes if video never ends/errors
            timerRef.current = setTimeout(() => {
                console.warn('[LIVE_DRAW] Session timeout reached, closing overlay');
                handleClose();
            }, 5 * 60 * 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                clearTimeout(timerRef.current);
            }
        };
    }, [countdown]);

    const handleClose = () => {
        setDrawData(null);
        setCountdown(null);
        setShowVideo(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            clearTimeout(timerRef.current);
        }
    };

    if (!drawData) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="w-full max-w-4xl flex flex-col items-center text-center">
                    {!showVideo ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.div 
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                        boxShadow: ["0 0 20px rgba(59, 130, 246, 0.2)", "0 0 50px rgba(59, 130, 246, 0.4)", "0 0 20px rgba(59, 130, 246, 0.2)"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-400 font-bold uppercase tracking-widest text-sm"
                                >
                                    <Info size={16} /> Live Draw Event
                                </motion.div>
                                <h1 className="text-4xl md:text-6xl font-black text-white">
                                    Starting draw for <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                        {drawData.gameName}
                                    </span>
                                </h1>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-8xl md:text-[12rem] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                >
                                    {countdown}
                                </motion.div>
                                
                                {/* Pulse Ring */}
                                <motion.div 
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-blue-500/30"
                                />
                            </div>

                            <p className="text-gray-400 text-lg md:text-xl">
                                Get your tickets ready! The winning numbers are being drawn...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                        >
                            <video
                                src={drawData.videoUrl}
                                autoPlay
                                controls
                                className="w-full h-full object-contain"
                                onEnded={handleClose}
                                onError={handleClose}
                            />
                            
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white/50 text-xs px-4 pointer-events-none">
                                <span>Record Date: {new Date(drawData.timestamp).toLocaleString()}</span>
                                <span className="uppercase tracking-widest font-bold text-blue-400">Live Recording</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
