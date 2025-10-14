'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card' // Removed CardDescription
import Link from 'next/link' // Import Link for "forget password?"

export default function LoginPage() {
  const [username, setUsername] = useState('') // Changed email to username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn, signUp, signInWithOAuth } = useAuth()

  const handleSignIn = async (e: React.FormEvent) => { // Renamed handleSubmit to handleSignIn
    e.preventDefault()
    setError('')
    
    try {
      // Assuming username is used as email for authentication
      const result = await signIn(username, password)
      
      if (result.error) {
        setError(result.error.message)
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred during authentication')
      console.error(err)
    }
  }

  const handleSignUp = async () => { // Added handleSignUp function
    setError('');
    try {
      const result = await signUp(username, password);
      if (result.error) {
        setError(result.error.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred during sign up');
      console.error(err);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError('An error occurred during OAuth authentication')
      console.error(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#373434]"> {/* Dark background color */}
      <Card className="max-w-sm mx-auto bg-transparent border-none shadow-none text-[#FFDA68] min-w-[300px]"> {/* Transparent card, no border/shadow, text color, adjusted width */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-4xl text-center text-[#FFDA68] font-bold"> {/* "Log in" title, yellow color */}
            Log in
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
          
          <form onSubmit={handleSignIn} className="space-y-4"> {/* Changed onSubmit to handleSignIn */}
            <div>
              <Label htmlFor="username" className="text-[#FFDA68]">Username:</Label> {/* Changed label to Username */}
              <Input
                id="username"
                type="text" // Changed type to text for username
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 bg-white text-black border-gray-300" // White background for input
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#FFDA68]">Password:</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-white text-black border-gray-300" // White background for input
              />
            </div>

            <div className="text-right text-sm">
              <Link href="/forget-password" className="text-[#F2C94C] hover:underline"> {/* Forget password link */}
                forget password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full bg-[#F2C94C] text-black hover:bg-[#e0b83c] font-bold"> {/* Log in button */}
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2"> {/* Adjusted gap for buttons */}
          <Button
            type="button"
            onClick={handleSignUp} // Sign up button
            variant="outline"
            className="w-full border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black font-bold"
          >
            Sign up
          </Button>
          
          <div className="mt-4 w-full">
            <Button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2" // Google Sign In button
              variant="outline"
            >
              <img src="/google.svg" alt="Google icon" className="h-5 w-5" /> {/* Google icon */}
              Sign in with Google
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}