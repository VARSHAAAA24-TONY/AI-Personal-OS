'use client'

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "./button"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 glass-cyber rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative h-16 w-16 rounded-xl bg-zinc-900 border border-rose-500/30 flex items-center justify-center shadow-2xl">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="font-mono text-lg font-bold text-white uppercase tracking-tighter">System Critical Failure</h2>
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest max-w-sm">
              The neural link has been severed. Data corruption detected in current module.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest px-6"
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-2" />
              Re-initialize
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-void-lime text-void-bg hover:bg-void-lime/90 font-mono text-[10px] uppercase tracking-widest px-6"
            >
              <Home className="h-3.5 w-3.5 mr-2" />
              Return Base
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 text-left overflow-auto max-w-2xl max-h-40">
              <p className="font-mono text-[8px] text-rose-400 whitespace-pre-wrap">{this.state.error?.stack}</p>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
