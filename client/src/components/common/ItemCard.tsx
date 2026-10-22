import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, Tag, ArrowUpRight } from 'lucide-react';
import type { Item } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface ItemCardProps {
  item: Item;
  onFavoriteToggle?: (itemId: string, isFav: boolean) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onFavoriteToggle }) => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    const newFavState = !isFavorite;
    setIsFavorite(newFavState);
    try {
      await api.toggleFavorite(item.id);
      if (onFavoriteToggle) {
        onFavoriteToggle(item.id, newFavState);
      }
    } catch {
      setIsFavorite(!newFavState);
    }
  };

  const getSharingBadge = (type: string) => {
    switch (type) {
      case 'donate':
        return {
          label: 'Free to Keep',
          bg: 'bg-rekind-dark text-white',
        };
      case 'lend':
        return {
          label: 'Available to Borrow',
          bg: 'bg-rekind-espresso text-rekind-sand',
        };
      case 'exchange':
        return {
          label: 'Open to Swap',
          bg: 'bg-rekind-brown text-white',
        };
      case 'sell':
        return {
          label: `${formatPrice(item.price, item.currency)} • Affordable`,
          bg: 'bg-[#9A634B] text-white',
        };
      default:
        return { label: type, bg: 'bg-rekind-dark text-white' };
    }
  };

  const badge = getSharingBadge(item.type);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-card border border-rekind-border overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-rekind-tan/80 flex flex-col h-full"
    >
      {/* Image Container with Badge */}
      <Link to={`/item/${item.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-rekind-beige/40">
        {item.images[0] ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-rekind-sand/30 text-rekind-muted text-xs font-semibold">
            No image
          </div>
        )}

        {/* Status overlay if reserved */}
        {item.status === 'reserved' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-white/90 text-rekind-dark text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Handover Pending
            </span>
          </div>
        )}

        {/* Sharing Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full shadow-xs ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label="Save item"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-rekind-dark shadow-sm backdrop-blur-xs transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rekind-terracotta text-rekind-terracotta' : 'text-rekind-muted hover:text-rekind-dark'
            }`}
          />
        </button>

        {/* Condition Ribbon */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-white/95 text-rekind-dark rounded-md backdrop-blur-sm border border-rekind-border/70 shadow-2xs">
            {item.condition}
          </span>
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Location */}
          <div className="flex items-center justify-between text-[11px] text-rekind-muted mb-1.5">
            <span className="font-medium text-rekind-brown">{item.category}</span>
            <span className="flex items-center gap-1 truncate max-w-[130px]" title={item.location}>
              <MapPin className="w-3 h-3 text-rekind-muted shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/item/${item.id}`} className="block">
            <h3 className="font-heading font-bold text-base text-rekind-dark group-hover:text-rekind-espresso transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h3>
          </Link>
        </div>

        {/* Bottom Metadata & Owner */}
        <div className="pt-3 mt-3 border-t border-rekind-border/60 flex items-center justify-between">
          {/* Owner info */}
          <div className="flex items-center gap-2">
            <img
              src={item.ownerAvatar}
              alt={item.ownerName}
              className="w-6 h-6 rounded-full object-cover border border-rekind-sand"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-rekind-dark leading-none truncate max-w-[90px]">
                {item.ownerName}
              </span>
              <span className="text-[10px] text-rekind-muted flex items-center gap-0.5 mt-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-rekind-terracotta" />
                {item.ownerTrustScore}% trust
              </span>
            </div>
          </div>

          {/* Action pill / Price indicator */}
          <Link
            to={`/item/${item.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rekind-dark group-hover:text-rekind-terracotta transition-colors"
          >
            <span>{item.type === 'sell' ? formatPrice(item.price, item.currency) : 'View details'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
