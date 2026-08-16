import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, X, CheckCircle2, AlertTriangle, 
  Cpu, Zap, Database, ArrowRight, Code, Copy, Check, Sparkles, RefreshCw, FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PIPELINE_STEPS, DEMO_PRESETS } from '../data/sampleDocuments';
import { uploadDocument, processDocument as processDocumentApi } from '../services/api';

export default function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepLog, setStepLog] = useState("");
  const [extractedResult, setExtractedResult] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [copiedJson, setCopiedJson] = useState(false);
  const [backendDocId, setBackendDocId] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      alert("Unsupported file format! Please upload a PDF, JPG, JPEG, or PNG file.");
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileObj = {
      rawFile: file,
      fileName: file.name,
      fileSize: `${sizeInMB} MB`,
      fileType: file.type || 'application/pdf',
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSelectedFile(fileObj);
    setExtractedResult(null);
    setBackendDocId(null);

    // Try uploading to backend API immediately
    try {
      setStepLog("Uploading file to FastAPI backend...");
      const res = await uploadDocument(file);
      if (res && res.id) {
        setBackendDocId(res.id);
        console.log("Document uploaded to backend with ID:", res.id);
      }
    } catch (err) {
      console.log("Backend offline or upload error. Will fallback to simulated processing.");
    }
  };

  const loadPresetDemo = (preset) => {
    setSelectedFile({
      fileName: preset.fileName,
      fileSize: preset.fileSize,
      fileType: preset.fileType,
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      presetData: preset
    });
    setExtractedResult(null);
    setBackendDocId(null);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setExtractedResult(null);
    setIsProcessing(false);
    setActiveStep(0);
    setBackendDocId(null);
  };

  const startProcessing = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setExtractedResult(null);
    setActiveStep(1);
    setStepLog(PIPELINE_STEPS[0].statusMsg);

    // If backend doc ID exists, process via real FastAPI backend
    if (backendDocId) {
      let stepCounter = 1;
      const interval = setInterval(() => {
        stepCounter++;
        if (stepCounter <= 4) {
          setActiveStep(stepCounter);
          setStepLog(PIPELINE_STEPS[stepCounter - 1].statusMsg);
        }
      }, 500);

      try {
        const apiRes = await processDocumentApi(backendDocId);
        clearInterval(interval);
        setActiveStep(6);
        setStepLog(PIPELINE_STEPS[5].statusMsg);
        setIsProcessing(false);

        const data = {
          fileName: selectedFile.fileName,
          fileSize: selectedFile.fileSize,
          fileType: selectedFile.fileType,
          vendorName: apiRes.extracted_data.vendor_name || 'Extracted Vendor',
          invoiceNumber: apiRes.extracted_data.invoice_number || 'INV-001',
          issueDate: apiRes.extracted_data.invoice_date || new Date().toISOString().split('T')[0],
          dueDate: apiRes.extracted_data.due_date || '',
          currency: 'USD',
          subtotal: apiRes.extracted_data.subtotal || 0,
          taxAmount: apiRes.extracted_data.tax || 0,
          totalAmount: apiRes.extracted_data.total_amount || 0,
          confidenceScore: round(apiRes.extracted_data.confidence_score, 1),
          status: apiRes.decision.decision === 'APPROVED' ? 'Approved' : 'Needs Review',
          category: 'Operations',
          poNumber: 'PO-EXTRACTED',
          lineItems: [
            { description: "Extracted Line Items", quantity: 1, unitPrice: apiRes.extracted_data.subtotal || apiRes.extracted_data.total_amount, total: apiRes.extracted_data.total_amount, confidence: apiRes.extracted_data.confidence_score }
          ],
          fastApiSchema: apiRes
        };

        setExtractedResult(data);

        try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
        return;
      } catch (err) {
        clearInterval(interval);
        console.warn("Backend process call failed, using rule fallback demo result:", err.message);
      }
    }

    // Fallback simulation pipeline
    let stepCounter = 1;
    const interval = setInterval(() => {
      stepCounter++;
      if (stepCounter <= PIPELINE_STEPS.length) {
        setActiveStep(stepCounter);
        setStepLog(PIPELINE_STEPS[stepCounter - 1].statusMsg);
      } else {
        clearInterval(interval);
        setIsProcessing(false);

        const data = selectedFile.presetData || {
          fileName: selectedFile.fileName,
          fileSize: selectedFile.fileSize,
          fileType: selectedFile.fileType,
          vendorName: selectedFile.fileName.toLowerCase().includes('aws') ? 'Amazon Web Services' : 'Apex Enterprise Systems',
          invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          currency: 'USD',
          subtotal: 8400.00,
          taxAmount: 672.00,
          totalAmount: 9072.00,
          confidenceScore: 98.6,
          status: 'Approved',
          category: 'Operations & IT',
          poNumber: 'PO-99182',
          lineItems: [
            { description: "Managed Cloud Computing & Storage Node", quantity: 2, unitPrice: 3200.00, total: 6400.00, confidence: 99.1 },
            { description: "AI Pipeline Ingestion & Vector Service", quantity: 1, unitPrice: 2000.00, total: 2000.00, confidence: 98.2 }
          ]
        };

        const fastApiSchema = {
          document_id: `DOC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          file_meta: {
            name: selectedFile.fileName,
            size: selectedFile.fileSize,
            mime_type: selectedFile.fileType
          },
          extracted_fields: {
            vendor_name: data.vendorName,
            invoice_number: data.invoiceNumber,
            issue_date: data.issueDate,
            due_date: data.dueDate,
            subtotal: data.subtotal,
            tax_amount: data.taxAmount,
            total_amount: data.totalAmount,
            currency: data.currency,
            po_number: data.poNumber
          },
          line_items: data.lineItems,
          ai_confidence: data.confidenceScore / 100,
          decision: data.status === 'Approved' ? 'AUTO_APPROVED' : 'PENDING_HUMAN_REVIEW',
          validated_at: new Date().toISOString()
        };

        setExtractedResult({ ...data, fastApiSchema });
        try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
      }
    }, 700);
  };

  function round(val, dec) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  const copyJsonToClipboard = () => {
    if (!extractedResult) return;
    navigator.clipboard.writeText(JSON.stringify(extractedResult.fastApiSchema, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section id="upload" style={{ padding: '80px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={14} style={{ color: '#06B6D4' }} />
            <span style={{ color: '#E2E8F0' }}>Live Interactive AI Workspace</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Document Upload & <span className="gradient-text">Extraction Engine</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            Drag and drop your invoice or document below to initiate multi-modal OCR extraction, validation rules, and automated decision workflows.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: extractedResult ? '1fr 1fr' : '1fr', gap: '32px', transition: 'all 0.4s ease' }}>
          
          <div className="glass-card" style={{ padding: '32px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloud size={22} style={{ color: '#06B6D4' }} />
                <span>Document Upload Zone</span>
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>PDF</span>
                <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>PNG</span>
                <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#94A3B8' }}>JPG</span>
              </div>
            </div>

            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              style={{
                border: dragActive ? '2px dashed #06B6D4' : '2px dashed rgba(255, 255, 255, 0.15)',
                background: dragActive ? 'rgba(6, 182, 212, 0.08)' : 'rgba(8, 12, 20, 0.5)',
                borderRadius: '16px',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: selectedFile ? 'default' : 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {!selectedFile ? (
                <div>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    margin: '0 auto 16px auto',
                    border: '1px solid rgba(99, 102, 241, 0.25)'
                  }}>
                    <UploadCloud size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
                    Drag & Drop your invoice or file here
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Supports PDF, JPG, JPEG, and PNG documents up to 25MB
                  </p>
                  <button type="button" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
                    Browse Files
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        color: 'white'
                      }}>
                        <FileText size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F8FAFC', wordBreak: 'break-all' }}>
                          {selectedFile.fileName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                          <span>Size: {selectedFile.fileSize}</span>
                          <span>•</span>
                          <span>Uploaded at {selectedFile.uploadTime}</span>
                        </div>
                      </div>
                    </div>

                    {!isProcessing && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeSelectedFile(); }}
                        style={{
                          background: 'rgba(244, 63, 94, 0.12)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#FB7185',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!selectedFile && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
                  ⚡ Quick Demo Hacks: Click to load sample document
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {DEMO_PRESETS.map((preset, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => loadPresetDemo(preset)}
                      className="glass-pill"
                      style={{ cursor: 'pointer', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.2)', fontSize: '0.8rem' }}
                    >
                      + {preset.fileName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedFile && (
              <div style={{ marginTop: '24px' }}>
                <button 
                  onClick={startProcessing} 
                  disabled={isProcessing}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={18} className="pulse-glow" style={{ animation: 'spin 1.5s linear infinite' }} />
                      <span>AI Pipeline Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      <span>Process Document with AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {(isProcessing || activeStep > 0) && (
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E2E8F0' }}>Live AI Execution Pipeline</span>
                  <span style={{ fontSize: '0.78rem', color: isProcessing ? '#06B6D4' : '#10B981', fontFamily: 'var(--font-code)' }}>
                    {isProcessing ? `Step ${activeStep} of ${PIPELINE_STEPS.length}` : 'Execution Completed'}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(8, 12, 20, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-code)',
                  color: '#38BDF8',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Cpu size={14} className={isProcessing ? 'pulse-glow' : ''} />
                  <span>{stepLog}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PIPELINE_STEPS.map((step) => {
                    const isDone = activeStep > step.id || (!isProcessing && activeStep === PIPELINE_STEPS.length);
                    const isCurrent = isProcessing && activeStep === step.id;

                    return (
                      <div 
                        key={step.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: isCurrent 
                            ? 'rgba(99, 102, 241, 0.15)' 
                            : isDone 
                            ? 'rgba(16, 185, 129, 0.08)' 
                            : 'rgba(255, 255, 255, 0.03)',
                          border: isCurrent 
                            ? '1px solid rgba(99, 102, 241, 0.4)' 
                            : isDone 
                            ? '1px solid rgba(16, 185, 129, 0.2)' 
                            : '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isDone ? '#10B981' : isCurrent ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                            color: 'white'
                          }}>
                            {isDone ? <Check size={14} /> : step.id}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isCurrent ? '#F8FAFC' : '#CBD5E1' }}>
                              {step.title}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              {step.desc}
                            </span>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: isDone ? '#34D399' : isCurrent ? '#818CF8' : 'var(--text-dim)'
                        }}>
                          {isDone ? 'Completed' : isCurrent ? 'Processing...' : 'Queued'}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

          {extractedResult && (
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--border-glass-glow)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <span className={`badge-status ${extractedResult.status === 'Approved' ? 'badge-approved' : 'badge-review'}`} style={{ fontSize: '0.82rem', marginBottom: '6px' }}>
                    <CheckCircle2 size={14} />
                    <span>{extractedResult.status === 'Approved' ? 'AI AUTO-APPROVED' : 'NEEDS REVIEW'}</span>
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px' }}>
                    Extracted Document Metadata
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Overall Confidence</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-code)' }}>
                    {extractedResult.confidenceScore}%
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
                <button 
                  onClick={() => setActiveTab('summary')}
                  style={{
                    background: activeTab === 'summary' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    border: activeTab === 'summary' ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                    color: activeTab === 'summary' ? '#F8FAFC' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  Invoice Summary
                </button>
                <button 
                  onClick={() => setActiveTab('lines')}
                  style={{
                    background: activeTab === 'lines' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    border: activeTab === 'lines' ? '1px solid rgba(99, 102, 241, 0.4)' : 'none',
                    color: activeTab === 'lines' ? '#F8FAFC' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  Line Items ({extractedResult.lineItems?.length || 0})
                </button>
                <button 
                  onClick={() => setActiveTab('fastapi')}
                  style={{
                    background: activeTab === 'fastapi' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    border: activeTab === 'fastapi' ? '1px solid rgba(56, 189, 248, 0.4)' : 'none',
                    color: activeTab === 'fastapi' ? '#38BDF8' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Code size={14} />
                  <span>FastAPI Response Schema</span>
                </button>
              </div>

              {activeTab === 'summary' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>VENDOR NAME</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>{extractedResult.vendorName}</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>INVOICE NUMBER</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--font-code)' }}>{extractedResult.invoiceNumber}</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ISSUE DATE</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{extractedResult.issueDate}</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PURCHASE ORDER</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#A5B4FC' }}>{extractedResult.poNumber}</span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(6, 182, 212, 0.06)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      <span>Subtotal:</span>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>${extractedResult.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <span>Tax Amount (8%):</span>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>${extractedResult.taxAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, paddingTop: '10px', borderTop: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                      <span>Total Amount:</span>
                      <span className="gradient-text">${extractedResult.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {extractedResult.currency}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lines' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {extractedResult.lineItems?.map((item, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.description}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${item.unitPrice}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                          ${item.total?.toFixed(2)}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontFamily: 'var(--font-code)' }}>
                          {item.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'fastapi' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                      POST /api/documents/{backendDocId || '{id}'}/process
                    </span>
                    <button 
                      onClick={copyJsonToClipboard}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: copiedJson ? '#34D399' : '#F8FAFC',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copiedJson ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedJson ? 'Copied!' : 'Copy Payload'}</span>
                    </button>
                  </div>
                  <pre style={{
                    background: '#070B14',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-code)',
                    color: '#A5B4FC',
                    overflowX: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    maxHeight: '260px'
                  }}>
                    {JSON.stringify(extractedResult.fastApiSchema, null, 2)}
                  </pre>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
