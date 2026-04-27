import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Success! Please check your email for a confirmation link.')
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-slate-200">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">NoteStack</h1>
        <p className="text-slate-500 text-center mb-8">Personal Notes CRUD</p>
        
        {message && (
          <div className="mb-4 p-3 text-sm rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            {message}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
            <button 
              onClick={handleSignUp} 
              disabled={loading}
              className="w-full border-2 border-indigo-600 text-indigo-600 p-3 rounded-xl font-semibold hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}