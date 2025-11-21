import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationBarProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  notificationCount = 0,
  onNotificationClick,
}) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <nav className="bg-[#373434] text-[#FFDA68] p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/">PJ Pakjim Planner</Link>
      </div>

      {/* Desktop and Tablet: Date Controls & User Info */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Date Controls */}
        <div className="hidden lg:flex items-center space-x-2">
          <button onClick={onPrevMonth} className="hover:bg-[#FFD966] hover:text-black rounded-full p-2 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="w-36 text-center">{monthYear}</span>
          <button onClick={onNextMonth} className="hover:bg-[#FFD966] hover:text-black rounded-full p-2 transition-colors">
            <ChevronRight size={20} />
          </button>
          <button onClick={onGoToToday} className="bg-[#FFD966] text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors">
            Today
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={onNotificationClick} className="relative p-2 hover:bg-[#FFD966] hover:text-black rounded-full transition-colors">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User Info Dropdown */}
        {user && (
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2">
              <span>{user.email}</span>
              {user.user_metadata?.username && <span>({user.user_metadata.username})</span>}
              <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-10">
                <div className="px-4 py-2 text-sm text-gray-700">{user.email}</div>
                {user.user_metadata?.username && <div className="px-4 py-2 text-sm text-gray-700">{user.user_metadata.username}</div>}
                <div className="border-t border-gray-200"></div>
                <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile: Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu (Slide-out or Dropdown) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#373434] p-4 md:hidden z-20">
          {/* Date Controls */}
           <div className="flex items-center justify-center space-x-2 mb-4">
            <button onClick={onPrevMonth} className="hover:bg-[#FFD966] hover:text-black rounded-full p-2 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="w-36 text-center">{monthYear}</span>
            <button onClick={onNextMonth} className="hover:bg-[#FFD966] hover:text-black rounded-full p-2 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={onGoToToday} className="w-full bg-[#FFD966] text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors mb-4">
            Today
          </button>

          {/* Notifications */}
          <button onClick={onNotificationClick} className="flex items-center justify-between w-full p-2 mb-2 hover:bg-[#4a4747] rounded">
            <span>Notifications</span>
            {notificationCount > 0 && (
               <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          
          {/* User Info */}
          {user && (
            <div className="border-t border-gray-500 pt-2">
                <div className="px-2 py-1 text-sm">{user.email}</div>
                {user.user_metadata?.username && <div className="px-2 py-1 text-sm">{user.user_metadata.username}</div>}
                <button onClick={signOut} className="block w-full text-left px-2 py-2 text-sm hover:bg-[#4a4747] rounded">
                    Sign Out
                </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;