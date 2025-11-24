'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred during authentication');
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
        <h2 className="text-3xl font-bold mb-6 text-center text-[#FFD966]">Log in</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <Label htmlFor="email" className="block mb-1 text-[#FFD966]">Email:</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FFD966] text-black"
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FFD966] text-black"
            />
          </div>
          <div className="text-right mb-2">
            <Link href="/reset-password" className="text-[#FFD966] text-sm hover:underline">forget password?</Link>
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold"
          >
            Log in
          </Button>
        </form>
        <Button
          type="button"
          onClick={() => router.push('/signup')}
          className="w-full py-2 mt-4 bg-transparent border border-[#FFD966] text-[#FFD966] rounded hover:bg-[#FFD966] hover:text-[#353131] font-bold"
        >
          Sign up
        </Button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn('google')}
          className="w-full py-2 mt-4 bg-white text-black rounded flex items-center justify-center font-bold shadow hover:bg-gray-300"
        >
          <span className="mr-2">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}