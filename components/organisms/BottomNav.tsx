'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, PlusCircleIcon, ChartBarIcon, UserIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: '/home', label: 'Home', icon: HomeIcon },
    { href: '/log', label: 'Log', icon: PlusCircleIcon },
    { href: '/insights', label: 'Insights', icon: ChartBarIcon },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-ocean-900 border-t border-ocean-700 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive ? "text-ocean-300" : "text-ocean-500 hover:text-ocean-400"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
