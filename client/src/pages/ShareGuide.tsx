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
          Industrial Circular Architecture
        </span>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-rekind-dark tracking-tight">
          Four circular pathways for <span className="editorial-italic font-normal text-rekind-brown">heavy machinery.</span>
        </h1>
        <p className="text-sm sm:text-base text-rekind-muted leading-relaxed">
          REKIND Industrial is built to eliminate idle capital across plants, yards, and construction fleets. Whether transferring surplus equipment at zero cost, leasing machinery for contracted projects, trading plant assets, or liquidating capital inventory — every transfer prevents scrap destruction and conserves industrial value.
        </p>
      </div>

      {/* The 4 Paths Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Method 1: Donate / Surplus Transfer */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-dark text-rekind-sand flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                Highest ESG & Circular Impact
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">1. Surplus Transfer (Free)</h2>
              <p className="text-xs text-rekind-muted mt-1">Transfer decommissioned plant inventory, spare pumps, and tooling at zero equipment cost.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Decommissioned industrial pump stations & motors</li>
                <li>Surplus hydraulic cylinders, hoses, and valves</li>
                <li>Redundant plant tooling attachments & drill bits</li>
                <li>Machinery spare parts inventory post line conversion</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              ✨ <strong>Plant Decommissioning:</strong> High corporate ESG credit; buyer covers certified rigging and transport.
            </div>
          </div>

          <Link
            to="/post-item?method=donate"
            className="w-full py-3 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors text-center block"
          >
            Start Surplus Transfer Listing →
          </Link>
        </div>

        {/* Method 2: Lend / Industrial Lease */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-espresso text-rekind-sand flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                Capital Fleet Utilization
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">2. Industrial Lease (Rental)</h2>
              <p className="text-xs text-rekind-muted mt-1">Lease heavy machinery to contractors for monthly projects, scheduled overhauls, or peak seasons.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Crawler excavators & backhoes (Caterpillar, Komatsu)</li>
                <li>Material handling forklifts & reach stackers</li>
                <li>Industrial diesel generators (100 kVA - 1000 kVA)</li>
                <li>Rotary screw air compressors (Atlas Copco, Ingersoll)</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              ⏱️ <strong>Operating meter tracking:</strong> Specify operating hour allowances (e.g. 200 hrs/month) and maintenance terms.
            </div>
          </div>

          <Link
            to="/post-item?method=lend"
            className="w-full py-3 rounded-xl bg-rekind-espresso text-rekind-sand hover:bg-rekind-brown transition-colors text-center block"
          >
            Start Industrial Lease Listing →
          </Link>
        </div>

        {/* Method 3: Exchange / Machine Trade-In */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rekind-brown text-white flex items-center justify-center">
                <Repeat className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                Machinery Barter & Trade-In
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">3. Equipment Trade-In (Swap)</h2>
              <p className="text-xs text-rekind-muted mt-1">Directly trade machinery assets you no longer utilize for equipment your plant currently requires.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>CNC milling centers swapped for CNC lathes</li>
                <li>Heavy forklift trucks exchanged for scissor lifts</li>
                <li>Hydraulic press brakes traded for plate rollers</li>
                <li>Surplus generator capacity swapped for plant compressors</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              🤝 <strong>Asset Rebalance:</strong> Modernize machine shops without liquid cash drawdowns.
            </div>
          </div>

          <Link
            to="/post-item?method=exchange"
            className="w-full py-3 rounded-xl bg-rekind-brown text-white hover:bg-rekind-dark transition-colors text-center block"
          >
            Start Equipment Swap Listing →
          </Link>
        </div>

        {/* Method 4: Machinery Sale */}
        <div className="bg-white rounded-2xl border border-rekind-border p-8 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#9A634B] text-white flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-900 text-xs font-bold">
                Direct Capital Sale
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-rekind-dark">4. Machinery Sale</h2>
              <p className="text-xs text-rekind-muted mt-1">Liquidate plant equipment at verified fair asset valuation with dual INR (₹) and USD ($) support.</p>
            </div>

            <div className="space-y-2 text-xs text-rekind-dark">
              <p className="font-semibold text-rekind-brown">Best suited for:</p>
              <ul className="space-y-1.5 list-disc list-inside text-rekind-muted">
                <li>Production CNC machining centers (Haas, Mazak, Fanuc)</li>
                <li>Hydraulic excavators, bulldozers & road rollers</li>
                <li>Multi-megawatt diesel power generation packages</li>
                <li>Plant production lines undergoing technology upgrades</li>
              </ul>
            </div>

            <div className="p-3 bg-rekind-beige/40 rounded-xl border border-rekind-border text-xs text-rekind-brown">
              🏷️ <strong>Global & Domestic:</strong> Quote tenders in Indian Rupees (₹) for domestic buyers or US Dollars ($) for cross-border export.
            </div>
          </div>

          <Link
            to="/post-item?method=sell"
            className="w-full py-3 rounded-xl bg-[#9A634B] text-white hover:bg-rekind-dark transition-colors text-center block"
          >
            Start Machinery Sale Listing →
          </Link>
        </div>

      </div>

      {/* Safety & Heavy Machinery Verification Principles */}
      <div className="rounded-2xl bg-rekind-cream border border-rekind-border p-8 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
          <ShieldCheck className="w-4 h-4" />
          <span>Industrial Handover & Rigging Protocols</span>
        </div>
        <h3 className="text-2xl font-heading font-bold text-rekind-dark">
          The REKIND Industrial Verification Standard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-rekind-muted leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">On-Site Run Inspection</h4>
            <p>
              Buyer engineers inspect hydraulic pressure, motor amperage, bearing temperatures, and maintenance logs in person prior to contract execution.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">Rigging & Transit Logistics</h4>
            <p>
              Heavy machinery requires certified crane lifting, counterweight staging, and lowbed multi-axle trailer transport with route clearances.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-rekind-dark">Verified Transfer Ledger</h4>
            <p>
              Upon machine commissioning, both organizations sign off in the REKIND portal, updating corporate trust scores and recording conserved tons of industrial machinery steel.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
