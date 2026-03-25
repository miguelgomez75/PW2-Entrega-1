<script>
  // $props() - Svelte 5 props
  let { message = '', type = 'info', onClose } = $props()
</script>

<div class="toast toast--{type}" role="alert">
  <span class="toast__icon">
    {#if type === 'success'}✓{:else if type === 'error'}✕{:else}ℹ{/if}
  </span>
  <span class="toast__msg">{message}</span>
  <button class="toast__close" onclick={onClose}>×</button>
</div>

<style>
  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    min-width: 280px;
    max-width: 420px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.18);
    animation: slideIn 0.25s ease;
  }
  .toast--success { background: #0a2e1a; border-left: 3px solid #2ECC71; color: #2ECC71; }
  .toast--error   { background: #2e0a0a; border-left: 3px solid #E74C3C; color: #E74C3C; }
  .toast--info    { background: #0a1a2e; border-left: 3px solid #3498DB; color: #3498DB; }
  .toast__icon { font-size: 1rem; font-weight: 700; }
  .toast__msg { flex: 1; color: #eee; }
  .toast__close {
    background: none; border: none; color: #888; cursor: pointer;
    font-size: 1.2rem; line-height: 1; padding: 0;
  }
  .toast__close:hover { color: #fff; }
  @keyframes slideIn {
    from { transform: translateX(40px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
</style>
