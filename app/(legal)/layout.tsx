import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ocean-950">
      <nav className="sticky top-0 bg-ocean-900/95 backdrop-blur-sm border-b border-ocean-800 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-ocean-300 hover:text-ocean-200 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-lg font-semibold text-white">Lumen</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-ocean-800 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-6 justify-center text-sm text-ocean-400">
            <Link href="/terms" className="hover:text-ocean-300 transition-colors">
              Terms
            </Link>
            <span className="text-ocean-700">|</span>
            <Link href="/privacy" className="hover:text-ocean-300 transition-colors">
              Privacy
            </Link>
            <span className="text-ocean-700">|</span>
            <Link href="/cookies" className="hover:text-ocean-300 transition-colors">
              Cookies
            </Link>
          </div>
          <div className="text-center mt-6 text-sm text-ocean-500">
            © {new Date().getFullYear()} Lumen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
