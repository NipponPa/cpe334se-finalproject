'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import ProfilePictureDisplay from '@/components/profile/ProfilePictureDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ProfilePictureDisplay 
                  imageUrl={avatarUrl} 
                  defaultText={user.email?.split('@')[0] || 'User'} 
                  size="xl" 
                  className="mb-4"
                />
                <p className="text-center text-gray-600 mb-4">
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
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="text-lg font-mono text-gray-700">{user.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Provider</h3>
                  <p className="text-lg">
                    {user.app_metadata?.provider ? 
                      user.app_metadata.provider.charAt(0).toUpperCase() + user.app_metadata.provider.slice(1) : 
                      'Email/Password'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                  <p className="text-lg">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Manage Connected Accounts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;