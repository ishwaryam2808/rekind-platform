import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gift, 
  Repeat, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Sparkles,
  HelpCircle,
  Users
} from 'lucide-react';

export const ShareGuide: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
          Sharing Architecture
        </span>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-rekind-dark tracking-tight">
          Choose how to <span className="editorial-italic font-normal text-rekind-brown">share your item.</span>
        </h1>
        <p className="text-sm sm:text-base text-rekind-muted leading-relaxed">
          REKIND is built to support flexible community circularity. Whether you want to give an item away for free, lend it for a semester, swap for something you need, or sell affordably — every path prevents landfill waste.
        </p>
      </div>

      {/* The 4 Paths Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Method 1: Donate */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-dark text-rekind-sand flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                Highest Community Impact
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">1. Donate (Give for Free)</h2>
              <p className="text-xs text-rekind-muted mt-1">Pass on items you will never use again with zero monetary barrier.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Textbooks from finished courses</li>
                <li>Gently used clothes, jackets, and shoes</li>
                <li>Dorm lamps, kettles, and kitchen utensils</li>
                <li>Study notebooks, stationery, and organizers</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              ✨ <strong>Fastest turnaround:</strong> Free items typically get requested within 24 to 48 hours.
            </div>
          </div>

          <Link
            to="/post-item?method=donate"
            className="w-full py-3 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors text-center block"
          >
            Start Free Donation Listing →
          </Link>
        </div>

        {/* Method 2: Lend */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso text-rekind-sand flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                Resource Circulation
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">2. Lend (Temporary Borrow)</h2>
              <p className="text-xs text-rekind-muted mt-1">Share an item temporarily for a semester, exam period, or weekend DIY task.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Scientific & graphing calculators (TI-84, Casio)</li>
                <li>Musical instruments for practice (guitars, keyboards)</li>
                <li>Tools & hardware (drills, sanders, toolboxes)</li>
                <li>Camping gear and sleeping bags</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              ⏱️ <strong>Clear timelines:</strong> You specify expected return dates (e.g. "Up to 4 months for semester").
            </div>
          </div>

          <Link
            to="/post-item?method=lend"
            className="w-full py-3 rounded-xl bg-rekind-espresso text-rekind-sand hover:bg-rekind-brown transition-colors text-center block"
          >
            Start Lending Listing →
          </Link>
        </div>

        {/* Method 3: Exchange */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-brown text-white flex items-center justify-center">
                <Repeat className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                Direct Mutual Swap
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">3. Exchange (Item Swap)</h2>
              <p className="text-xs text-rekind-muted mt-1">Trade what you have for something you currently need with no money exchanged.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Novels, manga, and recreational book collections</li>
                <li>Children's puzzles, board games, and Lego sets</li>
                <li>Specialized hobby and crafting materials</li>
                <li>Interchangeable sporting goods and racquets</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              🤝 <strong>Custom proposals:</strong> Requesters propose what they have to swap before you accept.
            </div>
          </div>

          <Link
            to="/post-item?method=exchange"
            className="w-full py-3 rounded-xl bg-rekind-brown text-white hover:bg-rekind-dark transition-colors text-center block"
          >
            Start Item Swap Listing →
          </Link>
        </div>

        {/* Method 4: Affordable Sale */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#9A634B] text-white flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-900 text-xs font-bold">
                Affordable Second-Hand
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">4. Affordable Sale</h2>
              <p className="text-xs text-rekind-muted mt-1">Set an accessible second-hand price to recover part of the item's purchase value.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Laptops, monitors, and audio equipment</li>
                <li>Solid wood furniture and ergonomic desk chairs</li>
                <li>Higher-value technical reference handbooks</li>
                <li>Premium waterproof outdoor gear</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              🏷️ <strong>Community ethos:</strong> Keep pricing fair and friendly compared to commercial retail.
            </div>
          </div>

          <Link
            to="/post-item?method=sell"
            className="w-full py-3 rounded-xl bg-[#9A634B] text-white hover:bg-rekind-dark transition-colors text-center block"
          >
            Start Affordable Sale Listing →
          </Link>
        </div>

      </div>

      {/* Safety & Community Verification Principles */}
      <div className="rounded-2xl bg-rekind-cream border border-rekind-border p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
          <ShieldCheck className="w-4 h-4" />
          <span>Trust & Verification</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-rekind-dark">
          The REKIND Handover Ethics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-rekind-muted leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">Daylight Public Locations</h4>
            <p>
              We recommend meeting outside campus libraries, student commons, or neighborhood coffee shops. Never invite strangers to private residences alone.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">Honest Condition Reporting</h4>
            <p>
              Photograph any scuffs, dog-eared pages, or worn cables upfront. Surprises at handover damage community trust.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">Verify Transfer Completion</h4>
            <p>
              Once handed over, both parties can confirm the transfer in My Activity. This updates your trust score and logs real kilograms diverted in our impact ledger.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
