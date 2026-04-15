'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileText, Plus, Trash2, Cpu, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Note {
  id: string
  title: string
  updated_at: string
  content: any
}

interface NotesListProps {
  notes: Note[]
  selectedNoteId?: string
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
  onAddNote: () => void
}

export function NotesList({ 
  notes, 
  selectedNoteId, 
  onSelectNote, 
  onDeleteNote, 
  onAddNote 
}: NotesListProps) {
  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-zinc-500" />
          <h2 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Neural Fragments</h2>
        </div>
        <button 
          onClick={onAddNote}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition-all"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Hash className="h-8 w-8 mx-auto text-zinc-800" />
            <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
              No fragments detected in current sector.
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={cn(
                  "group relative p-4 cursor-pointer rounded-xl transition-all duration-200 border border-transparent",
                  selectedNoteId === note.id 
                    ? "bg-[#ccff00]/5 border-[#ccff00]/20" 
                    : "hover:bg-white/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 flex h-2 w-2 rounded-full shrink-0",
                    selectedNoteId === note.id ? "bg-[#ccff00] shadow-[0_0_8px_#ccff00]" : "bg-zinc-800"
                  )} />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-mono text-xs font-bold truncate uppercase tracking-tight transition-colors",
                      selectedNoteId === note.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      {note.title || 'UNTITLED_LOG'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-[8px] text-zinc-700 uppercase tracking-tighter">Updated:</span>
                      <span className="font-mono text-[8px] text-zinc-600 uppercase">
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-rose-500 text-zinc-600 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-widest text-zinc-600">
          <span>Active Sector: 0x4F</span>
          <span>Storage: 82%</span>
        </div>
      </div>
    </div>
  )
}
