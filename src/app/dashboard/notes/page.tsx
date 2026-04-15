'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { NotesList } from '@/components/notes/notes-list'
import { NoteEditor } from '@/components/notes/editor'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Cpu, Terminal, Sparkles, Plus, AlertCircle } from 'lucide-react'
import { debounce } from 'lodash'

interface Note {
  id: string
  title: string
  content: any
  updated_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setNotes([])
        return
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err: any) {
      console.warn('Neural Sync Interrupted.', err.message)
      setError('Failed to sync neural fragments.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const saveNote = async (id: string, updates: Partial<Note>) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n))
    } catch (err: any) {
      console.error('Error saving note:', err)
      // Visual feedback for error could be added here
    } finally {
      setSaving(false)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((id: string, updates: Partial<Note>) => saveNote(id, updates), 1000),
    [supabase]
  )

  const handleAddNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Neural identity not verified.')

      const newNote = {
        user_id: user.id,
        title: 'New Neural Fragment',
        content: {},
      }

      const { data, error } = await supabase
        .from('notes')
        .insert(newNote)
        .select()
        .single()

      if (error) throw error
      
      setNotes([data, ...notes])
      setSelectedNote(data)
    } catch (err: any) {
      console.error('Error adding note:', err)
      alert('Failed to initialize neural fragment: ' + err.message)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setNotes(notes.filter(n => n.id !== id))
      if (selectedNote?.id === id) setSelectedNote(null)
    } catch (err: any) {
      console.error('Error deleting note:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-void-lime" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Syncing Neural Mesh...</span>
      </div>
    )
  }

  // Resilience: We no longer return the error UI to prevent blanking out the dashboard
  // if (error) { ... }

  return (
    <div className="h-[calc(100vh-8rem)] flex overflow-hidden glass-cyber rounded-2xl border border-white/5 shadow-2xl">
      {/* List Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-white/5 bg-black/20">
        <NotesList 
          notes={notes}
          selectedNoteId={selectedNote?.id}
          onSelectNote={setSelectedNote}
          onDeleteNote={handleDeleteNote}
          onAddNote={handleAddNote}
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-black/40 to-transparent">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Note Header */}
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex-1 flex items-center gap-4">
                  <Terminal className="h-4 w-4 text-void-lime opacity-50" />
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const newTitle = e.target.value
                      setSelectedNote({ ...selectedNote, title: newTitle })
                      debouncedSave(selectedNote.id, { title: newTitle })
                    }}
                    className="bg-transparent border-none text-xl font-mono font-bold text-white focus:outline-none focus:ring-0 w-full placeholder:text-zinc-700 uppercase tracking-tighter"
                    placeholder="UNTITLED_FRAGMENT"
                  />
                </div>
                {saving && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-void-lime/10 border border-void-lime/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-void-lime animate-pulse" />
                    <span className="font-mono text-[8px] text-void-lime uppercase tracking-widest">Saving</span>
                  </div>
                )}
              </div>

              {/* Note Editor */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                  <NoteEditor 
                    content={selectedNote.content}
                    onChange={(content) => {
                      setSelectedNote({ ...selectedNote, content })
                      debouncedSave(selectedNote.id, { content })
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <div key="idle" className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-void-lime/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative h-24 w-24 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10 shadow-2xl">
                  <Sparkles className="h-10 w-10 text-void-lime" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-[0.3em]">Knowledge Base Idle</h3>
                <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                  Select a neural fragment to modify<br />or initialize a new one.
                </p>
              </div>
              <button 
                onClick={handleAddNote}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-void-lime font-mono text-[10px] uppercase tracking-widest hover:bg-void-lime hover:text-black transition-all duration-300"
              >
                <Plus className="h-3 w-3" />
                New Fragment
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
