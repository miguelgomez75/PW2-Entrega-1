<script>
  import { auth } from '../lib/auth.svelte.js'
  import { toasts } from '../lib/toasts.svelte.js'

  let { onNavigate } = $props()

  // $derived() - datos del usuario en cabecera
  const roleLabel = $derived(auth.isAdmin ? 'Administrador' : 'Usuario')
  const initials  = $derived(auth.username ? auth.username.slice(0, 2).toUpperCase() : '??')
</script>

<div class="page">
  <h1 class="page-title">PERFIL</h1>

  <div class="profile-card">
    <div class="avatar">{initials}</div>

    <div class="profile-info">
      <div class="info-row">
        <span class="info-label">Usuario</span>
        <span class="info-value">{auth.username}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Rol</span>
        <span class="info-value role role--{auth.user?.role}">{roleLabel}</span>
      </div>
    </div>

    <button
      class="btn-logout"
      onclick={() => { auth.logout(); toasts.info('Sesión cerrada'); onNavigate('login') }}
    >
      Cerrar sesión
    </button>
  </div>
</div>

<style>
  .page { max-width: 480px; margin: 4rem auto; padding: 0 1.5rem; }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: #fff;
    letter-spacing: 0.2em;
    margin: 0 0 2rem;
  }

  .profile-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(240,224,64,0.12);
    border: 2px solid #f0e040;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: #f0e040;
    letter-spacing: 0.05em;
  }

  .profile-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #0d0d0d;
    border-radius: 6px;
  }

  .info-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .info-value {
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: #eee;
  }

  .role {
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .role--admin {
    background: rgba(240,224,64,0.12);
    color: #f0e040;
    border: 1px solid rgba(240,224,64,0.3);
  }

  .role--user {
    background: rgba(52,152,219,0.1);
    color: #3498DB;
    border: 1px solid rgba(52,152,219,0.3);
  }

  .btn-logout {
    width: 100%;
    padding: 0.75rem;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: none;
    border: 1px solid rgba(231,76,60,0.3);
    color: #E74C3C;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-logout:hover {
    background: rgba(231,76,60,0.1);
    border-color: #E74C3C;
  }
</style>
