import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Code, Copy, Check, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

export default function DocumentDrawer({ doc, onClose }) {
  if (!doc) return null;

  const [activeTab, setActiveTab] = useState('fields'); // 'fields' | 'lines' | 'validation' | 'json'
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(doc.fastApiSchema || doc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '32px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className={`badge-status ${doc.status === 'Approved' ? 'badge-approved' : 'badge-review'}`}>
                {doc.status === 'Approved' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                <span>{doc.status}</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                ID: {doc.id}
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>
              {doc.vendorName}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              File: {doc.fileName} • {doc.fileSize}
            </span>
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

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '24px' }}>
          {[
            { id: 'fields', label: 'Extracted Fields' },
            { id: 'lines', label: `Line Items (${doc.lineItems?.length || 0})` },
            { id: 'validation', label: 'Rules & Validation' },
            { id: 'json', label: 'FastAPI Payload JSON' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                color: activeTab === tab.id ? '#F8FAFC' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Extracted Fields */}
        {activeTab === 'fields' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>VENDOR NAME</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>{doc.vendorName}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>INVOICE NO</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--font-code)' }}>{doc.invoiceNumber}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ISSUE DATE</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{doc.issueDate}</span>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PURCHASE ORDER</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#A5B4FC' }}>{doc.poNumber}</span>
              </div>
            </div>

            {/* Total Financial Summary Card */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '14px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 600, color: '#F8FAFC' }}>${doc.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Tax Amount:</span>
                <span style={{ fontWeight: 600, color: '#F8FAFC' }}>${doc.taxAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, paddingTop: '12px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <span>Total Amount Due:</span>
                <span className="gradient-text">${doc.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {doc.currency}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Line Items */}
        {activeTab === 'lines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {doc.lineItems?.map((item, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F8FAFC' }}>
                    {item.description}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Quantity: {item.quantity} • Unit Price: ${item.unitPrice.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8' }}>
                    ${item.total.toFixed(2)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#34D399', fontFamily: 'var(--font-code)' }}>
                    {item.confidence}% AI match
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Validation Checks */}
        {activeTab === 'validation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {doc.validationChecks?.map((check, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: check.status === 'passed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: check.status === 'passed' ? '#34D399' : '#FBBF24',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    {check.status === 'passed' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#F8FAFC' }}>
                      {check.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {check.detail}
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: check.status === 'passed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: check.status === 'passed' ? '#34D399' : '#FBBF24'
                }}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 4: Raw FastAPI JSON */}
        {activeTab === 'json' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                MySQL DB / FastAPI REST Schema JSON
              </span>
              <button 
                onClick={copyJson}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: copied ? '#34D399' : '#F8FAFC',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre style={{
              background: '#070B14',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-code)',
              color: '#A5B4FC',
              overflowX: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxHeight: '300px'
            }}>
              {JSON.stringify(doc.fastApiSchema || doc, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
