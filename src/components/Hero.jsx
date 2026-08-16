import React, { useState, useEffect } from 'react';
import { UploadCloud, Play, Sparkles, CheckCircle, ShieldCheck, Zap, ArrowRight, FileCheck } from 'lucide-react';

export default function Hero({ onUploadClick }) {
  const [activeScanIndex, setActiveScanIndex] = useState(0);

  const scanDemos = [
    { vendor: "Acme Corp", total: "$13,500.00", status: "Auto-Approved", confidence: "98.8%", po: "PO-77491" },
    { vendor: "Global Logistics", total: "$4,536.54", status: "Needs Review", confidence: "84.2%", po: "PO-88102" },
    { vendor: "CyberShield Inc", total: "$9,612.00", status: "Auto-Approved", confidence: "97.4%", po: "PO-66120" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScanIndex((prev) => (prev + 1) % scanDemos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentScan = scanDemos[activeScanIndex];

  return (
    <section style={{ paddingTop: '140px', paddingBottom: '70px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Hero Content */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }} className="glass-pill">
              <Sparkles size={14} style={{ color: '#06B6D4' }} />
              <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Hackathon Showcase • Intelligent Document Processing</span>
            </div>

            <h1 style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
              Automate Your Document Workflow with <span className="gradient-text">AI</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '540px' }}>
              Transform unstructured invoices, receipts, and multi-page PDFs into structured data instantly with multi-modal AI extraction, automated validation, and decision engine integration.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={onUploadClick} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <UploadCloud size={20} />
                <span>Upload Document</span>
              </button>

              <a href="#how-it-works" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                <Play size={18} style={{ color: '#38BDF8' }} />
                <span>See How It Works</span>
              </a>
            </div>

            {/* Quick feature callouts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} style={{ color: '#10B981' }} />
                <span>99.4% Extraction Accuracy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <Zap size={16} style={{ color: '#F59E0B' }} />
                <span>&lt; 1.8s Processing Time</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Live Interactive Pipeline Preview Widget */}
          <div style={{ position: 'relative' }}>
            {/* Background Glow */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)',
              filter: 'blur(40px)',
              zIndex: 0
            }} />

            <div className="glass-card" style={{ position: 'relative', zIndex: 1, padding: '24px', overflow: 'hidden' }}>
              {/* Top Card Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>Live AI Document Parser</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-code)', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                  FastAPI REST Engine Active
                </span>
              </div>

              {/* Simulated Scanner Visual */}
              <div style={{
                position: 'relative',
                height: '240px',
                background: 'rgba(8, 12, 20, 0.9)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                overflow: 'hidden'
              }}>
                <div className="radar-line" />

                {/* Simulated Document Content Lines */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCheck size={18} style={{ color: '#6366F1' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentScan.vendor}</span>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: currentScan.status === 'Auto-Approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: currentScan.status === 'Auto-Approved' ? '#34D399' : '#FBBF24'
                    }}>
                      {currentScan.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>EXTRACTED TOTAL</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{currentScan.total}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>CONFIDENCE SCORE</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38BDF8' }}>{currentScan.confidence}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Extracted Chips */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    PO: {currentScan.po}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    Tax Audit: Passed
                  </span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: '#CBD5E1', padding: '4px 10px', borderRadius: '6px' }}>
                    Duplicate Hash: Clean
                  </span>
                </div>
              </div>

              {/* Bottom Pipeline Progress Bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>AI Extraction Workflow</span>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>100% Validated</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #06B6D4, #6366F1, #10B981)', borderRadius: '3px' }} />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
