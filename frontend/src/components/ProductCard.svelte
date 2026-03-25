<script>
  import { auth } from '../lib/auth.svelte.js'

  // $props() con callbacks al padre - Svelte 5
  let { product, onEdit, onDelete } = $props()

  // $derived() - precio formateado
  const precioFormateado = $derived(
    typeof product.precio === 'number'
      ? product.precio.toFixed(2)
      : Number(product.precio || 0).toFixed(2)
  )

  const activo = $derived(product.activo !== false)

  let confirmDelete = $state(false)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(product._id)
      confirmDelete = false
    } else {
      confirmDelete = true
      setTimeout(() => { confirmDelete = false }, 3000)
    }
  }
</script>

<article class="card {!activo ? 'card--inactive' : ''}">
  <div class="card__status">{activo ? 'ACTIVO' : 'INACTIVO'}</div>

  {#if product.imagen}
    <div class="card__img-wrap">
      <img src="/uploads/{product.imagen}" alt={product.nombre} class="card__img" />
    </div>
  {:else}
    <div class="card__img-placeholder">
      <span>◈</span>
    </div>
  {/if}

  <div class="card__body">
    <h3 class="card__name">{product.nombre}</h3>
    <div class="card__price">
      <span class="price-sym">€</span>
      <span class="price-val">{precioFormateado}</span>
    </div>
  </div>

  {#if auth.isAdmin}
    <div class="card__actions">
      <button class="btn-edit" onclick={() => onEdit(product)}>Editar</button>
      <button
        class="btn-delete {confirmDelete ? 'btn-delete--confirm' : ''}"
        onclick={handleDelete}
      >
        {confirmDelete ? '¿Seguro?' : 'Eliminar'}
      </button>
    </div>
  {/if}
</article>

<style>
  .card {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-3px);
    border-color: #f0e040;
  }

  .card--inactive {
    opacity: 0.55;
    filter: grayscale(0.5);
  }

  .card__status {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    background: rgba(46, 204, 113, 0.15);
    color: #2ECC71;
    border: 1px solid rgba(46, 204, 113, 0.3);
  }

  .card--inactive .card__status {
    background: rgba(180,180,180,0.1);
    color: #888;
    border-color: #444;
  }

  .card__img-wrap {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: #0a0a0a;
  }

  .card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }

  .card:hover .card__img { transform: scale(1.04); }

  .card__img-placeholder {
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: #333;
  }

  .card__body {
    padding: 1rem;
    flex: 1;
  }

  .card__name {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #eee;
    margin: 0 0 0.6rem;
    line-height: 1.3;
  }

  .card__price {
    display: flex;
    align-items: baseline;
    gap: 0.15rem;
  }

  .price-sym {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #f0e040;
  }

  .price-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #f0e040;
  }

  .card__actions {
    display: flex;
    gap: 0.5rem;
    padding: 0 1rem 1rem;
  }

  .btn-edit, .btn-delete {
    flex: 1;
    padding: 0.45rem;
    border-radius: 4px;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border: none;
  }

  .btn-edit {
    background: rgba(240,224,64,0.1);
    color: #f0e040;
    border: 1px solid rgba(240,224,64,0.3);
  }

  .btn-edit:hover {
    background: rgba(240,224,64,0.2);
  }

  .btn-delete {
    background: rgba(231,76,60,0.1);
    color: #E74C3C;
    border: 1px solid rgba(231,76,60,0.3);
  }

  .btn-delete:hover { background: rgba(231,76,60,0.2); }

  .btn-delete--confirm {
    background: #E74C3C;
    color: #fff;
    animation: pulse 0.5s;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
</style>
