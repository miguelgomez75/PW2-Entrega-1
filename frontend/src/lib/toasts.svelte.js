// src/lib/toasts.svelte.js
// $state() a nivel de módulo – válido en archivos .svelte.js
let list = $state([])

function add(message, type = 'info', duration = 3500) {
  const id = Date.now()
  list = [...list, { id, message, type }]
  setTimeout(() => remove(id), duration)
}

function remove(id) {
  list = list.filter(t => t.id !== id)
}

export const toasts = {
  get toasts() { return list },
  add,
  remove,
  success(msg) { add(msg, 'success') },
  error(msg)   { add(msg, 'error') },
  info(msg)    { add(msg, 'info') }
}
