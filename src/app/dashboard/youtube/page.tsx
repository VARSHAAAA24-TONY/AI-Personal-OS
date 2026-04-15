'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Search, Loader2, Sparkles, Copy, Check, Terminal, Cpu, Zap, Activity, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function SummarizerPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const validateUrl = (input: string) => {
    try {
      const parsed = new URL(input)
      return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')
    } catch {
      return false
    }
  }

  const handleSummarize = async () => {
    if (!url) return
    if (!validateUrl(url)) {
      setError('Invalid Neural Link: Must be a valid YouTube URL.')
      return
    }

    setLoading(true)
    setSummary('')
    setError(null)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Signal Distillation Failed')
      }
      
      setSummary(data.summary)

      // Fail-safe persistence: Log data if DB is reachable
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Unauthenticated')

        await supabase.from('summaries').insert({
          user_id: user.id,
          video_url: url,
          summary: data.summary,
        })
      } catch (dbErr) {
        console.warn('Neural Buffer Cache: Data distilled but DB sync failed.')
      }
    } catch (err: any) {
      console.error('Summarize Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!summary) return
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Terminal className="h-4 w-4 text-void-cyan" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Channel: Stream-Extractor_v4</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-3xl font-bold tracking-tighter text-white uppercase"
          >
            Stream <span className="text-void-cyan">Link</span> Summarizer
          </motion.h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Decrypt and distill intelligence from neural video streams.</p>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-black/40 border border-white/5">
          <Activity className="h-4 w-4 text-void-cyan animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-zinc-400">Signal Strength: Optimal</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative group max-w-3xl mx-auto w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-void-cyan/20 to-transparent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
        <div className="relative flex items-center bg-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-void-cyan/30 transition-all shadow-2xl">
          <div className="pl-6 pr-4">
            <Video className="h-6 w-6 text-zinc-700 group-focus-within:text-void-cyan transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSummarize()}
            placeholder="PASTE_STREAM_URL_HERE..."
            className="flex-1 bg-transparent py-5 font-mono text-sm text-white placeholder:text-zinc-800 focus:outline-none"
          />
          <div className="pr-4">
            <Button
              onClick={handleSummarize}
              disabled={loading || !url}
              className="bg-void-cyan hover:bg-[#33f5ff] text-black font-mono font-bold uppercase tracking-tighter rounded-xl px-8 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-[10px]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  DECODING
                </div>
              ) : (
                'Extract'
              )}
            </Button>
          </div>
        </div>
        
        {/* Local Sync Log */}
        <div className="flex items-center gap-2 opacity-30 justify-center">
          <Activity className="h-3 w-3 text-void-cyan" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-white">Stream Ready</span>
        </div>
      </div>

      {/* Results Section */}
      <motion.div 
        layout
        className="glass-cyber rounded-3xl border border-white/5 min-h-[400px] overflow-hidden relative shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {!summary && !loading && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                <Cpu className="relative h-16 w-16 opacity-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em]">Awaiting Data Stream</p>
                <p className="font-mono text-[8px] uppercase tracking-widest opacity-40">Ready for neural distillation</p>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black/40 backdrop-blur-md z-10"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-2 border-white/5 border-t-void-cyan animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-void-cyan animate-pulse" />
              </div>
              <div className="space-y-3 text-center">
                <p className="font-mono text-xs text-white font-bold uppercase tracking-[0.3em] animate-pulse">Analyzing Frequency</p>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 w-4 bg-void-cyan/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="h-full w-full bg-void-cyan"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {summary && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10"
            >
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-void-cyan shadow-[0_0_8px_#00f2ff]" />
                  <h2 className="font-mono text-xs font-bold text-white uppercase tracking-[0.2em]">Abstracted Intelligence</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="font-mono text-[9px] uppercase tracking-widest text-void-cyan hover:bg-void-cyan/10 border border-void-cyan/20"
                >
                  {copied ? <Check className="h-3 w-3 mr-2" /> : <Copy className="h-3 w-3 mr-2" />}
                  {copied ? 'Copied' : 'Share Log'}
                </Button>
              </div>
              
              <div className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
