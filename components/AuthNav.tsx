import { isAuthenticated } from '@/lib/auth'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

export default async function AuthNav() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className="text-xs font-light tracking-wider opacity-30 hover:opacity-60 transition-opacity lowercase"
      >
        login
      </Link>
    )
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




