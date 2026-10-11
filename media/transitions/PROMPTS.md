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
| `keyframes/F1-atico.png` | ✅ v3: **outpaint de F2** (F2 intacta en el centro). Las versiones reinventadas hacían que la pared de paneles de la izquierda se "construyera" durante el avance (regla 12) |
| `keyframes/F2-caballete.png` | ✅ |
| `keyframes/F3-comision.png` | ✅ |
| `keyframes/F4-personales.png` | ✅ v3 (v1 `-frontal` descartada por la regla 1, v2 `-con-puerta` por la regla 3) |
| `keyframes/F5-en-proceso.png` | ✅ v4: giro de 45° más a la derecha por la misma pared lateral; el caballete está más adelante en esa pared |
| `transitions/clip1-entrada-atico.mp4` | ✅ v2: avance recto, la pared izquierda ya existe desde el primer fotograma. Sale a 1928×1076: normalizar a 1920×1080 al concatenar |
| `transitions/clip2-taller-comision.mp4` | ✅ |
| `transitions/clip3-comision-personales.mp4` | ✅ v3: giro en el sitio, pared del fondo rígida, sin puerta |
| `transitions/clip4-personales-en-proceso.mp4` | ✅ v4: giro en el sitio hacia la derecha, sin fundidos. El cuadro de la escalera se deforma un poco a mitad del giro |
| `recorrido-preview.mp4` / `recorrido-scroll.mp4` | ✅ rehechos con los clips nuevos |

Coste acumulado: ~100 créditos (quedan 0,75).
