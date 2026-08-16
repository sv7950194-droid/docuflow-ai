import React from 'react';
import { FileText, ShieldCheck, Code2 } from 'lucide-react';

export default function Footer({ onArchClick }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(8, 12, 20, 0.9)', padding: '60px 0 30px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand Col */}
          <div>
            <div className="logo-group" style={{ marginBottom: '14px' }}>
              <div className="logo-badge" style={{ width: '36px', height: '36px' }}>
                <FileText size={18} />
              </div>
              <div className="logo-title" style={{ fontSize: '1.2rem' }}>
                DocuFlow<span className="gradient-text">.AI</span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.6 }}>
              Intelligent Document Processing & Automation System. Extract, validate, and process invoices with AI precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '14px' }}>Product</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <li><a href="#upload" style={{ color: 'inherit', textDecoration: 'none' }}>Document Upload</a></li>
              <li><a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How It Works</a></li>
              <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
              <li><a href="#dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard Preview</a></li>
            </ul>
          </div>

          {/* Integration Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '14px' }}>Architecture</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <li><button onClick={onArchClick} style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>FastAPI Spec</button></li>
              <li><span style={{ color: 'var(--text-dim)' }}>PaddleOCR / PyTesseract</span></li>
              <li><span style={{ color: 'var(--text-dim)' }}>MySQL Relational Schema</span></li>
            </ul>
          </div>

          {/* Hackathon Badge */}
          <div>
            <div className="glass-card" style={{ padding: '16px', borderColor: 'rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '4px' }}>
                <ShieldCheck size={16} />
                <span>Hackathon Edition</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Built with a modular frontend layer ready for Python AI backend integration.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          <div>
            © 2026 DocuFlow AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Engineered for Hackathon Innovation</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
