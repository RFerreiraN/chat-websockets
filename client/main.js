// import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

// const authForm = document.getElementById('authForm')
// const nombre = document.getElementById('nombre')
// const botonSesion = document.getElementById('botonSesion')

// const chat = document.getElementById('chat')
// const form = document.getElementById('form')
// const input = document.getElementById('input')

// const socket = io({
//   auth: {
//     serverOffset: 0,
//     username: nombre.value.trim()
//   }
// })

// form.addEventListener('submit', (e) => {
//   e.preventDefault()

//   if (input.value) {
//     socket.emit('chat message', input.value)
//     input.value = ''
//   }
// })

// const mensajes = document.getElementById('mensajes')

// socket.on('chat message', (msg, serverOffset) => {
//   const li = document.createElement('li')
//   li.textContent = msg
//   mensajes.appendChild(li)
//   socket.auth.serverOffset = serverOffset

//   mensajes.scrollTop = mensajes.scrollHeight
// })

// /* Codigo de autenticación */

// const dataLocaStorage = JSON.parse(localStorage.getItem('usuario') || '[]')

// authForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   const nombreValido = nombre.value.trim()
//   if (!nombreValido) return false

//   const usuarios = dataLocaStorage
//   if (!usuarios.includes(nombreValido)) {
//     usuarios.push(nombreValido)
//   }

//   localStorage.setItem('usuario', JSON.stringify(usuarios))

//   nombre.value = ''

//   const modalElement = document.getElementById('modalEstatico')
//   const modal = bootstrap.Modal.getInstance(modalElement)
//   modal.hide()

//   chat.style.display = 'flex'
//   botonSesion.style.display = 'none'
// })

import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js'

// 🔹 Elementos DOM
const authForm = document.getElementById('authForm')
const nombreInput = document.getElementById('nombre')
const botonSesion = document.getElementById('botonSesion')
const chat = document.getElementById('chat')
const form = document.getElementById('form')
const input = document.getElementById('input')
const mensajes = document.getElementById('mensajes')

chat.classList.add('oculto')

const STORAGE_KEY = 'usuarios'

let socket = null

// LocalStorage

function getUsuarios() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function guardarUsuario(nombre) {
  const nombreLimpio = nombre.trim()
  if (!nombreLimpio) return false

  const usuarios = getUsuarios()

  if (!usuarios.includes(nombreLimpio)) {
    usuarios.push(nombreLimpio)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios))
  }

  return true
}

//  Chat

function iniciarSocket(username) {
  socket = io({
    auth: {
      username,
      serverOffset: 0
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!input.value) return

    socket.emit('chat message', input.value)
    input.value = ''
  })

  // Recibir mensaje
  socket.on('chat message', (msg, serverOffset, username) => {
    const mensaje = `
    <li>
      <p>
        <small>
          <strong>
            ${username}
          </strong>
        </small>
      </p>
        ${msg}
    </li>`
    mensajes.insertAdjacentHTML('beforeend', mensaje)

    socket.auth.serverOffset = serverOffset
    mensajes.scrollTop = mensajes.scrollHeight
  })
}

//  Autenticación

authForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const nombreValido = nombreInput.value.trim()
  if (!nombreValido) return

  guardarUsuario(nombreValido)

  // UI
  nombreInput.value = ''
  chat.classList.remove('oculto')
  botonSesion.classList.add('oculto')

  const modalElement = document.getElementById('modalEstatico')
  const modal = bootstrap.Modal.getInstance(modalElement)
  modal.hide()

  // Iniciar chat
  iniciarSocket(nombreValido)
})
