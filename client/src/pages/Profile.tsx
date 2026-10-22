import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Gift, 
  Repeat, 
  Leaf, 
  Award, 
  Settings,
  Package,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import type { Item } from '../types';
import { useAuth } from '../context/AuthContext';
import { ItemCard } from '../components/common/ItemCard';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadUserItems() {
      try {
        const res = await api.getActivity();
        setUserItems(res.myListings || []);
      } catch (err) {
        console.error('Failed to load user items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserItems();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-rekind-border p-6 sm:p-10 shadow-subtle space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-rekind-border/70">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-rekind-cream shadow-subtle"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-rekind-dark">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Member
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-rekind-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </span>
              </div>

              {user.bio && (
                <p className="text-xs sm:text-sm text-rekind-dark/80 max-w-xl italic pt-1">
                  "{user.bio}"
                </p>
              )}

              {/* Earned Community Badges */}
              <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-1.5">
                {user.badges?.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rekind-beige text-rekind-brown text-[11px] font-semibold border border-rekind-border"
                  >
                    <Award className="w-3 h-3 text-rekind-terracotta" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/settings"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rekind-border bg-rekind-cream/50 text-xs font-semibold text-rekind-dark hover:bg-rekind-sand/40 transition-colors self-center sm:self-start shrink-0"
          >
            <Settings className="w-4 h-4 text-rekind-muted" />
            <span>Account Settings</span>
          </Link>

        </div>

        {/* 4 Community Impact Metric Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-4 rounded-2xl bg-rekind-cream/60 border border-rekind-border/70 space-y-1">
            <span className="block text-3xl font-heading font-extrabold text-rekind-dark">
              {user.trustScore}%
            </span>
            <span className="text-xs text-rekind-muted font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rekind-terracotta" />
              Community Trust Score
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rekind-cream/60 border border-rekind-border/70 space-y-1">
            <span className="block text-3xl font-heading font-extrabold text-rekind-dark">
              {user.itemsSharedCount}
            </span>
            <span className="text-xs text-rekind-muted font-medium flex items-center justify-center gap-1">
              <Gift className="w-3.5 h-3.5 text-rekind-espresso" />
              Items Shared & Rehomed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rekind-cream/60 border border-rekind-border/70 space-y-1">
            <span className="block text-3xl font-heading font-extrabold text-rekind-dark">
              {user.itemsReceivedCount}
            </span>
            <span className="text-xs text-rekind-muted font-medium flex items-center justify-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-rekind-brown" />
              Items Received
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rekind-cream/60 border border-rekind-border/70 space-y-1">
            <span className="block text-3xl font-heading font-extrabold text-rekind-dark">
              ~{(user.itemsSharedCount * 2.2).toFixed(1)} kg
            </span>
            <span className="text-xs text-rekind-muted font-medium flex items-center justify-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-rekind-terracotta" />
              Est. Waste Diverted
            </span>
          </div>

        </div>

      </div>

      {/* Active Listings by this user */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-rekind-dark">
              Listings Shared by {user.name}
            </h2>
            <p className="text-xs text-rekind-muted">Items currently available to people in your area.</p>
          </div>

          <Link
            to="/post-item"
            className="px-4 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
          >
            + Add Another Item
          </Link>
        </div>

        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 space-y-2">
            <Package className="w-10 h-10 text-rekind-muted mx-auto" />
            <h3 className="font-heading font-bold text-base text-rekind-dark">No active listings yet</h3>
            <p className="text-xs text-rekind-muted">Pass on a textbook, lamp, or appliance you no longer need.</p>
          </div>
        )}
      </div>

    </div>
  );
};
