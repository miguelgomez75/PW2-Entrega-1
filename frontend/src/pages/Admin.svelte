<script>
  import { auth } from '../lib/auth.svelte.js'
  import { toasts } from '../lib/toasts.svelte.js'
  import { getUsers, createUser, updateUser, deleteUser } from '../services/userService.js'
  import UserRow from '../components/UserRow.svelte'

  let { onNavigate } = $props()

  // $state() - estado principal
  let users   = $state([])
  let loading = $state(true)

  // Estado del formulario de nuevo usuario
  let newUsername = $state('')
  let newPassword = $state('')
  let newRole     = $state('user')
  let creating    = $state(false)
  let formErrors  = $state({})

  // $derived() - contadores
  const adminCount = $derived(users.filter(u => u.role === 'admin').length)
  const userCount  = $derived(users.filter(u => u.role === 'user').length)

  // $effect() - guardia de permisos (sólo se re-ejecuta si cambia auth)
  $effect(() => {
    if (!auth.isAuthenticated) { onNavigate('login'); return }
    if (!auth.isAdmin)         { onNavigate('productos'); return }
  })

  // Carga inicial al montar
  $effect(() => {
    loadUsers()
    return () => {}
  })

  async function loadUsers() {
    loading = true
    try {
      users = await getUsers()
    } catch (err) {
      toasts.error('Error al cargar usuarios')
    } finally {
      loading = false
    }
  }

  function validateForm() {
    const errs = {}
    if (!newUsername.trim()) errs.username = 'Obligatorio'
    if (newPassword.length < 4) errs.password = 'Mínimo 4 caracteres'
    formErrors = errs
    return Object.keys(errs).length === 0
  }

  async function handleCreateUser() {
    if (!validateForm()) return
    creating = true
    try {
      await createUser({ username: newUsername.trim(), password: newPassword, role: newRole })
      toasts.success('Usuario creado')
      newUsername = ''
      newPassword = ''
      newRole = 'user'
      formErrors = {}
      await loadUsers()
    } catch (err) {
      toasts.error(err.message)
    } finally {
      creating = false
    }
  }

  // Callback de UserRow (onChangeRole)
  async function handleChangeRole(id, role) {
    try {
      await updateUser(id, { role })
      toasts.success('Rol actualizado')
      await loadUsers()
    } catch (err) {
      toasts.error(err.message)
    }
  }

  // Callback de UserRow (onDelete)
  async function handleDeleteUser(id) {
    try {
      await deleteUser(id)
      toasts.success('Usuario eliminado')
      await loadUsers()
    } catch (err) {
      toasts.error(err.message)
    }
  }
</script>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">ADMINISTRACIÓN</h1>
    <div class="stats">
      <div class="stat">
        <span class="stat-val">{adminCount}</span>
        <span class="stat-label">Admins</span>
      </div>
      <div class="stat">
        <span class="stat-val">{userCount}</span>
        <span class="stat-label">Usuarios</span>
      </div>
    </div>
  </div>

  <!-- Formulario nuevo usuario -->
  <section class="section">
    <h2 class="section-title">Nuevo Usuario</h2>
    <div class="new-user-form">
      <div class="form-row">
        <div class="field">
          <label class="label" for="nu-name">Username</label>
          <input
            id="nu-name"
            class="input {formErrors.username ? 'input--error' : ''}"
            type="text"
            placeholder="username"
            bind:value={newUsername}
            disabled={creating}
          />
          {#if formErrors.username}
            <span class="field-error">{formErrors.username}</span>
          {/if}
        </div>

        <div class="field">
          <label class="label" for="nu-pass">Contraseña</label>
          <input
            id="nu-pass"
            class="input {formErrors.password ? 'input--error' : ''}"
            type="password"
            placeholder="••••••"
            bind:value={newPassword}
            disabled={creating}
          />
          {#if formErrors.password}
            <span class="field-error">{formErrors.password}</span>
          {/if}
        </div>

        <div class="field">
          <label class="label" for="nu-role">Rol</label>
          <select id="nu-role" class="input select" bind:value={newRole} disabled={creating}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <button class="btn-create" onclick={handleCreateUser} disabled={creating}>
          {#if creating}
            <span class="spinner"></span>
          {:else}
            + Crear
          {/if}
        </button>
      </div>
    </div>
  </section>

  <!-- Tabla de usuarios -->
  <section class="section">
    <h2 class="section-title">Usuarios <span class="count-badge">{users.length}</span></h2>

    {#if loading}
      <div class="loading-rows">
        {#each Array(4) as _}
          <div class="row-skeleton"></div>
        {/each}
      </div>
    {:else if users.length === 0}
      <div class="empty">Sin usuarios</div>
    {:else}
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th class="th">Usuario</th>
              <th class="th">Rol</th>
              <th class="th th--right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user (user._id)}
              <UserRow
                {user}
                onChangeRole={handleChangeRole}
                onDelete={handleDeleteUser}
              />
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>

<style>
  .page { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: #fff;
    letter-spacing: 0.2em;
    margin: 0;
  }

  .stats { display: flex; gap: 1.5rem; }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .stat-val {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    color: #f0e040;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .section { margin-bottom: 2.5rem; }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #888;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .count-badge {
    background: #1a1a1a;
    color: #555;
    font-size: 0.7rem;
    padding: 0.15rem 0.45rem;
    border-radius: 20px;
  }

  .new-user-form {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 1.25rem;
  }

  .form-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .field { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 140px; }

  .label {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .input {
    background: #0d0d0d;
    border: 1px solid #2a2a2a;
    border-radius: 5px;
    color: #eee;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    padding: 0.6rem 0.8rem;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }
  .input:focus { border-color: #f0e040; }
  .input--error { border-color: #E74C3C; }
  .input:disabled { opacity: 0.4; }

  .select { cursor: pointer; }
  .select option { background: #111; }

  .field-error {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #E74C3C;
  }

  .btn-create {
    background: #f0e040;
    border: none;
    border-radius: 5px;
    color: #0d0d0d;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    padding: 0.62rem 1.25rem;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    align-self: flex-end;
    height: 36px;
  }
  .btn-create:hover:not(:disabled) { background: #fff176; }
  .btn-create:disabled { opacity: 0.4; cursor: not-allowed; }

  .table-wrap {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
  }

  .table { width: 100%; border-collapse: collapse; }

  .th {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #1a1a1a;
    text-align: left;
    background: #0d0d0d;
  }

  .th--right { text-align: right; }

  .loading-rows { display: flex; flex-direction: column; gap: 0.5rem; }

  .row-skeleton {
    height: 44px;
    background: linear-gradient(90deg, #111 25%, #161616 50%, #111 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
  }

  .empty {
    text-align: center;
    padding: 3rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    color: #444;
  }

  .spinner {
    width: 12px; height: 12px;
    border: 2px solid #0d0d0d;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
