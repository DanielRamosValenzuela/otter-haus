# TranHaus — Plataforma web para corredor de propiedades

Este directorio contiene la documentación de planificación del proyecto, **antes de escribir código**. La idea es alinear negocio, UI/UX y arquitectura técnica primero, e iterar sobre estos documentos a medida que se resuelvan las preguntas abiertas.

## Contexto

El corredor ya tenía una landing hecha en Google Sites (marca **TranHaus**, tema oscuro/dorado, "lujo y confort en Chile", zonas Norte/Centro/Sur, WhatsApp como canal de contacto). Ese sitio es el punto de partida conceptual — no el resultado final — para un producto propio, completo, construido en Next.js: sitio público de marketing + catálogo de propiedades, y un panel privado donde el corredor pueda subir y administrar sus propiedades fácilmente.

## Documentos

| Documento | Contenido |
|---|---|
| [`01-overview.md`](./01-overview.md) | Visión general, objetivos, alcance del MVP vs. fases futuras |
| [`02-negocio.md`](./02-negocio.md) | Usuarios, funcionalidades, modelo de datos de negocio, fuera de alcance |
| [`03-ui-ux.md`](./03-ui-ux.md) | Dirección de diseño, sistema de diseño, animaciones, sitemap, wireframes conceptuales |
| [`04-tecnico.md`](./04-tecnico.md) | Stack, arquitectura de datos (mock JSON), auth, Server Actions, deployment |

Cada documento termina con una sección **Preguntas abiertas** — decisiones que son del cliente/del corredor y que aún no están resueltas.

## Decisiones ya tomadas (confirmadas contigo)

1. **Dirección visual:** refinar el concepto oscuro/dorado de TranHaus, no proponer alternativas desde cero.
2. **Alcance de usuarios:** un solo corredor (una cuenta admin), no una plataforma multi-agencia.
3. **Tipo de operación:** el catálogo soporta **venta y arriendo**.

## Próximos pasos

1. Revisar estos 4 documentos y responder las preguntas abiertas (marcadas en cada uno).
2. Ajustar lo que no calce con la visión real del corredor.
3. Recién ahí pasamos a implementación (estructura de carpetas, componentes, mock data, etc.) — nada de código todavía.
