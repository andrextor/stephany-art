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

**Recomendación:** **Cormorant Garamond** (500) para titulares y nombres de obra + **Manrope** (400/600) para texto, botones y fichas técnicas. Servidas en local y recortadas a latín, sin cursivas ni pesos 900.

Cormorant es una excepción a la lista de fuentes del skill (`Geist, Manrope, Geist Mono, Poppins`) y necesita aprobación expresa. Si no se aprueba: solo **Manrope**.

### 5.2 Color

Sacado de su biografía (crema + dorado) y del vídeo (paredes blancas, nogal):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#FAF8F3` | Crema de la biografía, fondo general |
| `--surface` | `#FFFFFF` | Tarjetas de obra (blanco de sala: el cuadro se ve con su color real) |
| `--ink` | `#1F1A16` | Texto y botón principal (nogal casi negro, texto crema) |
| `--ink-soft` | `#5E554D` | Texto secundario |
| `--gold` | `#B8912F` | Filetes, separadores, foco. **Nunca para texto pequeño** (contraste insuficiente sobre crema) |
| `--line` | `#E6E0D5` | Bordes completos de tarjeta |

Tema claro: un fondo oscuro altera la lectura de obras luminosas (colibrí, velero). Sin degradados de fondo. En el scroll‑world el texto va sobre un velo `--ink` al 40 %.

### 5.3 Formas y movimiento

- El cuadro manda: tarjetas `rounded-lg` con borde completo, obra siempre entera (`object-fit: contain`) dentro de una proporción fija; nunca recortada.
- Filete dorado fino como único ornamento, igual que en la biografía.
- Movimiento lento, `cubic-bezier(0.32,0.72,0,1)`, apariciones con IntersectionObserver.
- Iconos: Phosphor (WhatsApp, filtros, flechas).

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
| `sea-stairs` | *Tránsito del alma* | 5 | Título **probable** (bio): confirmar |
| `textured-figure` | *La noche oscura del alma* | 6 (+certificado) | Título **probable** (bio): confirmar |
| `mother-and-child` | *Miradas que fragmentan* | 6 | Título **probable** (bio): confirmar |
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

## 8. Plan por fases

| Fase | Entregable | Estado |
|---|---|---|
| **0 · Datos** | Bio ✅, WhatsApp ✅, fotos ✅. Faltan títulos, fichas, estados y permisos (§9) | En curso |
| **1 · Base** | Tailwind, fuentes, tokens, layout, Header (píldora flotante), Footer, 404, SEO base | Bloqueada por la tipografía |
| **2 · Contenido** | Colección `artworks`, `site.ts`, imágenes en `src/assets` | ✅ |
| **3 · Catálogo** | `/obras` con filtros y `/obras/[slug]` con CTA por estado | Lista para empezar |
| **4 · Home** | Secciones §4.2 | Tras la fase 1 |
| **5 · Scroll‑world** | Vídeos web ✅; falta: stills, motor, textos, `object-position` móvil, reduced‑motion | Falta instalar el plugin |
| **6 · QA** | Costuras, móvil 390×844, Lighthouse, accesibilidad, `astro build` | — |

---

## 9. Preguntas para Stephany

1. **Títulos**: ¿*Tránsito del alma*, *La noche oscura del alma* y *Miradas que fragmentan* son la escalera, la figura en espiral y la madre con el niño? ¿Títulos del resto?
2. **Fichas**: año, técnica y medidas de cada obra.
3. **Estado de las obras personales**: disponible, vendida o colección personal.
4. **Permisos**: ¿los clientes de los 6 retratos autorizan publicarlos?
5. **Encargos**: qué acepta, tamaños, plazos, cómo cobra, si envía a otras ciudades o países.
6. **Contacto**: email, Instagram, ciudad.
7. **Tipografía**: Cormorant Garamond + Manrope (recomendada) o solo Manrope.
8. **Dominio y hosting**.
