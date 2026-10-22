import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Send, 
  MessageSquare, 
  Package, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import type { Conversation, Message } from '../types';
import { useAuth } from '../context/AuthContext';

const QUICK_CHIPS = [
  'Can we meet outside Central Library at 3 PM?',
  'Is this still available for pickup today?',
  'Sounds great! See you there.',
  'Thank you so much for giving this a second life! 🌱'
];

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await api.getConversations();
      const list: Conversation[] = res.conversations || [];
      setConversations(list);

      const targetId = searchParams.get('conv');
      if (targetId) {
        const found = list.find(c => c.id === targetId);
        if (found) {
          selectConversation(found);
          return;
        }
      }

      if (list.length > 0 && !activeConv) {
        selectConversation(list[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    try {
      const res = await api.getConversation(conv.id);
      setActiveConv(res.conversation);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || messageText;
    if (!textToSend.trim() || !activeConv || !user) return;

    setSending(true);
    try {
      const res = await api.sendMessage(activeConv.id, textToSend.trim());
      setActiveConv(res.conversation);
      setMessageText('');
      scrollToBottom();

      // Update conversations sidebar list
      setConversations(prev => prev.map(c => c.id === activeConv.id ? res.conversation : c));
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!user) return { name: 'User', avatar: '', location: '' };
    const otherId = conv.participants.find(p => p !== user.id) || conv.participants[0];
    return conv.participantDetails[otherId] || { name: 'Community Member', avatar: '', location: '' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
          Direct Community Chat
        </span>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rekind-dark">
          Messages & Handover Coordination
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-rekind-border overflow-hidden shadow-subtle grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Sidebar: Conversations List */}
        <div className={`md:col-span-4 lg:col-span-4 border-r border-rekind-border flex flex-col ${
          activeConv ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-rekind-border/70 bg-rekind-cream/50">
            <h3 className="font-heading font-bold text-sm text-rekind-dark">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="divide-y divide-rekind-border/50 overflow-y-auto flex-1 max-h-[560px]">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConv?.id === conv.id;
                const unread = user ? (conv.unreadCount?.[user.id] || 0) : 0;

                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-rekind-beige/50' : 'hover:bg-rekind-cream/50'
                    }`}
                  >
                    <img
                      src={other.avatar}
                      alt={other.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-rekind-sand"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-xs sm:text-sm text-rekind-dark truncate">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-rekind-muted shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {conv.itemTitle && (
                        <div className="flex items-center gap-1 text-[11px] text-rekind-brown font-medium truncate mb-1">
                          <Package className="w-3 h-3 shrink-0 text-rekind-terracotta" />
                          <span className="truncate">{conv.itemTitle}</span>
                        </div>
                      )}

                      <p className="text-xs text-rekind-muted truncate line-clamp-1">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rekind-terracotta text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-rekind-muted">
                No active conversations yet. When you request an item or someone reaches out, your chats will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Active Thread */}
        <div className={`md:col-span-8 lg:col-span-8 flex flex-col justify-between ${
          !activeConv ? 'hidden md:flex items-center justify-center' : 'flex'
        }`}>
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-rekind-border/70 flex items-center justify-between bg-rekind-cream/40">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConv(null)}
                    className="md:hidden p-1.5 rounded-lg border border-rekind-border text-rekind-muted hover:text-rekind-dark"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={getOtherParticipant(activeConv).avatar}
                    alt={getOtherParticipant(activeConv).name}
                    className="w-9 h-9 rounded-full object-cover border border-rekind-sand"
                  />

                  <div>
                    <h3 className="font-heading font-bold text-sm text-rekind-dark leading-tight">
                      {getOtherParticipant(activeConv).name}
                    </h3>
                    <p className="text-[11px] text-rekind-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rekind-muted" />
                      <span>{getOtherParticipant(activeConv).location || 'Community Member'}</span>
                    </p>
                  </div>
                </div>

                {activeConv.itemId && (
                  <Link
                    to={`/item/${activeConv.itemId}`}
                    className="text-xs font-semibold text-rekind-brown hover:text-rekind-dark flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rekind-border bg-white"
                  >
                    <span className="hidden sm:inline">Item Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Linked Item Banner */}
              {activeConv.itemTitle && (
                <div className="px-4 py-2 bg-rekind-beige/40 border-b border-rekind-border text-xs text-rekind-brown flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium truncate">
                    <Package className="w-3.5 h-3.5 text-rekind-terracotta shrink-0" />
                    <span>Topic: <strong>{activeConv.itemTitle}</strong></span>
                  </span>
                  <span className="text-[10px] text-rekind-muted">Safe campus handover</span>
                </div>
              )}

              {/* Messages Body */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 max-h-[420px] bg-rekind-cream/20">
                {activeConv.messages?.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-baseline gap-1.5 mb-1 text-[10px] text-rekind-muted">
                        <span className="font-semibold">{isMe ? 'You' : msg.senderName}</span>
                        <span>•</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          isMe
                            ? 'bg-rekind-dark text-white rounded-br-xs shadow-xs'
                            : 'bg-white border border-rekind-border text-rekind-dark rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions */}
              <div className="px-4 pt-2 pb-1 border-t border-rekind-border/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-rekind-muted font-medium shrink-0">Quick reply:</span>
                {QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, chip)}
                    className="px-2.5 py-1 rounded-full bg-rekind-sand/40 hover:bg-rekind-sand text-rekind-dark text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-rekind-border/70 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a thoughtful message or arrange a safe meetup..."
                  className="flex-1 px-4 py-2.5 bg-rekind-cream/40 border border-rekind-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-rekind-tan"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="p-2.5 rounded-xl bg-rekind-dark text-white hover:bg-rekind-espresso transition-colors disabled:opacity-50"
                  title="Send message"
                >
                  <Send className="w-4 h-4 text-rekind-tan" />
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-rekind-muted space-y-2">
              <MessageSquare className="w-12 h-12 text-rekind-sand mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">Select a conversation</h3>
              <p className="text-xs">Coordinate pickup times, ask item questions, and confirm safe swaps.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
