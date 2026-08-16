import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { fetchDocuments } from '../services/api';

export default function RecentDocuments({ onSelectDoc }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [apiDocs, setApiDocs] = useState(null);

  useEffect(() => {
    async function loadBackendDocs() {
      const data = await fetchDocuments(searchTerm, statusFilter);
      if (data && data.documents && data.documents.length > 0) {
        // Map backend schema to UI format
        const mapped = data.documents.map(d => ({
          id: `DOC-${d.id}`,
          fileName: d.filename,
          fileSize: '1.5 MB',
          fileType: d.document_type === 'pdf' ? 'application/pdf' : 'image/png',
          uploadDate: d.created_at ? new Date(d.created_at).toLocaleString() : '2026-08-08',
          vendorName: d.vendor_name || 'Extracted Vendor',
          invoiceNumber: d.invoice_number || 'INV-001',
          issueDate: d.invoice_date || '2026-08-01',
          dueDate: d.due_date || '2026-08-31',
          currency: 'USD',
          subtotal: d.subtotal || 0,
          taxAmount: d.tax || 0,
          totalAmount: d.total_amount || 0,
          status: d.decision === 'APPROVED' ? 'Approved' : (d.decision === 'REJECTED' ? 'Flagged' : 'Needs Review'),
          confidenceScore: d.confidence_score || 95.0,
          category: 'Operations',
          riskLevel: d.decision === 'APPROVED' ? 'Low Risk' : 'Medium Risk',
          poNumber: 'PO-EXTRACTED',
          lineItems: [
            { description: "Extracted Invoice Line Item", quantity: 1, unitPrice: d.subtotal || d.total_amount, total: d.total_amount, confidence: d.confidence_score }
          ],
          fastApiSchema: d
        }));
        setApiDocs(mapped);
      } else {
        setApiDocs(null);
      }
    }

    const timer = setTimeout(() => {
      loadBackendDocs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const docsToDisplay = apiDocs || SAMPLE_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <section id="recent" style={{ padding: '80px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="glass-pill" style={{ color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)', marginBottom: '10px', display: 'inline-block' }}>
              Audit & Processing Ledger
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Recent <span className="gradient-text">Processed Documents</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '8px 16px',
              width: '260px'
            }}>
              <Search size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input 
                type="text" 
                placeholder="Search vendor, invoice #..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F8FAFC',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              {['All', 'Approved', 'Needs Review'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    background: statusFilter === status ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    border: statusFilter === status ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                    color: statusFilter === status ? '#F8FAFC' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(8, 12, 20, 0.5)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>File / Vendor</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Invoice No</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AI Confidence</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docsToDisplay.length > 0 ? (
                  docsToDisplay.map((doc) => (
                    <tr 
                      key={doc.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onClick={() => onSelectDoc(doc)}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(99, 102, 241, 0.12)',
                            color: '#818CF8',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center'
                          }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#F8FAFC' }}>
                              {doc.vendorName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {doc.fileName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-code)', fontSize: '0.88rem', color: '#38BDF8' }}>
                        {doc.invoiceNumber}
                      </td>

                      <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        {doc.issueDate}
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                        ${doc.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {doc.currency}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '70px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${doc.confidenceScore}%`,
                              height: '100%',
                              background: doc.confidenceScore > 90 ? '#10B981' : '#F59E0B',
                              borderRadius: '3px'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-code)', fontWeight: 600, color: doc.confidenceScore > 90 ? '#34D399' : '#FBBF24' }}>
                            {doc.confidenceScore}%
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge-status ${doc.status === 'Approved' ? 'badge-approved' : 'badge-review'}`}>
                          {doc.status === 'Approved' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          <span>{doc.status}</span>
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onSelectDoc(doc); }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#F8FAFC',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No document records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
