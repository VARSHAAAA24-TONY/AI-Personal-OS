'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  StickyNote, 
  Video, 
  Search, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-zinc-400',
  },
  {
    label: 'Neuro-Notes',
    icon: StickyNote,
    href: '/dashboard/notes',
    color: 'text-zinc-400',
  },
  {
    label: 'Stream-Link',
    icon: Video,
    href: '/dashboard/youtube',
    color: 'text-zinc-400',
  },
  {
    label: 'Job-Search',
    icon: Search,
    href: '/dashboard/job-search',
    color: 'text-zinc-400',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [userName, setUserName] = React.useState<string | null>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Neural User')
      }
    }
    getUser()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-[#0a0f1c] border-r border-white/5 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Subtle Sidebar Glow */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#ccff00]/10 to-transparent" />

      {/* Header */}
      <div className={cn(
        "p-6 flex items-center justify-between",
        isCollapsed && "px-4 justify-center"
      )}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-black">
              <Zap className="h-5 w-5" />
            </div>
            <h1 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white">
              Neural<span className="text-[#ccff00]">OS</span>
            </h1>
          </Link>
        )}
        {isCollapsed && (
          <Zap className="h-6 w-6 text-[#ccff00]" />
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group relative flex p-3 w-full justify-start cursor-pointer hover:bg-white/5 rounded-xl transition-all duration-200",
              pathname === route.href ? "bg-white/5" : "transparent"
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn(
                "h-5 w-5 mr-3 transition-colors",
                pathname === route.href ? "text-[#ccff00]" : "text-zinc-500 group-hover:text-white"
              )} />
              {!isCollapsed && (
                <span className={cn(
                  "font-mono text-[11px] uppercase tracking-wider transition-colors",
                  pathname === route.href ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                )}>
                  {route.label}
                </span>
              )}
            </div>
            {pathname === route.href && (
              <motion.div 
                layoutId="active-nav"
                className="absolute left-0 top-3 bottom-3 w-[2px] bg-[#ccff00] rounded-r shadow-[0_0_8px_rgba(204,255,0,0.5)]"
              />
            )}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 space-y-2 border-t border-white/5">
        {!isCollapsed && (
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-white uppercase tracking-tighter">Verified</span>
              <span className="font-mono text-[8px] text-zinc-600 uppercase truncate max-w-[120px]">{userName}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5 mx-auto" /> : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Collapse Node</span>
            </>
          )}
        </button>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 transition-all font-mono text-[10px] uppercase tracking-widest"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Disconnect Node</span>}
        </button>
      </div>
    </div>
  )
}
