import { useState, useEffect } from 'react'
import { FolderPlus, Hash, LogOut, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const API_URL = ('http://localhost:5000/', 'https://your-backend.onrender.com/api');

export default function Sidebar({ onSelectGroup, selectedGroupId, userId }) {
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')

  useEffect(() => {
    if (userId) fetchGroups()
  }, [userId])

  async function fetchGroups() {
    try {
      const res = await fetch(`${API_URL}/groups?userId=${userId}`)
      const data = await res.json()
      setGroups(Array.isArray(data) ? data : [])
    } catch (err) { setGroups([]) }
  }

  async function addGroup(e) {
    e.preventDefault()
    if (!newGroupName.trim()) return
    const res = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGroupName, user_id: userId })
    })
    if (res.ok) { setNewGroupName(''); fetchGroups(); }
  }

  async function deleteGroup(e, id) {
    e.stopPropagation()
    if (!confirm("Delete this group and all its notes?")) return
    const res = await fetch(`${API_URL}/groups/${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (selectedGroupId === id) onSelectGroup(null)
      fetchGroups()
    }
  }

  return (
    <div className="w-64 h-full bg-slate-900 text-slate-300 p-4 flex flex-col shrink-0">
      <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <Hash className="text-indigo-400" /> NoteStack
      </h2>

      <div className="space-y-1 mb-6">
        <button onClick={() => onSelectGroup(null)} className={`w-full text-left p-2 rounded-lg ${!selectedGroupId ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
          All Notes
        </button>
      </div>

      <div className="mb-6 px-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Create Group</p>
        <form onSubmit={addGroup} className="flex gap-2">
          <input className="bg-slate-800 p-2 rounded text-sm w-full outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Group name..." value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
          <button className="bg-indigo-600 p-2 rounded hover:bg-indigo-700 transition-colors"><FolderPlus size={18} /></button>
        </form>
      </div>

      <hr className="border-slate-800 mb-6" />

      <div className="flex-1 overflow-y-auto space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">My Groups</p>
        {groups.map(g => (
          <div key={g.id} className="relative group flex items-center">
            <button onClick={() => onSelectGroup(g.id)} className={`w-full text-left p-2 rounded-lg truncate pr-8 ${selectedGroupId === g.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
              # {g.name}
            </button>
            <button onClick={(e) => deleteGroup(e, g.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 transition-opacity">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => supabase.auth.signOut()} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors px-2">
        <LogOut size={18} /> Logout
      </button>
    </div>
  )
}