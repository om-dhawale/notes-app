import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './Auth'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import { Trash2, Search } from 'lucide-react'

const API_URL = 'https://notes-app-i8mn.onrender.com/api';

function App() {
  const [session, setSession] = useState(null)
  const [notes, setNotes] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editNote, setEditNote] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user?.id) fetchNotes()
  }, [session, selectedGroupId])

  async function fetchNotes() {
    try {
      const response = await fetch(`${API_URL}/notes?userId=${session.user.id}`);
      const data = await response.json();
      const notesList = Array.isArray(data) ? data : [];
      setNotes(selectedGroupId ? notesList.filter(n => n.group_id === selectedGroupId) : notesList);
    } catch (err) { setNotes([]); }
  }

  async function deleteNote(e, id) {
    e.stopPropagation();
    if (!confirm("Delete this note?")) return;
    const response = await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
    if (response.ok) fetchNotes();
  }

  if (!session) return <Auth />

  const filteredNotes = notes.filter(n => 
    n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar userId={session.user.id} selectedGroupId={selectedGroupId} onSelectGroup={setSelectedGroupId} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">{selectedGroupId ? 'Group Notes' : 'All My Notes'}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input className="p-2 pl-10 rounded-full border border-slate-200 outline-none w-64 focus:ring-2 focus:ring-indigo-500" placeholder="Search notes..." onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </header>
          <NoteEditor userId={session.user.id} groupId={selectedGroupId} onSave={fetchNotes} editNote={editNote} setEditNote={setEditNote} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map(note => (
              <div key={note.id} onClick={() => setEditNote(note)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 transition cursor-pointer group relative flex flex-col min-h-[160px]">
                <button onClick={(e) => deleteNote(e, note.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-2 z-10">
                  <Trash2 size={20} />
                </button>
                <h3 className="font-bold text-lg mb-1">{note.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(note.created_at).toLocaleDateString()}</span>
                <p className="text-slate-600 text-sm line-clamp-5 flex-1">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
export default App