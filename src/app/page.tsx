'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">Secure Protected Area</p>
          
          <Card className="w-full max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left w-full max-w-md">
                  <p className="text-gray-600"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                  <p className="text-gray-600"><span className="font-semibold">User ID:</span> {user?.id || 'N/A'}</p>
                  <p className="text-gray-600"><span className="font-semibold">Authentication Status:</span> Active</p>
                  {user?.created_at && (
                    <p className="text-gray-600"><span className="font-semibold">Account Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 pt-4">
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
                <Button>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-gray-500 text-sm">
            <p>This is a protected page. Only authenticated users can access this content.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
