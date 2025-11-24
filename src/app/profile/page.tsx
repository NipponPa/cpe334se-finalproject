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
  const [fullName, setFullName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();

        if (data) {
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
          if (data.full_name) {
            setFullName(data.full_name);
          }
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
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
        {/* Header */}
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

        {/* Single Profile Card */}
        <div className="grid grid-cols-1">
          <Card className="bg-[#4a4747] border-none text-white min-h-[300px]">
            <CardHeader>
              <CardTitle className="text-[#FFDA68] pb-6 pt-1">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT: Profile picture + edit */}
                <div className="flex flex-col items-center lg:w-1/3">
                  <div className="relative">
                    <ProfilePictureDisplay
                      imageUrl={avatarUrl}
                      defaultText={user.email?.split('@')[0] || 'User'}
                      size="xl"
                      className="mb-4"
                    />

                    {/* ตำแหน่งสำหรับปุ่ม / ไอคอนแก้ไขรูปโปรไฟล์ (overlay มุมล่างขวา) */}
                    <div className="absolute bottom-2 right-2">
                      <ProfilePictureUpload
                        onPictureChange={(newUrl) => setAvatarUrl(newUrl)}
                      />
                    </div>
                  </div>

                  {/* แสดง username แบบสั้น ๆ ใต้รูป (ใช้ fullName เป็น username) */}
                  <p className="mt-2 text-center text-lg font-semibold">
                    {fullName || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {user.email}
                  </p>
                </div>

                {/* RIGHT: Profile information */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      User Name
                    </h3>
                    <p className="text-lg">
                      {fullName || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Email
                    </h3>
                    <p className="text-lg">
                      {user.email}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Provider
                    </h3>
                    <p className="text-lg">
                      {user.app_metadata?.provider
                        ? user.app_metadata.provider.charAt(0).toUpperCase() +
                          user.app_metadata.provider.slice(1)
                        : 'Email/Password'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Account Created
                    </h3>
                    <p className="text-lg">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;