<script>
  // $props() con callbacks - Svelte 5
  let { product = null, onSave, onCancel } = $props()

  // $state() para el formulario
  let nombre = $state(product?.nombre ?? '')
  let precio = $state(product?.precio ?? '')
  let imagen = $state(null)
  let saving = $state(false)
  let errors = $state({})

  const isEditing = $derived(!!product?._id)
  const title = $derived(isEditing ? 'Editar Producto' : 'Nuevo Producto')

  // Validación frontend
  function validate() {
    const errs = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    if (!precio || isNaN(Number(precio)) || Number(precio) < 0) {
      errs.precio = 'Precio válido requerido (≥ 0)'
    }
    errors = errs
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    saving = true
    try {
      const data = { nombre: nombre.trim(), precio: Number(precio) }
      if (imagen) data.imagen = imagen
      // Al actualizar no enviamos la imagen si no se eligió una nueva
      await onSave(data, product?._id)
    } catch {
      // el error ya fue mostrado por el padre mediante toasts
    } finally {
      saving = false
    }
  }

  function handleFile(e) {
    imagen = e.target.files[0] || null
  }
</script>

<div class="modal-overlay" onclick={onCancel}>
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <div class="modal__header">
      <h2 class="modal__title">{title}</h2>
      <button class="modal__close" onclick={onCancel}>×</button>
    </div>

    <div class="modal__body">
      <div class="field">
        <label class="label" for="nombre">Nombre</label>
        <input
          id="nombre"
          class="input {errors.nombre ? 'input--error' : ''}"
          type="text"
          placeholder="Nombre del producto"
          bind:value={nombre}
          disabled={saving}
        />
        {#if errors.nombre}<span class="field-error">{errors.nombre}</span>{/if}
      </div>

      <div class="field">
        <label class="label" for="precio">Precio (€)</label>
        <input
          id="precio"
          class="input {errors.precio ? 'input--error' : ''}"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          bind:value={precio}
          disabled={saving}
        />
        {#if errors.precio}<span class="field-error">{errors.precio}</span>{/if}
      </div>

      <div class="field">
        <label class="label" for="imagen">Imagen (opcional)</label>
        <input
          id="imagen"
          class="input-file"
          type="file"
          accept="image/*"
          onchange={handleFile}
          disabled={saving}
        />
      </div>
    </div>

    <div class="modal__footer">
      <button class="btn-cancel" onclick={onCancel} disabled={saving}>Cancelar</button>
      <button class="btn-save" onclick={handleSubmit} disabled={saving}>
        {#if saving}
          <span class="spinner"></span> Guardando...
        {:else}
          {isEditing ? 'Actualizar' : 'Crear'}
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }

  .modal {
    background: #111;
    border: 1px solid #333;
    border-radius: 10px;
    width: 100%;
    max-width: 440px;
    margin: 1rem;
    animation: slideUp 0.25s ease;
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #222;
  }

  .modal__title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: #f0e040;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .modal__close {
    background: none; border: none;
    color: #666; cursor: pointer;
    font-size: 1.5rem; line-height: 1;
    transition: color 0.15s;
  }
  .modal__close:hover { color: #fff; }

  .modal__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

  .field { display: flex; flex-direction: column; gap: 0.4rem; }

  .label {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .input {
    background: #0d0d0d;
    border: 1px solid #333;
    border-radius: 5px;
    color: #eee;
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    padding: 0.65rem 0.9rem;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }
  .input:focus { border-color: #f0e040; }
  .input--error { border-color: #E74C3C; }
  .input:disabled { opacity: 0.5; }

  .input-file {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: #888;
    background: #0d0d0d;
    border: 1px dashed #333;
    border-radius: 5px;
    padding: 0.6rem;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
  }

  .field-error {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #E74C3C;
  }

  .modal__footer {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
  }

  .btn-cancel, .btn-save {
    flex: 1;
    padding: 0.7rem;
    border-radius: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }
  .btn-cancel {
    background: none;
    border: 1px solid #333;
    color: #888;
  }
  .btn-cancel:hover { border-color: #666; color: #eee; }
  .btn-save {
    background: #f0e040;
    border: none;
    color: #0d0d0d;
    font-weight: 700;
  }
  .btn-save:hover { background: #fff176; }
  .btn-save:disabled, .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 12px; height: 12px;
    border: 2px solid #0d0d0d;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
</style>
