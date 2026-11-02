import React, { useState } from 'react';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLiveBanner?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  title = 'Voice recognition (click and speak machine specs or keywords)',
  className = '',
  size = 'md',
  showLiveBanner = true
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition({
    onResult: (text) => {
      onTranscript(text);
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      alert('Voice Recognition is supported in Chrome, Edge, Safari, and modern mobile browsers.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setModalOpen(true);
      startListening();
    }
  };

  const handleClose = () => {
    stopListening();
    setModalOpen(false);
  };

  const sizeClasses = {
    sm: 'p-1.5 w-7 h-7 text-xs',
    md: 'p-2 w-8 h-8 text-sm',
    lg: 'p-3 w-10 h-10 text-base'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={title}
        className={`relative inline-flex items-center justify-center rounded-xl transition-all ${sizeClasses} ${
          isListening
            ? 'bg-red-500 text-white shadow-md animate-pulse ring-4 ring-red-200'
            : 'text-rekind-muted hover:text-rekind-dark hover:bg-rekind-sand/50'
        } ${className}`}
      >
        {isListening ? (
          <span className="relative flex items-center justify-center">
            <Volume2 className={`${iconSizes} animate-bounce`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          </span>
        ) : (
          <Mic className={iconSizes} />
        )}
      </button>

      {/* Voice Recognition Floating Banner / Modal */}
      {showLiveBanner && modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-rekind-border max-w-md w-full p-6 shadow-2xl relative text-center space-y-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-rekind-muted hover:text-rekind-dark hover:bg-rekind-sand/40"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center relative">
              <Mic className="w-8 h-8 animate-pulse" />
              {isListening && (
                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-rekind-dark">
                {isListening ? 'Listening for Machine or Spec...' : 'Voice Input Completed'}
              </h3>
              <p className="text-xs text-rekind-muted">
                Speak naturally (e.g., &ldquo;CAT 320 excavator 20 ton&rdquo;, &ldquo;5 ton forklift&rdquo;, or &ldquo;CNC lathe machine&rdquo;)
              </p>
            </div>

            {/* Live Waveform Indicator */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-8">
                <span className="w-1.5 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-8 bg-red-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              </div>
            )}

            {/* Transcript Preview */}
            <div className="min-h-16 p-3.5 rounded-2xl bg-rekind-beige/40 border border-rekind-border/70 text-xs sm:text-sm font-medium text-rekind-dark flex items-center justify-center text-center">
              {transcript || interimTranscript ? (
                <span className="text-rekind-dark font-semibold">
                  &ldquo;{transcript || interimTranscript}&rdquo;
                </span>
              ) : (
                <span className="text-rekind-muted italic">Waiting for voice input...</span>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium">{error}</p>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              {isListening ? (
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Done Speaking</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startListening}
                  className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-bold hover:bg-rekind-espresso transition-colors flex items-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Speak Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-rekind-sand/40 text-rekind-dark text-xs font-semibold hover:bg-rekind-sand/70 transition-colors"
              >
                Apply to Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
