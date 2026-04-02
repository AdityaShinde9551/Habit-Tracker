export default function HabitCard({ habit, onToggle, onDelete, dark }) {
  const d = dark
  return (
    <div className={`rounded-xl shadow-sm p-4 flex items-center justify-between border-l-4 transition-colors duration-300
      ${habit.completed ? 'border-green-400' : d ? 'border-red-500' : 'border-gray-200'}
      ${d ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={habit.completed}
          onChange={() => onToggle(habit._id, habit.completed)}
          className="w-4 h-4 accent-red-500 cursor-pointer"
        />
        <div>
          <p className={`text-sm font-medium ${habit.completed ? 'line-through text-gray-400' : d ? 'text-gray-100' : 'text-gray-700'}`}>
            {habit.name}
          </p>
          <p className={`text-xs capitalize ${d ? 'text-gray-400' : 'text-gray-400'}`}>{habit.frequency}</p>
        </div>
      </div>
      <button
        onClick={() => onDelete(habit._id)}
        className="text-red-400 hover:text-red-600 text-xs"
      >
        Delete
      </button>
    </div>
  )
}