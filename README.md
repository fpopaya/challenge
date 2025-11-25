# TenpoPoke - Challenge Frontend

Aplicación web desarrollada en React + TypeScript que muestra una lista de Pokémon consumiendo la API pública de PokeAPI, con sistema de autenticación y arquitectura escalable.

## 📋 Tabla de Contenidos

- [Instalación y Ejecución](#instalación-y-ejecución)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Solución de Lista Virtualizada](#solución-de-lista-virtualizada)
- [Estrategia de Logout](#estrategia-de-logout)
- [Propuesta de Mejora Backend](#propuesta-de-mejora-backend)
- [Stack Tecnológico](#stack-tecnológico)

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js 20.19+ o 22.12+ (recomendado)
- npm 9+ o pnpm 8+

### Pasos para Correr el Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tenpo-challenge
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_SUPABASE_URL=https://bhjuvadflnxykhpzkulq.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_gfA8T5BVvtsxvityYluqJQ_QDExr7-p
   ```

   **Nota:** Estas son credenciales públicas del proyecto demo (solo lectura).

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

5. **Ejecutar tests**
   ```bash
   npm run test
   ```

6. **Build para producción**
   ```bash
   npm run build
   npm run preview  # Preview del build
   ```

### Comandos Adicionales

```bash
npm run lint        # Ejecutar linter (Biome)
npm run lint:fix    # Corregir errores de linting automáticamente
npm run type-check  # Verificar tipos de TypeScript
```

---

## 🏗️ Arquitectura del Proyecto

### Domain-Driven Modular Architecture

El proyecto implementa una arquitectura modular orientada a dominios, diseñada para escalar con nuevas funcionalidades manteniendo bajo acoplamiento y alta cohesión.

```
src/
├── app/                    # Capa de aplicación
│   ├── layouts/           # Layouts públicos y privados
│   ├── providers/         # Providers globales (React Query, Error Boundary)
│   └── router/            # Configuración de rutas y guards
│
├── domains/               # Módulos de dominio (business logic)
│   ├── auth/             # Dominio de autenticación
│   │   ├── components/   # LoginForm
│   │   ├── hooks/        # useLogin
│   │   ├── pages/        # LoginPage
│   │   ├── services/     # auth.service.ts (API calls)
│   │   └── types/        # auth.schema.ts (Zod validations)
│   │
│   ├── pokemon/          # Dominio de Pokémon
│   │   ├── components/   # PokemonCard, PokemonList, etc.
│   │   ├── hooks/        # useInfiniteItems, useVirtualizedGrid
│   │   ├── pages/        # PokemonListPage
│   │   ├── services/     # pokemon.service.ts
│   │   └── types/        # pokemon.types.ts
│   │
│   └── session/          # Dominio de sesión de usuario
│       └── model/        # session.store.ts (Zustand)
│
├── infrastructure/        # Capa de infraestructura
│   ├── config/           # Configuración de Supabase
│   ├── errors/           # Manejo global de errores
│   ├── http/             # Cliente HTTP (Axios + interceptors)
│   └── logging/          # Sistema de logging
│
└── shared/               # Código compartido entre dominios
    ├── components/       # Button, Card, Badge, LoadingOverlay, etc.
    ├── hooks/            # useInfiniteScroll
    └── utils/            # cn() utility
```

### Contextos Público vs Privado

#### **Rutas Públicas** (`PublicLayout`)
- `/login` - Pantalla de autenticación
- Accesibles sin autenticación
- Redirigen a `/home` si el usuario ya está autenticado

#### **Rutas Privadas** (`PrivateLayout`)
- `/home` - Lista de Pokémon
- Requieren token de autenticación
- Redirigen a `/login` si no hay sesión activa

#### **Guards de Autenticación**

```typescript
// ProtectedRoute: Solo usuarios autenticados
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated())
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// GuestRoute: Solo usuarios NO autenticados
const GuestRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated())
  return isAuthenticated ? <Navigate to="/home" replace /> : children
}
```

### Escalabilidad

La arquitectura permite agregar nuevos módulos fácilmente:

**Ejemplo: Módulo de Cambio de Contraseña (Público)**
```
domains/
└── password-reset/
    ├── pages/PasswordResetPage.tsx
    ├── services/password.service.ts
    └── types/password.schema.ts
```

**Ejemplo: Módulo de Perfil de Usuario (Privado)**
```
domains/
└── user-profile/
    ├── pages/UserProfilePage.tsx
    ├── services/profile.service.ts
    └── types/profile.types.ts
```

---

## 📊 Solución de Lista Virtualizada

### Problema

Renderizar 2000+ elementos en el DOM simultáneamente causa:
- **Alto consumo de memoria**: Consumo significativo en nodos DOM
- **Renderizado lento**: Tiempo de montaje inicial perceptiblemente elevado
- **Scroll lag**: Pérdida de frames durante desplazamiento
- **Pobre experiencia de usuario**: Pantalla bloqueada durante carga

### Solución Implementada: Virtualización + Infinite Scroll

#### **1. Virtualización con TanStack Virtual**

Solo renderiza elementos visibles en el viewport + buffer de overscan.

```typescript
// useVirtualizedGrid.ts
const virtualizer = useVirtualizer({
  count: itemsCount,              // Total items (2000+)
  getScrollElement: () => scrollElementRef.current,
  estimateSize: () => ITEM_HEIGHT, // 190px por item
  overscan: 5,                     // Buffer de 5 items arriba/abajo
})
```

**Beneficios:**
- Solo ~10-15 elementos en el DOM (vs 2000)
- Memoria reducida significativamente
- Renderizado instantáneo
- Scroll fluido a 60fps

#### **2. Infinite Scroll con TanStack Query**

Carga datos de forma incremental en lugar de todo de una vez.

```typescript
// useInfiniteItems.ts
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['pokemon'],
  queryFn: ({ pageParam = 0 }) => fetchPokemon(pageParam, PAGE_SIZE),
  getNextPageParam: (lastPage, pages) => {
    const loaded = pages.length * PAGE_SIZE
    return loaded < lastPage.total ? loaded : undefined
  },
  initialPageParam: 0,
})
```

**Beneficios:**
- Carga inicial rápida: Solo 50 items por página
- Menor uso de red: Descarga progresiva
- Cache automático: No re-fetch de páginas ya cargadas
- UX mejorada: Contenido visible inmediatamente

#### **3. Lazy Loading de Imágenes**

```typescript
<img
  src={imageUrl}
  loading="lazy"  // Native browser lazy loading
  onLoad={handleImageLoad}
/>
```

**Beneficios:**
- Solo carga imágenes visibles en viewport
- Ahorro significativo de ancho de banda
- Tiempos de carga inicial reducidos

### Comparación de Performance

| Métrica | Sin Virtualización | Con Virtualización |
|---------|-------------------|-------------------|
| Elementos en DOM | 2000 | 10-15 |
| Consumo de memoria | Alto | Significativamente menor |
| Tiempo inicial de renderizado | Perceptiblemente lento | Instantáneo |
| FPS durante scroll | Bajo (frames perdidos) | Alto (60 fps) |
| Peticiones HTTP | Menos requests, payload grande | Más requests, payload incremental |

### ¿Por Qué Esta Solución?

1. **Escalabilidad**: Funciona igual con 2000 o 20,000 items
2. **Performance**: Renderizado y scroll optimizados
3. **UX**: Usuario ve contenido inmediatamente
4. **Estándar de Industria**: TanStack (React Query + Virtual) es el estado del arte
5. **Mantenibilidad**: Código declarativo y fácil de entender

---

## 🔐 Estrategia de Logout

### Arquitectura de Sesión

La estrategia de logout está diseñada para ser consistente con la arquitectura de contextos público/privado.

#### **1. Estado de Sesión (Zustand + LocalStorage)**

```typescript
// session.store.ts
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
      isAuthenticated: () => get().session !== null,
    }),
    {
      name: 'tenpo-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

**Características:**
- **Persistencia**: LocalStorage para sobrevivir recargas
- **Reactividad**: Zustand notifica cambios a todos los componentes
- **Tipado**: TypeScript garantiza integridad de datos

#### **2. Botón de Logout en PrivateLayout**

```typescript
// PrivateLayout.tsx
const { clearSession } = useSessionStore()
const navigate = useNavigate()

const handleLogout = () => {
  clearSession()           // Limpia store de Zustand
  navigate('/login')       // Redirige a contexto público
}

<button onClick={handleLogout}>Cerrar Sesión</button>
```

#### **3. Limpieza Automática de Datos**

El logout activa:

1. **Limpieza de Zustand Store**
   - Elimina `session` object (user + token)
   - Persiste en localStorage como `null`

2. **Invalidación de React Router**
   - `ProtectedRoute` detecta `isAuthenticated() === false`
   - Redirige automáticamente a `/login`

3. **Limpieza de React Query Cache** (opcional)
   ```typescript
   const queryClient = useQueryClient()
   queryClient.clear() // Limpia cache de datos privados
   ```

### Flujo de Logout

```
Usuario hace click en "Cerrar Sesión"
         ↓
useSessionStore.clearSession()
         ↓
session: null → localStorage
         ↓
navigate('/login')
         ↓
ProtectedRoute detecta !isAuthenticated
         ↓
Redirige a /login (si el usuario intenta volver a /home)
```

### Ventajas de Esta Estrategia

1. **Seguridad**: Token eliminado completamente del cliente
2. **Consistencia**: Un solo source of truth (Zustand store)
3. **Prevención de Race Conditions**: Guards reactivos a cambios de estado
4. **UX**: Redireccionamiento inmediato sin flashes
5. **Escalable**: Funciona con múltiples rutas privadas sin duplicar lógica

---

## 🚀 Propuesta de Mejora Backend

### Contexto Actual

La implementación actual consume directamente **Supabase** (base de datos sembrada con 2000 Pokémon de PokeAPI). El frontend realiza múltiples llamadas paginadas:

- **40 peticiones HTTP** de 50 items cada una para cargar todo
- **Latencia acumulada**: ~10-15 segundos para cargar los 2000 items
- Cada usuario genera la misma carga sobre Supabase

### Problema Hipotético

Si en lugar de Supabase consumiéramos directamente la **API pública de PokeAPI**:

- Cada usuario haría 40+ requests a la API externa
- Rate limits podrían bloquear la aplicación
- Latencia de red hacia API externa (sin control)
- Sin cache compartida entre usuarios

### Solución Propuesta: Backend For Frontend (BFF) con Cache

Una mejora realista sería introducir un **Backend For Frontend (BFF)** entre el frontend y la API pública, aplicando cache para reducir llamadas innecesarias.

#### Arquitectura

```
Frontend
    ↓
CDN Edge (Vercel/Cloudflare) - Cache Hit ~50ms
    ↓ (cache miss)
BFF Server - Cache en memoria/Redis
    ↓ (cache miss)
API Pública (PokeAPI)
```

#### Implementación Backend

**Nota:** Ejemplo conceptual. Esto reemplazaría el acceso directo a Supabase con un BFF que consulte PokeAPI.

```typescript
// BFF: Endpoint paginado con cache
app.get('/api/pokemon', async (req, res) => {
  const { page = 1, pageSize = 50 } = req.query
  const cacheKey = `pokemon:${page}:${pageSize}`

  // 1. Intentar leer de cache (memoria o Redis)
  const cached = await cache.get(cacheKey)
  if (cached) {
    res.setHeader('X-Cache', 'HIT')
    return res.json(cached)
  }

  // 2. Si no está en cache, consultar API pública
  const offset = (page - 1) * pageSize
  const pokemon = await fetchFromPokeAPI(offset, pageSize)

  // 3. Guardar en cache (TTL: 1 hora)
  await cache.set(cacheKey, pokemon, 3600)

  // 4. Headers de cache para CDN
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.setHeader('X-Cache', 'MISS')
  res.json(pokemon)
})
```

#### Frontend

**Nota:** Ejemplo conceptual. La implementación actual usa `useInfiniteItems` con Supabase.

```typescript
// Consumir endpoint paginado
const { data } = useInfiniteQuery({
  queryKey: ['pokemon'],
  queryFn: ({ pageParam = 1 }) =>
    fetch(`/api/pokemon?page=${pageParam}&pageSize=50`),
  getNextPageParam: (lastPage, pages) =>
    lastPage.hasMore ? pages.length + 1 : undefined,
})
```

### Beneficios

1. **Reducción de llamadas a API pública**
   - Cache en BFF evita consultar PokeAPI repetidamente
   - Solo 1 llamada inicial por página, reutilizada por todos los usuarios

2. **Latencia reducida**
   - CDN resuelve mayoría de requests en el edge (~50ms)
   - Cache en servidor evita latencia de red hacia API pública

3. **Escalabilidad**
   - CDN distribuye carga geográficamente
   - Cache reduce presión sobre API pública (rate limits)

4. **Implementación gradual**
   - Fase 1: BFF con cache en memoria (Node.js Map)
   - Fase 2: Agregar Redis para cache persistente
   - Fase 3: Deploy detrás de CDN (Vercel/Cloudflare)

5. **Mantenibilidad**
   - Arquitectura simple y estándar
   - Fácil de debuggear y monitorear
   - Sin cambios grandes en frontend existente

### Impacto Estimado

- **Llamadas a API externa**: De N requests por usuario → 1 request inicial por página (compartida)
- **Latencia percibida**: Reducción significativa con CDN edge caching
- **Resiliencia ante rate limits**: Cache protege contra límites de API pública
- **Escalabilidad**: Preparado para crecer sin saturar API externa

### Relación con Implementación Actual

Esta mejora teórica asume un escenario donde se migra de Supabase (backend controlado) a consumir directamente APIs públicas externas. En ese contexto, un BFF con cache se vuelve esencial para:

- Controlar la latencia hacia servicios externos
- Evitar rate limits de APIs públicas
- Compartir cache entre múltiples usuarios
- Tener un punto de control para logging, monitoring y circuit breakers

---

## 🛠️ Stack Tecnológico

### Core
- **React 19** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 6** - Build tool & dev server

### Routing & State
- **React Router 7** - Client-side routing
- **Zustand 5** - Global state management
- **TanStack Query 5** - Server state & caching

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **clsx + tailwind-merge** - Conditional classes

### Data Fetching
- **Axios 1.7** - HTTP client
- **Supabase** - Backend-as-a-Service (Auth + DB)

### Forms & Validation
- **React Hook Form 7** - Form state management
- **Zod 3.24** - Schema validation

### Performance
- **TanStack Virtual 3** - List virtualization
- **React.lazy() + Suspense** - Code splitting

### Quality & Testing
- **Biome 2** - Linter & formatter
- **Vitest 2** - Unit testing
- **TypeScript Strict Mode** - Type checking

---

## 📄 Licencia

MIT

---

## 👤 Autor

Fidel Popayan 🤟

Desarrollado para Tenpo Challenge Frontend
