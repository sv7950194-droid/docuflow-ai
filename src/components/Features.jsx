import React from 'react';
import { Cpu, ShieldCheck, Brain, Zap, Sliders, Database, ArrowUpRight } from 'lucide-react';

export default function Features({ onArchClick }) {
  const featureList = [
    {
      title: "AI Data Extraction",
      icon: <Cpu size={26} style={{ color: '#06B6D4' }} />,
      desc: "Automatically identifies vendors, invoice numbers, tax breakdowns, line items, and payment terms from unstructured files.",
      highlight: "99.4% Accuracy"
    },
    {
      title: "Automatic Validation",
      icon: <ShieldCheck size={26} style={{ color: '#34D399' }} />,
      desc: "Cross-references purchase orders, verifies tax logic, runs mathematical audits, and detects duplicate document hashes.",
      highlight: "Zero Math Errors"
    },
    {
      title: "Intelligent Decision Making",
      icon: <Brain size={26} style={{ color: '#818CF8' }} />,
      desc: "Scores confidence per field and assigns risk status (Auto-Approve, Pending Review, or Flagged Audit) based on business thresholds.",
      highlight: "Risk Engine"
    },
    {
      title: "Workflow Automation",
      icon: <Zap size={26} style={{ color: '#F59E0B' }} />,
      desc: "Eliminates manual data entry by routing approved invoices directly into ERP databases, accounting systems, and Webhooks.",
      highlight: "Hands-Free"
    },
    {
      title: "Custom Rule Engine",
      icon: <Sliders size={26} style={{ color: '#C084FC' }} />,
      desc: "Define custom spend limits, vendor approval lists, multi-currency conversion rules, and approval escalation hierarchies.",
      highlight: "Configurable"
    },
    {
      title: "Python FastAPI Ready",
      icon: <Database size={26} style={{ color: '#38BDF8' }} />,
      desc: "Built with a clean decoupled schema allowing effortless connection to FastAPI, PyTesseract OCR, and MySQL database backends.",
      highlight: "Hackathon Standard",
      isClickable: true
    }
  ];

  return (
    <section id="features" style={{ padding: '90px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="glass-pill" style={{ color: '#6366F1', borderColor: 'rgba(99, 102, 241, 0.3)', marginBottom: '12px', display: 'inline-block' }}>
            Enterprise Capabilities
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Powered by Next-Gen <span className="gradient-text">Document AI</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Built to scale from simple receipts to multi-million dollar enterprise vendor invoice processing pipelines.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {featureList.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              onClick={item.isClickable ? onArchClick : undefined}
              style={{
                padding: '32px',
                cursor: item.isClickable ? 'pointer' : 'default',
                borderColor: item.isClickable ? 'rgba(56, 189, 248, 0.4)' : undefined,
                background: item.isClickable ? 'rgba(56, 189, 248, 0.05)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {item.icon}
                </div>
                <span className="glass-pill" style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                  {item.highlight}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.title}</span>
                {item.isClickable && <ArrowUpRight size={18} style={{ color: '#38BDF8' }} />}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
