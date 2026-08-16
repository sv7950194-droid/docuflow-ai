export const SAMPLE_DOCUMENTS = [
  {
    id: "DOC-2026-9842",
    fileName: "AcmeCorp_Invoice_INV-9842.pdf",
    fileSize: "1.8 MB",
    fileType: "application/pdf",
    uploadDate: "2026-08-08 09:42 AM",
    vendorName: "Acme Corporation",
    invoiceNumber: "INV-9842",
    issueDate: "2026-08-01",
    dueDate: "2026-08-31",
    currency: "USD",
    subtotal: 12500.00,
    taxAmount: 1000.00,
    totalAmount: 13500.00,
    status: "Approved",
    confidenceScore: 98.8,
    category: "Software Subscriptions",
    riskLevel: "Low Risk",
    poNumber: "PO-77491",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "Enterprise Cloud Infrastructure - Q3", quantity: 1, unitPrice: 10000.00, total: 10000.00, confidence: 99.2 },
      { description: "Priority Technical Support SLA (24/7)", quantity: 1, unitPrice: 2500.00, total: 2500.00, confidence: 98.4 }
    ],
    validationChecks: [
      { name: "Vendor Tax ID Match", status: "passed", detail: "Verified against Master Vendor DB" },
      { name: "Purchase Order Matching", status: "passed", detail: "PO-77491 matched 100%" },
      { name: "Math & Tax Audit", status: "passed", detail: "Subtotal + Tax = Total verified" },
      { name: "Duplicate Detection", status: "passed", detail: "No matching invoice hash found" }
    ],
    fastApiSchema: {
      document_id: "DOC-2026-9842",
      extracted_data: {
        vendor_name: "Acme Corporation",
        invoice_number: "INV-9842",
        total_amount: 13500.00,
        tax_amount: 1000.00,
        currency: "USD",
        po_number: "PO-77491"
      },
      ai_confidence: 0.988,
      decision: "AUTO_APPROVED",
      processed_at: "2026-08-08T09:42:15Z"
    }
  },
  {
    id: "DOC-2026-9843",
    fileName: "TechLogistics_Freight_TL-401.pdf",
    fileSize: "2.4 MB",
    fileType: "application/pdf",
    uploadDate: "2026-08-08 08:15 AM",
    vendorName: "Global Tech Logistics",
    invoiceNumber: "TL-401",
    issueDate: "2026-08-05",
    dueDate: "2026-08-20",
    currency: "USD",
    subtotal: 4200.50,
    taxAmount: 336.04,
    totalAmount: 4536.54,
    status: "Needs Review",
    confidenceScore: 84.2,
    category: "Logistics & Shipping",
    riskLevel: "Medium Risk",
    poNumber: "PO-88102",
    paymentTerms: "Net 15",
    lineItems: [
      { description: "Air Freight Forwarding - APAC Corridor", quantity: 3, unitPrice: 1200.00, total: 3600.00, confidence: 91.0 },
      { description: "Customs Inspection & Duty Handling", quantity: 1, unitPrice: 600.50, total: 600.50, confidence: 77.4 }
    ],
    validationChecks: [
      { name: "Vendor Tax ID Match", status: "passed", detail: "Match confirmed" },
      { name: "Purchase Order Matching", status: "warning", detail: "Amount exceeds PO limit by $336.04" },
      { name: "Math & Tax Audit", status: "passed", detail: "Calculations valid" },
      { name: "Duplicate Detection", status: "passed", detail: "Unique invoice" }
    ],
    fastApiSchema: {
      document_id: "DOC-2026-9843",
      extracted_data: {
        vendor_name: "Global Tech Logistics",
        invoice_number: "TL-401",
        total_amount: 4536.54,
        tax_amount: 336.04,
        currency: "USD",
        po_number: "PO-88102"
      },
      ai_confidence: 0.842,
      decision: "PENDING_HUMAN_REVIEW",
      processed_at: "2026-08-08T08:15:22Z"
    }
  },
  {
    id: "DOC-2026-9844",
    fileName: "CyberShield_Security_Renewal.png",
    fileSize: "890 KB",
    fileType: "image/png",
    uploadDate: "2026-08-07 04:30 PM",
    vendorName: "CyberShield Inc",
    invoiceNumber: "CS-9912",
    issueDate: "2026-08-01",
    dueDate: "2026-09-01",
    currency: "USD",
    subtotal: 8900.00,
    taxAmount: 712.00,
    totalAmount: 9612.00,
    status: "Approved",
    confidenceScore: 97.4,
    category: "IT & Security",
    riskLevel: "Low Risk",
    poNumber: "PO-66120",
    paymentTerms: "Net 30",
    lineItems: [
      { description: "SOC2 Compliance Suite License - Annual", quantity: 1, unitPrice: 8900.00, total: 8900.00, confidence: 97.4 }
    ],
    validationChecks: [
      { name: "Vendor Tax ID Match", status: "passed", detail: "Match verified" },
      { name: "Purchase Order Matching", status: "passed", detail: "PO-66120 matched" },
      { name: "Math & Tax Audit", status: "passed", detail: "Exact match" },
      { name: "Duplicate Detection", status: "passed", detail: "Unique file" }
    ],
    fastApiSchema: {
      document_id: "DOC-2026-9844",
      extracted_data: {
        vendor_name: "CyberShield Inc",
        invoice_number: "CS-9912",
        total_amount: 9612.00,
        tax_amount: 712.00,
        currency: "USD",
        po_number: "PO-66120"
      },
      ai_confidence: 0.974,
      decision: "AUTO_APPROVED",
      processed_at: "2026-08-07T16:30:10Z"
    }
  },
  {
    id: "DOC-2026-9845",
    fileName: "OfficeDepot_Supplies_Receipt.jpg",
    fileSize: "620 KB",
    fileType: "image/jpeg",
    uploadDate: "2026-08-07 02:10 PM",
    vendorName: "Office Depot Direct",
    invoiceNumber: "REC-44109",
    issueDate: "2026-08-06",
    dueDate: "2026-08-06",
    currency: "USD",
    subtotal: 450.25,
    taxAmount: 36.02,
    totalAmount: 486.27,
    status: "Approved",
    confidenceScore: 99.1,
    category: "Office Operations",
    riskLevel: "Low Risk",
    poNumber: "N/A (P-Card)",
    paymentTerms: "Immediate",
    lineItems: [
      { description: "Ergonomic Mesh Chairs", quantity: 2, unitPrice: 180.00, total: 360.00, confidence: 99.5 },
      { description: "Recycled Printer Paper (Box of 10)", quantity: 3, unitPrice: 30.08, total: 90.25, confidence: 98.7 }
    ],
    validationChecks: [
      { name: "Vendor Tax ID Match", status: "passed", detail: "Receipt store ID verified" },
      { name: "Purchase Order Matching", status: "passed", detail: "P-Card auto check under $500 threshold" },
      { name: "Math & Tax Audit", status: "passed", detail: "Math accurate" },
      { name: "Duplicate Detection", status: "passed", detail: "Clean" }
    ],
    fastApiSchema: {
      document_id: "DOC-2026-9845",
      extracted_data: {
        vendor_name: "Office Depot Direct",
        invoice_number: "REC-44109",
        total_amount: 486.27,
        tax_amount: 36.02,
        currency: "USD",
        po_number: "P-Card"
      },
      ai_confidence: 0.991,
      decision: "AUTO_APPROVED",
      processed_at: "2026-08-07T14:10:05Z"
    }
  },
  {
    id: "DOC-2026-9846",
    fileName: "UnknownVendor_Hardware_Claim.pdf",
    fileSize: "3.1 MB",
    fileType: "application/pdf",
    uploadDate: "2026-08-06 11:50 AM",
    vendorName: "Apex Hardware Systems",
    invoiceNumber: "HS-00921",
    issueDate: "2026-08-04",
    dueDate: "2026-08-18",
    currency: "USD",
    subtotal: 18400.00,
    taxAmount: 1472.00,
    totalAmount: 19872.00,
    status: "Needs Review",
    confidenceScore: 78.5,
    category: "Hardware Hardware",
    riskLevel: "High Risk",
    poNumber: "PO-UNMATCHED",
    paymentTerms: "Net 15",
    lineItems: [
      { description: "Rack Server Chassis Unit X9", quantity: 2, unitPrice: 9200.00, total: 18400.00, confidence: 78.5 }
    ],
    validationChecks: [
      { name: "Vendor Tax ID Match", status: "warning", detail: "New vendor - pending W-9 confirmation" },
      { name: "Purchase Order Matching", status: "failed", detail: "PO-UNMATCHED not found in ERP system" },
      { name: "Math & Tax Audit", status: "passed", detail: "Math accurate" },
      { name: "Duplicate Detection", status: "passed", detail: "No duplicate found" }
    ],
    fastApiSchema: {
      document_id: "DOC-2026-9846",
      extracted_data: {
        vendor_name: "Apex Hardware Systems",
        invoice_number: "HS-00921",
        total_amount: 19872.00,
        tax_amount: 1472.00,
        currency: "USD",
        po_number: null
      },
      ai_confidence: 0.785,
      decision: "REJECTED_FLAGGED_FOR_AUDIT",
      processed_at: "2026-08-06T11:50:40Z"
    }
  }
];

export const PIPELINE_STEPS = [
  { id: 1, title: "Upload Document", icon: "UploadCloud", desc: "PDF, PNG, JPG ingestion & security pre-scan", statusMsg: "Receiving document payload..." },
  { id: 2, title: "Extract Information", icon: "FileText", desc: "OCR layout decomposition & table parser", statusMsg: "Running OCR & reading text matrices..." },
  { id: 3, title: "AI Analysis", icon: "Cpu", desc: "Multi-modal LLM entity & confidence scoring", statusMsg: "Analyzing line items, vendor tags & context..." },
  { id: 4, title: "Validation", icon: "CheckCircle2", desc: "PO matching, tax verification & duplicate checks", statusMsg: "Cross-referencing ERP database rules..." },
  { id: 5, title: "Intelligent Decision", icon: "Zap", desc: "Auto-approve, human review, or fraud flag", statusMsg: "Evaluating risk engine parameters..." },
  { id: 6, title: "Automated Processing", icon: "Database", desc: "MySQL record insert & Webhook dispatch", statusMsg: "Syncing to FastAPI database endpoint!" }
];

export const DEMO_PRESETS = [
  {
    fileName: "Sample_TechCorp_Invoice.pdf",
    fileSize: "1.2 MB",
    fileType: "application/pdf",
    vendorName: "TechCorp Global Solutions",
    invoiceNumber: "INV-2026-881",
    issueDate: "2026-08-08",
    dueDate: "2026-09-07",
    currency: "USD",
    subtotal: 5400.00,
    taxAmount: 432.00,
    totalAmount: 5832.00,
    confidenceScore: 98.9,
    status: "Approved",
    category: "SaaS Software",
    poNumber: "PO-99410",
    lineItems: [
      { description: "AI Processing API Quotas (Tier 3)", quantity: 100, unitPrice: 40.00, total: 4000.00, confidence: 99.1 },
      { description: "Dedicated Vector DB Cluster Node", quantity: 1, unitPrice: 1400.00, total: 1400.00, confidence: 98.7 }
    ]
  },
  {
    fileName: "Sample_AWS_Cloud_Bill.png",
    fileSize: "940 KB",
    fileType: "image/png",
    vendorName: "Amazon Web Services (AWS)",
    invoiceNumber: "AWS-902194",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    currency: "USD",
    subtotal: 3120.00,
    taxAmount: 249.60,
    totalAmount: 3369.60,
    confidenceScore: 99.5,
    status: "Approved",
    category: "Cloud Hosting",
    poNumber: "PO-10294",
    lineItems: [
      { description: "EC2 Compute Instances (us-east-1)", quantity: 1, unitPrice: 1950.00, total: 1950.00, confidence: 99.8 },
      { description: "S3 Storage & Data Transfer Out", quantity: 1, unitPrice: 1170.00, total: 1170.00, confidence: 99.2 }
    ]
  }
];
