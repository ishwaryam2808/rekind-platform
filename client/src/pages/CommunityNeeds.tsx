import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Gift, 
  ArrowRight, 
  X,
  MessageSquare,
  Sparkles,
  Package
} from 'lucide-react';
import { api } from '../services/api';
import type { CommunityNeed, Item } from '../types';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'Books and Education',
  'Electronics',
  'Clothing and Accessories',
  'Furniture and Home',
  'Kitchen Essentials',
  'Sports and Fitness',
  'Toys and Games',
  'Stationery',
  'Other Reusable Items'
];

const URGENCIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

export const CommunityNeeds: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [needs, setNeeds] = useState<CommunityNeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [urgency, setUrgency] = useState<string>(searchParams.get('urgency') || 'All');

  // Modal: Post a Need
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [needTitle, setNeedTitle] = useState<string>('');
  const [needDescription, setNeedDescription] = useState<string>('');
  const [needCategory, setNeedCategory] = useState<string>('Books and Education');
  const [needQuantity, setNeedQuantity] = useState<number>(1);
  const [needLocation, setNeedLocation] = useState<string>(user?.location || 'Central Campus Area');
  const [needUrgency, setNeedUrgency] = useState<string>('Medium');
  const [submittingNeed, setSubmittingNeed] = useState<boolean>(false);

  // Modal: Offer Item to Need
  const [selectedNeed, setSelectedNeed] = useState<CommunityNeed | null>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [submittingOffer, setSubmittingOffer] = useState<boolean>(false);
  const [offerSuccess, setOfferSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadNeeds();
    // Check if query param specifies an offer target
    const offerTargetId = searchParams.get('offer');
    if (offerTargetId) {
      api.getCommunityNeeds().then(res => {
        const found = res.needs?.find((n: CommunityNeed) => n.id === offerTargetId);
        if (found) openOfferModal(found);
      });
    }
  }, [searchParams]);

  const loadNeeds = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunityNeeds({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'All',
        urgency: searchParams.get('urgency') || 'All',
        status: 'open'
      });
      setNeeds(res.needs || []);
    } catch (err) {
      console.error('Failed to load community needs:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', search);
  };

  const handleCreateNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubmittingNeed(true);
    try {
      await api.createCommunityNeed({
        title: needTitle,
        description: needDescription,
        category: needCategory,
        quantity: needQuantity,
        location: needLocation,
        urgency: needUrgency
      });
      setCreateModalOpen(false);
      setNeedTitle('');
      setNeedDescription('');
      loadNeeds();
    } catch (err: any) {
      alert(err.message || 'Failed to post community need.');
    } finally {
      setSubmittingNeed(false);
    }
  };

  const openOfferModal = async (need: CommunityNeed) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (need.requesterId === user.id) {
      alert('You cannot offer an item to your own request.');
      return;
    }

    setSelectedNeed(need);
    setOfferMessage(`Hi ${need.requesterName}! I have something that can help fulfill your request for "${need.title}".`);
    try {
      const act = await api.getActivity();
      setUserItems(act.myListings?.filter((i: Item) => i.status === 'available') || []);
    } catch {
      setUserItems([]);
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNeed) return;

    setSubmittingOffer(true);
    try {
      await api.offerToCommunityNeed(selectedNeed.id, {
        message: offerMessage,
        linkedItemId: selectedItemId || null
      });
      setOfferSuccess(true);
      setTimeout(() => {
        setOfferSuccess(false);
        setSelectedNeed(null);
        loadNeeds();
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to submit offer.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-rekind-dark text-rekind-sand rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rekind-tan">
              Mutual Community Aid
            </span>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Community Needs Board
            </h1>
            <p className="text-xs sm:text-sm text-rekind-sand/80 leading-relaxed">
              Looking for a textbook, a graphing calculator for a semester, or a dorm study desk? Post what you need and neighbors or classmates will reach out to help.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                navigate('/auth');
              } else {
                setCreateModalOpen(true);
              }
            }}
            className="px-5 py-3 rounded-xl bg-rekind-tan text-rekind-dark hover:bg-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-subtle shrink-0 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-rekind-espresso" />
            <span>Post an Item Request</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-rekind-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requested textbooks, tools, supplies, or locations..."
            className="w-full pl-12 pr-28 py-3 bg-white text-rekind-dark rounded-xl text-sm placeholder:text-rekind-muted/70 focus:outline-none focus:ring-2 focus:ring-rekind-tan"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-rekind-border/70">
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="bg-white border border-rekind-border rounded-xl px-3 py-2 text-xs font-medium text-rekind-dark focus:outline-none focus:ring-1 focus:ring-rekind-tan"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          {/* Urgency Filter */}
          <select
            value={urgency}
            onChange={(e) => updateParam('urgency', e.target.value)}
            className="bg-white border border-rekind-border rounded-xl px-3 py-2 text-xs font-medium text-rekind-dark focus:outline-none focus:ring-1 focus:ring-rekind-tan"
          >
            {URGENCIES.map(u => <option key={u} value={u}>{u === 'All' ? 'All Urgencies' : `${u} Urgency`}</option>)}
          </select>

          {(category !== 'All' || urgency !== 'All' || search) && (
            <button
              onClick={() => {
                setCategory('All');
                setUrgency('All');
                setSearch('');
                setSearchParams(new URLSearchParams());
              }}
              className="text-xs text-rekind-brown hover:text-rekind-dark font-medium underline px-2"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="text-xs text-rekind-muted">
          Showing <strong>{needs.length}</strong> active community requests
        </div>

      </div>

      {/* Needs Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-card border border-rekind-border p-6 animate-pulse space-y-4">
              <div className="h-4 bg-rekind-sand/50 rounded w-1/3" />
              <div className="h-6 bg-rekind-sand/50 rounded w-3/4" />
              <div className="h-16 bg-rekind-sand/30 rounded" />
            </div>
          ))}
        </div>
      ) : needs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {needs.map((need) => (
            <div
              key={need.id}
              className="bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan transition-all duration-200 shadow-subtle hover:shadow-elevated flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header row: Urgency + Category */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    need.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                    need.urgency === 'High' ? 'bg-amber-100 text-amber-900' :
                    'bg-rekind-sand/50 text-rekind-dark'
                  }`}>
                    {need.urgency} Urgency
                  </span>
                  <span className="text-[11px] text-rekind-muted font-medium">
                    {need.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-base text-rekind-dark leading-snug">
                  {need.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-rekind-muted line-clamp-3 leading-relaxed whitespace-pre-line">
                  {need.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-[11px] text-rekind-muted pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rekind-muted" />
                    <span className="truncate max-w-[120px]">{need.location}</span>
                  </span>
                  <span>•</span>
                  <span>Qty: {need.quantity}</span>
                  <span>•</span>
                  <span className="text-rekind-brown font-medium">
                    {need.offersCount} {need.offersCount === 1 ? 'offer' : 'offers'} received
                  </span>
                </div>

              </div>

              {/* Bottom Action & Requester */}
              <div className="pt-4 mt-4 border-t border-rekind-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={need.requesterAvatar}
                    alt={need.requesterName}
                    className="w-7 h-7 rounded-full object-cover border border-rekind-sand"
                  />
                  <div>
                    <p className="text-xs font-semibold text-rekind-dark leading-tight">{need.requesterName}</p>
                    <p className="text-[10px] text-rekind-muted">
                      {new Date(need.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openOfferModal(need)}
                  className="px-3.5 py-1.5 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Gift className="w-3.5 h-3.5 text-rekind-tan" />
                  <span>Offer Item</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 max-w-lg mx-auto space-y-4">
          <HelpCircle className="w-12 h-12 text-rekind-muted mx-auto" />
          <h3 className="font-heading font-bold text-lg text-rekind-dark">
            {category !== 'All' || urgency !== 'All' || search ? 'No requests matching criteria' : 'No community requests yet'}
          </h3>
          <p className="text-xs text-rekind-muted leading-relaxed">
            {category !== 'All' || urgency !== 'All' || search
              ? 'Try resetting your search or filters to see more requests.'
              : 'Looking for a specific textbook, calculator, or household item? Post what you need and neighbors can reach out to help.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (!user) {
                  navigate('/auth');
                } else {
                  setCreateModalOpen(true);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
            >
              Post an Item Request
            </button>
          </div>
        </div>
      )}

      {/* CREATE NEED MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-rekind-border shadow-float">
            
            <div className="flex items-center justify-between pb-3 border-b border-rekind-border">
              <div>
                <h3 className="font-heading font-bold text-lg text-rekind-dark">Post a Community Need</h3>
                <p className="text-xs text-rekind-muted">Tell neighbors and classmates what you are looking for.</p>
              </div>
              <button onClick={() => setCreateModalOpen(false)} className="text-rekind-muted hover:text-rekind-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNeed} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  What item do you need? *
                </label>
                <input
                  type="text"
                  required
                  value={needTitle}
                  onChange={(e) => setNeedTitle(e.target.value)}
                  placeholder="e.g. Scientific Calculator (Casio fx-991EX or similar)"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1">Category *</label>
                  <select
                    value={needCategory}
                    onChange={(e) => setNeedCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-rekind-border rounded-xl text-xs"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1">Urgency</label>
                  <select
                    value={needUrgency}
                    onChange={(e) => setNeedUrgency(e.target.value)}
                    className="w-full p-2 bg-white border border-rekind-border rounded-xl text-xs"
                  >
                    <option value="Critical">Critical (Needed ASAP)</option>
                    <option value="High">High (Within few days)</option>
                    <option value="Medium">Medium (Sometime this month)</option>
                    <option value="Low">Low (Whenever someone has surplus)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Why do you need this? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={needDescription}
                  onChange={(e) => setNeedDescription(e.target.value)}
                  placeholder="Mention your coursework, project, or household reason. People love to help when they know the context!"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={needQuantity}
                    onChange={(e) => setNeedQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-rekind-border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1">Your Location / Campus</label>
                  <input
                    type="text"
                    value={needLocation}
                    onChange={(e) => setNeedLocation(e.target.value)}
                    className="w-full p-2 bg-white border border-rekind-border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNeed}
                  className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors disabled:opacity-50"
                >
                  {submittingNeed ? 'Posting...' : 'Publish Need'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* OFFER ITEM MODAL */}
      {selectedNeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-rekind-border shadow-float">
            
            {offerSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-rekind-dark">Offer Sent!</h3>
                <p className="text-xs text-rekind-muted">
                  {selectedNeed.requesterName} was notified and a conversation was started.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-rekind-border">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-rekind-dark">Offer Item to Neighbor</h3>
                    <p className="text-xs text-rekind-muted truncate max-w-xs">{selectedNeed.title}</p>
                  </div>
                  <button onClick={() => setSelectedNeed(null)} className="text-rekind-muted hover:text-rekind-dark">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitOffer} className="space-y-4">
                  {userItems.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-rekind-dark mb-1">
                        Link one of your active listings (Optional)
                      </label>
                      <select
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs"
                      >
                        <option value="">-- No specific listing (direct offer) --</option>
                        {userItems.map(i => (
                          <option key={i.id} value={i.id}>{i.title} ({i.type})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-rekind-dark mb-1">
                      Message to {selectedNeed.requesterName} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      placeholder="Describe what you have, its condition, and when you can meet..."
                      className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedNeed(null)}
                      className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingOffer}
                      className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors disabled:opacity-50"
                    >
                      {submittingOffer ? 'Sending...' : 'Send Offer'}
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
