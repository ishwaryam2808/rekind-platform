import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Bell, 
  PlusCircle, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  HeartHandshake, 
  Package, 
  MessageSquare, 
  ChevronDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';

export const Navbar: React.FC = () => {
  const { user, logout, unreadNotifsCount } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Community Needs', path: '/community-needs' },
    { name: 'How It Works', path: '/share' },
    { name: 'Impact', path: '/impact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-rekind-border">
      {/* Top Banner */}
      <div className="bg-rekind-dark text-rekind-sand text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-rekind-tan" />
        <span>Less waste. More sharing. <span className="editorial-italic text-rekind-beige">Stronger communities.</span></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-rekind-dark flex items-center justify-center shadow-subtle group-hover:bg-rekind-espresso transition-colors">
              {/* Flame & Leaf Symbol */}
              <svg className="w-6 h-6 text-rekind-tan" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 7 7 7 13C7 16.31 9.69 19 13 19C15.5 19 17.6 17.4 18.5 15.2C18.8 14.4 18 13.7 17.3 14.1C16.2 14.8 14.8 15.2 13.3 15.2C10.5 15.2 8.3 12.9 8.3 10.1C8.3 7.8 9.8 5.8 11.8 5C12.4 4.8 12.8 4.1 12.6 3.5C12.5 2.9 12.2 2 12 2Z" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-rekind-dark block leading-none">
                REKIND
              </span>
              <span className="text-[11px] font-medium tracking-wider text-rekind-muted uppercase mt-0.5 block">
                Give Things a Second Life
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'text-rekind-dark bg-rekind-sand/50 font-semibold shadow-xs'
                      : 'text-rekind-muted hover:text-rekind-dark hover:bg-rekind-sand/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Currency Selector (INR / USD) */}
            <div className="hidden sm:flex items-center bg-white/80 border border-rekind-border rounded-xl p-0.5 text-xs font-semibold shadow-xs">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currency === 'INR'
                    ? 'bg-rekind-dark text-white shadow-xs'
                    : 'text-rekind-muted hover:text-rekind-dark'
                }`}
                title="Display prices in Indian Rupee (₹ INR)"
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-rekind-dark text-white shadow-xs'
                    : 'text-rekind-muted hover:text-rekind-dark'
                }`}
                title="Display prices in US Dollar ($ USD)"
              >
                $ USD
              </button>
            </div>
            
            {/* Quick Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-rekind-muted hover:text-rekind-dark hover:bg-rekind-sand/30 rounded-lg transition-colors"
              title="Search items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-rekind-muted hover:text-rekind-dark hover:bg-rekind-sand/30 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rekind-terracotta rounded-full ring-2 ring-rekind-cream">
                  {unreadNotifsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown or Sign In */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-rekind-border bg-white hover:border-rekind-tan transition-all shadow-xs"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-rekind-sand"
                  />
                  <span className="hidden sm:inline-block text-xs font-semibold text-rekind-dark max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-rekind-muted" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-rekind-border shadow-float py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-rekind-border/60 bg-rekind-beige/30">
                      <p className="text-sm font-semibold text-rekind-dark leading-tight">{user.name}</p>
                      <p className="text-xs text-rekind-muted truncate mt-0.5">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rekind-brown font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-rekind-terracotta" />
                        <span>Trust Score: {user.trustScore}/100</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rekind-dark hover:bg-rekind-sand/30"
                      >
                        <UserIcon className="w-4 h-4 text-rekind-muted" />
                        Public Profile
                      </Link>
                      <Link
                        to="/my-activity"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rekind-dark hover:bg-rekind-sand/30"
                      >
                        <Package className="w-4 h-4 text-rekind-muted" />
                        My Activity (Listings & Requests)
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rekind-dark hover:bg-rekind-sand/30"
                      >
                        <MessageSquare className="w-4 h-4 text-rekind-muted" />
                        Messages & Handovers
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rekind-dark hover:bg-rekind-sand/30"
                      >
                        <Settings className="w-4 h-4 text-rekind-muted" />
                        Account Settings
                      </Link>
                    </div>

                    <div className="border-t border-rekind-border/60 pt-1">
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rekind-terracotta hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-xs sm:text-sm font-semibold text-rekind-dark hover:text-rekind-brown px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Prominent "Give an Item" CTA Button */}
            <Link
              to="/post-item"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-elevated active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-rekind-tan" />
              <span>Give an Item</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-rekind-dark hover:bg-rekind-sand/30 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-rekind-border/70 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-rekind-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, calculators, study desks, household essentials..."
                className="w-full pl-10 pr-24 py-2.5 bg-white border border-rekind-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rekind-tan/60 focus:border-rekind-brown"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1.5 bg-rekind-dark text-rekind-sand text-xs font-semibold rounded-lg hover:bg-rekind-espresso transition-colors flex items-center gap-1"
              >
                Search <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-rekind-border/70 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    active ? 'bg-rekind-sand/50 text-rekind-dark font-semibold' : 'text-rekind-muted hover:text-rekind-dark'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Mobile Currency Selector */}
            <div className="px-4 py-2 flex items-center justify-between bg-rekind-beige/40 rounded-xl border border-rekind-border/60">
              <span className="text-xs font-semibold text-rekind-brown">Display Currency:</span>
              <div className="flex items-center bg-white border border-rekind-border rounded-lg p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    currency === 'INR'
                      ? 'bg-rekind-dark text-white'
                      : 'text-rekind-muted'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    currency === 'USD'
                      ? 'bg-rekind-dark text-white'
                      : 'text-rekind-muted'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-rekind-border/50">
              <Link
                to="/post-item"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-rekind-dark text-white font-semibold text-sm shadow-subtle"
              >
                <PlusCircle className="w-4 h-4 text-rekind-tan" />
                <span>Give an Item</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
