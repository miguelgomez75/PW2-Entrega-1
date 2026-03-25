<script>
  import { auth } from '../lib/auth.svelte.js'

  // $props() con callbacks Svelte 5
  let { currentPage, onNavigate } = $props()

  // $derived() - nombre de usuario en cabecera
  const displayName = $derived(auth.username ? auth.username.toUpperCase() : '')
</script>

<nav class="navbar">
  <div class="navbar__brand" onclick={() => onNavigate('productos')}>
    <span class="brand-icon">◈</span>
    <span class="brand-name">TIENDA</span>
  </div>

  <div class="navbar__links">
    <button
      class="nav-btn {currentPage === 'productos' ? 'nav-btn--active' : ''}"
      onclick={() => onNavigate('productos')}
    >
      <span class="nav-label">Productos</span>
    </button>

    {#if auth.isAuthenticated}
      <button
        class="nav-btn {currentPage === 'perfil' ? 'nav-btn--active' : ''}"
        onclick={() => onNavigate('perfil')}
      >
        <span class="nav-label">Perfil</span>
      </button>

      {#if auth.isAdmin}
        <button
          class="nav-btn {currentPage === 'admin' ? 'nav-btn--active' : ''}"
          onclick={() => onNavigate('admin')}
        >
          <span class="nav-label">Admin</span>
          <span class="nav-badge">ADM</span>
        </button>
      {/if}

      <div class="navbar__user">
        <span class="user-pill">{displayName}</span>
        <button class="logout-btn" onclick={() => { auth.logout(); onNavigate('login') }}>
          Salir
        </button>
      </div>
    {:else}
      <button
        class="nav-btn nav-btn--cta {currentPage === 'login' ? 'nav-btn--active' : ''}"
        onclick={() => onNavigate('login')}
      >
        Entrar
      </button>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 60px;
    background: #0d0d0d;
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar__brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;
  }

  .brand-icon {
    color: #f0e040;
    font-size: 1.4rem;
  }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 0.25em;
    color: #fff;
  }

  .navbar__links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nav-btn {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    padding: 0.4rem 0.9rem;
    border-radius: 4px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    text-transform: uppercase;
  }

  .nav-btn:hover { color: #fff; background: #1a1a1a; }

  .nav-btn--active {
    color: #f0e040;
    background: rgba(240, 224, 64, 0.08);
  }

  .nav-btn--active::before {
    content: '›';
    color: #f0e040;
  }

  .nav-badge {
    background: #f0e040;
    color: #0d0d0d;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
  }

  .nav-btn--cta {
    background: #f0e040;
    color: #0d0d0d;
    font-weight: 700;
  }

  .nav-btn--cta:hover {
    background: #fff176;
    color: #0d0d0d;
  }

  .navbar__user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.75rem;
    padding-left: 0.75rem;
    border-left: 1px solid #333;
  }

  .user-pill {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #f0e040;
    background: rgba(240, 224, 64, 0.1);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    letter-spacing: 0.1em;
  }

  .logout-btn {
    background: none;
    border: 1px solid #333;
    color: #666;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    transition: all 0.15s;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .logout-btn:hover {
    border-color: #E74C3C;
    color: #E74C3C;
  }

  @media (max-width: 600px) {
    .navbar { padding: 0 1rem; }
    .nav-label { display: none; }
    .brand-name { font-size: 0.9rem; }
  }
</style>
