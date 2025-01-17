import debounce from 'lodash/debounce';
import { toast } from 'sonner';

export const initializeSpeechRecognition = (
  setIsMicActive: (active: boolean) => void,
  updateMessages: (transcript: string, isFinal: boolean) => void
) => {
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

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      updateMessages(finalTranscript.trim(), true);
    }

    if (interimTranscript) {
      updateMessages(interimTranscript.trim(), false);
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

  return recognition;
};

export const setupAudioContext = async (setVolume: (volume: number) => void) => {
  const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  try {
    const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    const microphoneStream = audioContext.createMediaStreamSource(microphone);
    microphoneStream.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedVolume = Math.min(1, averageVolume / 256);
      setVolume(normalizedVolume);
    };

    const volumeInterval = setInterval(updateVolume, 100);

    return { microphone, volumeInterval };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    toast.error('Failed to access microphone. Please check your permissions.');
    return null;
  }
};

