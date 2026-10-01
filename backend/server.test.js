const test = require('node:test');
const assert = require('node:assert');
const app = require('./server');

test('health, create and list tasks', async () => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;

  const health = await fetch(`${base}/api/health`);
  assert.strictEqual(health.status, 200);

  const created = await fetch(`${base}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'test task' })
  });
  assert.strictEqual(created.status, 201);

  const bad = await fetch(`${base}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.strictEqual(bad.status, 400);

  const list = await (await fetch(`${base}/api/tasks`)).json();
  assert.ok(list.some(t => t.title === 'test task'));

  server.close();
});
