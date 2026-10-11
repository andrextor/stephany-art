# Spec · web de Stephany Londoño, artista plástica

Borrador 2 · 11/10/2026. Basado en el flujo de la landing de Arko (`landing-page-design` + `scroll-world`) adaptado a un portafolio de artista.

**Regla de oro:** es una persona real. Solo se usan datos confirmados: la *Biografía Artística* oficial (PDF) y lo que ella responda. Lo que falte va marcado `PENDIENTE` en el contenido y nunca se inventa (títulos, técnicas, medidas, precios, premios, testimonios).

---

## 1. Objetivo

| | |
|---|---|
| **Acción principal** | Encargar una obra → WhatsApp **+57 313 793 7797** con mensaje prellenado |
| **Acción secundaria** (más abajo y en cada ficha) | Preguntar por una obra concreta → WhatsApp con el título de la obra |
| **Precios** | **Los encargos nunca muestran precio** (lo impide el schema). Obra personal: precio opcional y oculto por defecto |
| **Público (asumido)** | Personas en Colombia que buscan un retrato o una obra por encargo, y coleccionistas |
| **Objeciones (asumidas)** | Precio, plazos, si el resultado se parecerá a la foto, envío |
| **Tráfico (asumido)** | Instagram y boca a boca |
| **Tono** | El de su biografía: introspectivo, sereno, poético, sin grandilocuencia |

---

## 2. Contenido editable

Todo lo que cambia vive en archivos de contenido, nunca dentro de los componentes. Nombres de archivos, carpetas y claves en inglés; textos visibles en español.

### 2.1 Obras · colección `artworks`

- Schema: `src/content.config.ts`.
- Una obra = un archivo: `src/content/artworks/<slug>.md`. El cuerpo del Markdown es la descripción.
- Imágenes de cada obra: `src/assets/artworks/<slug>/<nombre-descriptivo>.webp`. Astro genera AVIF/WebP y `srcset` en el build.

```md
---
title: "Tránsito del alma"
category: personal                # commission | personal
status: in-progress               # opcional: available | reserved | sold | delivered | in-progress | private-collection
year: 2026                        # opcional
technique: "Óleo sobre lienzo"    # opcional
dimensions: { width: 100, height: 120, unit: cm }   # opcional
price: { amount: 3500000, currency: COP, visible: false }  # opcional, prohibido en commission
images:
  - src: ../../assets/artworks/sea-stairs/woman-climbing-sea-stairs.webp
    alt: "Texto alternativo descriptivo"
    kind: main                    # main | detail | process | studio | certificate
featured: true                    # sale en la home
order: 10                         # orden dentro de su categoría
draft: false                      # true = no se publica
---
Descripción de la obra.
```

**Categorías:** solo dos, *Obras por comisión* y *Obras personales*. "En proceso" es un **estado** de una obra personal, no una categoría.

**Estados y cómo se muestran**

| `status` | Etiqueta | CTA en la ficha |
|---|---|---|
| `available` | Disponible | Preguntar por esta obra |
| `reserved` | Reservada | Avisarme si se libera |
| `sold` | Vendida | Encargar algo parecido |
| `delivered` | Encargo entregado | Encargar una obra |
| `in-progress` | En proceso | Encargar una obra |
| `private-collection` | Colección personal | Encargar una obra |
| *(sin estado)* | Sin etiqueta | Encargar una obra |

**Validaciones del schema:** un encargo no puede tener precio, ni estar `available` o `reserved`. Al menos una imagen por obra. Si algo no cumple, `astro sync`/`astro build` falla con un mensaje claro.

**Certificados:** 4 obras tienen foto del certificado de autenticidad (`kind: certificate`). En la ficha se muestra como prueba ("Incluye certificado de autenticidad").

### 2.2 Datos del sitio · `src/data/site.ts`

Nombre, rol, país, WhatsApp y mensajes prellenados, cita, bio y exposiciones (copiadas literalmente de la biografía oficial), y el helper `whatsappUrl()`. Pendiente: email, Instagram, ciudad.

### 2.3 Fase 2 opcional: editor visual

Si Stephany va a editar sin tocar código: **Keystatic** (CMS sobre los mismos archivos del repo, gratis, sin base de datos). Se monta sobre el schema actual sin cambiarlo.

---

## 3. Páginas

| Ruta | Contenido |
|---|---|
| `/` | Scroll‑world (5 paradas) + resto de la landing (§4) |
| `/obras` | Catálogo. Filtros por categoría y estado en la URL (`?cat=personal&estado=in-progress`) para poder compartir el enlace |
| `/obras/[slug]` | Ficha: galería (principal, detalles, proceso, certificado), ficha técnica, estado, descripción, CTA según estado, obras relacionadas |
| `/404` | Página propia con vuelta a `/obras` |

Añadir una obra no requiere tocar ninguna página.

---

## 4. Home

### 4.1 Scroll‑world (arriba)

Vídeo 16:9 que avanza y retrocede con el scroll. Texto superpuesto en cada parada, con la cámara quieta.

| Parada | Fotograma | Texto | Título HTML |
|---|---|---|---|
| 0 · `inicio` | F1 entrada al ático | h1 con su nombre + "Artista plástica y pintora · Colombia", CTA principal | — |
| 1 · `taller` | F2 caballete | "Desde su nuevo estudio…" (frase de la bio) | El taller |
| 2 · `comision` | F3 pared del fondo | Encargos, CTA Encargar | Obras por comisión |
| 3 · `personales` | F4 pared lateral | Su obra propia y exposiciones | Obras personales |
| 4 · `en-proceso` | F5 caballete | Lo que pinta ahora | En proceso |

- Vídeos web en `public/video/clip-{1..4}-{1080,720}.{mp4,webm}`: H.264 y VP9, sin audio, un keyframe cada 0,25 s (GOP 6) para que el scrub sea fluido. 1080p para escritorio y 720p para móvil.
- Fotogramas de parada extraídos del propio vídeo, no de las imágenes clave, para que las costuras encajen.
- Móvil: el 16:9 se recorta a vertical con un `object-position` horizontal por parada.
- `prefers-reduced-motion`: solo los fotogramas fijos.

### 4.2 Debajo del scroll‑world

1. **Tagline reveal** con su cita: *"Más que una técnica, mi trabajo es una invitación a la pausa y a la contemplación…"*.
2. **Obras destacadas** (`featured: true`) en dos grupos, Comisión y Personales, con enlace a `/obras?cat=…`.
3. **Cómo funciona un encargo**: 3 pasos. `PENDIENTE validar con ella`.
4. **Sobre Stephany**: foto de BIARCO, bio y exposiciones (Bienal de Armenia 2024 y 2026, portada en FILBo 2025).
5. **FAQ** (6–8): plazos, tamaños, envíos, pagos, certificado de autenticidad, si pinta desde una foto. `PENDIENTE` hasta que responda.
6. **Contacto / CTA final**: WhatsApp. Mismo CTA que arriba.

---

## 5. Dirección de arte

### 5.1 Tipografía · validación

Qué usan el mundo del arte y los portafolios de pintores:
- **Galerías** (Gagosian, Serpentine, Stephen Friedman): sans neutras y una display propia. Estética institucional y fría; pensada para la marca de la galería, no para la voz de un artista.
- **Portafolios de artistas**: patrón dominante de **serif editorial para títulos + sans limpia para el texto**. Dos familias como máximo y que la obra sea lo protagonista.
- **Su propia identidad**: la biografía oficial ya usa una serif clásica sobre fondo crema con un filete dorado. Es una pista de marca que conviene respetar.

| Candidata (titulares) | Carácter | Encaje con Stephany |
|---|---|---|
| **Cormorant Garamond** | Garamond clásica y de alto contraste, lírica | **Alto.** Su obra es figurativa, introspectiva y con referencias místicas (*La noche oscura del alma*). Cuadra con su bio. Floja en tamaños pequeños, así que solo para titulares (≥ 30 px) |
| Instrument Serif | Display condensada de moda (2024–2026), un solo peso | Medio. Suena más a estudio de diseño que a pintora |
| Fraunces | Serif cálida y blanda, variable | Medio‑bajo. Más de marca de producto o gastronomía |

**Decisión (aprobada 11/10/2026):** **Cormorant Garamond** (500) para titulares y nombres de obra + **Manrope** (400/600) para texto, botones y fichas técnicas. Servidas en local y recortadas a latín, sin cursivas ni pesos 900.

Cormorant es una excepción a la lista de fuentes del skill (`Geist, Manrope, Geist Mono, Poppins`), aprobada expresamente.

### 5.2 Color

Sacado del vídeo del taller (nogal de las vigas, pared encalada, bambú del balcón). La paleta crema + dorado de la biografía se usó hasta la fase 6 y se sustituyó en la fase 7 (§5.4):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#EFE8DA` | Lino tostado, fondo general y "Obras destacadas" |
| `--surface` | `#F8F3E9` | Tarjetas de obra y banda "Sobre mí" |
| `--ink` | `#1E1711` | Nogal: texto, botón principal y bandas oscuras (cita, pie) |
| `--ink-soft` | `#5B5044` | Texto secundario sobre claro (6,4:1) |
| `--ink-faint` | `#B9AE9C` | Texto secundario sobre nogal (8,1:1) |
| `--moss` | `#4F6B3A` | Bambú: banda "Cómo funciona un encargo", filetes, raíl del recorrido, foco |
| `--moss-deep` | `#3B5230` | Musgo: años, icono de certificado (7,1:1) |
| `--clay` | `#A4502C` | Arcilla: solo el botón de WhatsApp del pie (texto `--surface`, 5,1:1) |
| `--line` | `#DCD2BF` | Bordes de tarjeta |

Las obras siempre sobre claro (un fondo oscuro altera la lectura del colibrí o el velero); las bandas oscuras llevan texto, no cuadros. Sin degradados de fondo. En el scroll‑world el texto va sobre un velo `--ink` al 40 %.

### 5.3 Formas y movimiento

- El cuadro manda: tarjetas `rounded-lg` con borde completo, obra siempre entera (`object-fit: contain`) dentro de una proporción fija; nunca recortada.
- Filete verde bambú fino como único ornamento.
- Movimiento lento, `cubic-bezier(0.32,0.72,0,1)`, apariciones con IntersectionObserver.
- Iconos: Phosphor (WhatsApp, filtros, flechas).

### 5.4 Fase 7 "casa de campo" (rama `feat/casa-de-campo`)

Segunda vuelta (11/10/2026): la primera versión (lino `#F5F2E8` + acento bambú, todo claro) se vio pálida y sin carácter. Se presentaron tres paletas con las obras reales (artefacto "Paletas casa de campo") y se eligió **A · Nogal**: bandas oscuras entre secciones claras y un solo acento. Valores finales en §5.2.

**Ritmo de la home**: Obras destacadas (lino) → cita (nogal) → Cómo funciona un encargo (bambú, tarjetas oscurecidas con `bg-ink/15`) → Sobre mí (tarjeta) → pie (nogal, botón arcilla). El pie se renderiza dentro de `.after-world` en la home (`Layout hideFooter`) para que forme parte de la pila.

**Scroll de las secciones (opción 3, "apiladas")**: cada sección es `position: sticky; top: min(0px, calc(100svh - var(--h)))` dentro de `.after-world`; la siguiente se desliza por encima igual que la página cubre el último fotograma del recorrido. `--h` lo publica un `ResizeObserver` en `index.astro`, de modo que una sección más alta que la pantalla se fija cuando su borde inferior entra en vista y nunca tapa texto sin leer (verificado en 390×844 y 1440×900). Sin JS no hay pila: scroll normal. Las apariciones con desenfoque (`data-reveal`, `reveal.ts`) se eliminaron en todas las páginas; solo queda la cita palabra a palabra.

Texto original de la propuesta:

El vídeo manda: ático de vigas oscuras, paredes encaladas, tablones, bambú en el balcón y luz nublada. La web de hoy sale de la biografía (crema + dorado) y queda más "galería" que "taller en el campo". Propuesta: mover el color hacia lo que se ve en el vídeo y reservar el oro para nada.

#### Color

Muestreado del fotograma F2 (madera `#221715`, bambú olivo `#938667`):

| Token | Hoy | Propuesta | Contraste sobre `--bg` | Uso |
|---|---|---|---|---|
| `--bg` | `#FAF8F3` | `#F5F2E8` lino | — | Fondo general, un punto más cálido y menos "pantalla" |
| `--surface` | `#FFFFFF` | `#FCFBF6` | — | Tarjetas de obra. Sigue casi blanco: el cuadro conserva su color |
| `--ink` | `#1F1A16` | `#221B14` nogal | 15,2:1 | Texto, botón principal |
| `--ink-soft` | `#5E554D` | `#5A5146` tierra | 6,9:1 | Texto secundario |
| `--gold` → `--moss` | `#B8912F` | `#5C7A46` bambú | 4,3:1 | Filetes, subrayado del menú, raíl del recorrido, foco. Solo decorativo (≥ 3:1) |
| `--gold-deep` → `--moss-deep` | `#8A6A1F` | `#3F5A33` musgo | 6,9:1 | Numerales, años, icono de certificado: todo lo que hoy es dorado y es texto |
| `--line` | `#E6E0D5` | `#E2DCCB` | — | Bordes |

Se descarta un segundo acento (terracota/arcilla): con el verde y el nogal basta; más colores compiten con los cuadros. Sin texturas de papel ni degradados: pesan y ensucian la obra. Tema claro, como hasta ahora.

#### Tipografía

Se mantienen Cormorant Garamond + Manrope (aprobadas). Un solo añadido: **la cursiva de Cormorant** (un archivo más, 23 KB, precargado junto a la redonda porque `<Font preload>` no distingue estilos), para lo que tiene voz propia y no es titular: la cita de la artista, los numerales de "Cómo funciona un encargo" y el nombre de la obra en la lista de exposiciones. Los titulares siguen en redonda. Nada más cambia de tamaño ni de peso.

#### Transiciones de página

Hoy cada navegación es un corte en blanco. Propuesta con la View Transitions API entre documentos (CSS puro, sin router en cliente, sin tocar el motor del recorrido ni el script de reveal):

1. **Fundido entre páginas**: 450 ms con la curva de la casa. Firefox y navegadores sin soporte siguen con el corte de siempre; `prefers-reduced-motion` lo desactiva.
2. **La obra viaja**: al abrir una ficha desde la tarjeta, la imagen se desplaza y crece hasta su sitio en la ficha, y vuelve a la tarjeta al retroceder (`view-transition-name: obra-<slug>` en tarjeta y ficha).
3. **La cabecera no parpadea**: la píldora del menú se mantiene fija durante el cambio de página.
4. **Reveal sin retraso en el primer pintado**: lo que ya está en pantalla al cargar aparece de inmediato; solo lo que viene de abajo se anima al hacer scroll. Hoy todo arranca invisible y aparece con retraso, y en la transición 2 la tarjeta destino estaría a opacidad 0.

Fuera de alcance: transiciones del recorrido (clips fijos hasta tener créditos), modo oscuro, cursor o efectos de hover nuevos.

#### Verificación

- Contraste AA en todos los textos (tabla anterior).
- Lighthouse móvil tras el cambio: `/` 99/100/100/100, ficha 100/100/100/100, CLS 0.
- Capturas de home, catálogo y ficha en 390 px y 1440 px revisadas; cursiva servida (`document.fonts.check`), `view-transition-name` presente en tarjeta, ficha y cabecera; tarjetas visibles en el primer pintado.
- Pendiente: ver la transición tarjeta → ficha en Chrome y Safari reales (el Chromium de pruebas no permite observar la animación entre documentos).

Coste: 0 créditos. Archivos: `global.css`, `astro.config.mjs`, `Layout.astro` (`theme-color`), `favicon.svg`, `ArtworkCard.astro`, `obras/[slug].astro`, `Header.astro`, `TaglineReveal.astro`, `index.astro`, `reveal.ts`.

### 5.5 Fase 8 "página normal" (rama `feat/pagina-normal`, aprobada e implementada el 11/10/2026)

**Pedido (11/10/2026):** el recorrido se queda como está, pero todo lo que viene después tiene que comportarse como una página normal. No gustan ni las secciones apiladas de la fase 7 ni la salida actual del recorrido, donde el último fotograma se queda fijo y "Obras destacadas" se le sube por encima.

**Qué se conserva:** la paleta Nogal y sus bandas (lino, nogal, bambú, tarjeta, nogal), la cursiva, las transiciones entre páginas, los textos del recorrido más altos y tempranos, y la ausencia de apariciones con desenfoque.

#### Cambios

1. **Sin secciones apiladas.** Se borran la regla `sticky` de `.after-world > :not(script)` en `global.css` y el `ResizeObserver` de `index.astro`. Cada sección sube y sale de pantalla con el scroll, como cualquier web.
2. **El pie vuelve a su sitio.** Se quitan `hideFooter` en `Layout.astro` y el `<Footer />` dentro de `.after-world`. El pie lo pinta el layout en todas las páginas, igual que antes de la fase 7.
3. **Salida del recorrido como página normal.** Al terminar la última parada, el último fotograma y su texto suben a la misma velocidad que el contenido. El borde inferior del fotograma queda pegado al borde superior de "Obras destacadas", sin hueco y sin solaparse: se ve igual que una imagen de cabecera que se va con el scroll.
   - En el motor (`scroll-world.js`, cambio local nº 12): en `read()`, `exit = max(0, y − totalW·vh)` se publica como `--sw-exit` en `.sw-root`. `.sw-stage` y `.sw-copylayer` aplican `translateY(calc(-1 * var(--sw-exit)))`.
   - Las cuentas cuadran sin tocar la altura reservada. `#world` mide `(totalW + 1)·vh`, así que "Obras destacadas" empieza a asomar justo en `y = totalW·vh`, el mismo punto en el que el fotograma empieza a subir.
   - El raíl, la barra de progreso y la pista siguen desvaneciéndose con `.sw-leaving`. `.sw-past` sigue ocultando el mundo cuando ya ha salido de pantalla.
   - `.after-world` deja de necesitar `z-index` porque ya no hay nada que tapar. Se queda solo con su fondo.
   - Con reduced motion no cambia nada: ya se muestran solo los fotogramas fijos.

#### Fuera de alcance

Las paradas y las transiciones entre clips del recorrido, la paleta, `/obras` y las fichas.

#### Verificación

- En varios puntos de la salida, a 390×844 y 1440×900: el borde inferior del fotograma coincide con el superior de "Obras destacadas" (±1 px).
- Al hacer scroll por la home, ninguna sección se queda fija.
- El pie aparece una sola vez en la home, `/obras` y una ficha.
- Lighthouse móvil sigue en 99–100 en la home y una ficha, con CLS 0.
- Capturas a mitad de la salida y al final de la home, en móvil y escritorio.

Resultado: hueco de 0 px entre fotograma y contenido en toda la salida (1 px en el primer punto en móvil, por redondeo); ninguna sección `sticky`; un solo pie en las tres páginas (en la home sin margen superior, para que no quede una franja de lino entre "Sobre mí" y el pie); Lighthouse móvil en la tabla de §9.

Coste: 0 créditos. Archivos: `scroll-world.js`, `global.css`, `index.astro`, `Layout.astro`.

---

## 6. Stack

- Astro 7 + Tailwind v4 + `astro:assets` (`<Picture>`).
- Motor scroll‑world del plugin `oso95/scroll-world` (marketplace añadido; falta `/plugin install`). Lenis solo si no choca con el suavizado del motor.
- BiomeJS (2 espacios), TypeScript estricto, sin `any`.
- Despliegue estático (Vercel, Netlify o Cloudflare Pages, `PENDIENTE elegir`).

---

## 7. Inventario (21 obras, 70 fotos)

Fuente: `~/Downloads/Stephany Londoño/`, convertidas a WebP (lado largo ≤ 2400 px, calidad 85, orientación EXIF aplicada).

**Personales (6)**

| slug | Título | Fotos | Nota |
|---|---|---|---|
| `sea-stairs` | *Tránsito del alma* ✅ | 5 | Título confirmado |
| `textured-figure` | *La noche oscura del alma* ✅ | 6 (+certificado) | Título confirmado |
| `mother-and-child` | *Miradas que fragmentan* ✅ | 6 | Título confirmado |
| `tree-tunnel` | Túnel del árbol | 3 | |
| `pond-bridge` | Estanque con puente | 5 (+certificado) | |
| `woman-portrait` | Retrato de mujer | 3 | `in-progress` |

**Por comisión (15)**

| slug | Título provisional | Fotos | Nota |
|---|---|---|---|
| `hummingbird` | Colibrí | 4 (+certificado) | |
| `sailboat` | Velero al atardecer | 3 (+certificado) | |
| `mountain-lake` | Lago entre montañas | 3 | La "canoa" era un detalle de esta obra |
| `macaws` | Guacamayas | 2 | |
| `elephants` | Familia de elefantes | 2 | |
| `golden-tree` | Árbol dorado | 2 | |
| `red-black-abstract` | Abstracto en rojo y negro | 2 | |
| `beige-abstract` | Abstracto en beige y negro | 2 | |
| `ghostface` | Ghostface | 2 | |
| `family-portrait` | Retrato familiar | 7 | `draft` hasta tener el permiso del cliente |
| `elderly-couple-rose` | Pareja con rosa | 3 | `draft`, permiso |
| `couple-garden` | Pareja en el jardín | 1 | `draft`, permiso |
| `father-children` | Padre con sus hijos | 2 | `draft`, permiso |
| `beach-couple` | Pareja en la playa | 2 | `draft`, permiso |
| `kissing-couple` | Pareja | 2 | `draft`, permiso |

Otras: `src/assets/studio/` (ático, caballete), `src/assets/artist/stephany-at-biarco.webp`.
Sin usar todavía: 2 vídeos del taller y 2 vídeos en `Videos/` (posible material para "Sobre Stephany").

---

## 8. SEO

- **Dominio:** se define al desplegar con `SITE_URL=https://dominio pnpm build`. Con él se generan las URL canónicas, `og:url` y `sitemap-index.xml`; sin él el build funciona igual, pero sin sitemap.
- `robots.txt` dinámico (`src/pages/robots.txt.ts`) que apunta al sitemap si hay dominio.
- **URLs en español** desde el frontmatter (`slug:`), por ejemplo `/obras/transito-del-alma/`. Cuando lleguen los títulos definitivos hay que actualizar el `slug` **antes del lanzamiento**; después, cambiarlo rompe enlaces.
- **Datos estructurados (JSON‑LD):** `WebSite` + `Person` en la home, `CollectionPage` + `ItemList` en `/obras`, `VisualArtwork` en cada ficha (con año, técnica y medidas cuando existan). Falta `sameAs` con Instagram.
- **Open Graph / Twitter:** título, descripción, imagen (1200 px de la propia obra en cada ficha, `og-default.jpg` en el resto), `og:image:alt`, `og:locale es_CO`.
- Descripción única por ficha con técnica y año cuando existen. `theme-color`, `author`, `lang="es"`.
- Las 6 obras en `draft` no aparecen ni en el sitemap ni en el catálogo.

## 9. Plan por fases

| Fase | Entregable | Estado |
|---|---|---|
| **0 · Datos** | Bio ✅, WhatsApp ✅, fotos ✅. Faltan títulos, fichas, estados y permisos (§9) | En curso |
| **1 · Base** | Tailwind, fuentes, tokens, layout, Header (píldora flotante), Footer, 404, SEO base | ✅ |
| **2 · Contenido** | Colección `artworks`, `site.ts`, imágenes en `src/assets` | ✅ |
| **3 · Catálogo** | `/obras` con filtros y `/obras/[slug]` con CTA por estado | ✅ |
| **4 · Home** | Secciones §4.2 | ✅ Tagline reveal, encargo en 3 pasos (PENDIENTE validar), FAQ oculta hasta tener respuestas |
| **5 · Scroll‑world** | Motor vendorizado en `src/scripts/scroll-world.js` (9 cambios documentados en su cabecera), 5 paradas, 4 clips MP4 (WebM solo si el MP4 no se puede reproducir), 720p y stills de 960 px en móvil, reduced‑motion | ✅ Revisado el 11/10: la salida del recorrido deja el último fotograma fijo y la página se desliza por encima; póster + altura reservada antes de que arranque el motor; copia de la primera parada renderizada en HTML (LCP ≈ primer pintado); stills bajo demanda. Textos (11/10, fase 7): centrados de verdad en escritorio (el parallax pisaba el centrado), más altos en móvil (≈ 18 dvh) y aparecen durante el final de la transición anterior, se mantienen durante toda la parada. Móvil = recorte del 16:9 (no hay cadena 9:16 nativa) |
| **6 · QA** | Costuras, móvil 390×844, Lighthouse, accesibilidad, `astro build` | ✅ Lighthouse 100/100/100/100 en `/`, `/obras` y una ficha (móvil y escritorio). Pendiente: prueba en iPhone real |
| **7 · Casa de campo** | §5.4: paleta nogal/bambú, cursiva de Cormorant, transiciones de página | ✅ en rama `feat/casa-de-campo` (paleta Nogal + secciones apiladas), pendiente de merge |
| **8 · Página normal** | §5.5: sin secciones apiladas; el último fotograma del recorrido sube con el contenido | ✅ en rama `feat/pagina-normal`, pendiente de merge. Salida verificada: hueco 0 px entre fotograma y contenido en 390 y 1440 px |

---

## 10. Preguntas para Stephany

1. **Títulos** del resto de obras (los tres de la bio ya están confirmados).
2. **Fichas**: año, técnica y medidas de cada obra.
3. **Estado de las obras personales**: disponible, vendida o colección personal.
4. **Permisos**: ¿los clientes de los 6 retratos autorizan publicarlos?
5. **Encargos**: qué acepta, tamaños, plazos, cómo cobra, si envía a otras ciudades o países.
6. **Contacto**: email, Instagram, ciudad.
7. **Dominio y hosting**.
