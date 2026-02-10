import express from 'express'
import logger from 'morgan'

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(logger('dev'))
app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.listen(PORT, () => {
  console.log(`Server Listening on port: http://localhost:${PORT}`)
})
