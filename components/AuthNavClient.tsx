'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function AuthNavClient() {
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        setAuthenticated(response.ok)
      } catch {
        setAuthenticated(false)
      }
    }
    checkAuth()
    // Refresh auth state on route changes
    router.refresh()
  }, [router])

  if (!authenticated) {
    return null
  }

  return (
    <>
      <Link
        href="/admin"
        className="text-xs font-light tracking-wider opacity-30 hover:opacity-60 transition-opacity lowercase"
      >
        admin
      </Link>
      <LogoutButton />
    </>
  )
}

