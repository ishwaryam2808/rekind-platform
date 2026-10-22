import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, user, switchDemoUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>((searchParams.get('mode') as any) || 'signin');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common Form Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Registration Extra Fields
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('North Campus & Student Area');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // If already logged in, redirect
  if (user) {
    navigate('/marketplace');
    return null;
  }

  // Live password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak (add numbers & symbols)', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair (add capital letters)', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong & Secure', color: 'bg-emerald-500' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-red-400' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login({ email, password });
        navigate('/marketplace');
      } else {
        // Register validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please enter a valid email address.');
        }

        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        if (!agreeTerms) {
          throw new Error('Please agree to the REKIND community guidelines and terms.');
        }

        await register({
          name,
          email,
          phone,
          location,
          password,
          confirmPassword
        });
        navigate('/marketplace');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (demoEmail: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await switchDemoUser(demoEmail);
      navigate('/marketplace');
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rekind-dark flex items-center justify-center text-rekind-tan shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 7 7 7 13C7 16.31 9.69 19 13 19C15.5 19 17.6 17.4 18.5 15.2C18.8 14.4 18 13.7 17.3 14.1C16.2 14.8 14.8 15.2 13.3 15.2C10.5 15.2 8.3 12.9 8.3 10.1C8.3 7.8 9.8 5.8 11.8 5C12.4 4.8 12.8 4.1 12.6 3.5C12.5 2.9 12.2 2 12 2Z" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-2xl text-rekind-dark">REKIND</span>
        </Link>
        <h1 className="text-2xl font-heading font-bold text-rekind-dark">
          {mode === 'signin' ? 'Welcome back to REKIND' : 'Join the Community'}
        </h1>
        <p className="text-xs text-rekind-muted">
          {mode === 'signin'
            ? 'Sign in to manage your listings, borrow requests, and messages.'
            : 'Pass on what you do not need, and find what you need nearby.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle">
        
        {/* Toggle Mode Pills */}
        <div className="grid grid-cols-2 p-1 bg-rekind-cream/80 rounded-xl border border-rekind-border/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-rekind-dark text-white shadow-xs' : 'text-rekind-muted hover:text-rekind-dark'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-rekind-dark text-white shadow-xs' : 'text-rekind-muted hover:text-rekind-dark'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-800 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Sen"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Preferred Location / Campus Area *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. North Campus & Hostel C"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu or name@email.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 characters)"
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-rekind-muted hover:text-rekind-dark"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Strength Feedback */}
            {mode === 'register' && password && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                </div>
                <p className="text-[10px] text-rekind-muted flex items-center justify-between">
                  <span>Strength: <strong>{strength.label}</strong></span>
                  <span>Min. 8 characters</span>
                </p>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-rekind-muted" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <label className="flex items-start gap-2 pt-1 text-xs text-rekind-muted cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-rekind-border text-rekind-dark focus:ring-rekind-tan"
              />
              <span>
                I agree to the REKIND community guidelines and respect fair sharing and honest condition disclosures.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-bold hover:bg-rekind-espresso transition-all shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            <span>{loading ? 'Please wait...' : mode === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4 text-rekind-tan" />
          </button>
        </form>

        {/* 1-Click Demo Accounts Picker */}
        <div className="pt-4 border-t border-rekind-border/70 space-y-2">
          <p className="text-[11px] font-bold text-rekind-muted uppercase tracking-wider text-center">
            One-Click Reviewer Test Logins
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoSignIn('maya.sen@campus.edu')}
              className="p-2 rounded-xl border border-rekind-border bg-rekind-cream/50 hover:bg-rekind-sand/40 text-left transition-colors"
            >
              <span className="font-bold text-rekind-dark block">Maya Sen</span>
              <span className="text-[10px] text-rekind-muted">Engineering Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('david.r@community.org')}
              className="p-2 rounded-xl border border-rekind-border bg-rekind-cream/50 hover:bg-rekind-sand/40 text-left transition-colors"
            >
              <span className="font-bold text-rekind-dark block">David Rivera</span>
              <span className="text-[10px] text-rekind-muted">Community Maker</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('amina@familycare.net')}
              className="p-2 rounded-xl border border-rekind-border bg-rekind-cream/50 hover:bg-rekind-sand/40 text-left transition-colors"
            >
              <span className="font-bold text-rekind-dark block">Amina El-Amin</span>
              <span className="text-[10px] text-rekind-muted">Family Circle Giver</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('kiran.p@techhub.io')}
              className="p-2 rounded-xl border border-rekind-border bg-rekind-cream/50 hover:bg-rekind-sand/40 text-left transition-colors"
            >
              <span className="font-bold text-rekind-dark block">Kiran Patel</span>
              <span className="text-[10px] text-rekind-muted">Tech Student & Lender</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
