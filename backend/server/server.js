import express from "express";
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());


let todos = [
{ id: 1, text: "Learn React", completed: false },
{ id: 2, text: "Build an API", completed: true }
];

app.get("/api/todos", (req, res) => {
res.json(todos);
});


app.post("/api/todos", (req, res) => {
const { text } = req.body;
if (!text || !text.trim()) {
return res.status(400).json({ error: "Text is required" });
}
const todo = { id: Date.now(), text: text.trim(), completed: false };
todos.unshift(todo);
res.status(201).json(todo);
});


app.patch("/api/todos/:id", (req, res) => {
const id = Number(req.params.id);
const todo = todos.find(t => t.id === id);
if (!todo) return res.status(404).json({ error: "Not found" });


const { text, completed } = req.body;
if (typeof text === "string") todo.text = text.trim();
if (typeof completed === "boolean") todo.completed = completed;


res.json(todo);
});


app.delete("/api/todos/:id", (req, res) => {
const id = Number(req.params.id);
const before = todos.length;
todos = todos.filter(t => t.id !== id);
if (todos.length === before) return res.status(404).json({ error: "Not found" });
res.status(204).end();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));