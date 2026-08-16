import React from 'react';
import { FileText, Cpu, Code2, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onUploadClick, onArchClick }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <a href="#" className="logo-group">
          <div className="logo-badge">
            <FileText size={22} className="pulse-glow" />
          </div>
          <div>
            <div className="logo-title">
              DocuFlow<span className="gradient-text">.AI</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginTop: '-4px' }}>
              Intelligent Automation
            </span>
          </div>
        </a>

        <nav>
          <ul className="nav-links">
            <li><a href="#upload" className="nav-link">Document Processing</a></li>
            <li><a href="#how-it-works" className="nav-link">How It Works</a></li>
            <li><a href="#features" className="nav-link">Features</a></li>
            <li><a href="#dashboard" className="nav-link">Dashboard</a></li>
            <li><a href="#recent" className="nav-link">Audit Records</a></li>
          </ul>
        </nav>

        <div className="nav-actions">
          <button 
            onClick={onArchClick}
            className="glass-pill" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer', 
              color: '#38BDF8',
              borderColor: 'rgba(56, 189, 248, 0.3)',
              background: 'rgba(56, 189, 248, 0.08)'
            }}
          >
            <Code2 size={14} />
            <span>FastAPI Architecture</span>
          </button>

          <button onClick={onUploadClick} className="btn-primary">
            <span>Upload Document</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
