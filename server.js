const express = require('express');
const prisma = require('./db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API is running' });
});

// GET /tasks            -> list all tasks
// GET /tasks?done=true  -> filter by completion status (matches index.js --done/--pending)
app.get('/tasks', async (req, res) => {
  try {
    const { done } = req.query;
    const where = {};
    if (done !== undefined) {
      where.done = done === 'true';
    }
    const tasks = await prisma.task.findMany({ where, orderBy: { id: 'asc' } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks -> create a task. Body: { "text": "Buy groceries" }
app.post('/tasks', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required and must be a non-empty string' });
    }
    const task = await prisma.task.create({ data: { text: text.trim() } });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id -> mark a task done (matches index.js's "complete" command)
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data: { done: true, completedAt: new Date() },
    });
    res.json(task);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Task not found' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id -> delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Task not found' });
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
