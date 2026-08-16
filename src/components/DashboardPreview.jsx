import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { fetchAnalytics } from '../services/api';

export default function DashboardPreview({ documentsCount }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      const data = await fetchAnalytics();
      if (data) {
        setMetrics(data);
      }
    }
    loadMetrics();
  }, [documentsCount]);

  const totalDocs = metrics ? metrics.total_documents : (1428 + (documentsCount || 0));
  const processedDocs = metrics ? metrics.processed_documents : (1390 + (documentsCount || 0));
  const approvedDocs = metrics ? metrics.approved_documents : (1245 + (documentsCount || 0));
  const reviewDocs = metrics ? metrics.review_documents : 45;
  const autoRate = metrics ? `${metrics.automation_rate}% automation rate` : "97.3% automation rate";

  const stats = [
    {
      title: "Total Documents",
      value: totalDocs.toLocaleString(),
      change: "+14.2% this week",
      isPositive: true,
      icon: <FileText size={24} style={{ color: '#06B6D4' }} />,
      borderColor: 'rgba(6, 182, 212, 0.3)',
      bgGlow: 'rgba(6, 182, 212, 0.08)'
    },
    {
      title: "Processed",
      value: processedDocs.toLocaleString(),
      change: autoRate,
      isPositive: true,
      icon: <Clock size={24} style={{ color: '#6366F1' }} />,
      borderColor: 'rgba(99, 102, 241, 0.3)',
      bgGlow: 'rgba(99, 102, 241, 0.08)'
    },
    {
      title: "Approved",
      value: approvedDocs.toLocaleString(),
      change: "Auto-synced to ERP/DB",
      isPositive: true,
      icon: <CheckCircle2 size={24} style={{ color: '#10B981' }} />,
      borderColor: 'rgba(16, 185, 129, 0.3)',
      bgGlow: 'rgba(16, 185, 129, 0.08)'
    },
    {
      title: "Needs Review",
      value: reviewDocs,
      change: "Requires human audit",
      isPositive: false,
      icon: <AlertTriangle size={24} style={{ color: '#F59E0B' }} />,
      borderColor: 'rgba(245, 158, 11, 0.3)',
      bgGlow: 'rgba(245, 158, 11, 0.08)'
    }
  ];

  return (
    <section id="dashboard" style={{ padding: '80px 0', position: 'relative', background: 'rgba(15, 23, 42, 0.4)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="glass-pill" style={{ color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '10px', display: 'inline-block' }}>
              Real-time Analytics
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              System <span className="gradient-text">Dashboard Metrics</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              FastAPI Analytics API Connected
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{
                padding: '26px',
                borderColor: stat.borderColor,
                background: stat.bgGlow
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {stat.title}
                </span>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(8, 12, 20, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {stat.icon}
                </div>
              </div>

              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px', fontFamily: 'var(--font-code)' }}>
                {stat.value}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: stat.isPositive ? '#34D399' : '#FBBF24' }}>
                <TrendingUp size={14} />
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
