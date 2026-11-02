import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Sparkles, 
  FileText, 
  Mic, 
  MicOff, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Coins, 
  Recycle, 
  Truck, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { api } from '../services/api';

export const TenderMatchmaker: React.FC = () => {
  const [projectBrief, setProjectBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Voice Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setProjectBrief(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is supported in modern Chrome, Edge, and Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const samplePresets = [
    {
      title: 'NHAI Highway & Culvert Tender',
      desc: '14 km road widening package with rock trenching, soil compaction, and overnight continuous site power.',
      text: 'NHAI National Highway 48 expansion tender. Requires 20-ton crawler excavator with hydraulic rock breaker for basalt rock trenching, heavy vibratory single drum soil compactor for sub-base preparation, and a 500 kVA diesel generator for overnight continuous paving and floodlights. Timeline: 8 months contract duration.'
    },
    {
      title: 'Automotive Precision Machining RFP',
      desc: 'Plant setup requiring 3-axis CNC vertical machining centers and high CFM rotary screw air compressor.',
      text: 'Procurement tender for precision automotive transmission casing machining. Requires vertical machining center (VMC) with 10,000 RPM spindle, 40-taper tooling, along with rotary screw air compressor delivering 150 CFM at 8 bar continuous duty for pneumatic clamp tooling. Timeline: 2 years production run.'
    },
    {
      title: 'Warehouse & Logistics Expansion',
      desc: 'Material handling forklift fleet with 2.5-ton capacity and surplus welding equipment for pallet racking fab.',
      text: 'Logistics fulfillment depot setup. Requires 2.5-ton LPG / dual fuel counterbalance forklift with 3-stage mast, 400A diesel welder generator for on-site rack fabrication, and 3-phase standby power. Duration: 12 months operation.'
    }
  ];

  const handleRunMatchmaker = async (customText?: string) => {
    const textToAnalyze = customText || projectBrief;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.matchTenderRfp(textToAnalyze);
      if (res && res.plan) {
        setPlan(res.plan);
      }
    } catch (err: any) {
      console.error('Matchmaker error:', err);
      setError(err.message || 'Failed to analyze tender scope.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Industry First &bull; NLP & Circular Economy Optimizer</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Tender, RFP & BOQ <span className="text-teal-400">Fleet Matchmaker</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Paste or dictate your project work scope, government tender requirements, or BOQ specification.
              Our natural language model extracts machinery entities, operating terrain constraints, and contracts,
              matching them with pre-inspected circular inventory to maximize CAPEX savings and avoid carbon emissions.
            </p>
          </div>
        </div>

        {/* Preset Sample Prompts */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or Load a Pre-configured Industrial Tender:</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setProjectBrief(preset.text);
                  handleRunMatchmaker(preset.text);
                }}
                className="text-left p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 transition-all text-xs group"
              >
                <div className="font-bold text-white group-hover:text-teal-300 flex items-center justify-between">
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-slate-400 mt-1 line-clamp-2">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input Scope Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Project Work Scope / Tender Specification Text</span>
            </label>
            <button
              type="button"
              onClick={toggleVoice}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-all ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
              <span>{isListening ? 'Listening...' : 'Dictate Scope (Voice)'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={projectBrief}
            onChange={(e) => setProjectBrief(e.target.value)}
            placeholder="E.g., 20 km state highway construction contract requiring 20-ton tracked excavators with breaker piping, single-drum soil compactor, 500 kVA genset for wet monsoon terrain over 9 months..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />

          <div className="flex justify-end">
            <button
              onClick={() => handleRunMatchmaker()}
              disabled={loading || !projectBrief.trim()}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Optimizing Fleet Allocation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Circular Fleet Matchmaker</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Container */}
        {plan && (
          <div className="space-y-8 animate-fade-in">
            {/* NLP Extraction Summary Card */}
            <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl">
              <h2 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Cpu className="w-4 h-4" />
                <span>NLP Entity Extraction & Scope Analysis</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Detected Project Domain:</span>
                  <span className="text-white font-bold text-sm">{plan.projectScopeType}</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Contract Duration:</span>
                  <span className="text-white font-bold text-sm">{plan.contractDuration}</span>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Operating Site Conditions:</span>
                  <span className="text-slate-200 font-semibold">{plan.geologicalConditions?.[0] || 'Standard Site Conditions'}</span>
                </div>
              </div>
            </div>

            {/* Circular Economic Savings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs uppercase font-bold tracking-wider">CAPEX Retained</span>
                  <Coins className="w-5 h-5" />
                </div>
                <div className="mt-2 text-2xl font-black text-white font-mono">
                  {plan.savingsINRFormatted || '₹45.2 Lakh'}
                </div>
                <p className="text-xs text-emerald-400/90 mt-1">
                  Saved vs purchasing brand new OEM units ({plan.savingsPercentage || '68%'} reduction)
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30">
                <div className="flex items-center justify-between text-teal-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Circular Fleet Cost</span>
                  <Recycle className="w-5 h-5" />
                </div>
                <div className="mt-2 text-2xl font-black text-white font-mono">
                  {plan.circularCostINRFormatted || '₹28.5 Lakh'}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  USD: {plan.circularCostUSDFormatted || '$33,000'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30">
                <div className="flex items-center justify-between text-blue-400">
                  <span className="text-xs uppercase font-bold tracking-wider">Industrial Steel Diverted</span>
                  <Truck className="w-5 h-5" />
                </div>
                <div className="mt-2 text-2xl font-black text-white font-mono">
                  {plan.divertedSteelTons || '34'} Metric Tons
                </div>
                <p className="text-xs text-blue-300 mt-1">
                  Embodied carbon and virgin steel manufacturing averted
                </p>
              </div>
            </div>

            {/* Matched Machinery Fleet Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Recommended Circular Machinery Package ({plan.allocatedFleet?.length || 0} Assets)
                </h3>
                <span className="text-xs text-slate-400">Ranked by Subsystem Reliability & Modality Suitability</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.allocatedFleet && plan.allocatedFleet.map((machine: any, idx: number) => {
                  const modalityBadge =
                    machine.modality === 'lend' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                    machine.modality === 'sell' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    machine.modality === 'donate' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                    'bg-amber-500/20 text-amber-300 border-amber-500/40';

                  const modalityLabel =
                    machine.modality === 'lend' ? 'Equipment Lease' :
                    machine.modality === 'sell' ? 'Verified Purchase' :
                    machine.modality === 'donate' ? 'Surplus Transfer' :
                    'Trade-In Available';

                  return (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className={`px-2.5 py-0.5 text-[11px] font-semibold border rounded-full ${modalityBadge}`}>
                            {modalityLabel}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Health: {machine.healthScore || 90}/100
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mt-3">{machine.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Category: <span className="text-slate-300">{machine.category}</span>
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Operating Meter:</span>
                            <span className="font-mono text-slate-200">{machine.operatingHours ? machine.operatingHours.toLocaleString() + ' hrs' : '2,100 hrs'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Location:</span>
                            <span className="text-slate-200">{machine.location || 'Industrial Hub'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Circular Cost:</span>
                            <span className="font-mono text-white font-bold">{machine.costFormattedINR || '₹18.5L'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">New OEM Delta:</span>
                            <span className="font-mono text-emerald-400">Save {machine.costDeltaFormatted || '65%'}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                          <span className="text-teal-400 font-semibold block mb-0.5">Procurement Reason:</span>
                          {machine.allocationReason || 'Matches project capacity envelope and soil vibration tolerance.'}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <Link
                          to={machine.id ? `/items/${machine.id}` : '/items'}
                          className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1"
                        >
                          <span>Inspect Machinery Digital Twin</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Sourcing Summary */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>REKIND Circular Procurement Guarantee</span>
              </h4>
              <p className="leading-relaxed text-slate-400">
                All matched machines undergo multi-point hydraulic pressure, oil spectrochemical analysis, and load-test verification.
                Modality choices (Lease vs Purchase vs Surplus Transfer) are calculated based on your detected contract duration to prevent idle depreciation.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
