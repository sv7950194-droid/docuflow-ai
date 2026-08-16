const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function uploadDocument(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend API upload error:", error.message);
    throw error;
  }
}

export async function processDocument(documentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Processing failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend API process error:", error.message);
    throw error;
  }
}

export async function fetchAnalytics() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return await response.json();
  } catch (error) {
    console.warn("Analytics API offline, using dashboard stats fallback.");
    return null;
  }
}

export async function fetchDocuments(search = '', status = '') {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (status && status !== 'All') query.append('status', status.toUpperCase().replace(' ', '_'));

    const response = await fetch(`${API_BASE_URL}/api/documents?${query.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch documents");
    return await response.json();
  } catch (error) {
    console.warn("Documents API offline, using fallback list.");
    return null;
  }
}

export async function fetchDocumentById(documentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`);
    if (!response.ok) throw new Error("Failed to fetch document details");
    return await response.json();
  } catch (error) {
    console.warn("Document details API offline.");
    return null;
  }
}
