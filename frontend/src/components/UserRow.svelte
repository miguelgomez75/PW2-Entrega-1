<script>
  // $props() con callbacks - Svelte 5
  let { user, onChangeRole, onDelete } = $props()

  let confirmDelete = $state(false)

  function handleDelete() {
    if (confirmDelete) {
      onDelete(user._id)
    } else {
      confirmDelete = true
      setTimeout(() => { confirmDelete = false }, 3000)
    }
  }

  function toggleRole() {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    onChangeRole(user._id, newRole)
  }
</script>

<tr class="user-row">
  <td class="td td--name">{user.username}</td>
  <td class="td">
    <button
      class="role-badge role-badge--{user.role}"
      onclick={toggleRole}
      title="Cambiar rol"
    >
      {user.role}
    </button>
  </td>
  <td class="td td--actions">
    <button
      class="action-btn action-btn--delete {confirmDelete ? 'action-btn--confirm' : ''}"
      onclick={handleDelete}
    >
      {confirmDelete ? '¿Seguro?' : 'Eliminar'}
    </button>
  </td>
</tr>

<style>
  .user-row {
    border-bottom: 1px solid #1a1a1a;
    transition: background 0.15s;
  }
  .user-row:hover { background: #111; }

  .td {
    padding: 0.8rem 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    color: #ccc;
    vertical-align: middle;
  }

  .td--name { color: #eee; font-weight: 500; }
  .td--actions { text-align: right; }

  .role-badge {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid;
  }

  .role-badge--admin {
    background: rgba(240,224,64,0.12);
    color: #f0e040;
    border-color: rgba(240,224,64,0.4);
  }
  .role-badge--admin:hover { background: rgba(240,224,64,0.25); }

  .role-badge--user {
    background: rgba(52,152,219,0.1);
    color: #3498DB;
    border-color: rgba(52,152,219,0.3);
  }
  .role-badge--user:hover { background: rgba(52,152,219,0.2); }

  .action-btn {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.3rem 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid rgba(231,76,60,0.3);
    background: rgba(231,76,60,0.08);
    color: #E74C3C;
  }
  .action-btn:hover { background: rgba(231,76,60,0.18); }
  .action-btn--confirm {
    background: #E74C3C; color: #fff; border-color: #E74C3C;
  }
</style>
