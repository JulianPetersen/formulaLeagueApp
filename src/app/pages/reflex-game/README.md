# Reflejos Pit Stop

Minijuego de reflejos para Formula League / Race Mind. No usa motor de juego. La partida se ejecuta en memoria dentro de `ReflexGamePage` y, al terminar, se persiste el resumen contra la API.

## Objetivo

Medir la velocidad de reaccion del usuario cuando aparece un objetivo en pantalla.

## Reglas

- La partida tiene 5 rondas.
- Al tocar `Jugar`, comienza la primera ronda.
- En cada ronda hay una espera aleatoria.
- Cuando aparece el objetivo rojo, el usuario debe tocarlo lo mas rapido posible.
- Si toca el objetivo, se registra el tiempo en milisegundos.
- Si toca antes de que aparezca o toca fuera del objetivo, cuenta como fallo.
- Despues de cada acierto o fallo, la siguiente ronda empieza automaticamente.
- Al completar 5 rondas, la partida termina y se intenta guardar en el ranking semanal.

## Estados

- `idle`: pantalla inicial, esperando que el usuario toque `Jugar`.
- `waiting`: la ronda esta activa, pero el objetivo todavia no aparecio.
- `target`: el objetivo esta visible y se esta midiendo el tiempo.
- `hit`: el usuario toco correctamente el objetivo.
- `miss`: el usuario fallo o se adelanto.
- `finished`: se completaron las 5 rondas.

## Resultados

La pantalla muestra:

- Mejor tiempo valido.
- Promedio de los intentos validos.
- Cantidad de fallos.
- Detalle de cada ronda en la pestana `Resultados`.
- Ranking semanal en la pestana `Ranking`.

Los fallos no entran en el promedio. Si la partida no tiene aciertos, el promedio queda vacio y no se guarda en el ranking.

## Archivos

- `reflex-game.page.ts`: logica del juego, estados, rondas, tiempos y resultados.
- `reflex-game.page.html`: estructura visual del juego y resultados.
- `reflex-game.page.scss`: estilos de la pantalla, tablero y objetivo.

## Integracion actual

- Ruta: `/tabs/reflex-game`.
- Entrada desde la home mediante el banner `Reflejos Pit Stop`.
- Modelo front: `src/app/models/reflex-game.ts`.
- Servicio HTTP: `src/app/services/reflex-game.ts`.
- Endpoint para guardar: `POST /api/reflexGame`.
- Endpoint de ranking: `GET /api/reflexGame/best-records`.
- Endpoint de mejor partida propia: `GET /api/reflexGame/me`.

## Payload persistido

Al terminar una partida valida, el front envia:

```json
{
  "bestResult": 184,
  "averageResult": 241,
  "attempts": 5,
  "misses": 1
}
```

El ranking se ordena por menor promedio, usando menor cantidad de fallos y mejor tiempo como desempate.
