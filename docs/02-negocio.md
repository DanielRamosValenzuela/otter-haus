# 02 — Negocio y producto

## Usuarios y roles

| Rol | Quién | Qué puede hacer |
|---|---|---|
| Visitante | Público general (compradores/arrendatarios) | Ver home, explorar catálogo, filtrar, ver detalle de propiedad, contactar (WhatsApp/formulario) |
| Corredor (admin) | El único usuario autenticado | Todo lo anterior + login, crear/editar/eliminar/despublicar propiedades, editar su perfil público ("Nosotros") |

Un solo corredor (confirmado) — no hay jerarquía de roles ni multi-tenant en el MVP.

## Funcionalidades — sitio público

### Home
- Hero con mensaje de marca (equivalente al actual "Tu próximo capítulo comienza aquí").
- Accesos rápidos por zona (Norte / Centro / Sur — o las zonas reales que maneje el corredor).
- Propiedades destacadas (subset del catálogo, marcadas como "destacada").
- Prueba social / diferenciadores (opcional: años de experiencia, propiedades vendidas, testimonios).
- CTA de contacto persistente (WhatsApp flotante).

### Catálogo de propiedades
- Grilla de propiedades con imagen, precio, ubicación, specs clave (dormitorios/baños/m²), badge de operación (Venta/Arriendo).
- Filtros: zona/comuna, tipo de operación (venta/arriendo), tipo de propiedad (casa/depto/terreno/oficina...), rango de precio, dormitorios.
- Orden: destacadas primero, más recientes, precio.
- Estado vacío ("no hay propiedades que calcen con tu búsqueda") con CTA para limpiar filtros o contactar directamente.

### Detalle de propiedad
- Galería de imágenes (varias fotos).
- Precio, ubicación, specs completos, descripción.
- Badge de estado (Disponible / Reservada / Arrendada-Vendida) — para que el corredor pueda marcar una propiedad sin borrarla.
- CTA de contacto (WhatsApp con mensaje prellenado referenciando la propiedad, formulario de contacto).
- Propiedades relacionadas/similares (mismo tipo o zona).

### Nosotros (perfil del corredor)
- Foto, bio, trayectoria, certificaciones/afiliaciones si aplica.
- Por qué elegir a este corredor (propuesta de valor).
- Datos de contacto directo.

### Guía Legal
- Contenido informativo sobre el proceso de compra/arriendo en Chile (documentos necesarios, pasos, costos asociados, etc.).
- En el MVP este contenido puede ser estático (no gestionable desde el panel); ver pregunta abierta más abajo.

### Contacto
- Formulario (nombre, contacto, mensaje, opcionalmente propiedad de interés).
- WhatsApp directo.
- Ubicación/zonas de cobertura.

## Funcionalidades — panel privado del corredor

- **Login** — acceso solo para el corredor.
- **Listado de mis propiedades** — vista tipo tabla/tarjetas con estado (publicada/borrador/despublicada), acciones rápidas.
- **Crear propiedad** — formulario con todos los campos del modelo de datos (abajo), incluida carga de imágenes (mock: pegar URLs o subir y quedar como referencia local en el MVP — ver `04-tecnico.md`).
- **Editar propiedad** — mismo formulario, precargado.
- **Eliminar / despublicar propiedad** — despublicar (soft) vs. eliminar (hard) son acciones distintas; despublicar es reversible y no rompe enlaces ya compartidos.
- **Marcar como destacada** — control simple para decidir qué aparece en Home.

Fuera del MVP pero mencionable como "diseñado para crecer hacia esto": analíticas de vistas por propiedad, gestión de leads recibidos, edición del contenido de la Guía Legal desde el panel.

## Modelo de datos de negocio (conceptual)

Campos por **propiedad** (la implementación técnica exacta vive en `04-tecnico.md`):

| Campo | Ejemplo | Notas |
|---|---|---|
| Título | "Casa moderna con vista a la cordillera" | |
| Operación | Venta / Arriendo | Confirmado: el catálogo soporta ambas |
| Tipo | Casa / Departamento / Terreno / Oficina / Parcela | |
| Zona/Comuna | "Zona Norte — Lo Barnechea" | Debe calzar con las zonas reales del corredor |
| Precio | UF 12.500 o CLP $350.000 (arriendo) | Moneda depende de operación — ver pregunta abierta |
| Dormitorios / Baños / Estacionamientos | 4 / 3 / 2 | |
| Superficie construida / de terreno (m²) | 220 / 500 | |
| Descripción | texto largo | |
| Galería de fotos | lista de imágenes | Mock = URLs externas |
| Estado | Disponible / Reservada / Arrendada-Vendida | |
| Destacada | sí/no | Controla aparición en Home |
| Publicada | sí/no (borrador) | El corredor puede preparar una ficha sin publicarla |

Campos del **perfil del corredor**: nombre, foto, bio, teléfono/WhatsApp, email, zonas de cobertura, redes sociales (opcional).

## Métricas de éxito sugeridas (para revisar con el corredor)

- Clics en CTA de WhatsApp / envíos de formulario de contacto.
- Tiempo hasta que el corredor logra publicar una propiedad nueva sin ayuda (mide qué tan "autónomo" es el panel).
- Velocidad de carga / Core Web Vitals del sitio público (impacta SEO y percepción de "marca de lujo").

## Zonas y datos maestros (confirmado)

"Norte / Centro / Sur" quedan como valores **ficticios de ejemplo**, no una taxonomía fija grabada en el código. El corredor debe poder terminar administrando sus propias zonas/comunas (y en general, sus propios valores maestros: tipos de propiedad, etc.) desde el panel a futuro — así que el modelo de datos trata "zona" como un campo de texto/catálogo editable, no un enum hardcodeado en la UI. Para el MVP igual se listan valores de ejemplo (Norte/Centro/Sur) como si vinieran de ese catálogo, para no bloquear el diseño del filtro y las tarjetas de Home.

## Preguntas abiertas — negocio

1. **Guía Legal**: ¿el corredor va a querer editar ese contenido él mismo desde el panel, o es un texto fijo que redactamos una vez y listo por ahora?
2. **Moneda**: en Chile las ventas suelen cotizarse en UF y los arriendos en CLP — ¿confirmamos ese criterio, o el corredor tiene su propia convención?
3. **Formulario de contacto**: cuando alguien lo llena, ¿basta con que llegue un correo al corredor (MVP simple), o necesita quedar guardado en el sistema para revisarlo después (empieza a acercarse a un mini-CRM)?
4. **Contenido real**: dado que por ahora todo sigue siendo ficticio, ¿en algún momento me vas a pasar copy/fotos reales del corredor (bio, propiedades reales) para reemplazar los mocks, o seguimos indefinidamente con contenido de prueba hasta nueva orden?
