'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Globe, Loader2, Zap } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError
    } catch (err: any) {
      console.error('OAuth Initialization Failure:', err.message)
      setError('Login failed. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0f1c] bg-orbital px-6 overflow-hidden selection:bg-[#ccff00]/30 selection:text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.06),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(204,255,0,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[448px] flex flex-col items-center">
        {/* Branding */}
        <div className="mb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Zap className="h-3 w-3 text-[#ccff00] animate-pulse" />
            <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-zinc-500">
              Neural OS // Security Protocol v4.0
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-8xl font-black tracking-tighter text-void-glow uppercase leading-none mb-6">
              The Void
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.7em] text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Intelligence Augmented Personal Operating System
            </p>
          </motion.div>
        </div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full glass-cyber rounded-xl p-10 relative overflow-hidden border border-white/[0.03]"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ccff00]/40 to-transparent" />
          
          <div className="mb-14 text-center">
            <h2 className="font-mono text-[12px] font-bold text-white uppercase tracking-[0.4em] mb-2">Establish Identity Sync</h2>
            <p className="font-mono text-[8px] text-zinc-600 uppercase tracking-widest leading-relaxed">
              Authorized via Google Secure Handshake
            </p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative w-full h-16 bg-white hover:bg-zinc-100 text-[#0a0f1c] font-mono font-black uppercase tracking-[0.3em] text-[11px] rounded-none transition-all flex items-center justify-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-void-cyan opacity-0 group-hover:opacity-5 transition-opacity" />
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Globe className="h-5 w-5" />
                  <span>Continue with Google</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </>
              )}
            </Button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg justify-center"
              >
                <p className="font-mono text-[9px] text-rose-400 uppercase tracking-widest leading-none">{error}</p>
              </motion.div>
            )}
          </div>

          <footer className="mt-14 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
             <div className="flex items-center gap-3">
                <ShieldCheck className="h-3 w-3 text-[#ccff00]" />
                <span className="font-mono text-[7px] uppercase tracking-widest text-zinc-700 font-bold tracking-[0.2em]">Verified Link</span>
             </div>
             <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[2px] w-4 bg-zinc-800" />
                ))}
             </div>
          </footer>
        </motion.div>

        <p className="mt-20 font-mono text-[8px] uppercase tracking-[0.8em] text-zinc-900 text-center animate-pulse">
          [ UNIFIED_AUTH_CORE_ACTIVE ]
        </p>
      </div>
    </div>
  )
}
