'use client'

import React from 'react'
import { Brain, Zap, Search, ArrowRight, Terminal } from 'lucide-react'
import Link from 'next/link'

const tools = [
  {
    title: 'Neuro-Notes',
    description: 'Capture cognitive threads with real-time neural sync.',
    icon: Brain,
    href: '/dashboard/notes',
    color: 'text-void-lime',
    border: 'border-void-lime/20',
  },
  {
    title: 'Stream-Link',
    description: 'Distill intelligence from video streams in pulses.',
    icon: Zap,
    href: '/dashboard/youtube',
    color: 'text-void-cyan',
    border: 'border-void-cyan/20',
  },
  {
    title: 'Job-Search',
    description: 'Scan the global network for career opportunities matched to your neural profile.',
    icon: Search,
    href: '/dashboard/job-search',
    color: 'text-void-lime',
    border: 'border-void-lime/20',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 opacity-50">
            <Terminal className="h-4 w-4 text-void-lime" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">System Status: ONLINE</span>
          </div>
          <h1 className="font-mono text-4xl font-bold tracking-tighter text-white uppercase">
            Neural Drive <span className="text-void-lime">Dashboard</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Welcome to the Neural Interface. Select a module to begin.</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Link 
            key={tool.title}
            href={tool.href}
            className={`group block h-full p-8 rounded-2xl glass-cyber border ${tool.border} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex flex-col h-full space-y-6">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-xl bg-black/40 border border-white/5 ${tool.color}`}>
                  <tool.icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col items-end opacity-20">
                  <span className="font-mono text-[8px] uppercase">Module</span>
                  <span className="font-mono text-xs">0{index + 1}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-mono text-xl font-bold uppercase tracking-tight text-white">{tool.title}</h3>
                <p className="font-mono text-[11px] leading-relaxed text-zinc-500 uppercase tracking-wider">
                  {tool.description}
                </p>
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 group-hover:text-white transition-colors">
                  Initialize
                </span>
                <ArrowRight className={`h-5 w-5 ${tool.color} transition-transform group-hover:translate-x-2`} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
