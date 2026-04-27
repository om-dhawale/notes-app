import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function NoteEditor({ groupId, onSave, editNote, setEditNote, userId }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title)
      setContent(editNote.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [editNote])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title) return

    const url = editNote ? `https://notes-app-i8mn.onrender.com/api/notes/${editNote.id}` : `https://notes-app-i8mn.onrender.com/api/notes`
    const method = editNote ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, user_id: userId, group_id: groupId })
    })

    if (response.ok) {
      setEditNote(null)
      setTitle('')
      setContent('')
      onSave()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-2xl shadow-sm border mb-8 transition ${editNote ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
        <span>{editNote ? 'Editing Note' : 'New Note'}</span>
        {editNote && <X className="cursor-pointer text-slate-400" size={18} onClick={() => setEditNote(null)} />}
      </div>
      <input className="w-full text-xl font-bold outline-none mb-2 bg-transparent" placeholder="Note Title..." value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="w-full outline-none text-slate-600 h-24 bg-transparent resize-none" placeholder="Start writing..." value={content} onChange={e => setContent(e.target.value)} />
      <div className="flex justify-end">
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          {editNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  )
}