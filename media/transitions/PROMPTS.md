# Prompts · vídeo de fondo "entrar al taller y recorrer las obras"

Versión corregida tras las pruebas (11/10/2026). Estos son los prompts que funcionaron, no los del primer intento.

Recorrido: **entrada al ático → caballete → pared del fondo (Comisión) → giro a la pared lateral (Personales) → rincón del caballete (En proceso)**.
5 fotogramas clave en 16:9 y 4 clips. El fotograma final del clip N es el inicial del clip N+1 (mismo archivo / job id).

```
F1 entrada ─clip 1 (avanza)─▶ F2 caballete ─clip 2 (gira izq.)─▶ F3 pared fondo COMISIÓN
F3 ─clip 3 (gira der. en el sitio)─▶ F4 pared lateral PERSONALES ─clip 4 (avanza)─▶ F5 rincón EN PROCESO
```

## Reglas (aprendidas en las pruebas)

1. **Cada fotograma en un punto de vista físicamente distinto.** Dos fotogramas con la misma composición (misma pared, mismo encuadre) producen un fundido de cuadros, no un movimiento de cámara. Fallo real: F3 y F4 eran ambas la pared del fondo vista de frente → Kling dejó la cámara quieta y transformó un cuadro en otro.
2. **Lo que está en el fotograma final debe poder existir en el inicial.** Si F2 tiene un objeto que F1 no tiene, Kling lo hace "aparecer". Fallo real: F1 con caballete vacío y F2 con retrato → el retrato se materializaba. Solución: generar F1 *a partir de* F2 (mismo estado de la habitación, cámara más atrás).
3. **No introducir arquitectura nueva entre fotogramas.** Si el fotograma final tiene una puerta o ventana que el inicial no tiene, Kling deforma las paredes para crearla. Fallo real: F4 v2 tenía una puerta al balcón entre las dos paredes → la pared del fondo se transformaba. Solución: prompt de imagen con `no doors, no windows, no openings` y describir qué queda fuera de encuadre.
4. **Para giros, describir una rotación en el sitio.** "Pure camera pan… stays in exactly the same spot… like turning their head… does not walk". Y aclarar que lo que aparece *ya existe fuera del encuadre*: si no, la pared nueva "sale" del lateral como si se construyera.
5. **Para avances, fijar la distancia a las paredes y repartir el giro.** "Keeping a constant distance of about two meters… turns very gradually, spread evenly over the whole shot… no whip pan, no motion blur". Sin esto Kling acelera a mitad de clip y barre contra la pared.
6. **Mantener la orientación de las paredes entre fotogramas.** Si una pared está a la derecha en el fotograma inicial, debe seguir a la derecha en el final (salvo que el clip gire de verdad hacia ella).
7. **Una sola casa, sin museo**: vigas en A oscuras, paredes blancas, tablones oscuros, luz nublada suave. `no spotlights, no frames`.
8. **Los cuadros no se mueven**: `The paintings are static artworks: nothing inside them moves`.
9. **Misma lente, altura y velocidad** en todos los clips: eye level, 24mm, slow constant pace.
10. **Títulos fuera del vídeo**: *Obras por comisión / Obras personales / En proceso* como HTML sobre el vídeo.
11. **El fondo hacia el que avanzas tiene que ser el mismo en los dos fotogramas.** Si F4 mira hacia la pared de Comisión y F5 pone el caballete en ese mismo fondo, Kling funde una cosa en otra. Fallo real: clip 4 v3. Solución: colocar el rincón En proceso junto a la ventana/balcón que ya existe a la izquierda de la pared de Comisión (visible en F3) y llegar a él girando a la izquierda.
12. **Para un avance recto, el fotograma inicial es el final alejado (outpaint).** Generar F1 como imagen nueva "desde más atrás" inventa detalles distintos a F2 (paneles, muebles) y Kling los transforma mientras avanza. Con `outpaint_image` (F2 → lienzo más grande, 2 créditos) todo lo de F2 ya existe en F1.

## Ajustes

| Paso | Modelo | Ajustes | Coste |
|---|---|---|---|
| Fotogramas | `gpt_image_2_5` | `aspect_ratio 16:9`, `resolution 2k`, **`quality medium`** (low deforma los cuadros) | 1 c/u |
| Clips | `kling3_0` · `mode pro` | 5 s, `sound off`, `aspect_ratio 16:9`, `start_image` + `end_image` | 8,75 c/u |

Kling 3.0 no tiene negative prompt: las exclusiones van dentro del prompt como `no …`.
Kling **ignora `aspect_ratio`** y toma el formato de los fotogramas: tienen que ser 16:9.
Con la CLI en cuenta de prueba solo se puede generar vía MCP de Higgsfield.

---

## 1 · Fotogramas (GPT Image 2.5)

Orden: **F2 → F1** (F1 se genera a partir de F2) y **F3 → F4 → F5** (cada una usa la anterior como referencia).

### F2 · caballete (ref: `taller/2.webp`)

```
Extend this photo of an attic studio to a 16:9 widescreen frame without changing the room: the wooden easel holding the painted portrait of an elderly couple, the leather pouf with a palette on it, the open wooden door with the balcony and green bamboo, the white folding table on the right, the dark wooden A-frame beams and dark polished floorboards. Remove the hand and the mug in the foreground completely; show the blank canvas lying on the plastic sheet on the floor. Continue the beams, slanted white walls and floorboards naturally on both sides. Soft overcast daylight from the balcony. Photorealistic photograph, eye level, 24mm lens, no people, no hands, no mug, no text, no signs, no watermark.
```

### F1 · entrada (refs: F2, `taller/1.webp` ampliada)

```
The exact same attic studio as the first reference image, in the exact same state, but seen from further back, standing at the entrance of the attic and looking down its whole length toward the open balcony door. Everything identical to the reference: the wooden easel holding the portrait of an elderly couple, the leather pouf with a palette, the blank canvas lying on the plastic sheet on the floor, the white folding table with printer, baskets and ring light on the right, the dark wooden cabinet on the left, the open wooden door and balcony with green bamboo. More of the dark wooden A-frame beams, slanted white walls and wide dark polished floorboards visible in the foreground, as in the second reference. Same light and colors as the first reference. Photorealistic photograph, 16:9, eye level, 24mm lens, no people, no hands, no text, no watermark.
```

### F3 · pared del fondo COMISIÓN (refs: `obras-comision/1.webp`, `obras-comision/2.webp`, `taller/1.webp`)

```
Another part of the same attic studio shown in the third reference photo, arranged quietly to show finished work. A straight white wall between two dark wooden beams. Two unframed canvases hang side by side at eye level, simply and slightly apart: on the left the hummingbird painting from the first reference (colorful hummingbird on a blossoming branch over a soft green background), on the right the sailboat painting from the second reference (wooden sailboat with two figures on a calm golden sea at sunset). Clear empty wall above them. Front view, centered, the wall fills most of the frame, a little floor visible. Reproduce both paintings exactly as in the references: same composition, colors and proportions. Same house throughout: dark wooden A-frame beams, slanted white walls, wide dark polished wood floorboards, soft overcast daylight coming from the balcony. Photorealistic photograph, 16:9, eye level, 24mm lens, no people, no hands, no text, no signs, no watermark, no gallery spotlights, no frames.
```

### F4 · pared lateral PERSONALES (refs: F3, `obras-personales/1.webp`, `obras-personales/2.webp`) ✅ v3

```
The exact same attic room as the first reference image, photographed from the exact same spot and height, with the camera only rotated about 40 degrees to the right, like turning your head. Nothing in the room changes. The end wall with the hummingbird and sailboat paintings is now in the left third of the frame, seen at a slight angle, unchanged. The window that was at the far left of the end wall is now out of frame, so no window and no door are visible anywhere. At the right edge of the end wall stands the same dark wooden corner post and rafter, and from there the long side wall of the attic runs to the right: a low vertical white knee wall under the slanted white roof and dark rafters, continuous plain plaster with no openings. On this side wall two unframed canvases hang side by side at eye level: the painting from the second reference (woman in a blue dress climbing stone steps across a turquoise sea toward a glowing figure in a swirling sky) and the painting from the third reference (dark painting of a woman embracing a child in a blue hoodie among shattered mirror shards with large painted eyes). Same dark polished floorboards and soft overcast daylight. Reproduce all four paintings exactly as in the references. Photorealistic photograph, 16:9, eye level, 24mm lens, no doors, no windows, no openings, no people, no text, no watermark, no spotlights, no frames.
```

### F5 · rincón EN PROCESO (refs: `obras-en-proceso/1.2.webp`, `obras-en-proceso/1.0.webp`, F4)

> v3 (pared a la derecha). Sigue pendiente la regla 11:

```
The same attic room as the third reference image, a few steps further along the long side wall: the camera has walked forward along the room keeping the side wall on its right, and has turned slightly left toward the far end of the attic. The two large paintings on the side wall are now only partly visible at the far RIGHT edge, seen at a sharp angle (the woman climbing steps across the sea and the woman embracing a child among mirror shards). Ahead, at the far end of the attic under the dark wooden A-frame rafters, is the artist's working corner beside an open wooden door to a balcony with green bamboo: the unfinished painting from the first reference (portrait of a dark-haired woman in a light blouse on a misty blue-grey background, its lower half still a pencil sketch) stands on a paint-stained wooden easel, and next to it a small wooden table with fresh dabs of oil paint and a few brushes, as in the second reference. Same slanted white walls, same dark polished floorboards, same soft overcast daylight. Reproduce the unfinished painting exactly as in the reference. Photorealistic photograph, 16:9, eye level, 24mm lens, no people, no hands, no text, no signs, no watermark, no gallery spotlights.
```

---

## 2 · Clips (Kling 3.0 Pro · 16:9 · 5 s · sin sonido)

### Clip 1 · F1 → F2 · avanza por el ático ✅

```
The camera walks slowly forward down the middle of the attic studio toward the open balcony door, the easel with the portrait of an elderly couple growing closer, and stops a few steps in front of the blank canvas lying on the plastic sheet on the floor. One continuous shot on a steady gimbal at eye level, 24mm, slow constant walking pace with natural parallax, gentle ease-in and ease-out, landing exactly on the final frame. The paintings are static artworks: nothing inside them moves. Keep the house structure, beams, walls, floor, furniture and daylight unchanged. No cuts, no fades, no dissolves, no morphing, no zoom, no camera shake, no people, no new objects. Photorealistic, silent.
```

### Clip 2 · F2 → F3 · gira a la izquierda hacia la pared del fondo ✅

```
The camera turns gently to the left, away from the easel, and walks a few steps along the attic, passing under a dark wooden beam, then settles facing a white wall where two canvases hang side by side: a colorful hummingbird and a sailboat at sunset. One continuous shot on a steady gimbal at eye level, 24mm, slow constant walking pace with subtle natural parallax, gentle ease-in and ease-out, landing exactly on the final frame. The paintings are static artworks: nothing inside them moves. Keep the house structure, beams, walls, floor and daylight unchanged. No cuts, no fades, no morphing, no zoom, no camera shake, no people, no new objects. Photorealistic, silent.
```

### Clip 3 · F3 → F4 · giro en el sitio hacia la pared lateral (v3)

```
Pure camera pan: the camera stays in exactly the same spot and slowly rotates about 40 degrees to the right, like a person turning their head. It does not walk, does not move forward or backward. The end wall with the hummingbird and sailboat paintings stays rigid and unchanged and simply slides toward the left of the frame. The side wall and its two paintings already exist just outside the frame on the right; they come into view only because the camera turns, already hanging on the wall. The room does not change shape: no new doors, no new windows, no openings appear, walls and beams do not move or bend. Steady gimbal at eye level, 24mm, slow constant rotation speed, gentle ease-in and ease-out, landing exactly on the final frame. The paintings are static artworks: nothing inside them moves. No cuts, no fades, no dissolves, no morphing, no zoom, no camera shake, no people. Photorealistic, silent.
```

### Clip 4 · F4 → F5 · avanza junto a la pared lateral hasta el caballete (v2)

```
Smooth steady dolly forward down the center of the attic, parallel to the side wall with the two large paintings on the right, keeping a constant distance of about two meters from that wall: the camera never approaches, brushes or points straight at the wall. While walking, the camera turns very gradually, spread evenly over the whole shot, toward the far end of the attic, where the working corner is: an unfinished portrait on a wooden easel, a small table with fresh paint and brushes, and an open door to a balcony with green bamboo. The paintings on the side wall pass by on the right of the frame without changing. Comes to a soft stop and holds still on the final frame. Steady gimbal at eye level, 24mm, slow constant walking speed, natural parallax, gentle ease-in and ease-out. The paintings are static artworks: nothing inside them moves or changes. No whip pan, no motion blur, no sudden turns, no cuts, no fades, no morphing, no zoom, no camera shake, no people, no new objects. Photorealistic, silent.
```

---

## 3 · Negative prompt (solo si se usa Seedance o Veo)

```
cut, scene change, fade, dissolve, crossfade, morphing, warping beams, bending walls, melting geometry, new doors, new windows, flicker, lighting change, zoom, fisheye, fast motion, whip pan, motion blur, shaky camera, animated paintings, moving water in paintings, people, hands, text, signs, labels, watermark, museum, spotlights, gold frames, marble floor, extra objects, vertical framing, black bars, audio
```

---

## 4 · Pipeline

1. Fotogramas en orden (F2 → F1, F3 → F4 → F5). Revisar cada uno contra las reglas 1, 2, 3 y 6 **antes** de gastar en clips.
2. Generar primero el clip con el movimiento más difícil.
3. Revisar cada clip con una hoja de contactos: `ffmpeg -i clip.mp4 -vf "select='not(mod(n\,15))',scale=480:-1,tile=5x2" -frames:v 1 hoja.png`.
4. Concatenar: `ffmpeg -f concat -safe 0 -i lista.txt -an -c:v libx264 -crf 20 -pix_fmt yuv420p recorrido-preview.mp4`.
5. Versión para scroll: `ffmpeg -i recorrido-preview.mp4 -an -c:v libx264 -crf 23 -g 1 -pix_fmt yuv420p -movflags +faststart recorrido-scroll.mp4`.

## Archivos

| Archivo | Estado |
|---|---|
| `keyframes/F1-atico.webp` | ✅ v3: **outpaint de F2** (F2 intacta en el centro). Las versiones reinventadas hacían que la pared de paneles de la izquierda se "construyera" durante el avance (regla 12) |
| `keyframes/F2-caballete.webp` | ✅ |
| `keyframes/F3-comision.webp` | ✅ |
| `keyframes/F4-personales.webp` | ✅ v3 (v1 `-frontal` descartada por la regla 1, v2 `-con-puerta` por la regla 3) |
| `keyframes/F5-en-proceso.webp` | ✅ v4: giro de 45° más a la derecha por la misma pared lateral; el caballete está más adelante en esa pared |
| `transitions/clip1-entrada-atico.mp4` | ✅ v2: avance recto, la pared izquierda ya existe desde el primer fotograma. Sale a 1928×1076: normalizar a 1920×1080 al concatenar |
| `transitions/clip2-taller-comision.mp4` | ✅ |
| `transitions/clip3-comision-personales.mp4` | ✅ v3: giro en el sitio, pared del fondo rígida, sin puerta |
| `transitions/clip4-personales-en-proceso.mp4` | ✅ v4: giro en el sitio hacia la derecha, sin fundidos. El cuadro de la escalera se deforma un poco a mitad del giro |
| `recorrido-preview.mp4` / `recorrido-scroll.mp4` | ✅ rehechos con los clips nuevos |

Coste acumulado: ~100 créditos (quedan 0,75).

---

## 5 · Cambios v3 (plan 11/10/2026 · 1 000 créditos disponibles, plan Plus)

Sustituye a los "Cambios v2" (espiral en el caballete): la decisión nueva es **la foto real del taller `keyframes/obra-inicio.jpeg` con *Tránsito del alma* en el caballete**. Los clips 2 y 4 están aprobados; el 1 y el 3 tienen defectos que se corrigen aquí.

### 5.0 · Costes reales (preflight `get_cost`, 11/10/2026)

| Modelo | Ajustes | Créditos / clip |
|---|---|---|
| **Kling 3.0 pro** (el usado) | 5 s, sin sonido, start+end | **8,75** |
| Kling 3.0 pro | **10 s**, sin sonido | **17,5** |
| Kling 3.0 4K | 5 s | 30 |
| MiniMax H3 (2K, start+end) | 5 s | 10 |
| MiniMax H3 Max (768p) | 5 s | (no medido, más barato) |
| Seedance 2.5 1080p | 5 s, sin audio | 60 |
| Seedance 2.5 borrador 480p | 5 s | 15 |
| FLUX 3 Video 1080p | 5 s, sin audio | 45 |
| GPT Image 2.5 · imagen | 2k, medium | 1 |
| Outpaint | | 2 |

**Elección de modelo.** Los tirones no vienen del modelo sino de (a) fotogramas clave con geometría distinta (reglas 1–3, 12) y (b) **pocos fotogramas por clip**: 5 s = 121 fotogramas que el scroll recorre en ~0,9 pantallas. Con **10 s (241 fotogramas) la cámara va a la mitad de velocidad y el scrub tiene el doble de pasos**: es la mejora de fluidez más barata y segura (17,5 c). Seedance y FLUX cuestan 5–7 veces más sin ninguna evidencia de que manejen mejor un paneo con fotograma inicial y final; Kling 4K solo añade resolución. **MiniMax H3** (2K, 10 c) es la única alternativa que vale la pena probar: un A/B en el clip 3, que es el más difícil.

### 5.1 · Entrada con *Tránsito del alma* (bloque A)

Orden: **F2v3 (edición de la foto) → F1v3 (outpaint de F2v3, regla 12) → clip 1 → clip 2**.

| Paso | Modelo | Coste |
|---|---|---|
| F2v3 | `gpt_image_2_5`, refs: `obra-inicio.jpeg` + `sea-stairs/woman-climbing-sea-stairs.webp` + `sea-stairs/woman-climbing-sea-stairs-in-studio.webp`, 16:9, 2k, medium | 1 (+1 reintento) |
| F1v3 | `outpaint_image` de F2v3, 16:9 con lienzo mayor (F2v3 intacta en el centro, ≈ 70 % del ancho) | 2 |
| Clip 1 v4 | `kling3_0` pro, F1v3 → F2v3, **10 s** | 17,5 |
| Clip 2 v3 | `kling3_0` pro, F2v3 → F3, 10 s | 17,5 |
| **Total** | | **38** (≈ 73 con un reintento por clip) |

Por qué desaparece la "columna que crece" del clip 1: F1 v3 y F2 salían de dos imágenes generadas por separado y Kling reconciliaba el poste de la derecha moviéndolo. Ahora F1v3 es un outpaint de F2v3, que a su vez es la foto real: el poste es el mismo píxel en los dos extremos.

#### F2v3 · caballete con *Tránsito del alma*

```
Extend the first reference photo of the attic studio to a 16:9 widescreen frame, keeping its full height and changing only one thing: the painting on the wooden easel. Replace the unfinished portrait with the painting from the second reference, a nearly square canvas about one meter wide: a woman in a pale blue dress climbing a stone stairway across a turquoise sea toward a glowing figure in a swirling cloudy sky. The third reference shows this same canvas standing on this same easel in this same spot: match that size, position and slight angle. Reproduce the painting exactly as in the second reference, same composition, colors and proportions. Everything else stays identical to the first reference: the paint-stained wooden easel with the black tablet arm beside it, the leather pouf, the blank canvas leaning on the left wall, the small dark cabinet, the open wooden door and the balcony with green bamboo, the white folding table with printer and baskets on the right, the dark wooden A-frame beams, white walls, wide dark polished floorboards and soft overcast daylight. Continue the beams, slanted walls and floorboards naturally on both sides. Photorealistic photograph, eye level, 24mm lens, no people, no hands, no text, no signs, no watermark.
```

#### F1v3 · entrada

`outpaint_image` de F2v3 (sin prompt). Revisar que el poste derecho y la mesa no cambien.

#### Clip 1 v4 · F1v3 → F2v3 · avanza (10 s)

```
The camera walks very slowly forward down the middle of the attic studio toward the open balcony door, the easel with the painting of the woman climbing stone steps across the sea growing closer, and stops a few steps in front of the leather pouf. One continuous shot on a steady gimbal at eye level, 24mm, slow constant walking pace with natural parallax, gentle ease-in and ease-out, landing exactly on the final frame. The dark wooden post and beams on the right are the same ones throughout: they only get closer, they never grow, bend, appear or disappear. The painting is a static artwork: nothing inside it moves. Keep the house structure, beams, walls, floor, furniture and daylight unchanged. No cuts, no fades, no dissolves, no morphing, no zoom, no camera shake, no people, no new objects. Photorealistic, silent.
```

#### Clip 2 v3 · F2v3 → F3 · gira a la izquierda (10 s)

```
The camera turns gently to the left, away from the easel with the painting of the woman climbing stone steps across the sea, and walks a few slow steps along the attic, passing under a dark wooden beam, then settles facing a white wall where two canvases hang side by side: a colorful hummingbird and a sailboat at sunset. One continuous shot on a steady gimbal at eye level, 24mm, slow constant walking pace with subtle natural parallax, gentle ease-in and ease-out, landing exactly on the final frame. The paintings are static artworks: nothing inside them moves. Keep the house structure, beams, walls, floor and daylight unchanged. No cuts, no fades, no morphing, no zoom, no camera shake, no people, no new objects. Photorealistic, silent.
```

### 5.2 · Giro a Personales sin columnas que suben (bloque B)

Defecto del clip 3 v3: al aparecer la pared lateral, las vigas de la derecha se esconden y suben. Causa: F3 y F4 v3 son dos imágenes generadas por separado y sus vigas no coinciden, así que Kling las "reconstruye" durante el giro (misma raíz que la regla 12). Solución: **F4v3 sale de F3 por outpaint**, para que la pared lateral y sus vigas ya existan en la misma imagen que F3; la cámara solo gira hacia ellas.

| Paso | Modelo | Coste |
|---|---|---|
| F3 ancha | `outpaint_image` de F3 hacia la derecha, al doble de ancho (≈ 32:9; si la herramienta no lo admite, dos outpaints 21:9 encadenados) | 2–4 |
| F4v3 ancha | `gpt_image_2_5` edición de la imagen ancha: colgar los dos cuadros en la pared lateral derecha sin tocar nada más | 1 (+1) |
| F4v3 | Recorte local (sharp) del tercio derecho a 16:9, misma altura que F3 | 0 |
| Clip 3 v4 | `kling3_0` pro, F3 → F4v3, **10 s** | 17,5 |
| A/B opcional | `minimax_h3` 2K, mismo par y prompt | 10 |
| **Total** | | **20,5–24** (+17,5 reintento, +10 A/B) |

Plan B si Kling sigue deformando las vigas: el giro como **paneo CSS sobre la imagen ancha** (sin vídeo, 0 créditos, perfecto en móvil). Requiere un tipo de conector nuevo en el motor; se decide tras ver el clip.

#### F4v3 ancha · colgar los cuadros (ref: F3 ancha + `sea-stairs/woman-climbing-sea-stairs.webp` + `shattered-mirror/…` o el cuadro que se decida)

```
Edit the reference image changing only one thing: on the long white side wall at the right, between the dark rafters, hang two unframed canvases side by side at eye level, slightly apart, seen at the same perspective angle as that wall: the painting from the second reference (woman in a blue dress climbing stone steps across a turquoise sea toward a glowing figure in a swirling sky) and the painting from the third reference (dark painting of a woman embracing a child in a blue hoodie among shattered mirror shards with large painted eyes). Reproduce both paintings exactly as in the references. Nothing else changes: same walls, rafters, beams, floorboards, end wall with the hummingbird and sailboat paintings, same light. Photorealistic, no people, no text, no watermark, no spotlights, no frames.
```

#### Clip 3 v4 · F3 → F4v3 · giro en el sitio (10 s)

```
Pure camera pan: the camera stays in exactly the same spot and very slowly rotates about 40 degrees to the right, like a person turning their head. It does not walk, does not move forward or backward. The end wall with the hummingbird and sailboat paintings stays rigid and unchanged and simply slides toward the left of the frame. The side wall and its two paintings already exist just outside the frame on the right and come into view only because the camera turns, already hanging on the wall. The dark rafters and the corner post on the right are the same ones already visible at the right edge of the first frame: they only slide left; no rafter rises, lowers, bends, appears or disappears. The room does not change shape: no new doors, no new windows, no openings. Steady gimbal at eye level, 24mm, slow constant rotation speed, gentle ease-in and ease-out, landing exactly on the final frame. The paintings are static artworks: nothing inside them moves. No cuts, no fades, no dissolves, no morphing, no zoom, no camera shake, no people. Photorealistic, silent.
```

### 5.3 · Decisión: *Tránsito del alma* repetida

Con el cambio, *Tránsito del alma* aparece dos veces: en el caballete de la entrada y en la pared de Personales (F4). Opciones:

- **Mantenerla** (0 créditos extra). Se ve primero de cerca y luego colgada: puede leerse como un hilo.
- **Cambiarla en la pared** por *La noche oscura del alma* (espiral) u otra obra personal: se hace en la misma edición de F4v3 (0 extra) **pero obliga a rehacer el clip 4**, que muestra esa pared (8,75 a 5 s · 17,5 a 10 s).

### 5.4 · Sugerencias sobre los clips aprobados (opcionales)

- **Clip 2:** a mitad del giro hay dos fotogramas oscuros y borrosos al pasar bajo la viga. A 10 s se suaviza; ya está contemplado en el bloque A.
- **Clip 4:** el cuadro de la escalera se deforma un poco a mitad del giro (ya anotado). Rehacerlo a 10 s con el mismo prompt lo reduce (17,5). Solo si se rehace por 5.3, o si molesta al verlo en el móvil.
- **Cierre volviendo a la puerta** (antes 5.2 de v2): sigue vigente. Opción A, rebobinar los clips 4, 3 y 2 con ffmpeg (0 c); opción B, clip 5 F5 → F1v3 como media vuelta en el sitio, 10 s (17,5, contar con un reintento). Se decide al final.

### 5.5 · Móvil (ver SPEC §5.12 y §5.13)

- **Siempre:** los clips 16:9 nuevos pasan por la cadena de la fase 13 (recorte vertical que sigue el `position` de cada parada, todo intra, 480×1040). A 10 s el clip de móvil pesa ≈ 4,5 MB en vez de 2,3; se cargan al acercarse, no afectan al LCP.
- **Opcional, 9:16 nativo (fase 14b):** la foto de entrada ya es vertical, así que F2v3-m y F1v3-m salen casi gratis (edición 9:16, 1 c + outpaint 2 c). F3, F4 y F5 en vertical necesitan recomponer la cámara más cerca de la pared para que los dos cuadros llenen el ancho (1 c cada una, con reintentos) y 4 clips más (8,75 / 17,5 c). ≈ 45–85 créditos. Se decide después de aprobar el juego 16:9.

### 5.6 · Presupuesto y orden

| Bloque | Mínimo | Realista (un reintento por clip) |
|---|---|---|
| A · entrada | 38 | 73 |
| B · giro a Personales | 20,5 | 48 (con A/B MiniMax) |
| C · clip 4 a 10 s | 0 | 17,5 |
| D · cierre a la puerta | 0 | 17,5 |
| E · móvil 9:16 nativo | 0 | 45–85 |
| **Total** | **≈ 60** | **≈ 150–240** de 1 000 |

Orden: F2v3 → revisar → F1v3 → F3 ancha y F4v3 → revisar contra las reglas → **clip 3 v4 primero** (el más difícil, con A/B) → clips 1 y 2 → opcionales → fase 13 (recodificación móvil) → web (pósteres, clips, copia de la parada 01 si cambia).
