# 01 — Visión general

## Pitch

Un sitio web propio para un corredor de propiedades independiente en Chile (marca **TranHaus**), que reemplaza su Google Site actual con una experiencia de marketing de nivel "boutique inmobiliaria de lujo" — visualmente cuidada, con animaciones y microinteracciones — y que además le da al corredor una herramienta simple para publicar y administrar sus propias propiedades sin depender de un desarrollador cada vez que sube una nueva.

## Objetivos

1. **Presentar al corredor y su marca** de forma profesional y memorable (página "Nosotros", identidad visual consistente).
2. **Mostrar el catálogo de propiedades** de forma atractiva y fácil de explorar (filtros por zona, tipo de operación, precio, etc.).
3. **Generar contacto/leads** — cada propiedad y cada página relevante debe facilitar el contacto (WhatsApp, formulario).
4. **Autonomía del corredor** — que pueda entrar a un panel privado, cargar una propiedad nueva (fotos, precio, specs) y que aparezca publicada, sin tocar código.
5. **Base técnica que escale** — hoy los datos son mock en JSON, pero el diseño de la app debe permitir reemplazar esa capa por una base de datos real sin rehacer la UI.

## Alcance del MVP

El MVP es **un producto completo de un solo corredor**, con frontend público + panel de administración, todo dentro de la misma app Next.js (frontend y "backend" —vía Server Actions/Route Handlers— conviven en el mismo proyecto).

Incluye:
- Sitio público: Home, Catálogo de propiedades, Detalle de propiedad, Nosotros, Guía Legal, Contacto.
- Panel privado del corredor: login, listado de sus propiedades, crear/editar/eliminar/despublicar una propiedad.
- Datos mock en JSON (propiedades, perfil del corredor) que simulan lo que después vendrá de una base de datos.
- Imágenes de prueba tomadas de internet (bancos de imágenes libres) como placeholder de las fotos reales de las propiedades.
- Diseño responsive, con animaciones/hover cuidados en toda la experiencia.

## Explícitamente fuera de alcance del MVP (fases futuras)

- Multi-corredor / multi-agencia (roles, equipos).
- Pagos en línea o cualquier flujo transaccional.
- Integración con portales externos (Portalinmobiliario, Yapo, etc.) o sindicación de listados.
- Blog / contenido editorial más allá de la Guía Legal.
- CRM avanzado (seguimiento de leads, pipeline de ventas) — el MVP solo captura el contacto, no lo gestiona.
- Búsqueda geoespacial / mapa interactivo (puede evaluarse en fase 2).
- Subida de archivos a almacenamiento real (S3/Vercel Blob/Supabase Storage) — en el MVP las imágenes son URLs externas dentro del JSON mock; la *interfaz* de subida se diseña para que en el futuro sea un cambio de implementación, no de UX.

Ver preguntas abiertas de negocio y técnicas en [`02-negocio.md`](./02-negocio.md) y [`04-tecnico.md`](./04-tecnico.md) — varias de estas exclusiones son supuestos, no reglas fijas.

## Usuarios

- **Visitante público** — comprador o arrendatario potencial navegando el catálogo.
- **Corredor (admin)** — única cuenta con acceso al panel privado, dueño de todas las propiedades.

## Cómo se relacionan estos documentos

- El **negocio** (`02-negocio.md`) define *qué* debe hacer el producto y *qué datos* importan.
- El **UI/UX** (`03-ui-ux.md`) define *cómo se ve y se siente*.
- Lo **técnico** (`04-tecnico.md`) define *cómo se construye* dado el negocio y el diseño — incluyendo particularidades de esta versión de Next.js (16) que no son las que conocías de antes, según `AGENTS.md` del repo.
