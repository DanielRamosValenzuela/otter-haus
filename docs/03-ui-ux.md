# 03 — UI/UX

## Dirección de diseño (confirmada)

Refinamos el concepto ya presente en la referencia TranHaus (Google Sites) en vez de partir de cero:

- **Tono**: lujo accesible, confianza, sobriedad — no "corporativo genérico", tampoco "flashy".
- **Base oscura** (charcoal/navy casi negro) con **acento dorado** como color de marca, tipografía blanca/gris clara para texto.
- **Fotografía como protagonista** — hero con imagen de interior de alta calidad y overlay oscuro para legibilidad del texto.
- **Tarjetas con efecto "glass"** (fondo oscuro semitransparente + blur) sobre las imágenes, como se ve en las tarjetas "Zona Norte/Centro/Sur" de la referencia.

Lo que cambia respecto a la referencia: la referencia es una landing estática de una página. Acá necesitamos un sistema de diseño reutilizable (múltiples páginas, catálogo, panel admin) y una capa de animación/interacción mucho más trabajada, ya que es uno de los objetivos explícitos del proyecto.

## Sistema de diseño (tokens implementados)

Tokens reales en `src/app/globals.css` (`@theme`), tema "lujo" oscuro/dorado con soporte dark/light. Los componentes nunca referencian light/dark directamente — siempre usan el nombre del token (`bg-ink-950`, `text-cream-50`, etc.) y el valor se resuelve según el tema activo.

**Color**
| Token | Modo oscuro (default) | Modo claro | Uso |
|---|---|---|---|
| `ink-950` | `#0b0d12` | `#faf8f4` | Fondo general (`body`) |
| `ink-900` | `#12141b` | `#f1eee6` | Cards, navbar, footer, superficies |
| `ink-800` | `#1a1d26` | `#ffffff` | Superficies elevadas (inputs, hover) |
| `ink-700` | `#232733` | `#e8e4d9` | Bordes sutiles, divisores |
| `ink-600` | `#2c3140` | `#ddd8c9` | Bordes/superficies secundarias |
| `gold-400` | `#e3c767` | `#a9821f` | Acento — texto/íconos sobre fondo oscuro |
| `gold-500` | `#d4af37` | `#8f6d14` | Acento principal — CTAs, badges, bordes activos |
| `gold-600` | `#c9a227` | `#7a5c10` | Acento — hover/estados presionados |
| `cream-50` | `#f5f5f0` | `#1d1b16` | Texto principal |
| `muted-400` | `#9ca3af` | `#6b6558` | Texto secundario |
| `muted-500` | `#6b7280` | `#8c8677` | Texto terciario/placeholder |
| `success-500` | `#5fa97c` | (fijo, no cambia con el tema) | Estado "Disponible" |
| `warning-500` | `#d9a441` | (fijo) | Estado "Reservada" |
| `danger-500` | `#c4614f` | (fijo) | Estado "Cerrada" / errores / acciones destructivas |
| `scrim` | `#05060a` | (fijo) | Overlay oscuro sobre fotografías y fondos de modal/drawer — siempre oscuro sin importar el tema activo, porque el contenido que cubre (texto sobre una foto) necesita seguir siendo legible en ambos temas |

La clase utilitaria `.scrim-scope` re-fija los tokens de superficie/texto/acento a sus valores de modo oscuro dentro de contenido que vive sobre una fotografía (hero, tarjetas de zona, galerías) — así el texto se mantiene legible sobre la foto sin importar si el sitio está en modo claro u oscuro. Un elemento dentro de `.scrim-scope` necesita declarar su propia clase de color (ej. `text-cream-50`) para heredar el valor re-fijado correctamente — la herencia pura desde un ancestro fuera de ese scope no lo recoge.

Contraste dorado-sobre-oscuro debe verificarse con WCAG AA para texto; en botones grandes/CTAs es aceptable, en texto largo se prefiere blanco/gris (`cream-50`).

**Otros tokens**
| Token | Valor | Uso |
|---|---|---|
| `radius-card` | `14px` | Cards, inputs, botones |
| `radius-pill` | `999px` | Badges, chips, botones pill |
| `shadow-lift` | `0 20px 40px -12px rgb(0 0 0 / 0.55)` | Hover elevado en cards |
| `shadow-glass` | `0 8px 32px -8px rgb(0 0 0 / 0.45)` | Efecto "glass" |
| `ease-lux` | `cubic-bezier(0.22, 1, 0.36, 1)` | Curva de easing estándar de toda la animación del sitio |

**Tipografía**
- Una display/serif o sans-serif condensada de alto impacto para titulares (headings) — transmite "lujo editorial".
- Una sans-serif neutra y muy legible para cuerpo de texto y UI del panel (formularios, tablas).
- Escala tipográfica modular (ej. 1.25 ratio) del hero (~56-72px desktop) hasta texto pequeño de metadatos (~13px).

**Espaciado y forma**
- Escala de spacing consistente (4/8px base, tipo Tailwind por defecto).
- Bordes redondeados suaves (8-16px) en cards y botones — coherente con lo visto en la referencia.
- Sombras sutiles + blur para profundidad, no sombras duras.

## Principios de animación

Esto es un foco explícito del proyecto, así que se documenta con intención en vez de "agregar animaciones sueltas":

1. **Microinteracciones en hover** (el pedido explícito):
   - Cards de propiedad: lift sutil (`translateY` + escala 1.02-1.03) + sombra que crece + imagen con zoom leve (`scale(1.05)`) dentro de un contenedor con `overflow: hidden`.
   - Botones/CTAs: cambio de color + subrayado animado o "fill" que se desliza.
   - Links de navegación: subrayado animado que crece desde el centro o izquierda.
   - Íconos (zonas, specs): rotación/bounce sutil.
2. **Scroll-reveal**: secciones del Home y del catálogo aparecen con fade+slide al entrar en viewport (no todo a la vez — genera sensación de producto cuidado sin ser lento). En desktop, el Home además tiene un fondo fijo con video real sincronizado al scroll (recorrido de una propiedad) — ver `04-tecnico.md`; en mobile se reemplaza por una imagen estática estándar por peso/rendimiento.
3. **Transiciones de página**: transición suave entre catálogo → detalle de propiedad (idealmente compartiendo la imagen mediante una transición tipo "shared element" si el enfoque técnico lo permite — ver `04-tecnico.md` sobre View Transitions).
4. **Estados de carga**: skeletons con shimmer (no spinners genéricos) para listados y detalle, coherentes con la paleta oscura.
5. **Feedback de formularios** (panel admin y contacto): validación inline animada, toast de confirmación al guardar/publicar una propiedad.
6. **Accesibilidad de movimiento**: todo lo anterior debe respetar `prefers-reduced-motion` — versión reducida (fade simple, sin parallax/scale) para quienes lo activen.

**Librerías candidatas** (a confirmar en `04-tecnico.md`): *Motion* (ex Framer Motion) para orquestación de animaciones de componentes/listas, y las capacidades nativas de CSS (`@starting-style`, `transition-behavior`, View Transitions API) que en 2026 ya cubren buena parte de esto sin JS extra — se evalúa el balance en el documento técnico.

## Mapa del sitio (sitemap)

```
Público
├── / (Home)
├── /propiedades (Catálogo, con filtros vía query params)
├── /propiedades/[slug] (Detalle)
├── /nosotros
├── /guia-legal
└── /contacto

Privado (requiere login)
├── /dashboard (Login si no autenticado)
├── /dashboard/propiedades (Listado del corredor)
├── /dashboard/propiedades/nueva
└── /dashboard/propiedades/[id]/editar
```

## Wireframes conceptuales (por página)

**Home**
1. Navbar sticky (logo, links, CTA "Contacto" destacado en dorado).
2. Hero full-bleed con imagen + overlay + titular + subtítulo + accesos por zona (tarjetas glass, como la referencia).
3. Sección "Propiedades destacadas" (grilla 3-4 columnas, animación stagger al aparecer).
4. Sección "Por qué TranHaus" / propuesta de valor (2-3 columnas con íconos).
5. Sección "Nosotros" resumida con foto del corredor + CTA a la página completa.
6. Footer (contacto, redes, zonas de cobertura, links legales).
7. WhatsApp FAB flotante persistente en todas las páginas públicas.

**Catálogo**
1. Header de página + barra de filtros (sticky en desktop, colapsable/drawer en mobile).
2. Contador de resultados + selector de orden.
3. Grilla de `PropertyCard`.
4. Paginación o scroll infinito (a decidir — scroll infinito se siente más "producto moderno" pero paginación es más simple de implementar con Server Components).

**Detalle de propiedad**
1. Galería (carousel/lightbox) full-width arriba.
2. Columna principal: título, precio, badges, specs, descripción.
3. Columna lateral (sticky en desktop): tarjeta de contacto rápido (WhatsApp + formulario corto).
4. Sección "Propiedades similares" al final.

**Nosotros / Guía Legal / Contacto**
- Layout más simple, tipo "página de contenido" con el mismo lenguaje visual (fondo oscuro, tarjetas glass para bloques de contenido).

**Dashboard (admin)**
- Tema visual coherente pero orientado a productividad: más denso, tablas claras, formularios con validación visible, menos "hero" y más utilidad. Sigue la misma paleta oscura/dorada para que se sienta parte del mismo producto, pero prioriza legibilidad sobre espectáculo.
- Listado de propiedades del corredor: tabla/cards con thumbnail, estado (badge de color), acciones (editar/despublicar/eliminar) con confirmación para eliminar.
- Formulario crear/editar: por secciones (Info general, Ubicación, Specs, Galería, Precio y estado), guardado con Server Action + feedback optimista.

## Inventario de componentes (design system)

`Navbar`, `Footer`, `Hero`, `ZoneCard`, `PropertyCard`, `PropertyGallery`, `FilterBar`/`FilterDrawer`, `Badge` (operación/estado), `WhatsAppFAB`, `ContactForm`, `StatCard`/`ValueProp`, `Pagination`, `EmptyState`, `Skeleton`, `Toast`, `DataTable` (admin), `PropertyForm` (admin, multi-sección), `ConfirmDialog`, `AuthForm` (login).

## Accesibilidad y responsive

- Mobile-first: la mayoría del tráfico de un sitio inmobiliario es móvil — el catálogo y el detalle deben sentirse igual de cuidados en mobile que el hero de desktop.
- Contraste AA en texto, foco visible en todos los elementos interactivos (importante en un tema oscuro, donde el foco por defecto del navegador puede perderse).
- Imágenes con `alt` descriptivo (relevante también para SEO inmobiliario).
- Formularios del panel con labels reales, mensajes de error asociados (`aria-describedby`), no solo color para indicar error.

## Preguntas abiertas — UI/UX

1. ¿Hay logo/isotipo real del corredor, o seguimos con wordmark tipo texto ("TRANHAUS") como en la referencia?
2. ¿Tienes una fuente de marca ya elegida, o propongo 2-3 combinaciones tipográficas para elegir cuando lleguemos a implementación?
3. Catálogo: ¿scroll infinito o paginación tradicional? (afecta también la arquitectura técnica de la página)
4. ¿El corredor tiene fotografía profesional propia de las propiedades que reemplazará luego los mocks, o el sitio debe optimizarse asumiendo fotos de calidad variable (celular)?
