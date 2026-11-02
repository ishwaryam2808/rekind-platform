import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, MicOff, BookOpen, Bot, Shield, Check, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface MachineryCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id?: string;
    title: string;
    category: string;
    manufacturer?: string;
    modelNumber?: string;
    condition: string;
    operatingHours?: number;
    location: string;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    id: string;
    topic: string;
    source: string;
  }>;
  timestamp: string;
}

export const MachineryCopilotModal: React.FC<MachineryCopilotModalProps> = ({ isOpen, onClose, item }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting & technical capabilities
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I am your REKIND Digital Twin & OEM Engineering Copilot for the **${item.title}** (${item.manufacturer || 'OEM'} ${item.modelNumber || ''}).\n\nI am grounded in official engineering manuals and field service guides. Ask me about auxiliary hydraulic relief pressures, maintenance schedules, spindle tapers, electrical wiring, or heavy transit tie-downs.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, item]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is supported in modern Chrome, Edge, and Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askMachineryCopilot({
        itemId: item.id,
        question: query,
        item: item,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
      });

      const assistantMsg: Message = {
        role: 'assistant',
        content: res.answer || "I've reviewed the OEM technical manual for this machine class.",
        citations: res.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `Error retrieving technical specs: ${err.message || 'Please check network connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = [
    'What is the auxiliary hydraulic pump flow & relief pressure?',
    'What are the scheduled maintenance intervals and oil grades?',
    'What are the transport dimensions and trailer requirements?',
    'What are the critical inspection points before putting into operation?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base">RAG Machinery Engineering Copilot</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  <span>OEM Grounded</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Digital Twin: <strong className="text-slate-200">{item.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations block for assistant answers */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>OEM Technical Manual Grounding:</span>
                    </span>
                    {msg.citations.map((cite, cIdx) => (
                      <div key={cIdx} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80 text-xs text-slate-300">
                        <div className="font-semibold text-slate-200">{cite.topic}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <FileText className="w-3 h-3 text-teal-400 inline" />
                          <span className="font-mono">{cite.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] mt-2 font-mono ${msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-bl-none p-4 text-sm text-slate-400 flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <span>Consulting OEM engineering knowledge base & telemetry...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center space-x-2 overflow-x-auto scrollbar-thin">
          <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>Suggested:</span>
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title={isListening ? 'Listening (Click to stop)' : 'Click to speak technical query'}
            >
              {isListening ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-teal-400" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask engineering question regarding this ${item.category || 'machine'}...`}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold p-2.5 rounded-xl transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
