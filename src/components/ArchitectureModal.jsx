import React from 'react';
import { X, Server, Database, Cpu, Layers, ArrowRight, Code, ShieldCheck } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '36px', maxWidth: '850px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <div className="glass-pill" style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)', marginBottom: '8px', display: 'inline-block' }}>
              Hackathon Architecture Spec
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Full-Stack System <span className="gradient-text">Integration Plan</span>
            </h3>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F8FAFC',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          This frontend is decoupled with strict JSON schema definitions so that the Python backend can be connected cleanly. Below is the multi-tier pipeline design:
        </p>

        {/* 4 Block Visual Architecture Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ color: '#818CF8', marginBottom: '8px' }}><Layers size={28} style={{ margin: '0 auto' }} /></div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>1. Frontend</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>React + Vite + UI</span>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ color: '#38BDF8', marginBottom: '8px' }}><Server size={28} style={{ margin: '0 auto' }} /></div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>2. REST API</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Python FastAPI</span>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ color: '#C084FC', marginBottom: '8px' }}><Cpu size={28} style={{ margin: '0 auto' }} /></div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>3. OCR & AI</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PaddleOCR + LLM</span>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ color: '#34D399', marginBottom: '8px' }}><Database size={28} style={{ margin: '0 auto' }} /></div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>4. Database</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MySQL Relational</span>
          </div>

        </div>

        {/* API Endpoint Specs Code Box */}
        <div style={{ background: '#070B14', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#CBD5E1' }}>
          <div style={{ color: '#38BDF8', fontWeight: 600, marginBottom: '8px' }}>
            # FastAPI Target Endpoint Structure:
          </div>
          <div>POST /api/v1/documents/process</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Multipart Form-Data: file (PDF/PNG/JPG) <br />
            Response: Extracted JSON with line_items, confidence_score, and automated approval decision.
          </div>
        </div>

      </div>
    </div>
  );
}
