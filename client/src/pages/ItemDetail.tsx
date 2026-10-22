import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Tag, 
  Eye, 
  Clock, 
  Repeat, 
  Gift, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import type { Item, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { ItemCard } from '../components/common/ItemCard';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState<boolean>(false);
  const [requestMessage, setRequestMessage] = useState<string>('');
  const [proposedExchange, setProposedExchange] = useState<string>('');
  const [borrowDuration, setBorrowDuration] = useState<string>('');
  const [meetupPreference, setMeetupPreference] = useState<string>('Central Campus or Public Library');
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.getItem(id);
        setItem(data.item);
        setOwner(data.owner);
        setRelatedItems(data.relatedItems || []);
        setSelectedImageIndex(0);
      } catch (err: any) {
        setError(err.message || 'Item could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  const handleFavorite = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!item) return;

    const newFav = !item.isFavorite;
    setItem({ ...item, isFavorite: newFav });
    try {
      await api.toggleFavorite(item.id);
    } catch {
      setItem({ ...item, isFavorite: !newFav });
    }
  };

  const handleDirectMessage = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!item || !owner) return;

    try {
      const res = await api.startConversation({
        recipientId: owner.id,
        itemId: item.id,
        initialMessage: `Hi ${owner.name}, I am reaching out regarding your listing "${item.title}" on REKIND.`
      });
      navigate(`/messages?conv=${res.conversation.id}`);
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!item) return;

    setSubmittingRequest(true);
    try {
      await api.createRequest({
        itemId: item.id,
        message: requestMessage,
        proposedExchange,
        borrowDuration,
        meetupPreference,
        requestType: item.type
      });

      // Confetti celebration for initiating reuse
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c2a68c', '#9a634b', '#141210']
      });

      setRequestSuccess(true);
      setTimeout(() => {
        setRequestModalOpen(false);
        setRequestSuccess(false);
        // Refresh item to show active userRequest
        api.getItem(item.id).then(d => {
          setItem(d.item);
          setOwner(d.owner);
        });
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to submit request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-rekind-sand/50 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-[4/3] bg-rekind-sand/40 rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-rekind-sand/50 rounded w-3/4" />
            <div className="h-4 bg-rekind-sand/40 rounded w-1/2" />
            <div className="h-24 bg-rekind-sand/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rekind-terracotta mx-auto" />
        <h2 className="text-2xl font-heading font-bold text-rekind-dark">Item not found</h2>
        <p className="text-sm text-rekind-muted">{error || 'This listing may have been completed or removed.'}</p>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.ownerId;
  const hasActiveRequest = Boolean(item.userRequest);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-rekind-muted">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-medium text-rekind-dark hover:text-rekind-brown transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-rekind-dark">Home</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-rekind-dark">Marketplace</Link>
          <span>/</span>
          <span className="text-rekind-dark font-medium truncate max-w-[150px]">{item.category}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-rekind-sand/30 border border-rekind-border shadow-subtle">
            <img
              src={item.images[selectedImageIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.status === 'reserved' && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-amber-900/90 text-white text-xs font-bold rounded-full backdrop-blur-xs">
                Handover in Progress
              </div>
            )}
            {item.status === 'completed' && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-rekind-dark text-rekind-sand text-xs font-bold rounded-full backdrop-blur-xs">
                Transfer Verified & Completed
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-rekind-dark ring-2 ring-rekind-tan' : 'border-rekind-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safety & Reuse Guidelines Notice */}
          <div className="p-4 rounded-xl bg-rekind-beige/50 border border-rekind-border/70 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-rekind-dark">
              <ShieldCheck className="w-4 h-4 text-rekind-terracotta" />
              <span>Community Trust & Safe Meetups</span>
            </div>
            <p className="text-rekind-muted leading-relaxed">
              Always meet in daylight at public spots like campus libraries, dining commons, or neighborhood coffee shops. Inspect the item together before confirming handover.
            </p>
            {item.safetyNotes && (
              <div className="pt-2 text-rekind-brown font-medium">
                <strong>Owner Note:</strong> {item.safetyNotes}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info, Price, Actions, Owner */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide ${
                item.type === 'donate' ? 'bg-rekind-dark text-white' :
                item.type === 'lend' ? 'bg-rekind-espresso text-rekind-sand' :
                item.type === 'exchange' ? 'bg-rekind-brown text-white' :
                'bg-rekind-terracotta text-white'
              }`}>
                {item.type === 'donate' ? 'Free to Keep (Donation)' :
                 item.type === 'lend' ? 'Available to Borrow (Lend)' :
                 item.type === 'exchange' ? 'Open to Swap (Exchange)' :
                 `${formatPrice(item.price, item.currency)} • Affordable Sale`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFavorite}
                  className="p-2 rounded-xl border border-rekind-border bg-white hover:bg-rekind-sand/30 transition-colors"
                  title="Save item"
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-rekind-terracotta text-rekind-terracotta' : 'text-rekind-muted'}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rekind-dark leading-tight">
              {item.title}
            </h1>

            {/* Price Banner */}
            <div className="text-xl font-heading font-bold text-rekind-dark">
              {item.type === 'sell' ? (
                <span>{formatPrice(item.price, item.currency)} <span className="text-xs text-rekind-muted font-normal">affordable second-hand</span></span>
              ) : (
                <span className="text-rekind-brown">Free <span className="text-xs text-rekind-muted font-normal">({item.type} model)</span></span>
              )}
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-rekind-border/70 text-xs">
            <div>
              <span className="text-rekind-muted block">Condition</span>
              <span className="font-semibold text-rekind-dark">{item.condition}</span>
            </div>
            <div>
              <span className="text-rekind-muted block">Category</span>
              <span className="font-semibold text-rekind-dark">{item.category}</span>
            </div>
            <div>
              <span className="text-rekind-muted block">Pickup Location</span>
              <span className="font-semibold text-rekind-dark flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rekind-muted" />
                <span className="truncate">{item.location}</span>
              </span>
            </div>
            <div>
              <span className="text-rekind-muted block">Listed On</span>
              <span className="font-semibold text-rekind-dark">
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Special Sharing Attributes */}
          {item.type === 'lend' && item.lendingDuration && (
            <div className="p-3 bg-rekind-cream rounded-xl border border-rekind-border text-xs space-y-1">
              <span className="font-bold text-rekind-dark flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rekind-terracotta" />
                Borrow Period Expected:
              </span>
              <p className="text-rekind-muted">{item.lendingDuration}</p>
            </div>
          )}

          {item.type === 'exchange' && item.exchangePreferences && (
            <div className="p-3 bg-rekind-cream rounded-xl border border-rekind-border text-xs space-y-1">
              <span className="font-bold text-rekind-dark flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-rekind-terracotta" />
                Owner's Swap Preferences:
              </span>
              <p className="text-rekind-muted">{item.exchangePreferences}</p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rekind-muted">
              Description & Notes
            </h3>
            <p className="text-xs sm:text-sm text-rekind-dark leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-rekind-sand/40 text-rekind-brown text-[11px] font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Owner Public Card */}
          {owner && (
            <div className="p-4 rounded-xl border border-rekind-border bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-10 h-10 rounded-full object-cover border border-rekind-sand"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-rekind-dark leading-tight">{owner.name}</h4>
                    <p className="text-[11px] text-rekind-muted">{owner.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rekind-brown">
                    <ShieldCheck className="w-3.5 h-3.5 text-rekind-terracotta" />
                    {owner.trustScore}%
                  </span>
                  <span className="text-[10px] text-rekind-muted block">Trust Score</span>
                </div>
              </div>

              {owner.bio && (
                <p className="text-xs text-rekind-muted italic">"{owner.bio}"</p>
              )}

              <div className="pt-2 border-t border-rekind-border/60 flex items-center justify-between text-[11px] text-rekind-muted">
                <span>{owner.itemsSharedCount} items shared</span>
                <span>•</span>
                <span>{owner.itemsReceivedCount} items received</span>
                <span>•</span>
                <span className="text-rekind-dark font-medium">{owner.badges[0] || 'Community Member'}</span>
              </div>
            </div>
          )}

          {/* Main Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {isOwner ? (
              /* User is Owner */
              <div className="p-4 rounded-xl bg-rekind-sand/30 border border-rekind-border text-center space-y-2">
                <p className="text-xs font-semibold text-rekind-dark">This is your item listing.</p>
                <div className="flex gap-2">
                  <Link
                    to="/my-activity"
                    className="flex-1 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors text-center"
                  >
                    Manage in My Activity
                  </Link>
                </div>
              </div>
            ) : hasActiveRequest ? (
              /* User already has a request */
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Request Submitted ({item.userRequest?.status})</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  You have an active request for this item. Check your activity or messages for updates.
                </p>
                <Link
                  to="/messages"
                  className="inline-block px-4 py-1.5 rounded-lg bg-amber-900 text-white text-xs font-semibold"
                >
                  Go to Messages
                </Link>
              </div>
            ) : item.status === 'completed' ? (
              <div className="p-4 rounded-xl bg-rekind-sand/40 border border-rekind-border text-center text-xs font-medium text-rekind-dark">
                This item has been transferred and given a second life!
              </div>
            ) : (
              /* Normal Actions for non-owners */
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso hover:text-white transition-all text-sm font-semibold shadow-subtle flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-rekind-tan" />
                  <span>
                    {item.type === 'donate' ? 'Request This Item (Free)' :
                     item.type === 'lend' ? 'Ask to Borrow' :
                     item.type === 'exchange' ? 'Propose an Exchange' :
                     'Offer to Purchase'}
                  </span>
                </button>

                <button
                  onClick={handleDirectMessage}
                  className="py-3.5 px-4 rounded-xl bg-white border border-rekind-border text-rekind-dark hover:border-rekind-brown hover:bg-rekind-cream transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                  title="Chat with owner"
                >
                  <MessageSquare className="w-4 h-4 text-rekind-muted" />
                  <span>Message</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Related Items Section */}
      {relatedItems.length > 0 && (
        <div className="pt-12 border-t border-rekind-border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold text-rekind-dark">
              Similar {item.category} Items
            </h3>
            <Link to={`/marketplace?category=${encodeURIComponent(item.category)}`} className="text-xs font-semibold text-rekind-brown hover:text-rekind-dark flex items-center gap-1">
              <span>View all in category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((rel) => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-rekind-border shadow-float">
            
            {requestSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-rekind-dark">Request Sent!</h3>
                <p className="text-xs sm:text-sm text-rekind-muted">
                  {owner?.name} has been notified and a message thread was created.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-rekind-border">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-rekind-dark">
                      {item.type === 'donate' ? 'Request Item' :
                       item.type === 'lend' ? 'Request to Borrow' :
                       item.type === 'exchange' ? 'Propose an Exchange' :
                       'Purchase Request'}
                    </h3>
                    <p className="text-xs text-rekind-muted truncate max-w-xs">{item.title}</p>
                  </div>
                  <button onClick={() => setRequestModalOpen(false)} className="text-rekind-muted hover:text-rekind-dark">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  
                  {/* Dynamic fields based on sharing method */}
                  {item.type === 'exchange' && (
                    <div>
                      <label className="block text-xs font-semibold text-rekind-dark mb-1">
                        What item would you like to offer in exchange? *
                      </label>
                      <input
                        type="text"
                        required
                        value={proposedExchange}
                        onChange={(e) => setProposedExchange(e.target.value)}
                        placeholder="e.g. Physics 1A textbook, or USB microphone..."
                        className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                      />
                    </div>
                  )}

                  {item.type === 'lend' && (
                    <div>
                      <label className="block text-xs font-semibold text-rekind-dark mb-1">
                        How long do you need to borrow this? *
                      </label>
                      <input
                        type="text"
                        required
                        value={borrowDuration}
                        onChange={(e) => setBorrowDuration(e.target.value)}
                        placeholder="e.g. 2 weeks, or for the semester until Dec 15..."
                        className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-rekind-dark mb-1">
                      Personal Message to {owner?.name} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder={`Hello ${owner?.name}! I saw your listing on REKIND and would be glad to give it a second life...`}
                      className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rekind-dark mb-1">
                      Proposed Public Meetup Location
                    </label>
                    <input
                      type="text"
                      value={meetupPreference}
                      onChange={(e) => setMeetupPreference(e.target.value)}
                      placeholder="e.g. Campus Library Entrance, Community Center, or High St Café"
                      className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rekind-muted hover:text-rekind-dark"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingRequest}
                      className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors disabled:opacity-50"
                    >
                      {submittingRequest ? 'Submitting...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
