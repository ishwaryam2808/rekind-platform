import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Filter, 
  ArrowUpDown, 
  Check, 
  Sparkles,
  Gift,
  Repeat,
  DollarSign,
  PackageOpen,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import type { Item, SharingType, ItemCondition } from '../types';
import { ItemCard } from '../components/common/ItemCard';
import { VoiceInputButton } from '../components/common/VoiceInputButton';

const CATEGORIES = [
  'All',
  'CNC & Metalworking Machinery',
  'Earthmoving & Excavation Equipment',
  'Material Handling & Forklifts',
  'Generators & Industrial Power',
  'Construction & Roadwork Machinery',
  'Agricultural & Heavy Transport',
  'Pumps, Compressors & Hydraulics',
  'Industrial Tooling & Plant Surplus'
];

const SHARING_METHODS: { label: string; value: string; icon?: any }[] = [
  { label: 'All Modalities', value: 'All' },
  { label: 'Surplus Transfer (Free)', value: 'donate' },
  { label: 'Industrial Lease / Rental', value: 'lend' },
  { label: 'Equipment Trade-In / Swap', value: 'exchange' },
  { label: 'Machinery Sale', value: 'sell' },
];

const CONDITIONS = [
  'All',
  'New / Unused Surplus',
  'Excellent / Low Hours',
  'Operational / Factory Serviced',
  'Needs Reconditioning',
  'Decommissioned / Salvage'
];

const SUGGESTED_VOICE_QUERIES = [
  'CAT 320 Excavator',
  '5 Ton Forklift',
  'Haas CNC VMC Mill',
  '125 kVA Diesel Generator',
  'Atlas Copco Air Compressor',
  'Single Drum Soil Roller'
];

export const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state synced with searchParams
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [type, setType] = useState<string>(searchParams.get('type') || 'All');
  const [condition, setCondition] = useState<string>(searchParams.get('condition') || 'All');
  const [locationFilter, setLocationFilter] = useState<string>(searchParams.get('location') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');

  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [semanticMatch, setSemanticMatch] = useState<{ intent: string; category: string; description: string; query: string } | null>(null);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All';
    const t = searchParams.get('type') || 'All';
    const cond = searchParams.get('condition') || 'All';
    const loc = searchParams.get('location') || '';
    const s = searchParams.get('sort') || 'newest';
    const mp = searchParams.get('maxPrice') || '';

    setSearch(q);
    setCategory(cat);
    setType(t);
    setCondition(cond);
    setLocationFilter(loc);
    setSort(s);
    setMaxPrice(mp);

    loadItems({
      search: q,
      category: cat,
      type: t,
      condition: cond,
      location: loc,
      sort: s,
      maxPrice: mp,
      page: 1
    });
  }, [searchParams]);

  const loadItems = async (params: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await api.getItems(params);
      setItems(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
      setSemanticMatch(res.semanticMatch || null);
    } catch (err) {
      console.error('Failed to load marketplace items:', err);
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

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setCondition('All');
    setLocationFilter('');
    setSort('newest');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = 
    (category && category !== 'All') ||
    (type && type !== 'All') ||
    (condition && condition !== 'All') ||
    Boolean(search) ||
    Boolean(locationFilter) ||
    Boolean(maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Search Banner */}
      <div className="bg-rekind-dark text-rekind-sand rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-rekind-tan flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Heavy Machinery & Plant Equipment Exchange
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Industrial asset redistribution.
          </h1>
          <p className="text-xs sm:text-sm text-rekind-sand/80 mt-2">
            Earthmoving, CNC tooling, heavy material handling, power generation, and manufacturing surplus. Search via voice command, OEM model numbers, or natural work intents.
          </p>
        </div>

        {/* Voice & Keyword Hybrid Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-rekind-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by OEM, model (e.g. CAT 320, Haas VF-2), or job intent (e.g. trench digging)..."
            className="w-full pl-12 pr-32 py-3 bg-white text-rekind-dark rounded-xl text-sm placeholder:text-rekind-muted/70 focus:outline-none focus:ring-2 focus:ring-rekind-tan"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <VoiceInputButton
              onTranscript={(spokenText) => {
                setSearch(spokenText);
                updateParam('search', spokenText);
              }}
              size="sm"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Suggested Voice & Semantic Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-rekind-sand/70 text-xs flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-rekind-tan" /> Spoken / Quick OEM Queries:
          </span>
          {SUGGESTED_VOICE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setSearch(q);
                updateParam('search', q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors border border-white/10"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Intent Match Notification */}
      {semanticMatch && (
        <div className="bg-rekind-cream border border-rekind-tan/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rekind-beige text-rekind-brown flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-rekind-brown" />
            </div>
            <div>
              <p className="text-xs font-bold text-rekind-dark uppercase tracking-wide">
                Semantic Intent Match: <span className="text-rekind-brown">"{semanticMatch.intent}"</span>
              </p>
              <p className="text-xs text-rekind-muted mt-0.5">
                {semanticMatch.description} — Prioritizing results in <strong className="text-rekind-dark">{semanticMatch.category}</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateParam('category', semanticMatch.category)}
            className="px-3.5 py-1.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso whitespace-nowrap self-start sm:self-auto"
          >
            Lock Category: {semanticMatch.category.split(' ')[0]}
          </button>
        </div>
      )}

      {/* Sharing Method Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-rekind-border/70">
        {SHARING_METHODS.map((m) => {
          const isSelected = type === m.value || (type === 'All' && m.value === 'All');
          return (
            <button
              key={m.value}
              onClick={() => updateParam('type', m.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-rekind-dark text-rekind-sand shadow-subtle'
                  : 'bg-white border border-rekind-border text-rekind-muted hover:text-rekind-dark hover:border-rekind-tan'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Active Filters & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="inline-flex md:hidden items-center gap-2 px-3 py-2 bg-white border border-rekind-border rounded-xl text-xs font-semibold text-rekind-dark"
          >
            <SlidersHorizontal className="w-4 h-4 text-rekind-muted" />
            <span>Filters</span>
          </button>

          {/* Category Dropdown (Desktop) */}
          <select
            value={category}
            onChange={(e) => updateParam('category', e.target.value)}
            className="hidden md:block bg-white border border-rekind-border rounded-xl px-3 py-2 text-xs font-medium text-rekind-dark focus:outline-none focus:ring-1 focus:ring-rekind-tan"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Condition Dropdown (Desktop) */}
          <select
            value={condition}
            onChange={(e) => updateParam('condition', e.target.value)}
            className="hidden md:block bg-white border border-rekind-border rounded-xl px-3 py-2 text-xs font-medium text-rekind-dark focus:outline-none focus:ring-1 focus:ring-rekind-tan"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c}</option>
            ))}
          </select>

          {/* Location input */}
          <div className="relative hidden md:block">
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-rekind-muted" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              onBlur={() => updateParam('location', locationFilter)}
              onKeyDown={(e) => e.key === 'Enter' && updateParam('location', locationFilter)}
              placeholder="Filter location..."
              className="pl-8 pr-3 py-1.5 bg-white border border-rekind-border rounded-xl text-xs font-medium text-rekind-dark w-36 focus:outline-none focus:ring-1 focus:ring-rekind-tan"
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rekind-beige text-rekind-brown rounded-xl text-xs font-medium hover:bg-rekind-sand transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>

        {/* Right: Results Count & Sort */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-rekind-muted">
          <span>Showing <strong>{items.length}</strong> of <strong>{total}</strong> items</span>

          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-rekind-border rounded-xl px-2.5 py-1.5 text-xs font-medium text-rekind-dark focus:outline-none focus:ring-1 focus:ring-rekind-tan"
            >
              <option value="newest">Newest First</option>
              <option value="views">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {filterDrawerOpen && (
        <div className="md:hidden bg-white border border-rekind-border rounded-2xl p-5 space-y-4 shadow-elevated">
          <div className="flex items-center justify-between pb-3 border-b border-rekind-border">
            <h3 className="font-heading font-bold text-sm text-rekind-dark">Filter Marketplace</h3>
            <button onClick={() => setFilterDrawerOpen(false)} className="p-1 text-rekind-muted hover:text-rekind-dark">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="w-full bg-white border border-rekind-border rounded-xl p-2 text-xs"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => updateParam('condition', e.target.value)}
                className="w-full bg-white border border-rekind-border rounded-xl p-2 text-xs"
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">Location or Campus</label>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="e.g. North Campus, Riverside..."
                className="w-full bg-white border border-rekind-border rounded-xl p-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                updateParam('location', locationFilter);
                setFilterDrawerOpen(false);
              }}
              className="flex-1 py-2 bg-rekind-dark text-white text-xs font-semibold rounded-xl"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                clearAllFilters();
                setFilterDrawerOpen(false);
              }}
              className="px-4 py-2 bg-rekind-beige text-rekind-brown text-xs font-semibold rounded-xl"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Main Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-card border border-rekind-border p-4 animate-pulse space-y-3">
              <div className="aspect-[4/3] bg-rekind-sand/40 rounded-xl" />
              <div className="h-4 bg-rekind-sand/50 rounded w-3/4" />
              <div className="h-3 bg-rekind-sand/40 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-rekind-border p-8 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rekind-beige flex items-center justify-center mx-auto text-rekind-brown">
            <PackageOpen className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-bold text-lg text-rekind-dark">
            {hasActiveFilters ? 'No matching machinery found' : 'No industrial equipment listed yet'}
          </h3>
          <p className="text-xs sm:text-sm text-rekind-muted leading-relaxed">
            {hasActiveFilters
              ? "We couldn't find machinery matching your search or filters. Try using our voice search, broadening your OEM specs, or creating an Equipment Demand."
              : "No machinery listed yet. Be the first to list surplus plant equipment, idle excavators, or CNC mills."}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-rekind-beige text-rekind-brown text-xs font-semibold hover:bg-rekind-sand transition-colors"
              >
                Clear All Filters
              </button>
            ) : (
              <Link
                to="/post-item"
                className="px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
              >
                List Machinery
              </Link>
            )}
            <Link
              to="/community-needs"
              className="px-5 py-2.5 rounded-xl bg-white border border-rekind-border text-rekind-dark text-xs font-semibold hover:bg-rekind-cream transition-colors"
            >
              Post Equipment Demand
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setPage(pageNum);
                  loadItems({
                    search,
                    category,
                    type,
                    condition,
                    location: locationFilter,
                    sort,
                    maxPrice,
                    page: pageNum
                  });
                }}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                  page === pageNum
                    ? 'bg-rekind-dark text-white'
                    : 'bg-white border border-rekind-border text-rekind-muted hover:text-rekind-dark'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};
