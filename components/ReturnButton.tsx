'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ReturnButtonProps {
  href: string
}

export default function ReturnButton({ href }: ReturnButtonProps) {
  return (
    <Link
      href={href}
      className="fixed top-20 left-6 z-40 w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full bg-white/80 backdrop-blur-sm hover:border-black hover:bg-black hover:text-white transition-all"
    >
      <ArrowLeft className="w-4 h-4" />
    </Link>
  )
}

