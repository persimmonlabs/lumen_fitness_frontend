'use client'

import Image from 'next/image'
import { useAppSelector } from '@/store'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

export function UserAvatar({ size = 'md', className = '', onClick }: UserAvatarProps) {
  const { user } = useAppSelector((state) => state.auth)

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
  }

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 64,
  }

  // Get initials from name or email
  const getInitials = () => {
    // Try to get full name from user metadata
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    // Fallback to email
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }

    return 'U'
  }

  // Get Google profile picture or avatar URL
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-coral-500 to-ocean-600 flex items-center justify-center overflow-hidden ring-2 ring-ocean-700 ${className}`}
      onClick={onClick}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Profile"
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="w-full h-full object-cover"
          unoptimized // For external Google images
        />
      ) : (
        <span className="font-semibold text-white">{getInitials()}</span>
      )}
    </div>
  )
}
