# Práctica 1 – Frontend Svelte 5

SPA construida con **Svelte 5 + Vite** que consume la API REST del backend de productos.

---

## Requisitos previos

Antes de empezar asegúrate de tener instalado:

- **Node.js** ≥ 18 → [nodejs.org](https://nodejs.org)
- **npm** ≥ 9 (incluido con Node.js)
- **MongoDB** corriendo localmente en el puerto por defecto (`27017`), o bien acceso a una instancia remota
- **Redis** corriendo localmente en el puerto por defecto (`6379`). Puedes arrancarlo con Docker:
  ```bash
  docker run -d -p 6379:6379 redis
  ```

---

## Estructura del repositorio

```
repo/
├── backend/     ← API REST (Node.js + Express + MongoDB)
└── frontend/    ← Esta carpeta. SPA en Svelte 5
```

---

## 1 · Preparar el backend

> Si el backend ya está en marcha puedes saltar al paso 2.

```bash
cd backend

# Copiar el fichero de entorno y rellenar los valores
cp .env.example .env
```

Edita el archivo `.env` recién creado con tus datos:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productos
JWT_SECRET=cambia_esto_por_una_clave_secreta
REDIS_URL=redis://localhost:6379
```

```bash
# Instalar dependencias
npm install

# (Opcional) Poblar la base de datos con usuarios de prueba
node seed.js

# Arrancar el servidor de desarrollo
npm run dev
```

El backend quedará escuchando en **http://localhost:3000**.  
Puedes verificarlo abriendo **http://localhost:3000/api-docs** (Swagger UI).

---

## 2 · Instalar y arrancar el frontend

Abre una **segunda terminal**:

```bash
cd frontend

# Instalar dependencias
npm install

# Arrancar en modo desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**.

El `vite.config.js` incluye un proxy que redirige automáticamente todas las llamadas a `/api/*` hacia `http://localhost:3000`, por lo que no hay problemas de CORS en desarrollo.

---

## 3 · Usuarios de prueba

Si ejecutaste `node seed.js` en el backend, existen estos dos usuarios listos para usar:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `user` | `user123` | Usuario estándar |

El rol **admin** permite crear, editar y eliminar productos, así como gestionar usuarios desde el panel de administración.

---

## 4 · Build de producción

```bash
cd frontend
npm run build      # genera la carpeta dist/
npm run preview    # sirve el build en http://localhost:4173
```

Para servir el frontend junto al backend en producción, copia el contenido de `dist/` a cualquier servidor estático o configura Express para servirlo:

```js
// En backend/server.js (ejemplo)
app.use(express.static(path.join(__dirname, '../frontend/dist')))
```

---

## Estructura del proyecto frontend

```
frontend/
├── index.html
├── vite.config.js           ← proxy /api → localhost:3000
├── svelte.config.js
├── package.json
└── src/
    ├── main.js              ← punto de entrada
    ├── App.svelte           ← raíz: routing SPA + efectos globales
    ├── lib/
    │   ├── auth.svelte.js   ← store global de autenticación (runes)
    │   └── toasts.svelte.js ← store global de notificaciones (runes)
    ├── services/
    │   ├── authService.js   ← POST /api/login, /api/register
    │   ├── productService.js← CRUD /api/productos
    │   └── userService.js   ← CRUD /api/users
    ├── components/
    │   ├── Navbar.svelte    ← navegación con resaltado de página activa
    │   ├── Toast.svelte     ← notificación individual
    │   ├── ProductCard.svelte  ← tarjeta de producto con acciones
    │   ├── ProductForm.svelte  ← modal crear/editar producto
    │   └── UserRow.svelte   ← fila de tabla de usuarios
    └── pages/
        ├── Login.svelte     ← pantalla de acceso
        ├── Productos.svelte ← listado + búsqueda + CRUD
        ├── Perfil.svelte    ← datos del usuario autenticado
        └── Admin.svelte     ← gestión de usuarios (solo admin)
```

---

## Runes de Svelte 5 utilizadas

### `$state()`
Estado reactivo principal de la aplicación.

| Archivo | Variable | Uso |
|---|---|---|
| `auth.svelte.js` | `token`, `user` | Sesión global (token JWT + datos de usuario) |
| `toasts.svelte.js` | `toasts` | Lista de notificaciones activas |
| `Productos.svelte` | `products`, `loading`, `search`, `showForm`, `editing` | Estado de la página de productos |
| `Admin.svelte` | `users`, `loading`, `newUsername`, etc. | Estado de la página de administración |
| `Login.svelte` | `username`, `password`, `loading`, `error` | Formulario de login |
| `ProductForm.svelte` | `nombre`, `precio`, `saving`, `errors` | Formulario modal de producto |
| `ProductCard.svelte` | `confirmDelete` | Confirmación de borrado (doble clic) |
| `UserRow.svelte` | `confirmDelete` | Confirmación de borrado de usuario |

### `$derived()`
Valores calculados automáticamente a partir del estado.

| Archivo | Variable | Cálculo |
|---|---|---|
| `auth.svelte.js` | `isAuthenticated` | `!!token` |
| `auth.svelte.js` | `isAdmin` | `user?.role === 'admin'` |
| `auth.svelte.js` | `username` | `user?.username \|\| ''` |
| `Productos.svelte` | `filtered` | Productos filtrados por búsqueda en cliente |
| `Productos.svelte` | `totalCount` | `filtered.length` |
| `Admin.svelte` | `adminCount`, `userCount` | Contadores por rol |
| `Login.svelte` | `canSubmit` | `username && password && !loading` |
| `ProductCard.svelte` | `precioFormateado`, `activo` | Formato de precio y estado activo |
| `ProductForm.svelte` | `isEditing`, `title` | Si estamos editando o creando |
| `Navbar.svelte` | `displayName` | Nombre en mayúsculas para la barra |
| `Perfil.svelte` | `roleLabel`, `initials` | Etiqueta de rol e iniciales del avatar |

### `$effect()`
Efectos secundarios reactivos.

| Archivo | Efecto |
|---|---|
| `App.svelte` | Redirige a `/login` si el token desaparece mientras se está en una ruta privada |
| `App.svelte` | Redirige a `/productos` si un no-admin intenta acceder a `/admin` |
| `Productos.svelte` | Carga productos al montar la página |
| `Admin.svelte` | Verifica permisos y carga usuarios al montar la página |

### `$props()`
Props y comunicación entre componentes con **callbacks** (en lugar de eventos custom).

| Componente | Props | Callbacks |
|---|---|---|
| `ProductCard` | `product` | `onEdit(product)`, `onDelete(id)` |
| `ProductForm` | `product` (nullable) | `onSave(data, id)`, `onCancel()` |
| `UserRow` | `user` | `onChangeRole(id, role)`, `onDelete(id)` |
| `Navbar` | `currentPage` | `onNavigate(page)` |
| `Toast` | `message`, `type` | `onClose()` |
| `Login`, `Productos`, `Perfil`, `Admin` | — | `onNavigate(page)` |

---

## Endpoints del backend utilizados

| Método | Ruta | Rol requerido | Uso |
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

### Requisitos mínimos (5 pts)
- [x] Proyecto Vite + Svelte 5
- [x] Login con gestión de errores
- [x] JWT almacenado y persistido en `localStorage`
- [x] Rutas privadas protegidas
- [x] Listado de productos (nombre, precio, estado)
- [x] Creación, edición y borrado de productos
- [x] Navegación SPA (Login / Productos / Perfil)
- [x] Página activa resaltada en Navbar
- [x] Diseño responsive

### Runes Svelte 5 (3 pts)
- [x] `$state()` para todo el estado de la app
- [x] `$derived()` para valores calculados
- [x] `$effect()` para side effects y redirecciones
- [x] `$props()` + callbacks en todos los componentes reutilizables

### Funcionalidades avanzadas (2 pts)
- [x] **Gestión de usuarios y roles** – zona admin exclusiva con tabla editable
- [x] **Persistencia de sesión** – `localStorage` + restauración en recarga
- [x] **Filtros y búsqueda** – barra de búsqueda con `$derived()` sin re-fetch
- [x] **Validación de formularios** – campos obligatorios, rangos, mensajes de error
- [x] **UX mejorada** – skeletons de carga, toasts globales, confirmación de borrado (doble acción)
