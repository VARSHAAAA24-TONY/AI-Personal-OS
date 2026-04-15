'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, 
  Search, 
  Loader2, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Terminal, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  Cpu,
  ArrowRight,
  Globe,
  Zap,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Job {
  id: string
  title: string
  company: string
  location: string
  link: string
  description: string
  salary: string
  posted: string
  platform?: string
}

interface Insights {
  demandStrength: string
  salaryBenchmark: string
  skillsInDemand: string[]
  growthAdvice: string
}

export default function JobSearchPage() {
  const [role, setRole] = useState('')
  const [locationType, setLocationType] = useState<'india' | 'international'>('india')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [insights, setInsights] = useState<Insights | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleSearch = async () => {
    if (!role) return
    setLoading(true)
    setJobs([])
    setInsights(null)
    setError(null)

    try {
      // 1. Fetch Real Job Data
      const jobResponse = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, locationType }),
      })

      const jobData = await jobResponse.json()
      
      if (!jobResponse.ok) {
        throw new Error('Unable to fetch jobs. Please try again')
      }
      
      setJobs(jobData.jobs || [])

      // 2. Fetch AI Insights based on those specific jobs
      const insightsRes = await fetch('/api/jobs/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, locationType, jobListings: jobData.jobs }),
      })

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json()
        setInsights(insightsData.insights)
      }

      // Log search for continuity
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('jobs').insert({
            user_id: user.id,
            role: role,
            results: jobData.jobs
          })
        }
      } catch (dbErr) {
        console.warn('History Log Interrupted.')
      }
    } catch (err: any) {
      console.error('Job Search Error:', err)
      setError('Unable to fetch jobs. Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Terminal className="h-4 w-4 text-[#ccff00]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Neural Hub: Global-Scout_v6</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-4xl font-bold tracking-tighter text-white uppercase"
          >
            Real-Time <span className="text-[#ccff00]">Market</span> Intelligence
          </motion.h1>
          <p className="max-w-2xl font-mono text-[11px] uppercase tracking-widest text-zinc-500 leading-relaxed">
            Distilling live opportunities from across the global flux using advanced neural filtration.
          </p>
        </div>
      </div>

      {/* Control Center */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Region Filter */}
          <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl md:w-64">
            <button
              onClick={() => setLocationType('india')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all",
                locationType === 'india' ? "bg-[#ccff00] text-black font-bold" : "text-zinc-500 hover:text-white"
              )}
            >
              <MapPin className="h-3 w-3" />
              India
            </button>
            <button
              onClick={() => setLocationType('international')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all",
                locationType === 'international' ? "bg-[#ccff00] text-black font-bold" : "text-zinc-500 hover:text-white"
              )}
            >
              <Globe className="h-3 w-3" />
              Global
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ccff00]/20 to-transparent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
            <div className="relative flex items-center bg-black border border-white/10 rounded-2xl p-1 focus-within:border-[#ccff00]/30 transition-all shadow-2xl">
              <input
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ENTER_ROLE_FOR_REALTIME_SYNC..."
                className="flex-1 bg-transparent border-none font-mono text-xs text-white focus:outline-none focus:ring-0 pl-6 placeholder:text-zinc-800"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !role}
                className="bg-[#ccff00] hover:bg-[#d9ff33] text-black rounded-xl h-11 px-8 transition-all flex items-center gap-2 group/btn font-mono font-bold uppercase tracking-tighter"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    Search
                    <Search className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Source Neutrality Note */}
        <div className="flex items-center gap-2 opacity-30 justify-center">
          <CheckCircle2 className="h-3 w-3 text-[#ccff00]" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-white">Aggregated from multiple job platforms</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-8"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-2 border-white/5 border-t-[#ccff00] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-[#ccff00] animate-pulse" />
              </div>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#ccff00] animate-pulse">Syncing Aggregated Streams...</p>
          </motion.div>
        ) : error ? (
           <motion.div 
             key="error"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="max-w-md mx-auto p-8 glass-cyber border border-rose-500/20 text-center space-y-4"
           >
              <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
              <div className="space-y-2">
                <p className="font-mono text-xs text-white uppercase tracking-widest font-bold">Protocol Error</p>
                <p className="font-mono text-[10px] text-zinc-500 uppercase leading-relaxed font-bold">{error}</p>
              </div>
              <Button 
                onClick={handleSearch}
                variant="ghost" 
                className="font-mono text-[9px] uppercase tracking-widest text-[#ccff00] border border-[#ccff00]/20"
              >
                Retry Link
              </Button>
           </motion.div>
        ) : jobs.length > 0 ? (
          <div key="results-container" className="space-y-12">
            {/* Market Intelligence Panel (A, B, C, D) */}
            {insights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-cyber border border-[#ccff00]/10 rounded-3xl p-8 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Activity className="h-32 w-32 text-[#ccff00]" />
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <BrainCircuit className="h-5 w-5 text-[#ccff00]" />
                  <h2 className="font-mono text-xs font-bold text-white uppercase tracking-[0.3em]">AI-Generated Market Snapshot</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                  {/* A. Demand Strength */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-[#ccff00]" />
                      A. Demand Strength
                    </p>
                    <p className="font-mono text-sm text-white font-bold leading-relaxed">{insights.demandStrength}</p>
                  </div>

                  {/* B. Salary Benchmark */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="h-3 w-3 text-void-lime" />
                      B. Salary Benchmark
                    </p>
                    <p className="font-mono text-sm text-white font-bold leading-relaxed">{insights.salaryBenchmark}</p>
                  </div>

                  {/* C. Skills in Demand */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 lg:col-span-1">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Cpu className="h-3 w-3 text-cyan-400" />
                      C. Core Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {insights.skillsInDemand.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[8px] text-zinc-300 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* D. Growth Advice */}
                  <div className="space-y-3 p-4 rounded-2xl bg-[#ccff00]/5 border border-[#ccff00]/10">
                    <p className="font-mono text-[9px] text-[#ccff00] uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="h-3 w-3" />
                      D. Growth Advice
                    </p>
                    <p className="font-mono text-[10px] text-zinc-400 italic leading-relaxed">
                      {insights.growthAdvice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative glass-cyber border border-white/5 rounded-2xl p-6 hover:border-[#ccff00]/30 transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h3 className="font-mono text-base font-bold text-white uppercase tracking-tighter group-hover:text-[#ccff00] transition-colors line-clamp-1">{job.title}</h3>
                      <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase">
                        <Building2 className="h-3 w-3" />
                        <span className="text-zinc-200">{job.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase">
                      <Zap className="h-3 w-3" />
                      {job.salary === 'Not disclosed' ? 'Salary: Not Disclosed' : `Est: ${job.salary}`}
                    </div>
                  </div>

                  <p className="font-mono text-[10px] text-zinc-500 mb-8 uppercase leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-end">
                    <a 
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-2 bg-[#ccff00] text-black px-6 py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl"
                    >
                      Apply Now
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                "Web Developer",
                "Data Scientist",
                "Cloud Architect",
                "Product Manager"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setRole(suggestion)}
                  className="group flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-[#ccff00]/30 hover:bg-[#ccff00]/5 transition-all text-left"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                    {suggestion}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-800 group-hover:text-[#ccff00] translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
