import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import HabitCard from '../components/HabitCard'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [error, setError] = useState('')
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits`, { headers })
      setHabits(res.data)
    } catch {
      setError('Failed to load habits')
    }
  }

  useEffect(() => { fetchHabits() }, [])

  const addHabit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/habits`, { name, frequency }, { headers })
      setName('')
      fetchHabits()
    } catch {
      setError('Failed to add habit')
    }
  }

  const toggleHabit = async (id, completed) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/habits`, { completed: !completed }, { headers })
    fetchHabits()
  }

  const deleteHabit = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits`, { headers })
    fetchHabits()
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const d = dark

  return (
    <div className={`min-h-screen transition-colors duration-300 ${d ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <div className={`shadow-sm px-6 py-4 flex justify-between items-center ${d ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-xl font-bold ${d ? 'text-red-400' : 'text-gray-800'}`}>Habit Tracker</h1>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${d ? 'text-gray-300' : 'text-gray-500'}`}>Hi, {username} 👋</span>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            className={`text-xl px-2 py-1 rounded-lg transition ${d ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'}`}
            title="Toggle dark mode"
          >
            {d ? '☀️' : '🌙'}
          </button>

          <button
            onClick={logout}
            className={`text-sm ${d ? 'text-red-400' : 'text-red-500'} hover:underline`}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Add Habit Form */}
        <div className={`rounded-xl shadow-sm p-6 mb-6 ${d ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${d ? 'text-red-400' : 'text-gray-700'}`}>Add New Habit</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <form onSubmit={addHabit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water, Read 30 mins"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${d ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'border-gray-300 text-gray-800'}`}
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${d ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-300 text-gray-800'}`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-sm font-medium transition ${d ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              + Add Habit
            </button>
          </form>
        </div>

        {/* Habit List */}
        <div className="space-y-3">
          {habits.length === 0
            ? <p className={`text-center text-sm mt-10 ${d ? 'text-gray-500' : 'text-gray-400'}`}>No habits yet. Add one above! 🌱</p>
            : habits.map(habit => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
                dark={dark}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}