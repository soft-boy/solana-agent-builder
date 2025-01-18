/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ArrowLeft, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceWave from '@/components/voice-wave'
import debounce from 'lodash/debounce'
import { toast } from 'sonner'

interface Message {
    role: string;
    content: string;
    timestamp: string;
}

interface ChatDrawerProps {
    isOpen: boolean;
    onToggle: () => void;
    AgentName: string;
}

export function ChatDrawer({ isOpen, onToggle, AgentName }: ChatDrawerProps) {
    const [isMicActive, setIsMicActive] = React.useState(false)
    const [, setVolume] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(false);
    const recognitionRef = React.useRef<SpeechRecognition | null>(null)
    const chatWindowRef = React.useRef<HTMLDivElement>(null)

    const [messages, setMessages] = React.useState<Message[]>([
        {
          role: 'user',
          content: 'Hello!',
          timestamp: '10:15 AM',
        },
        {
          role: 'assistant',
          content: 'Hi there! How can I assist you today?',
          timestamp: '10:16 AM',
        },
    ])

    if (AgentName === undefined) {
        AgentName = "Adam";
    }

    const initializeSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported on this browser.");
            return null;
        }
    
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
    
        recognition.onstart = () => {
            setIsMicActive(true);
        };
    
        recognition.onresult = debounce((event: any) => {
            console.log("Speech recognition result:", event);
            let finalTranscript = '';
            let interimTranscript = '';
    
            // Collect both final and interim transcripts
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
    
                if (event.results[i].isFinal) {
                    finalTranscript += transcript; // Update with final results
                } else {
                    interimTranscript += transcript; // Update with interim results
                }
            }
    
            // If there's any final transcript, update messages
            if (finalTranscript) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'user',
                        content: finalTranscript.trim(),
                        timestamp: new Date().toLocaleTimeString(),
                    },
                ]);
            }
    
            // If there's any interim transcript, dynamically update the last message
            if (interimTranscript) {
                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
    
                    // If the last message was from the user and it’s being updated with an interim result
                    if (lastMessage && lastMessage.role === 'user') {
                        updatedMessages[updatedMessages.length - 1] = {
                            ...lastMessage,
                            content: interimTranscript.trim(),  // Update with the interim result
                        };
                    } else if (!lastMessage || lastMessage.role !== 'user') {
                        // If there's no user message or last message wasn't from the user,
                        // do NOT push a new one just for interim results
                        // We should only update the last message or wait for final result
                    }
                    return updatedMessages;
                });
            }
        }, 300);
    
        recognition.onerror = (event: any) => {
            console.log("Speech recognition error:", event);
            if (event.error === "network") {
                toast.error("Network error: Check your internet connection.");
            } else {
                toast.error(`Speech recognition error: ${event.error}`);
            }
        };
    
        recognition.onend = () => {
            if (isMicActive) {
                try {
                    recognition.start(); // Restart recognition if mic is still active
                } catch (error) {
                    console.error("Speech recognition failed to restart:", error);
                }
            }
        };
    
        return recognition;
    };
    
    
    const startSpeechRecognition = async () => {
        try {
          const recognition = initializeSpeechRecognition();
          if (!recognition) return;
    
          // Setup AudioContext to capture microphone input
          const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
    
          let microphone;
          try {
            // Try to get user media for both mobile and desktop
            microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Failed to access microphone. Please check your permissions.');
            return;
          }
    
          const microphoneStream = audioContext.createMediaStreamSource(microphone);
          microphoneStream.connect(analyser);
    
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
    
          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
    
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
    
            const averageVolume = sum / dataArray.length;
            const normalizedVolume = Math.min(1, averageVolume / 256);
    
            setVolume(normalizedVolume);
          };
    
          const volumeInterval = setInterval(updateVolume, 100);
    
          recognitionRef.current = recognition;
          recognition.start();
    
          recognition.onend = () => {
            clearInterval(volumeInterval);
            microphone.getTracks().forEach((track: MediaStreamTrack) => track.stop());
          };
    
        } catch (error) {
          console.error('Error starting speech recognition:', error);
          toast.error('Failed to start speech recognition.');
        }
    };
      
    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
        setIsMicActive(false);
        setVolume(0); // Reset volume when stopping
    };

    React.useEffect(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, [messages]);

    React.useEffect(() => {
      return () => stopSpeechRecognition(); // Cleanup on component unmount
    }, []);

    const toggleMic = () => {
        if (isMicActive) {
          stopSpeechRecognition();
        } else {
          startSpeechRecognition();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onToggle}>
            <SheetTrigger asChild>
                <motion.div
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-50 overflow-hidden"
                    initial={{ width: '48px' }}
                    whileHover={{ width: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <Button 
                        variant="ghost" 
                        className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 transition-all duration-300 rounded-l-full pr-4 pl-3 h-12"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">Chat with {AgentName}</span>
                    </Button>
                </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] h-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Chat History with {AgentName}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto mt-4 space-y-4 px-2">
                    {messages.map((message, index) => (
                        <div key={index} className="flex space-x-3 p-3 rounded-lg bg-muted/30 backdrop-blur-sm">
                            <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">
                                        {message.role === 'user' ? 'User' : 'Sola'}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {message.timestamp}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="sticky bottom-4 left-0 right-0 flex justify-center">
                    <Button
                        size="lg"
                        className={`rounded-full px-6 py-6 text-sm font-medium shadow-lg text-white transition-all duration-300 ease-in-out ${
                        isMicActive
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                            : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500'
                        }`}
                        onClick={toggleMic}
                        disabled={isLoading}
                    >
                        <div className="flex items-center space-x-2">
                            <AnimatePresence mode="wait" initial={false}>
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </motion.div>
                                ) : isMicActive ? (
                                    <motion.div
                                        key="voice-wave"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <VoiceWave isActive={isMicActive} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="mic-icon"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Mic className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span>{isLoading ? 'Initializing...' : isMicActive ? '' : 'Click to turn on Microphone'}</span>
                        </div>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
