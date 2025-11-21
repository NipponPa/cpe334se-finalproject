'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const result = await signUp(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/'); // Redirect to home after successful sign-up
      }
    } catch (err) {
      setError('An error occurred during sign-up');
      console.error(err);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError('An error occurred during OAuth authentication');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#353131]">
      <div className="w-[400px] bg-[#353131] p-8 rounded-lg shadow-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#FFD966]">Sign up</h1>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <Label htmlFor="username" className="block mb-1 text-[#FFD966]">Username:</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
            />
          </div>
          <div>
            <Label htmlFor="email" className="block mb-1 text-[#FFD966]">Email:</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block mb-1 text-[#FFD966]">Password:</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="block mb-1 text-[#FFD966]">Confirm Password:</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-[#FFD966]"
            />
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full py-2 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold"
            >
              Sign up
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <Link href="/login" className="text-sm text-[#FFD966] hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}