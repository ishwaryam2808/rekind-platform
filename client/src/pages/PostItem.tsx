import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Gift, 
  Repeat, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Camera
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import type { SharingType, ItemCondition } from '../types';

const CATEGORIES = [
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

const CONDITIONS: ItemCondition[] = [
  'Like New',
  'Gently Used',
  'Good',
  'Fair',
  'Needs TLC'
];

export const PostItem: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);

  // Form Fields
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Books and Education');
  const [description, setDescription] = useState<string>('');
  const [condition, setCondition] = useState<ItemCondition>('Gently Used');
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState<string>(user?.location || '');
  const [safetyNotes, setSafetyNotes] = useState<string>('Meet at campus library or daylight public spot.');
  const [tags, setTags] = useState<string>('');

  // Sharing Method & Dynamic Fields
  const { currency: globalCurrency } = useCurrency();
  const initialMethod = (searchParams.get('method') as SharingType) || 'donate';
  const [type, setType] = useState<SharingType>(initialMethod);
  const [itemCurrency, setItemCurrency] = useState<'INR' | 'USD'>(globalCurrency);
  const [price, setPrice] = useState<number>(globalCurrency === 'INR' ? 150 : 10);
  const [lendingDuration, setLendingDuration] = useState<string>('');
  const [exchangePreferences, setExchangePreferences] = useState<string>('');

  // AI Assistant State
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setImages([base64, ...images]);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Assistant
  const runAiAssistant = async () => {
    setAiLoading(true);
    try {
      const res = await api.getAiSuggestions({
        titleHint: title,
        rawDescription: description,
        imageKeywords: title || category
      });
      if (res.suggestion) {
        setAiSuggestion(res.suggestion);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    if (aiSuggestion.title) setTitle(aiSuggestion.title);
    if (aiSuggestion.category) setCategory(aiSuggestion.category);
    if (aiSuggestion.description) setDescription(aiSuggestion.description);
    if (aiSuggestion.condition) setCondition(aiSuggestion.condition);
    if (aiSuggestion.tags) setTags(aiSuggestion.tags.join(', '));
    if (aiSuggestion.recommendedSharingMethod) setType(aiSuggestion.recommendedSharingMethod);
    if (aiSuggestion.suggestedPrice && aiSuggestion.recommendedSharingMethod === 'sell') {
      setPrice(aiSuggestion.suggestedPrice);
    }
    setAiSuggestion(null);
  };

  // Submit Listing
  const handlePublish = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        category,
        description,
        condition,
        type,
        price: type === 'sell' ? Number(price) : 0,
        currency: type === 'sell' ? itemCurrency : undefined,
        lendingDuration: type === 'lend' ? lendingDuration : '',
        exchangePreferences: type === 'exchange' ? exchangePreferences : '',
        quantity,
        location,
        images,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        safetyNotes
      };

      const res = await api.createItem(payload);
      setCreatedItemId(res.item.id);
    } catch (err: any) {
      alert(err.message || 'Failed to publish listing.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (createdItemId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-rekind-dark">
          Your listing is live!
        </h2>
        <p className="text-sm text-rekind-muted max-w-md mx-auto leading-relaxed">
          "{title}" is now visible to people nearby in {location}. We'll notify you as soon as someone requests it or asks a question.
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to={`/item/${createdItemId}`}
            className="px-6 py-3 rounded-xl bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
          >
            View Listing Page
          </Link>
          <Link
            to="/my-activity"
            className="px-6 py-3 rounded-xl bg-rekind-beige text-rekind-brown text-xs font-semibold hover:bg-rekind-sand transition-colors"
          >
            Manage in My Activity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Progress Tracker */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rekind-terracotta">
            Give Things a Second Life
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-rekind-dark">
            List an Item to Share
          </h1>
          <p className="text-xs sm:text-sm text-rekind-muted mt-1">
            Follow five simple steps to prepare an honest, attractive listing for your community.
          </p>
        </div>

        {/* 5-Step Bar */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { num: 1, label: 'Photo' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Method' },
            { num: 4, label: 'AI Review' },
            { num: 5, label: 'Publish' }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                step === s.num
                  ? 'bg-rekind-dark text-white border-rekind-dark shadow-xs'
                  : step > s.num
                  ? 'bg-rekind-beige text-rekind-dark border-rekind-border'
                  : 'bg-white text-rekind-muted border-rekind-border/70 opacity-60'
              }`}
            >
              <span className="text-[10px] font-bold block uppercase tracking-wider opacity-80">
                Step {s.num}
              </span>
              <span className="text-xs font-semibold truncate block">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: UPLOAD ACTUAL PHOTOGRAPH */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-rekind-dark">
              Step 1 — Upload an Actual Photograph
            </h2>
            <p className="text-xs text-rekind-muted mt-1">
              Clear, authentic photos build trust and ensure the recipient knows exactly what condition to expect.
            </p>
          </div>

          {/* Active Image Previews / Upload Drop Area */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-rekind-border bg-rekind-sand/20 group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-md transition-colors"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}

              {/* Upload Additional Photo */}
              <label className="border-2 border-dashed border-rekind-border hover:border-rekind-tan rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-colors bg-rekind-cream/50">
                <Upload className="w-6 h-6 text-rekind-muted mb-1" />
                <span className="text-xs font-semibold text-rekind-dark">Add Photo</span>
                <span className="text-[10px] text-rekind-muted">JPG, PNG up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <label className="border-2 border-dashed border-rekind-border hover:border-rekind-tan rounded-2xl py-12 px-6 flex flex-col items-center justify-center cursor-pointer text-center transition-colors bg-rekind-cream/40 space-y-2 block">
              <div className="w-12 h-12 rounded-xl bg-rekind-beige flex items-center justify-center text-rekind-brown mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rekind-dark">Click to upload or drag & drop item photograph</p>
                <p className="text-xs text-rekind-muted mt-0.5">JPEG, PNG, or WebP up to 5MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}

          {/* Step 1 Actions */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (images.length === 0) {
                  alert('Please upload at least one photograph of your item to continue.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors flex items-center gap-2"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DESCRIBE THE ITEM */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-rekind-dark">
              Step 2 — Describe the Item
            </h2>
            <p className="text-xs text-rekind-muted mt-1">
              Provide honest details so people know the condition, edition, or size.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Stewart Calculus: Early Transcendentals (8th Edition)"
                className="w-full p-3 bg-white border border-rekind-border rounded-xl text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Description & Notes *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail what is included, any cosmetic wear, and why you are passing it on..."
                className="w-full p-3 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-rekind-tan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Pickup Location / Campus *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. North Campus & Hostel C"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Search Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="calculus, textbook, stem, math"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-rekind-dark mb-1">
                Safe Meetup Notes
              </label>
              <input
                type="text"
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                placeholder="e.g. Can meet outside Central Campus Library in daylight"
                className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-rekind-border/70">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!title.trim()) {
                  alert('Please enter an item title.');
                  return;
                }
                setStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors flex items-center gap-2"
            >
              <span>Continue to Sharing Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CHOOSE A SHARING METHOD */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-rekind-dark">
              Step 3 — Choose a Sharing Method
            </h2>
            <p className="text-xs text-rekind-muted mt-1">
              REKIND prioritizes giving and community sharing, while also supporting affordable selling.
            </p>
          </div>

          {/* 4 Method Selectable Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Donate */}
            <div
              onClick={() => setType('donate')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                type === 'donate'
                  ? 'border-rekind-dark bg-rekind-beige/50 shadow-xs'
                  : 'border-rekind-border hover:border-rekind-tan bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rekind-dark text-rekind-sand flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                {type === 'donate' && <Check className="w-5 h-5 text-rekind-dark font-bold" />}
              </div>
              <h3 className="font-heading font-bold text-base text-rekind-dark">Donate (Free)</h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Give the item away completely free. Highest community impact and fastest rehoming.
              </p>
            </div>

            {/* Lend */}
            <div
              onClick={() => setType('lend')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                type === 'lend'
                  ? 'border-rekind-dark bg-rekind-beige/50 shadow-xs'
                  : 'border-rekind-border hover:border-rekind-tan bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rekind-espresso text-rekind-sand flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                {type === 'lend' && <Check className="w-5 h-5 text-rekind-dark font-bold" />}
              </div>
              <h3 className="font-heading font-bold text-base text-rekind-dark">Lend (Borrow)</h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Let someone borrow it for a defined period (e.g. calculator or textbook for the semester).
              </p>
            </div>

            {/* Exchange */}
            <div
              onClick={() => setType('exchange')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                type === 'exchange'
                  ? 'border-rekind-dark bg-rekind-beige/50 shadow-xs'
                  : 'border-rekind-border hover:border-rekind-tan bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rekind-brown text-white flex items-center justify-center">
                  <Repeat className="w-5 h-5" />
                </div>
                {type === 'exchange' && <Check className="w-5 h-5 text-rekind-dark font-bold" />}
              </div>
              <h3 className="font-heading font-bold text-base text-rekind-dark">Exchange (Swap)</h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Swap this item for another useful item you currently need.
              </p>
            </div>

            {/* Sell */}
            <div
              onClick={() => setType('sell')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                type === 'sell'
                  ? 'border-rekind-dark bg-rekind-beige/50 shadow-xs'
                  : 'border-rekind-border hover:border-rekind-tan bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#9A634B] text-white flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                {type === 'sell' && <Check className="w-5 h-5 text-rekind-dark font-bold" />}
              </div>
              <h3 className="font-heading font-bold text-base text-rekind-dark">Affordable Sale</h3>
              <p className="text-xs text-rekind-muted leading-relaxed">
                Set a modest, friendly second-hand price to recover part of the item's value.
              </p>
            </div>

          </div>

          {/* Dynamic Inputs Based on Selection */}
          <div className="p-4 rounded-xl bg-rekind-cream border border-rekind-border/70 space-y-3">
            {type === 'donate' && (
              <p className="text-xs text-rekind-brown font-medium">
                🎁 Listing as a free donation will mark the price as $0.00 and flag it on the "Available for Free" community showcase.
              </p>
            )}

            {type === 'lend' && (
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  Expected Borrowing Duration *
                </label>
                <input
                  type="text"
                  value={lendingDuration}
                  onChange={(e) => setLendingDuration(e.target.value)}
                  placeholder="e.g. 2 weeks, or until finals week in December"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                />
              </div>
            )}

            {type === 'exchange' && (
              <div>
                <label className="block text-xs font-semibold text-rekind-dark mb-1">
                  What kind of items are you looking to receive in swap? *
                </label>
                <input
                  type="text"
                  value={exchangePreferences}
                  onChange={(e) => setExchangePreferences(e.target.value)}
                  placeholder="e.g. Engineering mathematics textbook, study stool, or chemistry lab kit"
                  className="w-full p-2.5 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm"
                />
              </div>
            )}

            {type === 'sell' && (
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1.5">
                    Listing Currency *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setItemCurrency('INR');
                        if (price === 10) setPrice(150);
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        itemCurrency === 'INR'
                          ? 'border-rekind-dark bg-rekind-dark text-white shadow-xs'
                          : 'border-rekind-border bg-white text-rekind-muted hover:border-rekind-tan'
                      }`}
                    >
                      <span className="text-sm font-bold">₹</span>
                      <span>Indian Rupee (INR)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItemCurrency('USD');
                        if (price === 150) setPrice(10);
                      }}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        itemCurrency === 'USD'
                          ? 'border-rekind-dark bg-rekind-dark text-white shadow-xs'
                          : 'border-rekind-border bg-white text-rekind-muted hover:border-rekind-tan'
                      }`}
                    >
                      <span className="text-sm font-bold">$</span>
                      <span>US Dollar (USD)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rekind-dark mb-1">
                    Affordable Price ({itemCurrency === 'INR' ? '₹ INR' : '$ USD'}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-rekind-muted">
                      {itemCurrency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={itemCurrency === 'INR' ? 100000 : 2000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder={itemCurrency === 'INR' ? 'e.g. 150' : 'e.g. 15'}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-rekind-border rounded-xl text-xs sm:text-sm font-semibold"
                    />
                  </div>
                  <p className="text-[11px] text-rekind-muted mt-1">
                    {itemCurrency === 'INR'
                      ? 'Set a modest, friendly second-hand price in Indian Rupees (₹).'
                      : 'Set a modest, friendly second-hand price in US Dollars ($).'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3 Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-rekind-border/70">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors flex items-center gap-2"
            >
              <span>Continue to AI Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ASSISTANCE */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rekind-border/70 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rekind-terracotta uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Co-Pilot
              </div>
              <h2 className="text-lg font-heading font-bold text-rekind-dark">
                Step 4 — AI Listing Review & Optimization
              </h2>
            </div>
            <button
              onClick={runAiAssistant}
              disabled={aiLoading}
              className="px-4 py-2 rounded-xl bg-rekind-dark text-rekind-sand hover:bg-rekind-espresso text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-rekind-tan" />
              <span>{aiLoading ? 'Analyzing...' : 'Generate AI Suggestions'}</span>
            </button>
          </div>

          <p className="text-xs text-rekind-muted leading-relaxed">
            Our AI assistant can analyze your photo and description to refine your title, improve clarity, categorize appropriately, and generate high-value search tags. All suggestions can be freely accepted or edited before publishing.
          </p>

          {/* AI Suggestion Box */}
          {aiSuggestion ? (
            <div className="p-6 rounded-2xl bg-rekind-cream border border-rekind-tan/60 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rekind-dark flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rekind-terracotta" />
                  AI Suggested Improvements
                </span>
                <button
                  onClick={applyAiSuggestion}
                  className="px-3 py-1.5 rounded-lg bg-rekind-dark text-white text-xs font-semibold hover:bg-rekind-espresso transition-colors"
                >
                  Apply All Suggestions
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-rekind-muted block">Suggested Title:</span>
                  <span className="font-semibold text-rekind-dark">{aiSuggestion.title}</span>
                </div>
                <div>
                  <span className="text-rekind-muted block">Recommended Category:</span>
                  <span className="font-semibold text-rekind-dark">{aiSuggestion.category}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-rekind-muted block">Drafted Description:</span>
                  <p className="text-rekind-dark italic bg-white p-2.5 rounded-lg border border-rekind-border mt-1">
                    "{aiSuggestion.description}"
                  </p>
                </div>
                <div>
                  <span className="text-rekind-muted block">Keywords:</span>
                  <span className="font-medium text-rekind-brown">{aiSuggestion.tags.join(', ')}</span>
                </div>
                <div>
                  <span className="text-rekind-muted block">Recommended Method:</span>
                  <span className="font-semibold text-rekind-dark capitalize">{aiSuggestion.recommendedSharingMethod}</span>
                </div>
              </div>

              {aiSuggestion.similarItems && aiSuggestion.similarItems.length > 0 && (
                <div className="pt-3 border-t border-rekind-border text-xs text-rekind-muted">
                  <span>Similar active listings already nearby: </span>
                  <span className="font-medium text-rekind-dark">
                    {aiSuggestion.similarItems.map((s: any) => s.title).join(' • ')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-rekind-cream/50 border border-rekind-border text-center space-y-2">
              <Sparkles className="w-6 h-6 text-rekind-tan mx-auto" />
              <p className="text-xs font-medium text-rekind-dark">
                Click "Generate AI Suggestions" to let REKIND suggest an optimized title and description, or proceed directly to preview.
              </p>
            </div>
          )}

          {/* Step 4 Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-rekind-border/70">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-2.5 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-semibold hover:bg-rekind-espresso transition-colors flex items-center gap-2"
            >
              <span>Continue to Final Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PREVIEW AND PUBLISH */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-heading font-bold text-rekind-dark">
              Step 5 — Preview and Confirm
            </h2>
            <p className="text-xs text-rekind-muted mt-1">
              Here is how your item will appear to the community. Confirm all details are accurate before publishing.
            </p>
          </div>

          {/* Preview Card */}
          <div className="max-w-sm mx-auto bg-white rounded-card border border-rekind-border overflow-hidden shadow-elevated">
            <div className="aspect-[4/3] bg-rekind-sand/30 relative">
              {images[0] ? (
                <img src={images[0]} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rekind-muted text-xs font-medium">
                  No photo uploaded
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rekind-dark text-white">
                  {type === 'donate' ? 'Free to Keep' :
                   type === 'lend' ? 'Available to Borrow' :
                   type === 'exchange' ? 'Open to Swap' :
                   `${itemCurrency === 'INR' ? '₹' : '$'}${price} • Affordable`}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-white/95 text-rekind-dark rounded">
                  {condition}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-rekind-muted">
                <span className="font-semibold text-rekind-brown">{category}</span>
                <span>{location}</span>
              </div>

              <h3 className="font-heading font-bold text-sm text-rekind-dark line-clamp-2">
                {title || 'Untitled Item'}
              </h3>

              <p className="text-xs text-rekind-muted line-clamp-2">
                {description || 'No description provided.'}
              </p>

              <div className="pt-2 border-t border-rekind-border text-[11px] text-rekind-dark font-medium flex justify-between">
                <span>By {user?.name || 'You'}</span>
                <span>Ready for pickup</span>
              </div>
            </div>
          </div>

          {/* Trust Notice */}
          <div className="p-4 rounded-xl bg-rekind-beige/40 border border-rekind-border text-xs text-rekind-muted space-y-1">
            <span className="font-bold text-rekind-dark block">Transparency Pledge:</span>
            <p>
              Publishing this item makes it available for requests. A listing does not automatically count toward completed community reuse impact metrics until the handover is actually verified.
            </p>
          </div>

          {/* Step 5 Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-rekind-border/70">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 text-xs font-semibold text-rekind-muted hover:text-rekind-dark flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-rekind-dark text-white text-xs sm:text-sm font-bold hover:bg-rekind-espresso transition-colors disabled:opacity-50 flex items-center gap-2 shadow-subtle active:scale-98"
            >
              <Check className="w-4 h-4 text-rekind-tan" />
              <span>{submitting ? 'Publishing Listing...' : 'Confirm & Publish Listing'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
