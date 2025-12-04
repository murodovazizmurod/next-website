import { isAuthenticated } from '@/lib/auth'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

export default async function AuthCheck({ children }: { children: ReactNode }) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/login')
  }

  return <>{children}</>
}



