import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface UseVoiceRecognitionOptions {
  onResult?: (transcript: string) => void;
  lang?: string;
  continuous?: boolean;
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(options.onResult);
  onResultRef.current = options.onResult;

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = true;
      recognition.lang = options.lang || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        const cleanFinal = finalTranscript.trim();
        setInterimTranscript(currentInterim);
        
        if (cleanFinal) {
          setTranscript(cleanFinal);
          if (onResultRef.current) {
            onResultRef.current(cleanFinal);
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          setError('No speech detected. Please speak closer to your microphone.');
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please enable microphone permissions in your browser.');
        } else {
          setError(`Speech error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [options.lang, options.continuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Voice recognition not initialized.');
      return;
    }
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
    } catch (e: any) {
      // If already started, stop and restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 150);
      } catch (err) {
        console.error('Speech recognition start failed:', err);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
}
