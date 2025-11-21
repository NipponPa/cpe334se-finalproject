import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ChevronLeft, ChevronRight, Menu, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProfilePictureDisplay from '@/components/profile/ProfilePictureDisplay';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Fetch user's avatar URL when user changes
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } else {
        setAvatarUrl(null); // Reset when user logs out
      }
    };
    
    fetchUserAvatar();
  }, [user]);

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
              <ProfilePictureDisplay
                imageUrl={avatarUrl}
                defaultText={user.email?.split('@')[0] || 'User'}
                size="sm"
              />
              {/* <span>{user.email}</span> */}
              {user.user_metadata?.username && <span>({user.user_metadata.username})</span>}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-black z-10">
                <div className="flex items-center space-x-2 px-4 py-2">
                  <ProfilePictureDisplay
                    imageUrl={avatarUrl}
                    defaultText={user.email?.split('@')[0] || 'User'}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-medium">{user.email}</div>
                    {user.user_metadata?.username && <div className="text-xs text-gray-500">{user.user_metadata.username}</div>}
                  </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <Link href="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
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
                <div className="flex items-center space-x-2 px-2 py-1">
                  <ProfilePictureDisplay
                    imageUrl={avatarUrl}
                    defaultText={user.email?.split('@')[0] || 'User'}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm">{user.email}</div>
                    {user.user_metadata?.username && <div className="text-xs">{user.user_metadata.username}</div>}
                  </div>
                </div>
                <Link href="/profile" className="block w-full text-left px-2 py-2 text-sm hover:bg-[#4a4747] rounded" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
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