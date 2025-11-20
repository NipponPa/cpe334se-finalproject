'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import Calendar from '@/components/calendar/Calendar';

export default function Home() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#353131] py-8 px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#FFD966]">Welcome</h1>
          
          <div className="w-full space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-left w-full">
                <p className="text-[#FFD966]"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                <p className="text-[#FFD966]"><span className="font-semibold">User ID:</span> {user?.id || 'N/A'}</p>
                <p className="text-[#FFD966]"><span className="font-semibold">Authentication Status:</span> Active</p>
                {user?.created_at && (
                  <p className="text-[#FFD966]"><span className="font-semibold">Account Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handleSignOut}
                className="w-full py-2 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold"
              >
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-[#FFD966] text-sm text-center">
            <p>This is a protected page. Only authenticated users can access this content.</p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-8">
          <Calendar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
