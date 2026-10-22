import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [location, setLocation] = useState<string>(user?.location || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [securitySaving, setSecuritySaving] = useState<boolean>(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  if (!user) {
    navigate('/auth');
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

  const strength = getPasswordStrength(newPassword);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    setProfileError(null);
    try {
      await updateProfile({ name, phone, location, bio, avatar });
      setProfileSuccess('Profile information saved successfully.');
      setTimeout(() => setProfileSuccess(null), 3500);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySaving(true);
    setSecuritySuccess(null);
    setSecurityError(null);

    if (newPassword.length < 8) {
      setSecurityError('New password must be at least 8 characters.');
      setSecuritySaving(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSecurityError('New passwords do not match.');
      setSecuritySaving(false);
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmNewPassword });
      setSecuritySuccess('Your password has been changed securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSecuritySuccess(null), 3500);
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to change password.');
    } finally {
      setSecuritySaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-rekind-border/70">
        <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
          Account Preferences
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-rekind-dark">
          Settings & Security
        </h1>
        <p className="text-xs sm:text-sm text-rekind-muted mt-1">
          Update your public profile, contact details, and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-rekind-border/70">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-rekind-dark text-rekind-dark'
              : 'border-transparent text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-rekind-dark text-rekind-dark'
              : 'border-transparent text-rekind-muted hover:text-rekind-dark'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password & Security</span>
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle">
          
          {profileSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-rekind-border/70">
            <img
              src={avatar || user.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-rekind-sand"
            />
            <div className="space-y-1.5 flex-1">
              <label className="block text-xs font-semibold text-rekind-dark">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-rekind-cream/40 border border-rekind-border rounded-xl text-xs focus:ring-1 focus:ring-rekind-tan"
              />
              <p className="text-[11px] text-rekind-muted">
                Use an authentic clear headshot or choose an avatar icon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Email Address (Account identifier)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 bg-gray-50 border border-rekind-border rounded-xl text-xs sm:text-sm text-rekind-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Phone Number (Private until handover)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Preferred Community / Campus Area *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. North Campus & Hostel C"
                className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              Short Bio / Community Note
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell neighbors what you study, what you like to exchange, or your reuse philosophy..."
              className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-rekind-tan" />
              <span>{profileSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle max-w-xl">
          
          {securitySuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{securitySuccess}</span>
            </div>
          )}

          {securityError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{securityError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2.5 pr-10 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-rekind-muted hover:text-rekind-dark"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full p-2.5 pr-10 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-rekind-muted hover:text-rekind-dark"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Password Strength Meter */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-rekind-muted flex items-center justify-between">
                  <span>Strength: <strong>{strength.label}</strong></span>
                  <span>Min. 8 characters</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-rekind-dark mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={securitySaving || !newPassword}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors disabled:opacity-50"
            >
              {securitySaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
