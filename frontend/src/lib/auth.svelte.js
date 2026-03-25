// src/lib/auth.svelte.js
// Estado global de autenticación usando runes de Svelte 5

// $state() a nivel de módulo – válido en archivos .svelte.js
let token = $state(localStorage.getItem('token') || null)
let user  = $state(JSON.parse(localStorage.getItem('user') || 'null'))

// $derived() a nivel de módulo
const isAuthenticated = $derived(!!token)
const isAdmin         = $derived(user?.role === 'admin')
const username        = $derived(user?.username || '')

function login(newToken, userData) {
  token = newToken
  user  = userData
  localStorage.setItem('token', newToken)
  localStorage.setItem('user', JSON.stringify(userData))
}

function logout() {
  token = null
  user  = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

function getToken() {
  return token
}

export const auth = {
  get token()           { return token },
  get user()            { return user },
  get isAuthenticated() { return isAuthenticated },
  get isAdmin()         { return isAdmin },
  get username()        { return username },
  login,
  logout,
  getToken
}
