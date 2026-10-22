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

const SHARING_METHODS: { label: string; value: string; icon?: any }[] = [
  { label: 'All Methods', value: 'All' },
  { label: 'Free Giveaway (Donate)', value: 'donate' },
  { label: 'Borrow (Lend)', value: 'lend' },
  { label: 'Swap (Exchange)', value: 'exchange' },
  { label: 'Affordable Sale', value: 'sell' },
];

const CONDITIONS = [
  'All',
  'Like New',
  'Gently Used',
  'Good',
  'Fair'
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
          <span className="text-xs font-bold uppercase tracking-wider text-rekind-tan">
            Community Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
            Discover useful items nearby.
          </h1>
          <p className="text-xs sm:text-sm text-rekind-sand/80 mt-2">
            Textbooks, electronics, home essentials, and creative tools passed on between neighbors and students.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-rekind-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, keyword, or course code..."
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
            {hasActiveFilters ? 'No matching items found' : 'No items available yet'}
          </h3>
          <p className="text-xs sm:text-sm text-rekind-muted leading-relaxed">
            {hasActiveFilters
              ? "We couldn't find items matching your search or filters. Try clearing your filters or posting an item request."
              : "Nothing here yet. Get started by creating your first listing or request an item you need on the Community Needs board."}
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
                Share an Item
              </Link>
            )}
            <Link
              to="/community-needs"
              className="px-5 py-2.5 rounded-xl bg-white border border-rekind-border text-rekind-dark text-xs font-semibold hover:bg-rekind-cream transition-colors"
            >
              Post a Community Need
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
