'use client'
import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowThankYou(true);
      setEmail('');
      // Auto hide the thank you message after 5 seconds
      setTimeout(() => setShowThankYou(false), 5000);
    }
  };

  return (
    <>
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-6 flex justify-between items-center">
          <p>© 2024 Bloom. All rights reserved.</p>
          <button 
            onClick={() => setIsAdminModalOpen(true)}
            className="text-gray-600 hover:underline"
          >
            Admin Access
          </button>
        </div>
      </footer>

      <AdminLoginModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* ... your existing newsletter input ... */}
      </form>

      {/* Thank you popup */}
      {showThankYou && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <p className="text-sm">Thanks for subscribing! Continue shopping</p>
        </div>
      )}
    </>
  );
} 