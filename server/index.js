import express from 'express'

const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  res.send('<h1>Esto será el chat</h1>')
})

app.listen(PORT, () => {
  console.log(`Server Listening on port: http://localhost:${PORT}`)
})
