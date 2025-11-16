'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, PlusCircleIcon, ChartBarIcon, UserIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: '/home', label: 'Home', icon: HomeIcon },
    { href: '/log', label: 'Log', icon: PlusCircleIcon, primary: true },
    { href: '/insights', label: 'Insights', icon: ChartBarIcon },
    { href: '/profile', label: 'Profile', icon: UserIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-ocean-900 border-t border-ocean-700 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon, primary }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200",
                primary && "relative",
                isActive ? "text-ocean-300" : "text-ocean-500 hover:text-ocean-400"
              )}
            >
              {primary && isActive && (
                <div className="absolute inset-x-0 top-0 h-1 bg-ocean-400 rounded-b-full" />
              )}
              <Icon className={cn(
                "transition-all duration-200",
                primary ? "w-8 h-8" : "w-6 h-6"
              )} />
              <span className={cn(
                "mt-1",
                primary ? "text-xs font-medium" : "text-xs"
              )}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
