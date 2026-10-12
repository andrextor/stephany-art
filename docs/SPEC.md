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

### 5.6 Fase 9 "la obra y la artista" (rama `feat/obra-y-artista`, aprobada e implementada el 11/10/2026)

**Pedido:** "Obras destacadas" se ve plana. Referencia del cliente: obra grande con la artista y su trayectoria al lado. Se presentaron tres opciones (artefacto "Obras destacadas Stephany") y se eligió **B · La obra y la artista**.

**Por qué se veía plana:** todas las obras en cajas 4:5 iguales (franjas vacías cuando el cuadro no tiene esa proporción), todas con el mismo peso, y la artista muy abajo.

#### Home después del recorrido

1. **Obra insignia + artista** (sustituye a la cuadrícula y a la banda de la cita). Izquierda, sobre nogal: la primera obra destacada (hoy *Tránsito del alma*) a su proporción real con su cartela. Derecha: "Stephany Londoño · Artista plástica", la cita completa en cursiva, tres datos de trayectoria (`site.highlights`) y dos botones (encargar por WhatsApp, ver las obras). La cita deja de repetirse en una banda aparte: se borra `TaglineReveal`.
2. **La artista y más obras** (`#sobre`). Izquierda, sobre tarjeta: solo la foto de la artista (la del taller se quitó a petición del cliente), una presentación corta (`site.intro`, resumida de la biografía oficial) y "Leer la biografía" como `<details>` nativo con los cuatro párrafos y las exposiciones. Derecha: hasta seis obras destacadas más, colgadas, y "Ver las N obras".
3. Cómo funciona un encargo (bambú) y pie (nogal), sin cambios.

#### Tarjeta de obra (home, `/obras`, relacionadas)

- La obra a su proporción real, sin caja ni borde, con sombra de lienzo sobre la pared. Las filas de la cuadrícula se alinean por abajo, como cuadros colgados a la misma altura de mirada.
- Cartela de museo: título en cursiva; debajo, tipo de obra en singular ("Obra personal", "Por encargo") y estado o año. La técnica aparece cuando Stephany la dé.
- Se conservan `data-category`/`data-status` (filtros) y `view-transition-name` (transición a la ficha).

#### Pendiente para Stephany

Una o dos fotos suyas pintando en el taller: la actual es de un evento con logos de patrocinadores.

#### Verificación

Capturas de home y `/obras` en 390 y 1440 px; filtros de `/obras` siguen funcionando; Lighthouse móvil ≥ 99 y CLS 0; contraste AA de cartelas sobre lino y nogal.

### 5.7 Fase 10 "movimiento y espirales" (rama `feat/movimiento`, aprobada e implementada el 11/10/2026)

**Pedido (11/10/2026):** con el nuevo diseño de la fase 9, el cliente sí quiere el scroll que teníamos en las secciones, y pide tomar como referencia las mejoras de la landing de Arko (`midudev/mcp-higgsfield-landing`): scroll y figuras decorativas.

**Lo que hace Arko después de su recorrido** (revisado en el código):
- Scroll suave en toda la página con Lenis (`autoRaf`, anclas suaves), desactivado con reduced motion.
- Apariciones escalonadas: cada bloque entra con un retraso propio (`--d: 0, 100, 200 ms`) en vez de todos a la vez.
- La frase principal se enciende palabra a palabra según avanza el scroll, ligada a la posición y no a un disparo único.
- Espirales de arena rastrillada (SVG de anillos irregulares hechos a mano) detrás de la frase y del CTA final, al 10 % de opacidad, que se trazan del centro hacia fuera al hacer scroll.
- Fotos recortadas en arco (`mask-arch`) y óvalos en lugar de rectángulos.

#### Propuesta para Stephany

1. **Secciones apiladas de vuelta** (interpretación de "el scroll que teníamos"): "Obra insignia", "Sobre mí + más obras", "Cómo funciona un encargo" y el pie vuelven a deslizarse uno sobre otro, con el mismo código de la fase 7 (`sticky` + `--h` publicado por `ResizeObserver`, sin tapar texto sin leer). La salida del recorrido sigue como en la fase 8: el último fotograma sube con el contenido.
2. **Scroll suave** con Lenis en toda la web (dependencia `lenis`, ~4 KB gzip, sin GSAP). Apagado con reduced motion. El recorrido ya suaviza el vídeo; se comprueba que no se sume un segundo retraso.
3. **Espiral de Stephany como figura decorativa.** El motivo sale de su propia obra: el relieve de *La noche oscura del alma* y el cielo en remolino de *Tránsito del alma*. Una espiral continua trazada a mano (no anillos), SVG generado en el build, `currentColor` al 10–12 %:
   - detrás de la cita, en la columna lino de "Obra insignia" (esquina inferior derecha, recortada);
   - en la banda bambú del encargo (esquina superior derecha);
   - en el pie nogal (esquina inferior derecha), igual que Arko en su CTA final.
   Se traza al hacer scroll con animaciones CSS ligadas a la vista (`animation-timeline: view()`, `stroke-dashoffset`), sin JS. Donde no hay soporte (Firefox) se ve ya dibujada.
4. **La cita se enciende palabra a palabra** en "Obra insignia", ligada al scroll como en Arko.
5. **Apariciones escalonadas** solo para títulos, cartelas y botones (no para las obras), con retrasos de 0/100/200 ms, sin desenfoque, y siempre visibles en el primer pintado: lo que ya está en pantalla al cargar no se anima.
6. **Foto de la artista en arco**: la parte superior redondeada como una ventana del ático. Además recorta los logos del fondo del evento.

#### Fuera de alcance

El recorrido (clips, paradas, textos), la paleta y el contenido.

#### Verificación

Secciones apiladas sin texto oculto en 390×844 y 1440×900; la espiral visible y trazada en Chrome y Safari, dibujada en Firefox; reduced motion sin Lenis, sin trazado y sin apariciones; Lighthouse móvil ≥ 99, CLS 0.

Coste: 0 créditos. Archivos: `global.css`, `index.astro`, `Footer.astro`, `Layout.astro`, un componente `Spiral.astro` nuevo, `package.json` (lenis).

Resultado: en 390×844 y 1440×900 cada sección apilada termina en el borde inferior de la pantalla antes de que la siguiente la cubra (ningún texto tapado sin leer) y ninguna aparición queda pendiente dentro de la vista; las palabras de la cita se encienden con el scroll; con reduced motion no hay Lenis, todo está visible y las espirales se ven ya dibujadas; sin errores de consola. Lighthouse móvil: `/` 99/100/100/100, `/obras` 99/100/100/100, ficha 100/100/100/100, CLS 0.

### 5.8 Fase 11 "scroll como Arko" (rama `feat/scroll-arko`, 11/10/2026)

- Las apariciones copian las de Arko: suben 4rem, pasan de desenfocadas a nítidas y aparecen en 1 s, escalonadas con `--d`. Ahora también las obras (tarjetas de la home, `/obras` y relacionadas, 0/120/240 ms por columna) y la obra insignia. Se mantienen las secciones apiladas y el scroll suave.
- El observador de apariciones usa `threshold: 0` sin margen inferior: con el margen de −10 % el botón de WhatsApp del pie, en la última franja de la página, no llegaba a aparecer nunca.
- Foto de la artista centrada en su columna y anclada arriba (`object-top`), para que la cara quede dentro del arco.
- La foto ya no parece un parche. `stephany-portrait.webp` sale de la foto original del evento, que se conserva como fuente: recorte de retrato de la cabeza al catálogo, color natural un poco más cálido y luminoso con sharp (se probaron blanco y negro cálido y color desaturado: los dos la dejaban sin vida). Abajo se funde con la banda (`.fade-bottom`) y lleva un pie que da contexto: "En la 5.ª Bienal Internacional de Arte de Armenia, 2024". Sigue pendiente una foto de Stephany pintando en el taller.

### 5.9 Instagram (11/10/2026)

- Pestaña vertical pegada al borde derecho, abajo, en todas las páginas: Instagram y WhatsApp, solo iconos (sin "Contáctanos" ni "Conecta"), fondo nogal translúcido, `aria-label` en cada enlace y zona segura del móvil respetada. Va abajo y no a media altura para no chocar con los puntos de navegación del recorrido. Enlace limpio `https://www.instagram.com/stephanylondonoart/`, sin el parámetro de seguimiento que traía el enlace compartido.
- También en el pie (`Instagram @stephanylondonoart`) y en el JSON-LD de la artista (`sameAs`).
- Correo `stephanylondof@gmail.com` en `site.email`: pie (enlace `mailto:`) y JSON-LD (`email`).

### 5.10 Menú como Arko (11/10/2026)

- En pantallas grandes la píldora del menú va pegada a la izquierda (`lg:justify-start`) para dejar libre el centro de la imagen; en móvil sigue centrada.
- Nuevo enlace "Recorrido" (`/#world`). Una píldora de fondo se desliza bajo el enlace de la sección visible (scroll-spy con `data-spy` en el recorrido, la obra insignia, "Sobre mí" y el pie; el pie usa su propio observador porque es más bajo que media pantalla). En `/obras` queda marcado "Obras".
- "Encargar una obra" pasa a arcilla, como el botón de reservar de Arko.
- Al hacer este cambio se detectó una regresión de la fase 11: la edición de las apariciones había borrado el final de `global.css` (tema del recorrido, textos de las paradas, preludio y transiciones entre páginas). Restaurado desde la fase 10 y comprobado: tipografía y colores del recorrido, preludio idéntico al motor y transiciones presentes.

---

### 5.11 Fase 12 "niebla" (rama `feat/niebla`, aprobada e implementada el 11/10/2026)

Pedido del cliente: fuente Althera (se usa Newsreader por licencia), textos nuevos en cuatro sitios y la paleta de la foto de bosque con niebla.

**1 · Tipografía: se mantiene Cormorant Garamond.** El cliente pidió Althera (Syauqi Studio), pero el zip disponible es la versión *free for personal use only*, sin uso comercial y sin cursiva. Se probó **Newsreader** como alternativa libre (comparativa en el artefacto "Fuentes para Stephany"), pero tras verla en el sitio se prefirió volver a Cormorant (11/10/2026). Si más adelante compran la licencia web de Althera en Gumroad, se sirve en local con `fontProviders.local()`.

**2 a 5 · Textos.** Solo cambia el texto; la maquetación se queda igual.

| # | Dónde | Archivo | Texto nuevo |
|---|---|---|---|
| 2 | Introducción de `/obras` | `src/pages/obras/index.astro` | Exploraciones personales y obras por encargo, universos donde la introspección y la naturaleza cobran vida a través del óleo, el acrílico y la delicadeza de las texturas. |
| 3 | `/obras`, con el filtro **En proceso** activo | `src/pages/obras/index.astro` | Una sutil danza entre la luz, la sombra y la materia. Así avanza el proceso creativo en el caballete. |
| 4 | Recorrido, parada 01 (Stephany Londoño) | `src/components/ScrollWorld.astro` | Un viaje visual hacia los rincones del alma. Pinturas al óleo y acrílico donde la memoria cobra latido y el tiempo se detiene en el lienzo. |
| 5 | Recorrido, parada 02 (El taller) | `src/components/ScrollWorld.astro` | Donde el tiempo se desacelera entre pigmentos y bastidores. El taller es un refugio íntimo para dar forma a lo invisible. |

Correcciones mínimas sobre el texto recibido: "textura" pasa a "texturas", "avanzan" a "avanza" y se añade el punto final.
- **N.º 3, confirmado (11/10/2026).** Es la introducción que sustituye al texto 2 cuando está activo el filtro "En proceso" (`?estado=in-progress`).
- **Copia sincronizada.** La parada 01 tiene una copia HTML previa (`.sw-prelude`) que debe coincidir píxel a píxel con la del motor. Con el texto más largo, hay que volver a comprobar ese ajuste en móvil.

**6 · Paleta "Niebla".** Sale de la foto de referencia (bosque, niebla y luz de amanecer). Como la referencia no trae claros, el fondo es un gris niebla cálido derivado de ella.

| Token | Antes (Nogal) | Ahora (Niebla) | Uso | Contraste |
|---|---|---|---|---|
| `--bg` | `#EFE8DA` | `#ECE8E2` niebla | Fondo general | — |
| `--surface` | `#F8F3E9` | `#F6F4F0` | Banda "Sobre mí", tarjetas | — |
| `--ink` | `#1E1711` | `#1B1D22` noche | Texto, botón principal, bandas oscuras, pie | 13,8:1 sobre bg |
| `--ink-soft` | `#5B5044` | `#404C4C` pizarra | Texto secundario sobre claro | 7,3:1 |
| `--ink-faint` | `#B9AE9C` | `#7F8A89` salvia | Texto secundario sobre noche | 4,7:1 |
| `--moss` | `#4F6B3A` | `#404C4C` pizarra | Banda "Cómo funciona un encargo" (texto bg 7,3:1) | — |
| `--moss-deep` | `#3B5230` | `#56625F` | Años, kicker, estados | 5,2:1 |
| `--clay` | `#A4502C` | `#E0B88F` luz de amanecer | Botón WhatsApp del pie y "Encargar una obra" del menú, con **texto `--ink`** (ya no `--surface`) | 9,2:1 |
| `--line` | `#DCD2BF` | `#D6D0C8` | Bordes | — |
| figura | — | arena, salvia, pizarra | Montañas en niebla (abajo) | — |

Se conservan los nombres de los tokens (`moss`, `clay`) para no tocar 40 clases; el renombrado se deja para más adelante si molesta. También se actualizan el `favicon.svg`, el `theme-color` y el velo del recorrido (`--ink` al 40 %).

**7 · Niebla en capas en lugar de la espiral** (elegida el 11/10/2026 en el artefacto "Figuras para Stephany", frente a curvas de nivel, pincelada seca y bambú). `Ridges.astro` genera en build 4 capas de montañas con senos superpuestos y semilla fija. Va abajo y a lo ancho en dos sitios (en la banda del encargo se probó y sobraba):
- **Panel de la cita:** arena, salvia y pizarra, al 30 % de la altura.
- **Pie:** al 45 %.

Al entrar cada sección, las capas cercanas suben más que las lejanas (`animation-timeline: view()`, 14 px por capa); sin movimiento con reduced motion. Se elimina `Spiral.astro`.

**8 · Pincelada seca** (opción C del mismo artefacto, 11/10/2026). `Brush.astro` genera en build un trazo de pincel seco: decenas de cerdas a lo largo de una curva bezier, con grosor, opacidad y cortes aleatorios de semilla fija. Se pinta de izquierda a derecha con una animación `clip-path` y no se muestra con reduced motion.
- **Banda del encargo:** trazo grande (`sweep`) abajo a la derecha en `--bg` al 40 %, pintado con el scroll (`view()`).
- **Ficha de obra:** trazo plano (`flat`) bajo el título en arena, pintado una vez al abrir la obra. Nunca va encima del cuadro.

**Criterios de aceptación**
- Todos los pares de texto ≥ 4,5:1, con Lighthouse de accesibilidad a 100 en `/`, `/obras` y una ficha.
- La copia previa coincide con la del motor (diferencia de 0 px) en 390 y 1440 px.
- `?estado=en-proceso` muestra el texto 3; el resto de filtros, el texto 2.
- Sin CLS por el cambio de fuente: preload más fallback métrico.
- Se mantienen Performance ≥ 95 y CLS 0.

**Orden de trabajo** (un commit por punto): paleta → textos.

### 5.12 Fase 13 "recorrido fluido en móvil" (rama `feat/recorrido-movil`, implementada el 11/10/2026)

Síntoma: en el celular el recorrido se ve a saltos y recortado; en el PC va fluido. Son tres causas que se suman, todas medidas sobre los archivos actuales.

**Diagnóstico**

| # | Causa | Dato |
|---|---|---|
| 1 | **Cada paso del scroll obliga al decodificador del móvil a reconstruir hasta 6 fotogramas.** Los clips llevan un fotograma clave cada 6 (`-g 6`, 0,25 s). Para mostrar un fotograma intermedio hay que decodificar desde el fotograma clave anterior. Un PC lo hace de sobra; un móvil resuelve 6–15 saltos por segundo y el resto se pierde: el vídeo avanza a tirones | `ffprobe clip-1-1080.mp4`: 121 fotogramas, 20 claves |
| 2 | **El móvil decodifica 4 veces más imagen de la que muestra.** El clip es 16:9 (1280×720 en móvil) y la pantalla es 9:19,5. Con `object-fit: cover` se ve el centro: unos 333 px de los 1280 de ancho (26 %). Por eso además se ve "recortado": la puerta y el caballete quedan fuera del encuadre | 390×844 sobre 1280×720: escala 1,17, ancho visible 333 px |
| 3 | **El motor pide saltos que no cambian nada.** En móvil `eps = 0,02 s`, medio fotograma a 24 fps: la mitad de los `currentTime` que pide muestran el mismo fotograma, pero cuestan una decodificación. Y solo espera a `seeking`, que en iOS se apaga antes de que el fotograma se pinte, así que encadena peticiones sobre un decodificador ocupado | `scroll-world.js`, `raf()` |

Descartado: Lenis no interviene en táctil (`syncTouch` apagado, scroll nativo). Los clips se cargan como Blob, así que no es un problema de red ni de `Range`.

**Plan**

1. **Clips de móvil verticales y "todo intra"** (0 créditos, solo ffmpeg sobre los másteres de `media/transitions/`).
   - Recorte 9:19,5 del máster 1080p que **sigue el `position` de cada parada**: el clip *n* va de la parada *n* a la *n+1*, así que el recorte se desplaza linealmente de `x_n` a `x_{n+1}` (50 → 45 → 55 → 75 → 85 %). Altura completa, por eso el 44 % vertical deja de importar. Salida 480×1040.
   - `-g 1`: todos los fotogramas son clave. Cualquier salto = 1 decodificación, sea cual sea el fotograma. Es exactamente lo que recomienda la cabecera del motor para móvil.
   - H.264 Main, `crf 26`, `+faststart`, sin audio.
   - **Peso medido en el clip 1:** 720p actual (`-g 6`) 2,27 MB · 720p todo intra 4,47 MB (el doble, descartado) · **vertical 540×960 todo intra `crf 26` 2,27 MB**: el mismo peso de hoy con 3 veces menos píxeles por fotograma y 6 veces menos trabajo por salto. 480×1040 tiene los mismos píxeles, así que pesa igual.
   - Pósteres `stop-{0..4}-960.webp` regenerados a partir del **primer o último fotograma del clip vertical**, con el mismo recorte, para que el póster y el vídeo coincidan al píxel (hoy son recortes del 16:9 por CSS).
   - Se mantienen las variantes `.webm` (VP9 `-g 1`, mismo recorte) solo como reserva y para las pruebas en Chromium sin H.264.
   - Cuando se rehagan los clips en Higgsfield (previsto), la cadena se repite en minutos; si se renderizan en 9:16 nativo, se omite el recorte.
2. **Motor, cambio local 13** (`scroll-world.js`, solo en la rama móvil):
   - `eps` en móvil = 1 fotograma (`1/24`). No se pide ningún salto que muestre el mismo fotograma.
   - Un salto nuevo solo cuando **el anterior ya se pintó**: `requestVideoFrameCallback` (Safari 15.4+, Chrome, Firefox) con `seeked` como reserva. Hoy solo se mira `seeking`.
   - En Safari, `fastSeek()` en vez de `currentTime` para los clips de móvil: como son todo intra, el fotograma "más cercano" es el exacto y evita la ruta lenta de búsqueda precisa.
   - Factor del lerp en móvil 0,14 (hoy 0,18) para que el movimiento sea más flotante; parámetro, no regla.
   - `--sw-pos` en móvil pasa a `center`, porque el recorte ya va en el vídeo.
3. **Verificación**
   - Chromium con emulación de móvil (390×844, táctil, CPU ×4) sobre `.webm`: latencia media entre `currentTime` y el fotograma pintado, antes y después. Objetivo: ≥ 20 fotogramas pintados por segundo durante un scroll continuo.
   - **Prueba en el teléfono real** con `astro dev --host` por wifi (iOS Safari y Android Chrome): fluidez, sin fotograma en blanco al entrar, sin salto al esconderse la barra de direcciones, pósteres iguales al vídeo.
   - Lighthouse móvil sin cambio (los clips se cargan al acercarse, no afectan al LCP) y CLS 0.
   - En escritorio nada cambia: mismos clips 1080p `-g 6`.

**Criterios de aceptación:** en un iPhone o Android de gama media el recorrido avanza con el dedo sin tirones visibles; el encuadre vertical muestra la puerta y el caballete en cada parada; el peso total de los clips de móvil no supera el de hoy (≈ 8,2 MB en MP4).

**Implementado (11/10/2026).** `scripts/encode-world.mjs` genera desde los másteres: `clip-N-1080.{mp4,webm}` (escritorio, `-g 6`), `clip-N-portrait.{mp4,webm}` (480×1040, `-g 1`, recorte que sigue `STOP_X` de parada a parada) y los pósteres `stop-N.webp` / `stop-N-portrait.webp` desde el primer o último fotograma de los clips ya codificados. `ScrollWorld.astro` apunta a los `-portrait` y ya no lleva `position` por parada; la copia previa usa `<picture>` con el póster vertical hasta 860 px. Motor: cambio local 13. Medición en Chromium emulando iPhone 13 con CPU ×4, clip 1 de 10 s: **153 fotogramas pintados en 3,5 s de scroll continuo (44 fps)**, 1 pintado por cada salto pedido. Pesos por clip de 10 s: 1080 MP4 ≈ 7,5 MB, vertical MP4 ≈ 3–4 MB (todo intra), vertical WebM ≈ 3–9 MB (solo reserva para pruebas).

Orden de trabajo (un commit por punto): motor y script de ffmpeg ahora → clips y pósteres cuando estén los clips v3 (fase 14) → verificación en teléfono real y spec.

### 5.13 Fase 14 "clips v3" (rama `feat/recorrido-movil`, ejecutada el 11/10/2026)

Detalle completo, prompts y costes en `media/transitions/PROMPTS.md` §5. Resumen:

- **Entrada nueva:** la foto real del taller (`media/keyframes/obra-inicio.jpeg`) con *Tránsito del alma* en el caballete, extendida a 16:9 por GPT Image 2.5 y con la entrada (F1v3) como outpaint de esa misma imagen. Esto elimina de raíz la "columna que crece" del clip 1.
- **Giro a Personales:** F4v3 sale de un outpaint de F3, así la pared lateral y sus vigas ya existen cuando la cámara gira; prompt que prohíbe que las vigas suban o aparezcan.
- **Modelo:** se sigue con Kling 3.0 pro, pero a **10 s** (17,5 c): el doble de fotogramas por conector y la cámara a mitad de velocidad. Es la mejora de fluidez más barata; Seedance (60 c) y FLUX (45 c) descartados por precio sin evidencia de mejora; A/B con MiniMax H3 (10 c) solo en el clip 3.
- **Decisión pendiente:** *Tránsito del alma* quedaría dos veces (caballete y pared de Personales). Mantener, o cambiarla en la pared y rehacer el clip 4.
- **Móvil:** todos los clips nuevos pasan por la fase 13; el 9:16 nativo es opcional y se decide tras aprobar el 16:9.
- **Presupuesto:** ≈ 60 créditos mínimo, 150–240 realista, de 1 000 disponibles.
- **Web al final:** pósteres y clips nuevos en `public/world` y `public/video`, prueba en teléfono real, Lighthouse y CLS 0.

**Ejecutado (11/10/2026).** Decisiones del cliente: caballete A; *Tránsito del alma* se queda también en la pared de Personales; marcos finos de madera y tamaños ligeramente distintos en los cuatro cuadros colgados; **cierre nuevo**: el recorrido termina donde empezó, en el caballete junto a la puerta, ahora con el retrato en proceso real (F5v3, mismo encuadre que F2v3), en lugar del rincón generado. Detalle, aprendizajes y archivos en `media/transitions/PROMPTS.md` §5 y "Archivos".

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
| **9 · La obra y la artista** | §5.6: obra insignia junto a la artista, tarjetas sin caja con cartela de museo | ✅ en rama `feat/obra-y-artista`, pendiente de merge |
| **10 · Movimiento y espirales** | §5.7: secciones apiladas de vuelta, scroll suave, espiral de Stephany como figura decorativa, cita palabra a palabra, foto en arco | ✅ en rama `feat/movimiento`, pendiente de merge |
| **11 · Scroll como Arko** | §5.8: apariciones con desenfoque escalonadas también en las obras, foto centrada | ✅ en rama `feat/scroll-arko`, pendiente de merge |
| **12 · Niebla** | §5.11: textos nuevos en `/obras` y en las paradas 01‑02, paleta de bosque con niebla | ✅ en rama `feat/niebla`, pendiente de merge. Copia previa = motor (0 px) en 390 y 1440; Lighthouse 96–99 / 100 / 100 / 100, CLS 0 |
| **13 · Recorrido en móvil** | §5.12: clips verticales todo intra para el teléfono, saltos a fotograma entero y esperando al pintado | Plan escrito, pendiente de aprobación |
| **14 · Clips v3** | §5.13: entrada con la foto real y *Tránsito del alma*, giro a Personales sin vigas que suben, clips a 10 s | Plan escrito, pendiente de aprobación. Va antes de la recodificación móvil de la fase 13 |

---

## 10. Preguntas para Stephany

1. **Títulos** del resto de obras (los tres de la bio ya están confirmados).
2. **Fichas**: año, técnica y medidas de cada obra.
3. **Estado de las obras personales**: disponible, vendida o colección personal.
4. **Permisos**: ¿los clientes de los 6 retratos autorizan publicarlos?
5. **Encargos**: qué acepta, tamaños, plazos, cómo cobra, si envía a otras ciudades o países.
6. **Contacto**: email, Instagram, ciudad.
7. **Dominio y hosting**.
