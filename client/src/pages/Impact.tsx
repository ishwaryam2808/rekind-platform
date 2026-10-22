import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Leaf, 
  DollarSign, 
  Users, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import type { ImpactMetrics, TransferRecord } from '../types';

export const Impact: React.FC = () => {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [categoryStats, setCategoryStats] = useState<Record<string, any>>({});
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [auditLedger, setAuditLedger] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await api.getImpact();
        setMetrics(res.metrics);
        setCategoryStats(res.categoryStats || {});
        setTypeCounts(res.typeCounts || {});
        setAuditLedger(res.auditLedger || []);
      } catch (err) {
        console.error('Failed to load impact metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadImpact();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="h-8 w-48 bg-rekind-sand/50 rounded mx-auto" />
        <div className="h-4 w-96 bg-rekind-sand/40 rounded mx-auto" />
      </div>
    );
  }

  const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verifiable Database Audit Ledger</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-rekind-dark tracking-tight">
          Transparent <span className="editorial-italic font-normal text-rekind-brown">Community Impact.</span>
        </h1>
        <p className="text-sm sm:text-base text-rekind-muted leading-relaxed">
          Every number below is calculated strictly from confirmed completed item handovers logged in the REKIND community ledger. No synthetic estimates, no fake claims.
        </p>
      </div>

      {/* 4 Main Verified Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-rekind-border p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-rekind-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Circulated Items</span>
            <Package className="w-5 h-5 text-rekind-espresso" />
          </div>
          <span className="block text-4xl font-heading font-extrabold text-rekind-dark">
            {metrics ? metrics.totalTransfers : 0}
          </span>
          <p className="text-xs text-rekind-muted">
            Textbooks, tools, calculators, and home essentials kept in active use.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-rekind-border p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-rekind-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Waste Diverted</span>
            <Leaf className="w-5 h-5 text-rekind-terracotta" />
          </div>
          <span className="block text-4xl font-heading font-extrabold text-rekind-dark">
            {metrics ? `${metrics.wasteDivertedKg} kg` : '0 kg'}
          </span>
          <p className="text-xs text-rekind-muted">
            Actual physical goods saved from municipal and campus dumpsters.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-rekind-border p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-rekind-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Community Savings</span>
            <DollarSign className="w-5 h-5 text-emerald-700" />
          </div>
          <span className="block text-4xl font-heading font-extrabold text-rekind-dark">
            ${metrics ? metrics.economicValueSaved : 0}
          </span>
          <p className="text-xs text-rekind-muted">
            Calculated replacement cost saved by local students and families.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-rekind-border p-6 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-rekind-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Emissions Avoided</span>
            <Sparkles className="w-5 h-5 text-rekind-brown" />
          </div>
          <span className="block text-4xl font-heading font-extrabold text-rekind-dark">
            {metrics ? `${metrics.co2DivertedKg} kg` : '0 kg'}
          </span>
          <p className="text-xs text-rekind-muted">
            CO₂ equivalent manufacturing and transport emissions prevented.
          </p>
        </div>

      </div>

      {/* Sharing Methods Breakdown & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Sharing Method Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle">
          <div>
            <h3 className="font-heading font-bold text-lg text-rekind-dark">
              Transfers by Sharing Method
            </h3>
            <p className="text-xs text-rekind-muted mt-1">
              Distribution of completed handovers across our four core circular pathways.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Free Donations', count: typeCounts.donate || 0, color: 'bg-rekind-dark' },
              { label: 'Lending & Borrowing', count: typeCounts.lend || 0, color: 'bg-rekind-espresso' },
              { label: 'Item Exchanges', count: typeCounts.exchange || 0, color: 'bg-rekind-brown' },
              { label: 'Affordable Sales', count: typeCounts.sell || 0, color: 'bg-[#9A634B]' }
            ].map((m) => {
              const pct = (metrics && metrics.totalTransfers > 0) ? Math.round((m.count / metrics.totalTransfers) * 100) : 0;
              return (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-rekind-dark">{m.label}</span>
                    <span className="text-rekind-muted">{m.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-rekind-sand/40 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-rekind-cream border border-rekind-border text-xs text-rekind-brown font-medium leading-relaxed">
            {metrics && metrics.totalTransfers > 0 ? (
              <span>🌿 Over <strong>{Math.round((( (typeCounts.donate || 0) + (typeCounts.lend || 0) + (typeCounts.exchange || 0) ) / metrics.totalTransfers) * 100)}%</strong> of all community transfers on REKIND take place with zero money changing hands.</span>
            ) : (
              <span>🌿 The community ledger is initialized and clean. Once members complete and verify item transfers, circularity distributions will calculate here.</span>
            )}
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle">
          <div>
            <h3 className="font-heading font-bold text-lg text-rekind-dark">
              Category Impact Breakdown
            </h3>
            <p className="text-xs text-rekind-muted mt-1">
              Breakdown of diverted landfill weight and replacement value by category.
            </p>
          </div>

          <div className="divide-y divide-rekind-border/60">
            {Object.entries(categoryStats).length > 0 ? (
              Object.entries(categoryStats).map(([cat, stat]: [string, any]) => (
                <div key={cat} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-rekind-dark block">{cat}</span>
                    <span className="text-rekind-muted">{stat.count} {stat.count === 1 ? 'item' : 'items'} transferred</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rekind-dark block">{stat.weightKg.toFixed(1)} kg diverted</span>
                    <span className="text-rekind-brown font-medium">~${stat.valueSaved} saved</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-rekind-muted py-4">No category transfers recorded yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Verifiable Chronological Transfer Audit Ledger */}
      <div className="bg-white rounded-2xl border border-rekind-border p-6 sm:p-8 space-y-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rekind-border/70 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Audit Trail</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-rekind-dark">
              Verified Completed Transfer Ledger
            </h3>
          </div>
          <p className="text-xs text-rekind-muted max-w-sm">
            Auditable log of completed community handovers, verifying genuine weight and replacement cost saved.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rekind-border text-rekind-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Verification ID</th>
                <th className="pb-3 font-semibold">Item Transferred</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold text-right">Diverted</th>
                <th className="pb-3 font-semibold text-right">Value Saved</th>
                <th className="pb-3 font-semibold text-right">Date Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rekind-border/50">
              {auditLedger.length > 0 ? (
                auditLedger.map((tx) => (
                  <tr key={tx.id} className="hover:bg-rekind-cream/40 transition-colors">
                    <td className="py-3.5 font-mono text-rekind-muted">{tx.id}</td>
                    <td className="py-3.5 font-semibold text-rekind-dark">{tx.itemTitle}</td>
                    <td className="py-3.5 text-rekind-muted">{tx.category}</td>
                    <td className="py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded bg-rekind-sand/40 text-rekind-brown font-medium">
                        {tx.sharingType}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-medium text-rekind-dark">{tx.weightKg} kg</td>
                    <td className="py-3.5 text-right font-semibold text-emerald-700">${tx.valueSaved}</td>
                    <td className="py-3.5 text-right text-rekind-muted">
                      {new Date(tx.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-rekind-muted">
                    No completed transfers recorded yet. The verified audit ledger updates automatically as community members confirm item handovers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-rekind-dark text-rekind-sand text-center space-y-4 max-w-3xl mx-auto">
        <h3 className="text-2xl font-heading font-bold text-white">
          Add your item to the community ledger.
        </h3>
        <p className="text-xs sm:text-sm text-rekind-sand/80 max-w-xl mx-auto">
          Every textbook passed on, calculator lent, and jacket swapped prevents manufacturing emissions and keeps landfill tons out of our local soil.
        </p>
        <div className="pt-2">
          <Link
            to="/post-item"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rekind-tan text-rekind-dark text-xs sm:text-sm font-bold hover:bg-white transition-colors"
          >
            <span>Share an Item Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
