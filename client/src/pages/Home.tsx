import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  BookOpen,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import type { Item, CommunityNeed, ImpactMetrics } from '../types';
import { ItemCard } from '../components/common/ItemCard';

export const Home: React.FC = () => {
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
                Community Reuse & Resource Sharing
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-rekind-dark tracking-tight leading-[1.1]">
                Give things a <br />
                <span className="editorial-italic font-normal text-rekind-brown">second life.</span>
              </h1>

              <p className="text-lg sm:text-xl text-rekind-muted max-w-xl font-normal leading-relaxed">
                Pass on what you no longer need. Discover what someone else is looking for. Together, we make useful things go further.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/marketplace"
                  className="px-6 py-3.5 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso hover:text-white transition-all text-sm font-semibold shadow-subtle hover:shadow-elevated flex items-center gap-2 group active:scale-98"
                >
                  <span>Explore Items</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/post-item"
                  className="px-6 py-3.5 rounded-xl bg-white border border-rekind-border text-rekind-dark hover:border-rekind-brown hover:bg-rekind-cream transition-all text-sm font-semibold shadow-2xs active:scale-98"
                >
                  Share Something
                </Link>
              </div>

              {/* Supporting Line */}
              <div className="pt-4 flex items-center gap-3 text-xs text-rekind-brown font-medium">
                <Leaf className="w-4 h-4 text-rekind-terracotta shrink-0" />
                <span>Less waste. More sharing. Stronger communities.</span>
              </div>

              {/* Quick Category Jump Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-rekind-muted font-medium">Popular:</span>
                <Link to="/marketplace?category=Books%20and%20Education" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors">
                  📚 Textbooks
                </Link>
                <Link to="/marketplace?category=Electronics" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors">
                  ⚡ Calculators & Gadgets
                </Link>
                <Link to="/marketplace?category=Furniture%20and%20Home" className="px-2.5 py-1 rounded-md bg-white border border-rekind-border hover:border-rekind-tan text-rekind-dark transition-colors">
                  🪑 Dorm & Home Desks
                </Link>
                <Link to="/marketplace?type=donate" className="px-2.5 py-1 rounded-md bg-rekind-beige border border-rekind-border hover:border-rekind-brown text-rekind-brown font-semibold transition-colors">
                  🎁 Free Giveaways
                </Link>
              </div>

            </div>

            {/* Right Editorial Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Large Editorial Photography Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-float border border-rekind-border bg-rekind-sand/30 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
                    alt="Community items reuse"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Floating Tag on Main Photo */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium tracking-wide uppercase">
                      Community Platform
                    </span>
                    <p className="font-heading font-bold text-lg leading-tight">
                      Giving unused items a grateful second life with people who need them.
                    </p>
                  </div>
                </div>

                {/* Overlapping Floating Small Card 1 (Top Right) */}
                <div className="absolute -top-4 -right-4 sm:-right-6 w-44 sm:w-48 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rekind-border shadow-elevated hidden sm:block animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rekind-espresso text-rekind-sand flex items-center justify-center shrink-0">
                      <Repeat className="w-5 h-5 text-rekind-tan" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] font-bold text-rekind-terracotta uppercase">Circular Sharing</span>
                      <p className="text-xs font-semibold text-rekind-dark truncate">Give, Lend & Swap</p>
                      <p className="text-[10px] text-rekind-muted">Community circularity</p>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Small Card 2 (Bottom Left) */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 w-52 sm:w-56 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rekind-border shadow-elevated hidden sm:block animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rekind-beige flex items-center justify-center shrink-0 text-rekind-brown">
                      <Sparkles className="w-5 h-5 text-rekind-terracotta" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rekind-dark">AI-Assisted Listing</p>
                      <p className="text-[11px] text-rekind-muted">Auto title, tags & fair advice</p>
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
          
          {/* Card 1: Find Something */}
          <Link
            to="/marketplace"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Find Something</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Discover useful items available nearby, from study materials to dorm furniture.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Browse Marketplace →
            </div>
          </Link>

          {/* Card 2: Give Something */}
          <Link
            to="/post-item?method=donate"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Give Something</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Donate items to people who need them and give them a grateful second home.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              List a Free Item →
            </div>
          </Link>

          {/* Card 3: Lend or Exchange */}
          <Link
            to="/share"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Lend or Exchange</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Share temporarily for a semester, or swap items with a neighbor.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Learn How to Share →
            </div>
          </Link>

          {/* Card 4: Ask the Community */}
          <Link
            to="/community-needs"
            className="group relative bg-white rounded-card p-6 border border-rekind-border hover:border-rekind-tan/80 transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-espresso mb-4 group-hover:bg-rekind-dark group-hover:text-rekind-sand transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-rekind-dark mb-1.5 flex items-center justify-between">
                <span>Ask the Community</span>
                <ArrowRight className="w-4 h-4 text-rekind-tan group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Post an item request and connect with people who have surplus supplies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rekind-border/50 text-[11px] font-semibold text-rekind-brown">
              Community Needs Board →
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

      {/* 6. HOW REKIND WORKS IN THREE SIMPLE STEPS */}
      <section className="bg-rekind-dark text-rekind-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rekind-tan">
              Simple & Thoughtful
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white">
              How REKIND works in three simple steps
            </h2>
            <p className="text-sm text-rekind-sand/80">
              Pass on useful things quickly, safely, and with real measurable community impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                1
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Snap & List with AI
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Take a quick photo of your unused textbook, calculator, or household item. Our AI assistant helps suggest category, title, description, and tags.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                2
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Choose How to Share
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Donate it completely free, lend it for the semester, propose a fair item swap, or sell at an affordable price. You stay in full control.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-rekind-charcoal/80 border border-rekind-espresso rounded-card p-8 relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso flex items-center justify-center text-rekind-tan font-heading font-extrabold text-xl">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-white">
                Handover & Divert Waste
              </h3>
              <p className="text-xs sm:text-sm text-rekind-sand/70 leading-relaxed">
                Meet safely at a campus library or community spot. Mark the transfer completed to record real diverted landfill weight in our verified ledger.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link
              to="/share"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rekind-espresso text-rekind-cream hover:bg-rekind-brown text-xs sm:text-sm font-semibold transition-colors border border-rekind-brown/40"
            >
              <span>Explore Sharing Guide & Methods</span>
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
                {impactMetrics ? `$${impactMetrics.economicValueSaved}` : '—'}
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
