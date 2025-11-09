'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Trash2 } from 'lucide-react';

const ProfileDropDown = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAccount = () => {
    // Implement delete account functionality
    alert('Delete account functionality not implemented yet.');
  };

  return (
    <div className="relative ml-4">
      <button onClick={() => setIsOpen(!isOpen)}>
        <User />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex flex-col items-center">
            <User size={48} />
            <p className="mt-2 font-bold">Hi, {user?.user_metadata.username || user?.email}</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center bg-white p-2 rounded">
              <User size={20} className="mr-2" />
              <span>{user?.user_metadata.username || 'user123'}</span>
            </div>
            <div className="flex items-center bg-white p-2 rounded mt-2">
              <LogOut size={20} className="mr-2" />
              <span>{user?.email}</span>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={signOut} className="w-full bg-white text-black p-2 rounded flex items-center justify-center">
              <LogOut size={20} className="mr-2" />
              Sign Out
            </button>
            <button onClick={handleDeleteAccount} className="w-full bg-red-500 text-white p-2 rounded mt-2 flex items-center justify-center">
              <Trash2 size={20} className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;