<script>
  import { auth } from '../lib/auth.svelte.js'
  import { login as loginService } from '../services/authService.js'
  import { toasts } from '../lib/toasts.svelte.js'

  let { onNavigate } = $props()

  // $state() para el formulario
  let username = $state('')
  let password = $state('')
  let loading = $state(false)
  let error = $state('')

  // $derived() - botón deshabilitado
  const canSubmit = $derived(username.trim().length > 0 && password.length > 0 && !loading)

  async function handleLogin() {
    if (!canSubmit) return
    loading = true
    error = ''
    try {
      const { token } = await loginService(username.trim(), password)
      // Decodificar payload del JWT para obtener datos del usuario
      const payload = JSON.parse(atob(token.split('.')[1]))
      auth.login(token, { username: payload.username, role: payload.role })
      toasts.success(`Bienvenido, ${payload.username}`)
      onNavigate('productos')
    } catch (err) {
      error = err.message
      toasts.error(err.message)
    } finally {
      loading = false
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleLogin()
  }
</script>

<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <span class="login-icon">◈</span>
      <h1 class="login-title">ACCESO</h1>
      <p class="login-sub">Introduce tus credenciales para continuar</p>
    </div>

    <div class="login-form">
      <div class="field">
        <label class="label" for="uname">Usuario</label>
        <input
          id="uname"
          class="input"
          type="text"
          placeholder="admin / user"
          bind:value={username}
          onkeydown={handleKeydown}
          disabled={loading}
          autocomplete="username"
        />
      </div>

      <div class="field">
        <label class="label" for="pass">Contraseña</label>
        <input
          id="pass"
          class="input"
          type="password"
          placeholder="••••••••"
          bind:value={password}
          onkeydown={handleKeydown}
          disabled={loading}
          autocomplete="current-password"
        />
      </div>

      {#if error}
        <div class="login-error">{error}</div>
      {/if}

      <button
        class="login-btn"
        onclick={handleLogin}
        disabled={!canSubmit}
      >
        {#if loading}
          <span class="spinner"></span> Entrando...
        {:else}
          Entrar →
        {/if}
      </button>
    </div>

    <div class="login-hint">
      <span>Demo: <code>admin / admin123</code> · <code>user / user123</code></span>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 0%, #1a1a0a 0%, #0d0d0d 60%);
    padding: 2rem;
  }

  .login-card {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 2.5rem;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: cardIn 0.35s ease;
  }

  @keyframes cardIn {
    from { transform: translateY(30px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-icon {
    display: block;
    font-size: 2.5rem;
    color: #f0e040;
    margin-bottom: 0.75rem;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.8rem;
    color: #fff;
    letter-spacing: 0.25em;
    margin: 0 0 0.5rem;
  }

  .login-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #555;
    margin: 0;
    letter-spacing: 0.05em;
  }

  .login-form { display: flex; flex-direction: column; gap: 1rem; }

  .field { display: flex; flex-direction: column; gap: 0.4rem; }

  .label {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .input {
    background: #0a0a0a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    color: #eee;
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    padding: 0.75rem 1rem;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }
  .input:focus { border-color: #f0e040; }
  .input:disabled { opacity: 0.5; }
  .input::placeholder { color: #333; }

  .login-error {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: #E74C3C;
    background: rgba(231,76,60,0.08);
    border: 1px solid rgba(231,76,60,0.2);
    border-radius: 5px;
    padding: 0.5rem 0.8rem;
  }

  .login-btn {
    background: #f0e040;
    border: none;
    border-radius: 6px;
    color: #0d0d0d;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    padding: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .login-btn:hover:not(:disabled) { background: #fff176; transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .login-hint {
    margin-top: 1.5rem;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #444;
  }

  .login-hint code {
    color: #666;
    background: #1a1a1a;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
  }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid #0d0d0d;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
