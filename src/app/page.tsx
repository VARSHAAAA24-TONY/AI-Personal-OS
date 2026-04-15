'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Terminal, Zap } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0a0f1c] bg-orbital px-6 overflow-hidden selection:bg-[#ccff00]/30 selection:text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.06),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(204,255,0,0.06),transparent_70%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-12"
        >
          <Zap className="h-3 w-3 text-[#ccff00] animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-400">System Status: Neural-Ready</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-void-glow uppercase leading-none">
            The Void
          </h1>
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.8em] text-zinc-500 max-w-lg mx-auto leading-relaxed">
            Autonomous Intelligence Operating System
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 flex flex-col items-center gap-8"
        >
          <Button
            onClick={() => router.push('/login')}
            className="group relative h-16 px-12 bg-[#ccff00] hover:bg-[#d9ff33] text-[#0a0f1c] font-mono font-black uppercase tracking-[0.5em] text-[12px] rounded-none transition-all overflow-hidden"
            style={{ boxShadow: '0 0 30px rgba(204, 255, 0, 0.3)' }}
          >
            <span className="relative z-10 flex items-center gap-4">
              Enter Terminal
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>

          <div className="flex items-center gap-6 opacity-20">
             <div className="h-[1px] w-12 bg-white" />
             <Terminal className="h-4 w-4 text-white" />
             <div className="h-[1px] w-12 bg-white" />
          </div>

          <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-zinc-700">
            [ Verified Access Only // Secure Neural Sync ]
          </p>
        </motion.div>
      </div>

      {/* Decorative side elements */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-10 hidden md:flex">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-[1px] bg-white" />
        ))}
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-10 hidden md:flex">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-[1px] bg-white" />
        ))}
      </div>
    </div>
  )
}
