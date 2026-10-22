import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, ShieldCheck, Leaf, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-rekind-dark text-rekind-sand border-t border-rekind-espresso pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-rekind-espresso">
          
          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rekind-espresso flex items-center justify-center border border-rekind-brown/40">
                <svg className="w-5 h-5 text-rekind-tan" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 7 7 7 13C7 16.31 9.69 19 13 19C15.5 19 17.6 17.4 18.5 15.2C18.8 14.4 18 13.7 17.3 14.1C16.2 14.8 14.8 15.2 13.3 15.2C10.5 15.2 8.3 12.9 8.3 10.1C8.3 7.8 9.8 5.8 11.8 5C12.4 4.8 12.8 4.1 12.6 3.5C12.5 2.9 12.2 2 12 2Z" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-rekind-cream">
                REKIND
              </span>
            </div>

            <p className="text-sm text-rekind-sand/80 leading-relaxed max-w-sm">
              An AI-assisted community reuse platform. We help people pass on textbooks, calculators, furniture, and household essentials to neighbors and fellow students who can use them.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-rekind-tan font-medium">
              <Leaf className="w-4 h-4 text-rekind-tan" />
              <span>Prioritizing donation, lending, and exchange over landfill waste.</span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rekind-beige">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-white transition-colors flex items-center gap-1 group">
                  <span>Browse All Items</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=donate" className="hover:text-white transition-colors">
                  Free Items to Give Away
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=lend" className="hover:text-white transition-colors">
                  Borrow & Lending
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=exchange" className="hover:text-white transition-colors">
                  Item Swaps & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/community-needs" className="hover:text-white transition-colors">
                  Community Needs Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: How to Share */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rekind-beige">
              How to Share
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/share" className="hover:text-white transition-colors">
                  Sharing Methods Guide
                </Link>
              </li>
              <li>
                <Link to="/post-item" className="hover:text-white transition-colors">
                  Post an Item Listing
                </Link>
              </li>
              <li>
                <Link to="/community-needs" className="hover:text-white transition-colors">
                  Request Something You Need
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Verified Impact Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rekind-beige">
              Trust & Ethics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-rekind-sand/80">
                <ShieldCheck className="w-3.5 h-3.5 text-rekind-tan" />
                <span>Verified Transfer Ledger</span>
              </li>
              <li className="flex items-center gap-1.5 text-rekind-sand/80">
                <HeartHandshake className="w-3.5 h-3.5 text-rekind-tan" />
                <span>Zero Fake Statistics Pledge</span>
              </li>
              <li className="flex items-center gap-1.5 text-rekind-sand/80">
                <Sparkles className="w-3.5 h-3.5 text-rekind-tan" />
                <span>AI Photo & Tag Assistance</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-rekind-sand/60 gap-4">
          <p>© {new Date().getFullYear()} REKIND. One person's unused item can become another person's opportunity.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-rekind-sand cursor-pointer">Community Guidelines</span>
            <span className="hover:text-rekind-sand cursor-pointer">Safety Reminders</span>
            <span className="hover:text-rekind-sand cursor-pointer">Privacy & Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
