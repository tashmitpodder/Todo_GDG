export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


export async function getTodos() {
const res = await fetch(`${API_BASE}/api/todos`);
if (!res.ok) throw new Error("Failed to fetch todos");
return res.json();
}


export async function addTodo(text) {
const res = await fetch(`${API_BASE}/api/todos`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ text })
});
if (!res.ok) throw new Error("Failed to add todo");
return res.json();
}


export async function toggleTodo(id, completed) {
const res = await fetch(`${API_BASE}/api/todos/${id}`, {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ completed })
});
if (!res.ok) throw new Error("Failed to update todo");
return res.json();
}


export async function deleteTodo(id) {
const res = await fetch(`${API_BASE}/api/todos/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error("Failed to delete todo");
}