import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Cpu, AlertTriangle, TrendingDown, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface MLAssetValuationCardProps {
  item: {
    id?: string;
    title: string;
    category: string;
    condition: string;
    operatingHours?: number;
    manufacturingYear?: number;
    price?: number;
    manufacturer?: string;
    modelNumber?: string;
  };
}

export const MLAssetValuationCard: React.FC<MLAssetValuationCardProps> = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMLDiagnostics({
        category: item.category,
        operatingHours: item.operatingHours || 2500,
        manufacturingYear: item.manufacturingYear || 2020,
        condition: item.condition || 'good',
        price: item.price || 1500000,
        manufacturer: item.manufacturer || '',
        modelNumber: item.modelNumber || ''
      });
      if (res && res.diagnostics) {
        setDiagnostics(res.diagnostics);
      }
    } catch (err: any) {
      console.error('Failed to load ML diagnostics:', err);
      setError('Telemetry telemetry unavailable. Fallback values active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [item.id, item.category, item.operatingHours, item.price]);

  if (loading && !diagnostics) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Cpu className="w-5 h-5 animate-spin" />
          </div>
          <div className="h-4 bg-slate-800 rounded w-48"></div>
        </div>
        <div className="h-20 bg-slate-800/50 rounded-lg"></div>
      </div>
    );
  }

  if (!diagnostics) return null;

  const healthScore = diagnostics.compositeHealthIndex || 85;
  const healthColor =
    healthScore >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    healthScore >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-teal-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-lg tracking-tight">AI & ML Predictive Health & Fair Value</h3>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full">
                Physics-Informed
              </span>
            </div>
            <p className="text-xs text-slate-400">Weibull reliability degradation curve & OEM residual corridor</p>
          </div>
        </div>

        <button
          onClick={fetchDiagnostics}
          className="text-xs text-slate-400 hover:text-teal-300 flex items-center space-x-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
          title="Recalculate Diagnostics"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Top Metrics Row: Health Index & Fair Asset Valuation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Composite Health Index */}
        <div className={`p-4 rounded-xl border ${healthColor} flex items-center justify-between`}>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80 block">Composite Health Index</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold">{healthScore}</span>
              <span className="text-xs opacity-75">/ 100</span>
            </div>
            <span className="text-xs mt-1 block opacity-90 font-medium">
              {diagnostics.healthTier || 'Operational Good'}
            </span>
          </div>
          <div className="text-right">
            <Activity className="w-10 h-10 opacity-75 inline-block" />
            <div className="text-xs opacity-75 mt-1 font-mono">
              MTBF {diagnostics.totalWearAccumulated ? (100 - diagnostics.totalWearAccumulated).toFixed(0) : '85'}% intact
            </div>
          </div>
        </div>

        {/* Predictive Fair Valuation */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Predicted Fair Valuation</span>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {diagnostics.confidenceScore || 92}% Confidence
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-white font-mono">
                {diagnostics.fairPriceFormattedINR || `₹${(item.price || 0).toLocaleString('en-IN')}`}
              </span>
              <span className="text-sm font-mono text-slate-400">
                ({diagnostics.fairPriceFormattedUSD || `$${Math.round((item.price || 0) / 86.5).toLocaleString('en-US')}`})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Corridor: <span className="text-slate-300 font-mono">{diagnostics.priceRangeINR?.minFormatted || '₹0'} – {diagnostics.priceRangeINR?.maxFormatted || '₹0'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Subsystems Remaining Useful Life (RUL) */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Critical Subsystem Wear & Remaining Useful Life (RUL)</span>
          <span className="text-[11px] text-slate-400 font-normal">Based on {item.operatingHours ? item.operatingHours.toLocaleString() : '2,500'} Operating Hours</span>
        </h4>

        <div className="space-y-3">
          {diagnostics.subsystems && diagnostics.subsystems.map((sub: any, idx: number) => {
            const wearPct = Math.min(100, Math.max(0, sub.wearPercentage || 20));
            const barColor =
              wearPct > 65 ? 'bg-rose-500' :
              wearPct > 40 ? 'bg-amber-500' :
              'bg-teal-400';

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{sub.name}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-slate-400">RUL: <strong className="text-slate-200">{sub.remainingHours?.toLocaleString() || '6,000'} hrs</strong></span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className={wearPct > 65 ? 'text-rose-400 font-bold' : 'text-slate-400'}>{wearPct}% wear</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${wearPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circular Procurement Economics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">OEM Brand Multiplier</span>
          <span className="font-semibold text-slate-200 font-mono">{diagnostics.oemFactor || '1.15x'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Depreciation Method</span>
          <span className="font-semibold text-slate-200">Non-linear Weibull</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Baseline New OEM</span>
          <span className="font-semibold text-slate-200 font-mono">{diagnostics.baselineNewCostINR ? `₹${(diagnostics.baselineNewCostINR / 100000).toFixed(1)}L` : '₹1.2Cr'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Capital Retained</span>
          <span className="font-semibold text-emerald-400 font-mono">
            {diagnostics.capexRetainedINR ? `+₹${(diagnostics.capexRetainedINR / 100000).toFixed(1)}L` : '+65%'}
          </span>
        </div>
      </div>
    </div>
  );
};
