import React from 'react';
import { UploadCloud, FileText, Cpu, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Document",
      icon: <UploadCloud size={24} style={{ color: '#06B6D4' }} />,
      desc: "Ingest invoices, receipts, and multi-page PDFs via web upload, email hook, or REST API.",
      badge: "Ingestion"
    },
    {
      num: "02",
      title: "Extract Information",
      icon: <FileText size={24} style={{ color: '#38BDF8' }} />,
      desc: "Advanced multi-modal OCR decomposes document layouts, table rows, and key-value metadata.",
      badge: "OCR & Vision"
    },
    {
      num: "03",
      title: "AI Analysis",
      icon: <Cpu size={24} style={{ color: '#6366F1' }} />,
      desc: "LLM contextual understanding scores field confidence, categorizes expenses, and checks fraud risk.",
      badge: "LLM Intelligence"
    },
    {
      num: "04",
      title: "Validation",
      icon: <CheckCircle2 size={24} style={{ color: '#8B5CF6' }} />,
      desc: "Business rules verify line-item math, tax calculations, PO matching, and master vendor registries.",
      badge: "Rule Engine"
    },
    {
      num: "05",
      title: "Automate Workflow",
      icon: <Zap size={24} style={{ color: '#10B981' }} />,
      desc: "Instant auto-approval routes valid invoices directly to MySQL / ERP database with zero human touch.",
      badge: "Automation"
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '90px 0', position: 'relative', background: 'rgba(15, 23, 42, 0.3)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)', marginBottom: '12px', display: 'inline-block' }}>
            Pipeline Architecture
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            How <span className="gradient-text">DocuFlow AI</span> Operates
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            From raw unstructured document ingestion to automated database commit in 5 intelligent steps.
          </p>
        </div>

        {/* 5-Step Visual Flow Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', position: 'relative' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '28px 20px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Step Number & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-code)', color: 'rgba(255, 255, 255, 0.15)' }}>
                    {step.num}
                  </span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '6px', color: 'var(--text-muted)' }}>
                    {step.badge}
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  marginBottom: '16px'
                }}>
                  {step.icon}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#F8FAFC' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>

              {/* Arrow Indicator on step */}
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#06B6D4', fontWeight: 600 }}>
                <span>Phase {idx + 1}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
