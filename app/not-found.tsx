import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-light mb-4">404</h1>
      <p className="text-sm text-gray-600 mb-8">Page not found</p>
      <Link
        href="/"
        className="inline-block px-6 py-2 border border-black rounded text-sm hover:bg-black hover:text-white transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}




