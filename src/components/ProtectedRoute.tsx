'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ProtectedRouteProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  fallback = (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Authentication Required</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Redirecting to login...</p>
      </CardContent>
    </Card>
  ) 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
 const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we verify your authentication status...</p>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return fallback
  }

  return <>{children}</>
}