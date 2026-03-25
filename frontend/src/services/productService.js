// src/services/productService.js
import { auth } from '../lib/auth.svelte.js'

const BASE = '/api'

function headers(json = true) {
  const h = {}
  if (json) h['Content-Type'] = 'application/json'
  const token = auth.getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export async function getProducts(name = '') {
  const url = name ? `${BASE}/productos?name=${encodeURIComponent(name)}` : `${BASE}/productos`
  const res = await fetch(url, { headers: headers() })
  if (res.status === 401) throw new Error('401 – no autenticado')
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function createProduct(data) {
  // Si tiene imagen usamos FormData, si no JSON
  let body, h
  if (data.imagen instanceof File) {
    const fd = new FormData()
    fd.append('nombre', data.nombre)
    fd.append('precio', data.precio)
    fd.append('imagen', data.imagen)
    body = fd
    h = { 'Authorization': `Bearer ${auth.getToken()}` }
  } else {
    body = JSON.stringify(data)
    h = headers()
  }
  const res = await fetch(`${BASE}/productos`, { method: 'POST', headers: h, body })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  if (!res.ok) throw new Error('Error al eliminar producto')
  return res.json()
}
