# Spec · web de Stephany Londoño, artista plástica

Borrador 1 · 11/10/2026. Basado en el flujo de la landing de Arko (`landing-page-design` + `scroll-world`) adaptado a un portafolio de artista.

**Regla de oro (como en Arko):** es una persona real. Solo se usan datos que ella confirme. Lo que falte se marca como `PENDIENTE` en el contenido y nunca se inventa: ni títulos, ni técnicas, ni medidas, ni precios, ni premios, ni testimonios.

---

## 1. Objetivo

| | |
|---|---|
| **Acción principal** | Encargar una obra (comisión) → WhatsApp con mensaje prellenado. `PENDIENTE confirmar canal` |
| **Acción secundaria** (más abajo y en cada ficha) | Preguntar por una obra concreta disponible → WhatsApp con el título de la obra |
| **Oferta** | Retratos y obras por encargo (personas, mascotas, paisajes) + obra personal disponible. `PENDIENTE: qué tipos de encargo acepta, rangos de tamaño, tiempos` |
| **Público (asumido)** | Personas en Colombia que buscan un regalo o un retrato familiar pintado a mano, y coleccionistas que la siguen en Instagram |
| **Objeciones (asumidas)** | Precio, cuánto tarda, si el resultado se parecerá a la foto, cómo se envía la obra |
| **Tráfico (asumido)** | Instagram y boca a boca |
| **Tono** | Cercano, sereno, de taller. Habla ella en primera persona |

---

## 2. Contenido editable (lo más importante)

Todo lo que cambia con el tiempo vive en archivos de contenido, nunca dentro de los componentes. Editar una obra = editar un archivo Markdown.

### 2.1 Obras · `src/content/obras/<slug>.md`

Una obra = un archivo. Colección de Astro con schema validado (si falta un campo obligatorio o un valor no es válido, el build falla con un mensaje claro).

```md
---
title: "Colibrí en flor de cerezo"      # PENDIENTE si no hay título
category: comision                      # comision | personal | en-proceso
status: entregada                       # disponible | vendida | entregada | reservada | en-proceso | no-disponible
year: 2025
technique: "Óleo sobre lienzo"          # PENDIENTE
dimensions: { width: 60, height: 80, unit: cm }   # opcional
price: { amount: 2400000, currency: COP, visible: false }  # opcional; visible:false = "precio a consultar"
images:
  - { src: ../../assets/obras/colibri/principal.webp, alt: "Colibrí de plumas multicolor posado en una rama con flores rosadas", kind: principal }
  - { src: ../../assets/obras/colibri/taller.webp, alt: "...", kind: taller }   # principal | detalle | proceso | taller
featured: true     # aparece en la home
order: 10          # orden manual dentro de su categoría
draft: false       # true = no se publica
---
Texto libre de la obra: historia, inspiración, para quién fue (sin datos personales del cliente).
```

**Estados y cómo se muestran**

| `status` | Etiqueta | CTA en la ficha |
|---|---|---|
| `disponible` | Disponible | Preguntar por esta obra |
| `reservada` | Reservada | Avisarme si se libera |
| `vendida` | Vendida | Encargar algo parecido |
| `entregada` | Encargo entregado | Encargar una obra |
| `en-proceso` | En proceso | Seguir el proceso en Instagram |
| `no-disponible` | Colección personal | Encargar una obra |

Las reglas del schema evitan incoherencias: `category: en-proceso` obliga a `status: en-proceso`; `category: comision` no admite `disponible`.

### 2.2 Datos del sitio · `src/content/site.json`

Nombre, bio corta y larga, ciudad, WhatsApp, email, Instagram, textos de los CTA, mensajes prellenados de WhatsApp, menciones/exposiciones (p. ej. BIARCO, `PENDIENTE confirmar edición y año`), FAQ. Un solo archivo para todo lo que no es una obra.

### 2.3 Fase 2 opcional: editor visual

Si Stephany va a editar sin tocar código: **Keystatic** (CMS sobre los mismos archivos del repo, gratis, sin base de datos). Se monta encima del schema de 2.1 sin cambiarlo. No entra en la fase 1.

---

## 3. Páginas

| Ruta | Contenido |
|---|---|
| `/` | Scroll‑world (5 paradas) + resto de la landing (sección 4) |
| `/obras` | Catálogo completo. Filtros por categoría y estado, en la URL (`?cat=personal&estado=disponible`) para poder compartir el enlace |
| `/obras/[slug]` | Ficha: galería, ficha técnica, estado, descripción, CTA según estado, obras relacionadas de la misma categoría |
| `/404` | Página propia con vuelta a `/obras` |

El catálogo se genera solo desde `src/content/obras/`. Añadir una obra no requiere tocar ninguna página.

---

## 4. Home

### 4.1 Scroll‑world (arriba)

Vídeo 16:9 a pantalla completa que avanza y retrocede con el scroll. Texto superpuesto en cada parada, con la cámara quieta.

| Parada | Fotograma | Texto | Título HTML |
|---|---|---|---|
| 0 · `inicio` | F1 entrada al ático | h1 con su nombre + oficio, CTA principal | — |
| 1 · `taller` | F2 caballete | Dónde y cómo pinta (1–2 frases suyas) | El taller |
| 2 · `comision` | F3 pared del fondo | Qué encarga la gente, CTA Encargar | Obras por comisión |
| 3 · `personales` | F4 pared lateral | Su obra propia | Obras personales |
| 4 · `en-proceso` | F5 caballete | Lo que está pintando ahora | En proceso |

- Clips 1–4 de `media/transitions/` como conectores entre paradas. Fotogramas de parada extraídos del propio vídeo (no de las PNG) para que las costuras encajen.
- Móvil: el 16:9 se recorta a vertical. `object-position` horizontal por parada para mantener el sujeto a la vista. Encode 720p aparte para móvil.
- `prefers-reduced-motion`: solo los fotogramas fijos.
- Los títulos de pared son HTML, nunca texto dentro del vídeo.

### 4.2 Debajo del scroll‑world

1. **Tagline reveal** (obligatorio del skill), en su voz. `PENDIENTE frase suya`.
2. **Obras destacadas**: las `featured: true`, en tres grupos (Comisión, Personales, En proceso) con enlace a `/obras?cat=…`.
3. **Cómo funciona un encargo**: 3 pasos (me escribes con tu foto e idea → acordamos tamaño, precio y plazo → pinto y te envío avances). `PENDIENTE validar con ella`.
4. **Sobre Stephany**: foto `stephany/…BIARCO`, bio, menciones.
5. **FAQ** (6–8): tiempos, tamaños, precios, envíos, pagos, retoques, si pinta desde una foto. Todas `PENDIENTE` hasta que responda.
6. **Contacto / CTA final**: WhatsApp, email, Instagram, ciudad. Mismo CTA que arriba.

---

## 5. Dirección de arte

Sacada del vídeo (paredes blancas, vigas de nogal, suelo oscuro, luz de día) y de su paleta: turquesa del mar y los elefantes, ocre del velero.

**Tema claro**, como las paredes de una sala: los cuadros se ven con su color real. Un fondo oscuro altera la lectura de obras luminosas como el colibrí.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F6F3EE` | Yeso cálido, fondo general |
| `--surface` | `#FFFFFF` | Tarjetas de obra |
| `--ink` | `#1F1A16` | Texto, nogal casi negro |
| `--ink-soft` | `#5E554D` | Texto secundario |
| `--accent` | `#1E6B73` | Turquesa profundo: botones (texto blanco, contraste 6:1), enlaces, foco |
| `--line` | `#E3DDD4` | Bordes completos de tarjetas |

Sin degradados de fondo. El scroll‑world pone el texto sobre un velo de color `--ink` al 40 % para que se lea encima del vídeo.

**Tipografía** (decisión pendiente, ver §9):
- **Opción A, la recomendada:** titulares en *Fraunces* (serif editorial, peso 400–500, sin cursivas) + texto en *Manrope*. Da carácter de galería. Es una excepción a la lista de fuentes del skill y, como en Arko, hay que pedirla expresamente.
- **Opción B, la que marca el skill:** solo *Manrope* en todo.

En ambos casos: servidas en local, recortadas a latín, sin cursivas ni pesos 900.

**Formas:** sin marcos decorativos ni máscaras: el cuadro es el protagonista. Tarjetas con `rounded-lg` (8 px) y borde completo. Las obras siempre se ven enteras (`object-fit: contain`) dentro de una tarjeta de proporción fija; nunca se recortan.

**Movimiento:** lento, `cubic-bezier(0.32,0.72,0,1)`. Las obras aparecen con IntersectionObserver.

**Iconos:** Phosphor (WhatsApp, Instagram, correo, filtros).

---

## 6. Stack

- Astro 7 (ya instalado) + Tailwind v4 + `astro:assets` (`<Picture>` con AVIF/WebP y `srcset` automáticos).
- Las fotos de obras pasan de `public/photos/` a `src/assets/obras/<slug>/` para que Astro las optimice. **Hasta que lo autorices, `public/photos/` no se toca.**
- Motor scroll‑world del plugin `oso95/scroll-world` (marketplace añadido; falta `/plugin install`). Lenis solo si no choca con el suavizado del motor.
- BiomeJS (2 espacios), TypeScript estricto, sin `any`.
- Despliegue estático (Vercel/Netlify/Cloudflare Pages, `PENDIENTE elegir`).

---

## 7. Inventario de fotos (borrador para validar)

| Carpeta | Archivo | Obra (descripción, no título) | Notas |
|---|---|---|---|
| comision | `1.webp` | Colibrí sobre rama en flor | Baja resolución (963×1280) |
| comision | `2.webp` | Velero al atardecer, dos figuras | |
| comision | `IMG-20251014-WA0033(1)` y `IMG-20251111-WA0024(1)` | Pareja de guacamayas | **Duplicado**: misma obra, dos fotos |
| comision | `IMG-20251014-WA0034(2)` | Detalle: canoa con dos figuras | ¿Detalle del velero o de otra obra? |
| comision | `IMG-20260710-WA0030(1)` | Abstracto rojo y negro | Foto en ángulo |
| comision | `IMG.webp` | Familia de elefantes | |
| personales | `1.webp` | Mujer subiendo escalera sobre el mar | Foto en el taller |
| personales | `2.webp` | Madre e hijo entre espejo roto y ojos | |
| personales | `IMG_20250619_165207` | Paisaje de estanque con puente | |
| personales | `IMG_20250707_115000` | Túnel de árbol con figura | Foto en ángulo |
| personales | `IMG.webp` | Figura en círculo con textura | |
| en-proceso | `1.0`, `1.2`, `IMG.webp` | Retrato de mujer sin terminar | Las tres son la misma obra en distintas fases. `IMG.webp` está girada 90° |
| taller | `2.webp` | Retrato de pareja mayor en el caballete | ¿Es un encargo? Podría ir en Comisión |
| stephany | `IMG-20261009-WA0034(1)` | Ella con el catálogo de BIARCO | Para "Sobre mí" |

Resultado provisional: **6–7 obras por comisión, 5 personales, 1 en proceso**.

---

## 8. Plan por fases

| Fase | Entregable | Bloqueado por |
|---|---|---|
| **0 · Datos** | Respuestas a §9, títulos y fichas de las obras | Stephany |
| **1 · Base** | Tailwind, fuentes, tokens, layout, Header (píldora flotante), Footer, 404, SEO base | Decisión de tipografía |
| **2 · Contenido** | Colección `obras` con schema y estados, `site.json`, migrar fotos a `src/assets/obras/` | Fase 0 y permiso para mover fotos |
| **3 · Catálogo** | `/obras` con filtros en URL y `/obras/[slug]` con CTA por estado | Fase 2 |
| **4 · Home** | Secciones 4.2 (tagline, destacadas, encargo, sobre mí, FAQ, contacto) | Fase 2 |
| **5 · Scroll‑world** | Encodes web (desktop y 720p móvil), stills de parada, motor, textos, `object-position` móvil, reduced‑motion | Clips finales aprobados |
| **6 · QA** | Costuras del vídeo, móvil 390×844, Lighthouse, accesibilidad, `astro build` sin errores | — |

Se construye sección por sección; cada fase acaba en un commit revisable.

---

## 9. Preguntas para Stephany (una sola tanda)

1. **Contacto**: número de WhatsApp, email, Instagram y ciudad. ¿Envía a otras ciudades o países?
2. **Encargos**: ¿qué acepta (personas, mascotas, paisajes, abstractos)? Rangos de tamaño, tiempo típico, cómo cobra (anticipo, total).
3. **Precios**: ¿se muestran en la web, se muestra un "desde", o siempre "a consultar"?
4. **Por cada obra**: título, año, técnica, medidas y estado (disponible / vendida / entregada / colección personal).
5. **Dudas de las fotos**: ¿las guacamayas son una sola obra? ¿La canoa es un detalle del velero? ¿El retrato de la pareja del taller es un encargo?
6. **BIARCO**: qué edición, año y qué obra expuso. ¿Hay otras exposiciones o premios?
7. **Bio**: 3–5 frases en su voz, y una frase para el tagline.
8. **Tipografía**: Opción A (Fraunces + Manrope) u Opción B (solo Manrope).
9. **Dominio y hosting**.
