'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { User, LogOut } from 'lucide-react'

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  return (
    <header className="border-b border-dark-700 sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🍒</span>
            <span className="text-xl font-bold text-gradient">VibeCherry</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/feed"
              className={`transition-colors ${
                isActive('/feed')
                  ? 'text-cherry-400'
                  : 'text-gray-400 hover:text-cherry-400'
              }`}
            >
              Browse Specs
            </Link>
            <Link
              href="/writer"
              className={`transition-colors ${
                isActive('/writer')
                  ? 'text-cherry-400'
                  : 'text-gray-400 hover:text-cherry-400'
              }`}
            >
              The Writer
            </Link>
            <Link
              href="/collections"
              className={`transition-colors ${
                isActive('/collections')
                  ? 'text-cherry-400'
                  : 'text-gray-400 hover:text-cherry-400'
              }`}
            >
              Collections
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

