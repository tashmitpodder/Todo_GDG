import { useEffect, useState } from "react";
import { getTodos, addTodo, toggleTodo, deleteTodo, API_BASE } from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTodos();
        setTodos(data);
      } catch (e) {
        setError(
          "Could not load todos. Check if the server is running at " + API_BASE
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const optimistic = {
      id: Math.random(),
      text: text.trim(),
      completed: false,
      _optimistic: true,
    };
    setTodos([optimistic, ...todos]);
    setText("");

    try {
      const saved = await addTodo(optimistic.text);
      setTodos((prev) => prev.map((t) => (t.id === optimistic.id ? saved : t)));
    } catch (err) {
      setTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError("Failed to add. Check API");
    }
  }

  async function handleToggle(todo) {
    const prev = todos;
    setTodos(
      prev.map((t) =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      )
    );
    try {
      await toggleTodo(todo.id, !todo.completed);
    } catch (err) {
      setTodos(prev);
      setError("Failed to update.");
    }
  }

  async function handleDelete(id) {
    const prev = todos;
    setTodos(prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch (err) {
      setTodos(prev);
      setError("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
          📝 My To-Do List
        </h1>

        
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Add a task…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input input-bordered w-full rounded-xl"
          />
          <button
            type="submit"
            className="btn btn-accent rounded-xl px-6 text-white shadow-md hover:scale-105 transition"
          >
            Add
          </button>
        </form>

        
        {error && (
          <p className="text-red-200 text-sm text-center mb-4">{error}</p>
        )}

        
        {loading ? (
          <p className="text-center text-white">Loading…</p>
        ) : todos.length === 0 ? (
          <p className="text-center text-white opacity-80">
            No tasks yet !! Add your first one!
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-white/30 p-3 rounded-xl shadow-md hover:bg-white/40 transition"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className="checkbox checkbox-info"
                  />
                  <span
                    className={`text-white text-lg ${
                      todo.completed ? "line-through opacity-60" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                </label>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="btn btn-sm btn-error rounded-lg text-white shadow-md hover:scale-105 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
