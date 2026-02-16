import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

const socket = io({
  auth: {
    serverOffset: 0
  }
})

const chat = document.getElementById('chat')
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

  mensajes.scrollTop = mensajes.scrollHeight
})

/* Codigo de autenticación */

const authForm = document.getElementById('authForm')
const nombre = document.getElementById('nombre')
const botonSesion = document.getElementById('botonSesion')

const dataLocaStorage = JSON.parse(localStorage.getItem('usuario') || '[]')

authForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const nombreValido = nombre.value.trim()
  if (!nombreValido) return false

  const usuarios = dataLocaStorage
  if (!usuarios.includes(nombreValido)) {
    usuarios.push(nombreValido)
  }

  localStorage.setItem('usuario', JSON.stringify(usuarios))

  nombre.value = ''

  const modalElement = document.getElementById('modalEstatico')
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()

  chat.style.display = 'flex'
  botonSesion.style.display = 'none'
})
