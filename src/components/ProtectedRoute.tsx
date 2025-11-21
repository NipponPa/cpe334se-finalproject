'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CardContent, CardTitle } from '@/components/ui/card'

type ProtectedRouteProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center bg-[#373434]">
      <div className="w-full max-w-xs p-8 space-y-6">
        <div className="text-center">
          <CardTitle className="text-3xl font-bold text-[#FFDA68]">Authentication Required</CardTitle>
        </div>
        <CardContent className="p-0 pt-4 text-center">
          <p className="text-[#FFDA68]">Redirecting to login...</p>
        </CardContent>
      </div>
    </div>
  ) 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
 const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if user is not authenticated
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#373434]">
        <div className="w-full max-w-xs p-8 space-y-6">
          <div className="text-center">
            <CardTitle className="text-3xl font-bold text-[#FFDA68]">Loading...</CardTitle>
          </div>
          <CardContent className="p-0 pt-4 text-center">
            <p className="text-[#FFDA68]">Please wait while we verify your authentication status...</p>
          </CardContent>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback
  }

  return <>{children}</>
}