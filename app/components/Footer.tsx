'use client'
import { useState } from 'react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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
    </>
  );
} 