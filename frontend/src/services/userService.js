// src/services/userService.js
import { auth } from '../lib/auth.svelte.js'

const BASE = '/api'

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.getToken()}`
  }
}

export async function getUsers() {
  const res = await fetch(`${BASE}/users`, { headers: headers() })
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

export async function createUser(data) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Error al crear usuario')
  }
  return res.json()
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al actualizar usuario')
  return res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  if (!res.ok) throw new Error('Error al eliminar usuario')
  return res.json()
}
