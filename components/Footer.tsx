import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-900 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} My Blog</span>
          <span>·</span>
          <Link href="/bookmarks" className="hover:opacity-70 transition-opacity">
            Bookmarks
          </Link>
        </div>
      </div>
    </footer>
  )
}

