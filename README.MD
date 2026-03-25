# Práctica 1 – Frontend Svelte 5 + Backend Node.js

SPA construida con **Svelte 5 + Vite** que consume una API REST Express con autenticación JWT, MongoDB y Redis.

```
repo/
├── backend/     ← API REST (Node.js + Express + Mongoose + Redis)
└── frontend/    ← SPA en Svelte 5 + Vite
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| MongoDB | ≥ 6 (local en `27017`) |
| Redis | ≥ 7 (local en `6379`) |

### Levantar Redis con Docker (si no lo tienes instalado)

```bash
docker run -d -p 6379:6379 --name redis redis
```

---

## 1 · Configurar y arrancar el backend

```bash
cd backend
npm install
```

Crea el archivo `.env` en la carpeta `backend/` con este contenido:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productos
JWT_SECRET=cambia_esto_por_una_clave_secreta
REDIS_URL=redis://localhost:6379
```

> ⚠️ Sin el `.env` el servidor no arrancará. El fichero no se incluye en el repositorio por seguridad.

```bash
# (Opcional) Crear usuarios de prueba en la base de datos
node seed.js

# Arrancar en modo desarrollo (con nodemon)
npm run dev

# O en modo producción
npm start
```

El backend queda en **http://localhost:3000**.  
Documentación Swagger: **http://localhost:3000/api-docs**

### Usuarios de prueba (tras ejecutar `seed.js`)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `user` | `user123` | Usuario estándar |

---

## 2 · Arrancar el frontend

Abre una **segunda terminal**:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará en **http://localhost:5173**.

El `vite.config.js` incluye un proxy que redirige `/api/*` → `http://localhost:3000`, por lo que **no hay problemas de CORS** en desarrollo.

---

## 3 · Build de producción

```bash
cd frontend
npm run build     # genera dist/
npm run preview   # sirve el build en http://localhost:4173
```

Para servir frontend y backend juntos, copia `dist/` y configura Express:

```js
// backend/server.js
app.use(express.static(path.join(__dirname, '../frontend/dist')))
```

---

## 4 · Ejecutar los tests del backend

```bash
cd backend

# Asegúrate de que MongoDB y Redis estén corriendo
npm test
```

Los tests usan una base de datos separada (`productos_test`) para no interferir con los datos de desarrollo.

---

## Estructura del frontend

```
frontend/src/
├── App.svelte               ← routing SPA + efectos globales
├── lib/
│   ├── auth.svelte.js       ← store global de autenticación
│   └── toasts.svelte.js     ← store global de notificaciones
├── services/
│   ├── authService.js       ← POST /api/login, /api/register
│   ├── productService.js    ← CRUD /api/productos
│   └── userService.js       ← CRUD /api/users
├── components/
│   ├── Navbar.svelte
│   ├── Toast.svelte
│   ├── ProductCard.svelte
│   ├── ProductForm.svelte
│   └── UserRow.svelte
└── pages/
    ├── Login.svelte
    ├── Productos.svelte
    ├── Perfil.svelte
    └── Admin.svelte
```

---

## Runes de Svelte 5 utilizadas

### `$state()`
Estado reactivo principal. Usado en todos los componentes y en los stores globales (`auth.svelte.js`, `toasts.svelte.js`).

### `$derived()`
Valores calculados automáticamente:
- `isAuthenticated`, `isAdmin`, `username` → en `auth.svelte.js`
- `filtered`, `totalCount` → productos filtrados sin re-fetch en `Productos.svelte`
- `adminCount`, `userCount` → contadores en `Admin.svelte`
- `canSubmit` → validación del formulario de login
- `precioFormateado`, `activo` → formato en `ProductCard.svelte`

### `$effect()`
Side effects reactivos:
- `App.svelte` → redirige a `/login` si el token desaparece
- `App.svelte` → redirige a `/productos` si un no-admin accede a `/admin`
- `Productos.svelte` → carga productos al montar
- `Admin.svelte` → verifica permisos y carga usuarios al montar

### `$props()` + callbacks
Todos los componentes reutilizables reciben props y comunican acciones al padre mediante callbacks (no eventos custom):

| Componente | Props | Callbacks |
|---|---|---|
| `ProductCard` | `product` | `onEdit(product)`, `onDelete(id)` |
| `ProductForm` | `product` | `onSave(data, id)`, `onCancel()` |
| `UserRow` | `user` | `onChangeRole(id, role)`, `onDelete(id)` |
| `Navbar` | `currentPage` | `onNavigate(page)` |
| `Toast` | `message`, `type` | `onClose()` |

---

## Endpoints del backend utilizados

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/api/login` | — | Login → JWT |
| POST | `/api/register` | — | Registro |
| GET | `/api/productos` | autenticado | Listar productos |
| POST | `/api/productos` | admin | Crear producto |
| PUT | `/api/productos/:id` | admin | Editar producto |
| DELETE | `/api/productos/:id` | admin | Eliminar producto |
| GET | `/api/users` | admin | Listar usuarios |
| POST | `/api/users` | admin | Crear usuario |
| PUT | `/api/users/:id` | admin | Cambiar rol / datos |
| DELETE | `/api/users/:id` | admin | Eliminar usuario |

---

## Funcionalidades implementadas

### Requisitos mínimos
- Proyecto Vite + Svelte 5
- Login con gestión de errores y redirección
- JWT almacenado y persistido en `localStorage`
- Rutas privadas protegidas (redirect automático)
- Listado de productos con nombre, precio y estado
- Creación, edición y borrado de productos (admin)
- Navegación SPA: Login / Productos / Perfil / Admin
- Página activa resaltada en Navbar
- Diseño responsive

### Runes Svelte 5
- `$state()` para todo el estado de la app
- `$derived()` para valores calculados
- `$effect()` para side effects y redirecciones
- `$props()` + callbacks en todos los componentes reutilizables

### Funcionalidades avanzadas
- **Gestión de usuarios y roles** – zona admin exclusiva con tabla editable
- **Persistencia de sesión** – `localStorage` + restauración en recarga
- **Filtros y búsqueda** – barra de búsqueda con `$derived()` sin re-fetch
- **Validación de formularios** – campos obligatorios, rangos, mensajes de error inline
- **UX mejorada** – skeletons de carga, toasts globales, confirmación de borrado (doble acción)
