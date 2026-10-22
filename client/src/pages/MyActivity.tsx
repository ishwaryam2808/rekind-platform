import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Inbox, 
  Send, 
  Heart, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import type { Item, ItemRequest, TransferRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/common/ItemCard';

export const MyActivity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'received' | 'sent' | 'saved' | 'transfers'>('listings');
  const [myListings, setMyListings] = useState<Item[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ItemRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ItemRequest[]>([]);
  const [myTransfers, setMyTransfers] = useState<TransferRecord[]>([]);
  const [savedItems, setSavedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Status Filter for Listings
  const [listingStatusFilter, setListingStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadActivity();
  }, [user]);

  const loadActivity = async () => {
    setLoading(true);
    try {
      const [activityRes, favRes] = await Promise.all([
        api.getActivity(),
        api.getFavorites()
      ]);
      setMyListings(activityRes.myListings || []);
      setReceivedRequests(activityRes.receivedRequests || []);
      setSentRequests(activityRes.sentRequests || []);
      setMyTransfers(activityRes.myTransfers || []);
      setSavedItems(favRes.items || []);
    } catch (err) {
      console.error('Failed to load activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatusUpdate = async (requestId: string, status: 'accepted' | 'declined' | 'completed') => {
    try {
      await api.updateRequestStatus(requestId, status);
      if (status === 'completed') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c2a68c', '#9a634b', '#141210']
        });
      }
      loadActivity();
    } catch (err: any) {
      alert(err.message || 'Failed to update request.');
    }
  };

  const handleDeleteListing = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteItem(itemId);
      loadActivity();
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  const handleToggleListingStatus = async (item: Item) => {
    const nextStatus = item.status === 'available' ? 'reserved' : 'available';
    try {
      await api.updateItem(item.id, { status: nextStatus });
      loadActivity();
    } catch (err: any) {
      alert(err.message || 'Failed to update listing status.');
    }
  };

  const filteredListings = myListings.filter(item => {
    if (listingStatusFilter === 'all') return true;
    return item.status === listingStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-rekind-border/70 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
            Dashboard
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-rekind-dark">
            My Activity & Handovers
          </h1>
          <p className="text-xs sm:text-sm text-rekind-muted mt-1">
            Track your active listings, respond to requests, and confirm completed item transfers.
          </p>
        </div>

        <Link
          to="/post-item"
          className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors self-start sm:self-auto"
        >
          + List New Item
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-rekind-border/70">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
              : 'bg-white text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'received'
              ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
              : 'bg-white text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Requests ({receivedRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'sent'
              ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
              : 'bg-white text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({sentRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
              : 'bg-white text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Items ({savedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'transfers'
              ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
              : 'bg-white text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Verified Transfers ({myTransfers.length})</span>
        </button>
      </div>

      {/* TAB 1: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Sub-filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-rekind-muted font-medium">Status:</span>
            {['all', 'available', 'reserved', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setListingStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                  listingStatusFilter === st
                    ? 'bg-rekind-sand text-rekind-dark font-bold'
                    : 'bg-white text-rekind-muted hover:text-rekind-dark'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredListings.length > 0 ? (
            <div className="space-y-4">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-rekind-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-subtle"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-rekind-sand"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          item.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'reserved' ? 'bg-amber-100 text-amber-900' :
                          'bg-rekind-sand text-rekind-dark'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-rekind-muted">{item.category}</span>
                      </div>
                      <Link to={`/item/${item.id}`} className="font-heading font-bold text-sm sm:text-base text-rekind-dark hover:text-rekind-brown block">
                        {item.title}
                      </Link>
                      <p className="text-xs text-rekind-muted">
                        Method: <strong className="capitalize text-rekind-dark">{item.type}</strong> • Views: {item.views}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-rekind-border/50">
                    <button
                      onClick={() => handleToggleListingStatus(item)}
                      className="px-3 py-1.5 rounded-lg border border-rekind-border text-xs font-semibold text-rekind-dark hover:bg-rekind-cream transition-colors"
                    >
                      {item.status === 'available' ? 'Mark Reserved' : 'Mark Available'}
                    </button>
                    <Link
                      to={`/item/${item.id}`}
                      className="p-2 rounded-lg border border-rekind-border text-rekind-muted hover:text-rekind-dark transition-colors"
                      title="View item"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-2 rounded-lg border border-rekind-border text-rekind-terracotta hover:bg-red-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-3">
              <Package className="w-10 h-10 text-rekind-muted mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">No listings found</h3>
              <p className="text-xs text-rekind-muted">Share an item from your desk or room to give it a second life.</p>
              <Link to="/post-item" className="inline-block px-4 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold">
                Share an Item
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECEIVED REQUESTS */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-rekind-border p-5 space-y-4 shadow-subtle"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rekind-border/70">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.requesterAvatar}
                      alt={req.requesterName}
                      className="w-9 h-9 rounded-full object-cover border border-rekind-sand"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-rekind-dark">{req.requesterName} requested:</h4>
                      <p className="text-xs text-rekind-brown font-medium">{req.itemTitle}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full self-start sm:self-auto ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-900' :
                    req.status === 'accepted' ? 'bg-blue-100 text-blue-900' :
                    req.status === 'completed' ? 'bg-emerald-100 text-emerald-900' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Status: {req.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-rekind-dark italic bg-rekind-cream/60 p-3 rounded-xl border border-rekind-border/60">
                    "{req.message}"
                  </p>
                  {req.proposedExchange && (
                    <p className="text-rekind-muted">
                      <strong>Proposed Swap:</strong> {req.proposedExchange}
                    </p>
                  )}
                  {req.borrowDuration && (
                    <p className="text-rekind-muted">
                      <strong>Borrow Duration:</strong> {req.borrowDuration}
                    </p>
                  )}
                  {req.meetupPreference && (
                    <p className="text-rekind-muted">
                      <strong>Proposed Meetup:</strong> {req.meetupPreference}
                    </p>
                  )}
                </div>

                {/* Status Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <Link
                    to="/messages"
                    className="px-3.5 py-1.5 rounded-xl border border-rekind-border text-xs font-semibold text-rekind-dark hover:bg-rekind-cream flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rekind-muted" />
                    <span>Open Chat</span>
                  </Link>

                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleRequestStatusUpdate(req.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleRequestStatusUpdate(req.id, 'declined')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rekind-terracotta hover:bg-red-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleRequestStatusUpdate(req.id, 'completed')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Confirm Transfer Completed</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-2">
              <Inbox className="w-10 h-10 text-rekind-muted mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">No received requests yet</h3>
              <p className="text-xs text-rekind-muted">When someone requests your listings, they will show up here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY SENT REQUESTS */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-rekind-border p-5 space-y-3 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={req.itemImage}
                    alt={req.itemTitle}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-rekind-sand"
                  />
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-900' :
                      req.status === 'accepted' ? 'bg-blue-100 text-blue-900' :
                      req.status === 'completed' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {req.status.toUpperCase()}
                    </span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-rekind-dark">
                      {req.itemTitle}
                    </h4>
                    <p className="text-xs text-rekind-muted">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/messages"
                    className="px-4 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rekind-tan" />
                    <span>Chat with Owner</span>
                  </Link>

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleRequestStatusUpdate(req.id, 'completed')}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Received & Done</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-2">
              <Send className="w-10 h-10 text-rekind-muted mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">No sent requests</h3>
              <p className="text-xs text-rekind-muted">Browse the marketplace and request items you need.</p>
              <Link to="/marketplace" className="inline-block px-4 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold">
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div>
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedItems.map((item) => (
                <ItemCard key={item.id} item={item} onFavoriteToggle={() => loadActivity()} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-2">
              <Heart className="w-10 h-10 text-rekind-muted mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">No saved items</h3>
              <p className="text-xs text-rekind-muted">Tap the heart on any item card to bookmark it for later.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: VERIFIED TRANSFERS */}
      {activeTab === 'transfers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rekind-cream border border-rekind-border text-xs text-rekind-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rekind-terracotta shrink-0" />
            <span>
              These completed transfers are cryptographically verifiable records that update both participants' trust scores and feed directly into the verified community impact metrics.
            </span>
          </div>

          {myTransfers.length > 0 ? (
            <div className="space-y-3">
              {myTransfers.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl border border-rekind-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-heading font-bold text-sm text-rekind-dark block">
                      {tx.itemTitle}
                    </span>
                    <span className="text-rekind-muted">
                      Category: {tx.category} • Method: <strong className="capitalize">{tx.sharingType}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-rekind-brown font-medium">
                    <span>Diverted: ~{tx.weightKg} kg</span>
                    <span>•</span>
                    <span>Value Saved: ~${tx.valueSaved}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-rekind-border p-8 text-xs text-rekind-muted">
              No completed transfers yet. As soon as you handover or receive an item, it will be logged here!
            </div>
          )}
        </div>
      )}

    </div>
  );
};
