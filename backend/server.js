const express = require('express');
const app = express();
app.use(express.json());

// Data lives in memory. It is lost on every restart (add a database later).
let tasks = [{ id: 1, title: 'Deploy this app to OpenShift' }];
let nextId = 2;

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = { id: nextId++, title };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== Number(req.params.id));
  res.status(204).end();
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Backend running on port ${port}`));
}
