'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ocean-900 border-t border-ocean-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ocean-400">
          <span>&copy; {currentYear} Lumen</span>
          <span className="text-ocean-700">|</span>
          <a href="/terms" className="hover:text-ocean-300 transition-colors">
            Terms
          </a>
          <span className="text-ocean-700">|</span>
          <a href="/privacy" className="hover:text-ocean-300 transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
