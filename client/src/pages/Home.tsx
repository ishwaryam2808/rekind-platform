import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Search, 
  Gift, 
  Repeat, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  Users, 
  Clock, 
  Heart,
  Package,
  Wrench,
  Cpu,
  Truck,
  Zap,
  Mic
} from 'lucide-react';
import { api } from '../services/api';
import type { Item, CommunityNeed, ImpactMetrics } from '../types';
import { ItemCard } from '../components/common/ItemCard';
import { useCurrency } from '../context/CurrencyContext';
import { VoiceInputButton } from '../components/common/VoiceInputButton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [heroSearch, setHeroSearch] = useState<string>('');
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [freeItems, setFreeItems] = useState<Item[]>([]);
  const [urgentNeeds, setUrgentNeeds] = useState<CommunityNeed[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [itemsRes, needsRes, impactRes] = await Promise.all([
          api.getItems({ limit: 8 }),
          api.getCommunityNeeds({ status: 'open' }),
          api.getImpact()
        ]);

        if (itemsRes?.items) {
          setRecentItems(itemsRes.items);
          setFreeItems(itemsRes.items.filter((i: Item) => i.type === 'donate').slice(0, 4));
        }

        if (needsRes?.needs) {
          setUrgentNeeds(needsRes.needs.slice(0, 3));
        }

        if (impactRes?.metrics) {
          setImpactMetrics(impactRes.metrics);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rekind-beige border border-rekind-border text-xs font-semibold text-rekind-brown">
                <span className="w-2 h-2 rounded-full bg-rekind-terracotta animate-pulse" />
                Heavy Machinery & Plant Asset Redistribution
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-rekind-dark tracking-tight leading-[1.1]">
                Heavy machinery <br />
                <span className="editorial-italic font-normal text-rekind-brown">circular exchange.</span>
              </h1>

              <p className="text-lg sm:text-xl text-rekind-muted max-w-xl font-normal leading-relaxed">
                Liquidate surplus plant machinery, lease earthmoving equipment, or trade CNC tooling across industrial operations. Search by voice command, OEM model numbers, or natural work intents.
              </p>

              {/* Voice-Enabled Hero Search Bar */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (heroSearch.trim()) {
                    navigate(`/marketplace?search=${encodeURIComponent(heroSearch.trim())}`);
                  }
                }}
                className="relative max-w-xl"
              >
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-rekind-muted" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Voice or type OEM model (e.g. CAT 320, Haas VF-2, 5T Forklift)..."
                  className="w-full pl-12 pr-32 py-3.5 bg-white text-rekind-dark rounded-2xl text-sm border border-rekind-border shadow-subtle focus:outline-none focus:ring-2 focus:ring-rekind-tan"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1.5">
                  <VoiceInputButton
                    onTranscript={(transcript) => {
                      setHeroSearch(transcript);
                      navigate(`/marketplace?search=${encodeURIComponent(transcript)}`);
                    }}
                    size="sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Industrial OEM / Spoken Query Jump Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-rekind-muted font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-rekind-tan" /> Popular Queries:
                </span>
                <Link to="/marketplace?search=CAT%20320%20Excavator" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors font-medium">
                  🚜 CAT 320 Excavator
                </Link>
                <Link to="/marketplace?search=Haas%20CNC%20Mill" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors font-medium">
                  ⚙️ Haas CNC VMC
                </Link>
                <Link to="/marketplace?search=5%20Ton%20Forklift" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors font-medium">
                  🏗️ 5-Ton Forklift
                </Link>
                <Link to="/marketplace?type=donate" className="px-2.5 py-1 rounded-md bg-rekind-beige border border-rekind-border hover:border-rekind-brown text-rekind-brown font-semibold transition-colors">
                  🎁 Plant Surplus (Free)
                </Link>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/marketplace"
                  className="px-6 py-3.5 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso hover:text-white transition-all text-sm font-semibold shadow-subtle hover:shadow-elevated flex items-center gap-2 group active:scale-98"
                >
                  <span>Explore Machinery Catalog</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/post-item"
                  className="px-6 py-3.5 rounded-xl bg-white border border-rekind-border text-rekind-dark hover:border-rekind-brown hover:bg-rekind-cream transition-all text-sm font-semibold shadow-2xs active:scale-98"
                >
                  List Machinery or Surplus
                </Link>
              </div>

              {/* Supporting Line */}
              <div className="pt-2 flex items-center gap-3 text-xs text-rekind-brown font-medium">
                <Leaf className="w-4 h-4 text-rekind-terracotta shrink-0" />
                <span>Conserving heavy steel & industrial capital. Diverting industrial plant waste.</span>
              </div>

            </div>

            {/* Right Editorial Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Large Industrial Photography Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-float border border-rekind-border bg-rekind-sand/30 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1000&q=80"
                    alt="Heavy Excavation Machinery on site"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  
                  {/* Floating Tag on Main Photo */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium tracking-wide uppercase">
                      Industrial Exchange
                    </span>
                    <p className="font-heading font-bold text-lg leading-tight">
                      Giving decommissioned and idle heavy machinery a productive second life across operations.
                    </p>
                  </div>
                </div>

                {/* Overlapping Floating Small Card 1 (Top Right) */}
                <div className="absolute -top-4 -right-4 sm:-right-6 w-48 sm:w-52 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rekind-border shadow-elevated hidden sm:block animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rekind-espresso text-rekind-sand flex items-center justify-center shrink-0">
                      <Repeat className="w-5 h-5 text-rekind-tan" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-rekind-terracotta uppercase">4 Circular Modalities</span>
                      <p className="text-xs font-semibold text-rekind-dark truncate">Lease, Trade & Surplus</p>
                      <p className="text-[10px] text-rekind-muted">Zero idle machinery</p>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Small Card 2 (Bottom Left) */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 w-56 sm:w-60 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rekind-border shadow-elevated hidden sm:block animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rekind-beige flex items-center justify-center shrink-0 text-rekind-brown">
                      <Mic className="w-5 h-5 text-rekind-terracotta" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rekind-dark">Voice & Semantic Engine</p>
                      <p className="text-[11px] text-rekind-muted">Speak OEM specs or task intent</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FOUR MAIN ACTION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Find Machinery */}
          <Link
            to="/marketplace"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Find Machinery</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Discover heavy plant machinery, CNC tooling, excavators, and industrial compressors across verified yards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Browse Machinery Catalog →
            </div>
          </Link>

          {/* Card 2: Plant Surplus Transfer */}
          <Link
            to="/post-item?method=donate"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Surplus Asset Transfer</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Transfer decommissioned plant inventory, spare pumps, and tooling at zero capital equipment charge.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              List Free Plant Surplus →
            </div>
          </Link>

          {/* Card 3: Machinery Lease & Trade-In */}
          <Link
            to="/share"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Lease & Trade-In</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Lease heavy machines for seasonal project contracts or trade idle plant assets for needed equipment.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Industrial Sharing Modalities →
            </div>
          </Link>

          {/* Card 4: Equipment Demands */}
          <Link
            to="/community-needs"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Equipment Demands</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Post high-capacity machinery demands (e.g. 50T mobile crane, CNC horizontal lathe) to industrial peers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Machinery Demands Board →
            </div>
          </Link>

        </div>
      </section>

      {/* 3. RECENTLY ADDED ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta mb-1">
              Fresh in Your Community
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-rekind-dark">
              Recently Added Items
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rekind-dark hover:text-rekind-brown transition-colors group"
          >
            <span>View All Marketplace Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-card border border-rekind-border p-4 animate-pulse space-y-3">
                <div className="aspect-[4/3] bg-rekind-sand/40 rounded-xl" />
                <div className="h-4 bg-rekind-sand/50 rounded w-3/4" />
                <div className="h-3 bg-rekind-sand/40 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-rekind-border space-y-3 max-w-lg mx-auto">
            <Package className="w-10 h-10 text-rekind-muted mx-auto" />
            <h3 className="font-heading font-bold text-base text-rekind-dark">No items available yet</h3>
            <p className="text-xs text-rekind-muted">Be the first to give an unused textbook, tool, or household item a second life.</p>
            <Link to="/post-item" className="inline-block px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors">
              Share an Item
            </Link>
          </div>
        )}
      </section>

      {/* 4. ITEMS AVAILABLE FOR FREE (Donation spotlight) */}
      <section className="bg-rekind-beige/50 border-y border-rekind-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rekind-brown mb-1">
                <Gift className="w-3.5 h-3.5 text-rekind-terracotta" />
                Generous Community Spirit
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-rekind-dark">
                Available for Free
              </h2>
              <p className="text-xs sm:text-sm text-rekind-muted mt-1">
                Passed on with zero charge. Ready for immediate pickup.
              </p>
            </div>
            <Link
              to="/marketplace?type=donate"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rekind-dark hover:text-rekind-brown transition-colors group"
            >
              <span>Explore All Free Giveaways</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {freeItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white/80 rounded-2xl border border-rekind-border space-y-3 max-w-lg mx-auto">
              <Gift className="w-10 h-10 text-rekind-muted mx-auto" />
              <h3 className="font-heading font-bold text-base text-rekind-dark">No free items listed yet</h3>
              <p className="text-xs text-rekind-muted">Have supplies you no longer need? Pass them on to neighbors completely free.</p>
              <Link to="/post-item?method=donate" className="inline-block px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors">
                List a Free Giveaway
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. COMMUNITY REQUESTS THAT NEED HELP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta mb-1">
              Community Needs Board
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-rekind-dark">
              Requests That Need Help
            </h2>
            <p className="text-xs sm:text-sm text-rekind-muted mt-1">
              Have one of these unused items in your cupboard? You can make an immediate difference.
            </p>
          </div>
          <Link
            to="/community-needs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rekind-dark hover:text-rekind-brown transition-colors group"
          >
            <span>View All Needs & Make an Offer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {urgentNeeds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgentNeeds.map((need) => (
              <div
                key={need.id}
                className="bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan transition-all shadow-subtle hover:shadow-elevated flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
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

                  <h3 className="font-heading font-bold text-base text-rekind-dark mb-2 line-clamp-2">
                    {need.title}
                  </h3>

                  <p className="text-xs text-rekind-muted line-clamp-3 leading-relaxed mb-4">
                    {need.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-rekind-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={need.requesterAvatar}
                      alt={need.requesterName}
                      className="w-6 h-6 rounded-full object-cover border border-rekind-sand"
                    />
                    <div className="text-[11px]">
                      <p className="font-semibold text-rekind-dark">{need.requesterName}</p>
                      <p className="text-rekind-muted text-[10px]">{need.location}</p>
                    </div>
                  </div>

                  <Link
                    to={`/community-needs?offer=${need.id}`}
                    className="px-3 py-1.5 rounded-lg bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso text-xs font-semibold transition-colors"
                  >
                    Offer Item
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-rekind-border space-y-3 max-w-lg mx-auto">
            <HelpCircle className="w-10 h-10 text-rekind-muted mx-auto" />
            <h3 className="font-heading font-bold text-base text-rekind-dark">No community requests yet</h3>
            <p className="text-xs text-rekind-muted">Looking for a specific textbook, calculator, or household essential? Post what you need.</p>
            <Link to="/community-needs" className="inline-block px-5 py-2.5 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors">
              Post a Community Need
            </Link>
          </div>
        )}
      </section>

      {/* 6. HOW REKIND INDUSTRIAL WORKS IN THREE STEPS */}
      <section className="bg-rekind-dark text-rekind-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rekind-tan">
              Industrial Circular Economy
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              How REKIND Industrial works in three steps
            </h2>
            <p className="text-sm text-rekind-sand/80">
              Redistribute heavy plant machinery, CNC tooling, and earthmovers with transparent rigging logistics and measurable capital diversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Dictate & List with Voice AI
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Dictate machine name and service history via live voice recognition. Our industrial AI assistant auto-extracts OEM manufacturers (CAT, Haas, Komatsu), operating hours, power ratings, and safety guidance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Choose Industrial Modality
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Offer as a plant surplus transfer (free), lease equipment for ongoing project timelines, propose a machine trade-in swap, or list for capital liquidation with dual ₹ INR / $ USD pricing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Rigging, Inspection & ESG Metric
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Coordinate on-site test runs and lowbed trailer rigging. Verified asset transfers log conserved metric tons of machinery steel into the transparent circular impact ledger.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/share"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rekind-espresso text-rekind-cream hover:bg-rekind-brown text-xs sm:text-sm font-semibold transition-colors border border-rekind-brown/40"
            >
              <span>Explore Industrial Sharing Modalities</span>
              <ArrowRight className="w-4 h-4 text-rekind-tan" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SUSTAINABILITY & REUSE MESSAGE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-rekind-beige flex items-center justify-center mx-auto text-rekind-terracotta">
          <Leaf className="w-6 h-6" />
        </div>
        <blockquote className="text-2xl sm:text-3xl font-heading font-bold text-rekind-dark leading-snug">
          “One person’s unused textbook or quiet calculator can be the <span className="editorial-italic font-normal text-rekind-brown">exact key</span> that unlocks another student’s semester.”
        </blockquote>
        <p className="text-sm text-rekind-muted max-w-xl mx-auto leading-relaxed">
          REKIND was created to break the buy-new default. By passing on items within our local neighborhoods and campuses, we keep valuable goods circulating, prevent landfill waste, and build trusting community bonds.
        </p>
      </section>

      {/* 8. VERIFIED IMPACT METRICS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-rekind-border p-8 sm:p-12 shadow-subtle">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-rekind-border/70 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rekind-terracotta mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Impact Ledger</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-rekind-dark">
                Real Community Impact
              </h2>
            </div>
            <p className="text-xs text-rekind-muted max-w-xs">
              Metrics calculated strictly from verified completed item handovers recorded in our database.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-rekind-cream/60 border border-rekind-border/60">
              <span className="block text-3xl sm:text-4xl font-heading font-extrabold text-rekind-dark">
                {impactMetrics ? impactMetrics.totalTransfers : '—'}
              </span>
              <span className="text-xs text-rekind-muted font-medium mt-1 block">
                Items Given Second Life
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rekind-cream/60 border border-rekind-border/60">
              <span className="block text-3xl sm:text-4xl font-heading font-extrabold text-rekind-dark">
                {impactMetrics ? `${impactMetrics.wasteDivertedKg} kg` : '—'}
              </span>
              <span className="text-xs text-rekind-muted font-medium mt-1 block">
                Landfill Waste Diverted
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rekind-cream/60 border border-rekind-border/60">
              <span className="block text-3xl sm:text-4xl font-heading font-extrabold text-rekind-dark">
                {impactMetrics ? formatPrice(impactMetrics.economicValueSaved) : '—'}
              </span>
              <span className="text-xs text-rekind-muted font-medium mt-1 block">
                Saved by Community Members
              </span>
            </div>

            <div className="p-4 rounded-xl bg-rekind-cream/60 border border-rekind-border/60">
              <span className="block text-3xl sm:text-4xl font-heading font-extrabold text-rekind-dark">
                {impactMetrics ? impactMetrics.uniqueParticipants : '—'}
              </span>
              <span className="text-xs text-rekind-muted font-medium mt-1 block">
                Active Givers & Receivers
              </span>
            </div>

          </div>

          {impactMetrics?.totalTransfers === 0 && (
            <p className="mt-6 text-center text-xs text-rekind-muted">
              🌱 The community impact ledger is clean and ready. Once handovers are completed and verified between members, real statistics will calculate here automatically.
            </p>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/impact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rekind-brown hover:text-rekind-dark transition-colors"
            >
              <span>View full transparent impact dashboard & audit logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-rekind-dark text-rekind-sand p-10 sm:p-16 relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              Ready to give something a <br />
              <span className="editorial-italic font-normal text-rekind-tan">second life?</span>
            </h2>
            <p className="text-sm sm:text-base text-rekind-sand/80 leading-relaxed">
              Look around your desk, closet, or bookshelf. What you don't need today could make someone else's tomorrow so much easier.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/post-item"
                className="px-6 py-3.5 rounded-xl bg-rekind-tan text-rekind-dark hover:bg-white transition-all text-sm font-bold shadow-subtle"
              >
                Share an Item Now
              </Link>
              <Link
                to="/community-needs"
                className="px-6 py-3.5 rounded-xl bg-rekind-espresso text-rekind-sand hover:bg-rekind-brown transition-all text-sm font-semibold border border-rekind-brown/60"
              >
                Browse Needs Board
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
