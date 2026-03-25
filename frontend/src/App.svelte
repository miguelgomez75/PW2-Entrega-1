<script>
  import { auth } from './lib/auth.svelte.js'
  import { toasts } from './lib/toasts.svelte.js'
  import Navbar from './components/Navbar.svelte'
  import Toast from './components/Toast.svelte'
  import Login from './pages/Login.svelte'
  import Productos from './pages/Productos.svelte'
  import Perfil from './pages/Perfil.svelte'
  import Admin from './pages/Admin.svelte'

  // $state() - página actual (navegación SPA)
  // Si hay sesión guardada arrancamos en productos, si no en login
  let currentPage = $state(auth.isAuthenticated ? 'productos' : 'login')

  function navigate(page) {
    currentPage = page
  }

  // $effect() - redirigir al login si el token desaparece
  // (p.ej. caducó o el usuario lo borró manualmente)
  $effect(() => {
    if (!auth.isAuthenticated && (currentPage === 'perfil' || currentPage === 'admin')) {
      currentPage = 'login'
    }
  })

  // $effect() - redirigir si no-admin intenta acceder a /admin
  $effect(() => {
    if (currentPage === 'admin' && auth.isAuthenticated && !auth.isAdmin) {
      currentPage = 'productos'
      toasts.error('Acceso restringido a administradores')
    }
  })
</script>

<div class="app">
  <Navbar {currentPage} onNavigate={navigate} />

  <main class="main">
    {#if currentPage === 'login'}
      <Login onNavigate={navigate} />
    {:else if currentPage === 'productos'}
      <Productos onNavigate={navigate} />
    {:else if currentPage === 'perfil'}
      {#if auth.isAuthenticated}
        <Perfil onNavigate={navigate} />
      {:else}
        <Login onNavigate={navigate} />
      {/if}
    {:else if currentPage === 'admin'}
      {#if auth.isAdmin}
        <Admin onNavigate={navigate} />
      {:else}
        <Productos onNavigate={navigate} />
      {/if}
    {/if}
  </main>

  <!-- Toast container - global -->
  <div class="toast-container">
    {#each toasts.toasts as t (t.id)}
      <Toast message={t.message} type={t.type} onClose={() => toasts.remove(t.id)} />
    {/each}
  </div>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background: #0d0d0d;
    color: #eee;
    font-family: 'DM Mono', monospace;
    -webkit-font-smoothing: antialiased;
  }

  :global(::-webkit-scrollbar) { width: 6px; }
  :global(::-webkit-scrollbar-track) { background: #0d0d0d; }
  :global(::-webkit-scrollbar-thumb) { background: #2a2a2a; border-radius: 3px; }
  :global(::-webkit-scrollbar-thumb:hover) { background: #3a3a3a; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main { flex: 1; }

  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 500;
  }
</style>
