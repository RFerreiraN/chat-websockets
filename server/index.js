import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

dotenv.config()

const PORT = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: true
})

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    username TEXT
  )
`)

io.on('connection', async (socket) => {
  console.log('un usuario se ha conectado!!')

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado!!')
  })

  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'Desconocido'
    try {
      result = await db.execute({
        sql: 'INSERT INTO mensajes (content, username) VALUES (:msg, :username)',
        args: { msg, username }
      })
    } catch (error) {
      console.error(error)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString(), username, socket.id)
  })

  if (!socket.recovered) { // Para recuperar todos los datos cuando un nuevo usuario se conecte
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, username FROM mensajes WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id, row.username)
      })
    } catch (error) {
      console.error('Error recuperando los mensajes', error)
    }
  }
})

app.use(logger('dev'))
app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`Server Listening on port: http://localhost:${PORT}`)
})
