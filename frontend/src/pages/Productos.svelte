<script>
  import { auth } from '../lib/auth.svelte.js'
  import { toasts } from '../lib/toasts.svelte.js'
  import {
    getProducts, createProduct, updateProduct, deleteProduct
  } from '../services/productService.js'
  import ProductCard from '../components/ProductCard.svelte'
  import ProductForm from '../components/ProductForm.svelte'

  let { onNavigate } = $props()

  // $state() - estado principal de la página
  let products = $state([])
  let loading  = $state(true)
  let search   = $state('')
  let showForm = $state(false)
  let editing  = $state(null) // producto en edición

  // $derived() - productos filtrados por búsqueda en cliente
  const filtered = $derived(
    search.trim()
      ? products.filter(p =>
          p.nombre?.toLowerCase().includes(search.toLowerCase())
        )
      : products
  )

  const totalCount = $derived(filtered.length)

  // Cargar productos al montar el componente (una sola vez)
  $effect(() => {
    if (!auth.isAuthenticated) {
      onNavigate('login')
      return () => {}
    }
    loadProducts()
    return () => {}
  })

  async function loadProducts() {
    loading = true
    try {
      products = await getProducts()
    } catch (err) {
      // Si el backend responde 401, redirigir al login
      if (err.message.includes('401') || err.message.includes('autenticar')) {
        onNavigate('login')
      } else {
        toasts.error('Error al cargar productos')
      }
    } finally {
      loading = false
    }
  }

  // Abrir formulario de nuevo producto
  function openNew() {
    if (!auth.isAuthenticated) { onNavigate('login'); return }
    editing = null
    showForm = true
  }

  function openEdit(product) {
    editing = product
    showForm = true
  }

  function closeForm() {
    showForm = false
    editing = null
  }

  // Callback del formulario (onSave)
  async function handleSave(data, id) {
    try {
      if (id) {
        await updateProduct(id, data)
        toasts.success('Producto actualizado')
      } else {
        await createProduct(data)
        toasts.success('Producto creado')
      }
      closeForm()
      await loadProducts()
    } catch (err) {
      toasts.error(err.message)
    }
  }

  // Callback del card (onDelete)
  async function handleDelete(id) {
    try {
      await deleteProduct(id)
      toasts.success('Producto eliminado')
      await loadProducts()
    } catch (err) {
      toasts.error(err.message)
    }
  }
</script>

<div class="page">
  <div class="page-header">
    <div class="page-header__left">
      <h1 class="page-title">PRODUCTOS</h1>
      <span class="page-count">{totalCount} items</span>
    </div>

    <div class="page-header__right">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input
          class="search-input"
          type="text"
          placeholder="Buscar..."
          bind:value={search}
        />
      </div>

      {#if auth.isAdmin}
        <button class="btn-new" onclick={openNew}>+ Nuevo</button>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="loading-grid">
      {#each Array(6) as _}
        <div class="skeleton"></div>
      {/each}
    </div>
  {:else if filtered.length === 0}
    <div class="empty">
      <span class="empty-icon">◈</span>
      <p>{search ? 'Sin resultados para "' + search + '"' : 'No hay productos'}</p>
    </div>
  {:else}
    <div class="products-grid">
      {#each filtered as product (product._id)}
        <ProductCard
          {product}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      {/each}
    </div>
  {/if}
</div>

{#if showForm}
  <ProductForm
    product={editing}
    onSave={handleSave}
    onCancel={closeForm}
  />
{/if}

<style>
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-header__left { display: flex; align-items: baseline; gap: 1rem; }
  .page-header__right { display: flex; align-items: center; gap: 0.75rem; }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: #fff;
    letter-spacing: 0.2em;
    margin: 0;
  }

  .page-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #555;
    letter-spacing: 0.05em;
  }

  .search-wrap {
    display: flex;
    align-items: center;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 0 0.75rem;
    gap: 0.5rem;
    transition: border-color 0.15s;
  }
  .search-wrap:focus-within { border-color: #f0e040; }

  .search-icon { color: #444; font-size: 1rem; }

  .search-input {
    background: none;
    border: none;
    color: #eee;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    padding: 0.6rem 0;
    outline: none;
    width: 160px;
  }
  .search-input::placeholder { color: #333; }

  .btn-new {
    background: #f0e040;
    border: none;
    border-radius: 6px;
    color: #0d0d0d;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    padding: 0.6rem 1.1rem;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
  }
  .btn-new:hover { background: #fff176; transform: translateY(-1px); }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }

  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }

  .skeleton {
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
    aspect-ratio: 3/4;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .empty {
    text-align: center;
    padding: 5rem 2rem;
    color: #444;
  }

  .empty-icon {
    display: block;
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty p {
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }
</style>
