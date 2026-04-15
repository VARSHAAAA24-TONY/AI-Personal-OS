'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface NoteEditorProps {
  content: any
  onChange: (content: any) => void
  editable?: boolean
}

export function NoteEditor({ content, onChange, editable = true }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your second brain...',
      }),
    ],
    content: content,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-zinc-300',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getJSON()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  )
}
