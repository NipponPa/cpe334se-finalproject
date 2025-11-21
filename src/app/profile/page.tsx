'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import ProfilePictureDisplay from '@/components/profile/ProfilePictureDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const ProfilePage = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
      }
      setLoading(false);
    };
    
    fetchUserAvatar();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#353131]">
        <p className="text-[#FFDA68]">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#353131]">
        <p className="text-[#FFDA68]">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#353131] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#FFDA68]">Your Profile</h1>
          <Link href="/">
            <Button 
              variant="outline" 
              className="bg-[#FFD966] text-black hover:bg-yellow-400 border-none"
            >
              Back to Calendar
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-[#4a4747] border-none text-white">
              <CardHeader>
                <CardTitle className="text-[#FFDA68]">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ProfilePictureDisplay 
                    imageUrl={avatarUrl} 
                    defaultText={user.email?.split('@')[0] || 'User'} 
                    size="xl" 
                    className="mb-4"
                  />
                  <p className="text-center text-gray-300 mb-4">
                    {avatarUrl ? 'Click below to change your profile picture' : 'Click below to add a profile picture'}
                  </p>
                  
                  <ProfilePictureUpload 
                    onPictureChange={(newUrl) => setAvatarUrl(newUrl)} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-[#4a4747] border-none text-white mb-6">
              <CardHeader>
                <CardTitle className="text-[#FFDA68]">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Email</h3>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">User ID</h3>
                    <p className="text-lg font-mono text-gray-300">{user.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Provider</h3>
                    <p className="text-lg">
                      {user.app_metadata?.provider ? 
                        user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1) : 
                        'Email/Password'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Account Created</h3>
                    <p className="text-lg">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#4a4747] border-none text-white">
              <CardHeader>
                <CardTitle className="text-[#FFDA68]">Account Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full bg-[#FFD966] text-black hover:bg-yellow-400 border-none">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full bg-[#FFD966] text-black hover:bg-yellow-400 border-none">
                    Manage Connected Accounts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;