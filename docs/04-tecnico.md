# 04 — Arquitectura técnica

## Stack confirmado (ya en el repo)

- **Next.js 16.3.4** (App Router) — ⚠️ ver nota abajo, esta versión tiene cambios reales frente a lo "clásico".
- **React 19.2.8**
- **TypeScript**
- **Tailwind CSS v4**

> Nota de proceso: `AGENTS.md` en la raíz del repo indica que esta versión de Next.js tiene breaking changes frente al conocimiento de entrenamiento, y que hay que leer `node_modules/next/dist/docs/` antes de escribir código. Este documento ya incorpora esa lectura para lo relevante a este proyecto — se vuelve a verificar contra la documentación local al momento de implementar, por si algo cambió.

## Qué cambia en Next.js 16 y cómo afecta este proyecto

### Cache Components (cambio arquitectónico real, no cosmético)

Next 16 introduce un modelo de cache **opt-in** (`cacheComponents: true` en `next.config.ts`) que reemplaza las config de rutas `dynamic`/`revalidate`/`fetchCache` de versiones anteriores. Todo es dinámico por defecto; para que algo sea estático/cacheable hay que marcarlo explícitamente con `"use cache"` (+ `cacheLife()` para el TTL), o envolver la parte dinámica en `<Suspense>`. Existe además `"use cache: private"`, pensado justo para el caso "leer sesión del usuario y mostrar UI personalizada sin bloquear el resto de la página".

**Aplicación concreta a este proyecto:**
- Páginas públicas de solo lectura (catálogo, detalle de propiedad, home) → candidatas a `"use cache"`, porque los datos son compartidos entre visitantes.
- El panel del corredor (`/dashboard/*`) es por-usuario y depende de sesión → esas rutas deben leer la sesión detrás de `<Suspense>`, usando `"use cache: private"` donde aplique, en vez de forzar todo a dinámico "a la antigua".

Esto es una decisión de arquitectura a tomar explícitamente por página, no un detalle de implementación a resolver sobre la marcha.

### Mutaciones de datos: Server Actions como default

Para crear/editar/eliminar una propiedad desde el panel, el patrón recomendado por esta versión sigue siendo **Server Actions** (`'use server'`, `<form action={...}>` + `useActionState`) — sin necesidad de `fetch` ni cliente HTTP para las mutaciones propias de la UI del panel. Los **Route Handlers** (`app/api/.../route.ts`) siguen existiendo y se reservan para el día en que necesitemos un contrato de API real hacia afuera (ej. una futura app móvil, o integración con un portal externo) — hasta entonces no son necesarios para el MVP. La documentación es explícita en tratar tanto Server Actions como Route Handlers con las mismas consideraciones de seguridad que un endpoint público (validar input, verificar sesión/autorización server-side siempre, no confiar en checks del cliente).

### Autenticación: `middleware.ts` ahora es `proxy.ts`

Mismo rol (intercepción de requests a nivel de ruta — ej. redirigir a alguien no autenticado que intenta entrar a `/dashboard`), pero el archivo se llama `proxy.ts`. Es solo para checks "optimistas"/gruesos; la autorización real debe vivir cerca de los datos (una Data Access Layer con algo como `verifySession()`, memoizada con `cache()` de React, que se llama en cada Server Action y en cada carga de datos del dashboard — no solo confiar en el proxy).

**Resuelto**: se implementó con **`iron-session`** (cookie cifrada, `HttpOnly`) en vez de Auth.js/Better Auth. Dado que es **un solo corredor** (una sola cuenta hardcodeada vía variables de entorno), esas librerías asumen un modelo de usuarios en base de datos que no existe todavía — iron-session cubre el caso real (login con credenciales, sesión persistente) sin esa sobrecarga. La contraseña se valida con `scrypt` (`node:crypto`, sin dependencia de `bcrypt`). Migrar a Auth.js/Better Auth si el proyecto se vuelve multi-usuario queda aislado a `src/lib/auth/*`.

### "Adapters" (`07-adapters` en los docs)

Es un concepto para **plataformas de hosting**, no para quien construye la app — permite que un proveedor de hosting conecte su propio build/runtime vía `adapterPath`. No requiere que nosotros configuremos nada; el deploy "zero-config" (ej. Vercel) sigue funcionando igual. Se menciona solo para que quede registrado que la elección de hosting no agrega complejidad técnica al proyecto.

## Arquitectura de datos: mock JSON → base de datos real

Requisito explícito: hoy todo lo que "vendría de una base de datos" vive en JSON mock, pero el corredor va a querer cargar propiedades reales pronto — la capa de datos se diseña para que ese cambio sea de **implementación**, no de **UI**.

Enfoque propuesto: **capa de acceso a datos (repository pattern) detrás de una interfaz simple**, por ejemplo:

```
src/lib/data/properties.ts
  getProperties(filters) -> Property[]
  getPropertyBySlug(slug) -> Property | null
  createProperty(input) -> Property
  updateProperty(id, input) -> Property
  deleteProperty(id) -> void
```

La implementación inicial de estas funciones lee/escribe el JSON mock (`src/data/properties.json`); cuando exista una base de datos real, se reemplaza el contenido de este archivo por llamadas a un ORM/cliente de DB, y el resto de la app (páginas, Server Actions, componentes) no cambia porque solo conoce la interfaz.

**Decisión (confirmada):** por ahora todo son datos ficticios — el objetivo inmediato es tener el flujo completo de UI (público + panel) funcionando y agradable de usar, no operar el panel en producción con datos reales. El repository pattern de arriba es justamente lo que hace que "despues sea fácil incorporar un DB": el día que el corredor quiera cargar propiedades reales de verdad, se reemplaza `src/lib/data/properties.ts` por una implementación contra una base de datos (Postgres, SQLite, lo que se decida entonces) y **nada más en la app cambia** — ni componentes, ni Server Actions, ni páginas.

Nota técnica para la implementación (no bloquea el plan, es un detalle a tener presente): un JSON leído/escrito desde Server Actions en el filesystem del servidor funciona perfecto en desarrollo local y en la mayoría de entornos de demo, pero **no persiste de forma confiable en hosting serverless** (ej. Vercel resetea el filesystem entre invocaciones/deploys) — así que si en algún punto el panel se demuestra en producción y los cambios "desaparecen" al rato, no es un bug: es exactamente la razón por la que esta capa está diseñada para migrarse a una DB real antes de operar en serio.

## Imágenes

- MVP: URLs externas (bancos de imágenes) referenciadas dentro del JSON/DB, renderizadas con `next/image` (requiere configurar `remotePatterns` en `next.config.ts` para los dominios usados, ver `src/lib/images/allowed-hosts.ts`).
- El formulario de "subir imagen" en el panel se diseña ya pensando en la interfaz final (selector de archivos, preview, reordenar galería), pero el backend detrás puede empezar simplemente guardando una URL pegada por el corredor, y evolucionar a subida real (Vercel Blob / Supabase Storage / S3) sin cambiar el formulario.

## Fondo cinematográfico del Home (solo desktop)

El Home (`src/app/(public)/page.tsx`) usa `HomeCinematicScene` (`src/components/marketing/home-cinematic-scene.tsx`) como fondo fijo detrás de todas las secciones: 4 clips de video reales (exterior → pasillo → living → bar, mismo shoot de una sola propiedad, Kindel Media / Pexels, licencia libre sin atribución) cuyo `currentTime` se sincroniza 1:1 con el scroll — no hay autoplay, la "cámara" avanza y retrocede exactamente con el usuario. Los archivos viven en `public/videos/home-scene/`.

Este efecto es **solo desktop** (`min-width: 768px`, detectado con `useSyncExternalStore` para evitar el error de hidratación de Next/Motion y el warning de `react-hooks/set-state-in-effect`). En mobile no se monta ningún `<video>` — no se descarga nada — y `Hero` (`src/components/marketing/hero.tsx`) vuelve a mostrar su propia imagen de fondo estática (`md:hidden`), como era antes de este feature.

Detalle no obvio: el `<footer>` necesita `position: relative` explícito para pintar por encima del fondo fijo — un elemento `static` siempre pinta *debajo* de cualquier elemento posicionado con `z-index: auto` según las reglas de stacking de CSS, sin importar el orden en el DOM.

## Registro de npm

`.npmrc` en la raíz fija `registry=https://registry.npmjs.org/` explícitamente. No es config redundante: si la máquina donde se corre `npm install` (local o CI) está autenticada contra un registro privado a nivel de usuario/sistema, este archivo evita que esa config se filtre al build de este proyecto, que no tiene ninguna dependencia de un registro privado.

## Estructura de carpetas propuesta (borrador)

```
src/
  app/
    (public)/
      page.tsx                    → Home
      propiedades/page.tsx        → Catálogo
      propiedades/[slug]/page.tsx → Detalle
      nosotros/page.tsx
      guia-legal/page.tsx
      contacto/page.tsx
    (dashboard)/
      dashboard/page.tsx           → Login o listado según sesión
      dashboard/propiedades/nueva/page.tsx
      dashboard/propiedades/[id]/editar/page.tsx
    proxy.ts                       → protección de rutas /dashboard
  components/
    ui/            → primitivos (Button, Badge, Card, Dialog...)
    marketing/     → Hero, ZoneCard, ValueProp...
    property/      → PropertyCard, PropertyGallery, FilterBar...
    dashboard/     → DataTable, PropertyForm...
  lib/
    data/          → repository pattern (properties.ts, agent.ts)
    auth/          → sesión, DAL (verifySession, etc.)
    actions/       → Server Actions (createProperty, updateProperty...)
  data/
    properties.json → mock
    agent.json       → mock del perfil del corredor
```

Esto es un borrador de referencia, no una decisión cerrada — se ajusta al empezar a implementar.

## Deployment

Vercel es la opción por defecto dado que es Next.js — no requiere configuración de "adapter" propia. Si en el futuro se necesita otro proveedor, el sistema de adapters de esta versión de Next.js está pensado justamente para eso.

## Preguntas abiertas — técnico

1. ~~Persistencia real del panel~~ → **Resuelto**: datos ficticios (JSON mock) por ahora, arquitectura lista para migrar a DB real cuando se necesite.
2. **Proveedor de base de datos / hosting** (para cuando llegue ese momento): ¿hay preferencia (Vercel + Postgres tipo Neon/Supabase es la ruta de menor fricción), o alguna restricción (presupuesto, hosting ya contratado)?
3. ~~Librería de auth~~ → **Resuelto**: iron-session (ver sección de autenticación arriba).
4. **Dominio**: ¿ya existe un dominio propio (ej. tranhaus.cl) o seguimos en un subdominio de hosting mientras tanto?
