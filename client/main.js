import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

const socket = io({
  auth: {
    serverOffset: 0
  }
})
const form = document.getElementById('form')
const input = document.getElementById('input')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (input.value) {
    socket.emit('chat message', input.value)
    input.value = ''
  }
})

const mensajes = document.getElementById('mensajes')

socket.on('chat message', (msg, serverOffset) => {
  const li = document.createElement('li')
  li.textContent = msg
  mensajes.appendChild(li)
  socket.auth.serverOffset = serverOffset
})
