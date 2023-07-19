import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) return res.writeHead(400).end(JSON.stringify({ error: "Title is required" }));
      if (!description) return res.writeHead(400).end(JSON.stringify({ error: "Description is required" }));

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        updated_at: new Date(),
        created_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!id) return res.writeHead(400).end(JSON.stringify({ error: "Id is required" }));
      if (!title) return res.writeHead(400).end(JSON.stringify({ error: "Title is required" }));
      if (!description) return res.writeHead(400).end(JSON.stringify({ error: "Description is required" }));

      const taskFinded = database.select('tasks', { id });

      if (!taskFinded || !taskFinded.length) return res.writeHead(404).end(JSON.stringify({ error: "Task not found" }));

      database.update('tasks', id, {
        ...taskFinded[0],
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) return res.writeHead(400).end(JSON.stringify({ error: "Id is required" }));

      const taskFinded = database.select('tasks', { id });

      if (!taskFinded || !taskFinded.length) return res.writeHead(404).end(JSON.stringify({ error: "Task not found" }));

      database.update('tasks', id, {
        ...taskFinded[0],
        completed_at: new Date(),
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) return res.writeHead(400).end(JSON.stringify({ error: "Id is required" }));

      const taskFinded = database.select('tasks', { id });

      if (!taskFinded || !taskFinded.length) return res.writeHead(404).end(JSON.stringify({ error: "Task not found" }));

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]
