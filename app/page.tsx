'use client'

import { useState, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'
import { Button } from "@/components/ui/button"
import { Mic } from 'lucide-react'
import Disclaimer from '@/components/disclaimer'
import Footer from '@/components/footer'
import VoiceWave from '@/components/voice-wave'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/header'
import { toast } from 'sonner'

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const conversations = [
  { id: 1, title: "Introduction to Solana", date: "2023-05-15" },
  { id: 2, title: "Smart Contracts on Solana", date: "2023-05-16" },
  { id: 3, title: "Solana vs Ethereum", date: "2023-05-17" },
  { id: 4, title: "Solana Tokenomics", date: "2023-05-18" },
  { id: 5, title: "Solana DeFi Ecosystem", date: "2023-05-19" },
]

export default function Chat() {
  const [messages, setMessages] = useState([
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [volume, setVolume] = useState(0)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)

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
  
      // If there's any interim transcript, update the displayed message dynamically
      if (interimTranscript) {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: interimTranscript.trim(),
          };
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

  const toggleMic = () => {
    if (isMicActive) {
      stopSpeechRecognition()
    } else {
      startSpeechRecognition()
    }
  }

  const startSpeechRecognition = async () => {
    try {
      const recognition = initializeSpeechRecognition();
      if (!recognition) return;
  
      // Setup AudioContext to capture microphone input
      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      const microphoneStream = audioContext.createMediaStreamSource(microphone);
      microphoneStream.connect(analyser);
  
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
  
        // Get the average volume (loudness) from the frequency data
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / dataArray.length;
  
        // Normalize the volume to a range of 0-1 for the voice wave component
        const normalizedVolume = Math.min(1, averageVolume / 256);
        setVolume(normalizedVolume); // Update the volume state
      };
  
      const volumeInterval = setInterval(updateVolume, 100); // Update volume every 100ms
  
      recognitionRef.current = recognition;
      recognition.start();
  
      recognition.onend = () => {
        clearInterval(volumeInterval); // Clean up when recognition ends
      };
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error('Failed to start speech recognition.');
    }
  };
  

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsMicActive(false)
  }

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Stop speech recognition when component unmounts
    return () => stopSpeechRecognition()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header isDrawerOpen={isDrawerOpen} onToggleDrawer={toggleDrawer} />

      <div className="flex flex-grow overflow-hidden">
        <aside className={`hidden md:block ${isDrawerOpen ? 'w-64' : 'w-0'} overflow-y-auto border-r border-border transition-all duration-300`}>
          {isDrawerOpen && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Conversation History</h2>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className="w-full justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">{conversation.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {conversation.date}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isDrawerOpen ? 'md:ml-64' : ''}`}>
          <div className="flex-grow overflow-y-auto px-4 py-6" ref={chatWindowRef}>
            <div className="max-w-screen-md mx-auto">
              <div className="text-xs text-muted-foreground mb-4 font-mono">Current Conversation</div>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="flex space-x-3">
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
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="max-w-screen-md mx-auto flex flex-col items-center space-y-2">
              <Button 
                size="lg"
                className={`rounded-full px-6 py-6 text-sm font-medium shadow-lg text-white transition-all duration-300 ease-in-out ${
                  isMicActive 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                    : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500'
                }`}
                onClick={toggleMic}
              >
                <div className="flex items-center space-x-2">
                  <AnimatePresence mode="wait" initial={false}>
                    {isMicActive ? (
                      <motion.div
                        key="voice-wave"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <VoiceWave isActive={isMicActive} volume={volume} />
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
                  <span>{isMicActive ? 'Listening...' : 'Click to turn on Microphone'}</span>
                </div>
              </Button>
            </div>
          </div>
        </main>
      </div>

      <Disclaimer />
      <Footer />
    </div>
  )
}
