'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from "@/components/dashboard/sidebar"
import { createClient } from '@/lib/supabase/client'
import { Loader2, ShieldCheck } from 'lucide-react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authReady, setAuthReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          // Middleware should handle this, but as a secondary guard:
          window.location.href = '/login'
          return
        }
        
        setAuthReady(true)
      } catch (err) {
        console.error('Initial Auth check failed:', err)
        setError('Connection to Neural Core failed. Please refresh.')
      }
    }

    checkAuth()
  }, [supabase.auth])

  if (error) {
     return (
        <div className="flex h-screen items-center justify-center bg-[#0a0f1c] text-white">
           <div className="glass-cyber p-8 border border-rose-500/20 text-center space-y-4">
              <p className="font-mono text-rose-500 uppercase tracking-widest">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono uppercase tracking-widest"
              >
                Retry Link
              </button>
           </div>
        </div>
     )
  }

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1c] text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-void-lime/20 blur-2xl rounded-full animate-pulse" />
            <Loader2 className="relative h-12 w-12 animate-spin text-void-lime" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-void-lime animate-pulse">Syncing Neural Core</p>
            <span className="font-mono text-[8px] text-zinc-700 uppercase tracking-widest leading-relaxed">
              Verifying Session Integrity...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0f1c]">
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-void-lime/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-void-cyan/5 blur-[120px] rounded-full" />
        </div>
        
        {/* Content wrapper with Error Boundary */}
        <div className="relative z-10 p-8 min-h-full">
          <ErrorBoundary>
            <div className="w-full h-full">
              {children}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}
