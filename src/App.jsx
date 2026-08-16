import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DocumentUpload from './components/DocumentUpload';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import DashboardPreview from './components/DashboardPreview';
import RecentDocuments from './components/RecentDocuments';
import DocumentDrawer from './components/DocumentDrawer';
import ArchitectureModal from './components/ArchitectureModal';
import Footer from './components/Footer';

export default function App() {
  const [selectedDocDrawer, setSelectedDocDrawer] = useState(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  const scrollToUpload = () => {
    const uploadEl = document.getElementById('upload');
    if (uploadEl) {
      uploadEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar 
        onUploadClick={scrollToUpload} 
        onArchClick={() => setIsArchModalOpen(true)} 
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* 1. Hero Section */}
        <Hero onUploadClick={scrollToUpload} />

        {/* 2. Document Upload Suite */}
        <DocumentUpload />

        {/* 3. How It Works Section */}
        <HowItWorks />

        {/* 4. Features Section */}
        <Features onArchClick={() => setIsArchModalOpen(true)} />

        {/* 5. Dashboard Preview Section */}
        <DashboardPreview />

        {/* 6. Recent Documents Table */}
        <RecentDocuments onSelectDoc={(doc) => setSelectedDocDrawer(doc)} />
      </main>

      {/* Footer */}
      <Footer onArchClick={() => setIsArchModalOpen(true)} />

      {/* Document Details Drawer Modal */}
      <DocumentDrawer 
        doc={selectedDocDrawer} 
        onClose={() => setSelectedDocDrawer(null)} 
      />

      {/* Architecture Spec Modal */}
      <ArchitectureModal 
        isOpen={isArchModalOpen} 
        onClose={() => setIsArchModalOpen(false)} 
      />
    </div>
  );
}
