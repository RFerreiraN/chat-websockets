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
    content TEXT
  )
`)

io.on('connection', (socket) => {
  console.log('un usuario se ha conectado!!')

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado!!')
  })

  socket.on('chat message', async (msg) => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO mensajes (content) VALUES (:msg)',
        args: { msg }
      })
    } catch (error) {
      console.error(error)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString())
  })
})

app.use(logger('dev'))
app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`Server Listening on port: http://localhost:${PORT}`)
})
