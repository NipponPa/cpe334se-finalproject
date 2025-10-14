'use client'

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { signIn, signUp, signInWithOAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password)
      } else {
        result = await signIn(email, password)
      }
      
      if (result.error) {
        setError(result.error.message)
      } else {
        router.push('/dashboard') // Redirect to dashboard after login
      }
    } catch (err) {
      setError('An error occurred during authentication')
      console.error(err)
    }
 }

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError('An error occurred during OAuth authentication')
      console.error(err)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? 'Enter your details to create an account'
              : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            variant="link"
            className="w-full"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Button>
          
          <div className="mt-4 w-full">
            <Button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full"
              variant="outline"
            >
              Sign in with Google
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}