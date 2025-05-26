const express = require("express");
const app = express();
const port = 3000;
const rutas = require("./rutas");
const { enviarJuegoASQS, enviarJugadorASQS } = require("./sqs");

app.use(express.json());
app.use("/1", rutas);

// Array para guardar juegos
let juegos = [];
let idJuegoActual = 1;
let idJugadorActual = 1;

// --------------------- RUTAS DE JUEGOS ---------------------

// GET /games - Obtener todos los juegos
app.get("/games", (req, res) => {
  res.json(juegos);
});

// GET /games/:id - Obtener juego por ID
app.get("/games/:id", (req, res) => {
  const juego = juegos.find((j) => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send("Juego no encontrado");
  res.json(juego);
});

// POST /games - Crear nuevo juego
app.post("/games", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send("El cuerpo de la solicitud está vacío o mal formado.");
  }

  const { nombre, genero, fechaLanzamiento } = req.body;

  if (!nombre || !genero || !fechaLanzamiento) {
    return res
      .status(400)
      .send(
        "Todos los campos son obligatorios: nombre, genero, fechaLanzamiento"
      );
  }

  const nuevoJuego = {
    id: idJuegoActual++,
    nombre,
    genero,
    fechaLanzamiento,
  };

  juegos.push(nuevoJuego);

  res.status(201).json(nuevoJuego);
});

// PUT /games/:id - Actualizar juego
app.put("/games/:id", (req, res) => {
  const juego = juegos.find((j) => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send("Juego no encontrado");

  juego.nombre = req.body.nombre;
  juego.genero = req.body.genero;
  juego.fechaLanzamiento = req.body.fechaLanzamiento;

  res.json(juego);
});

// DELETE /games/:id - Eliminar juego
app.delete("/games/:id", (req, res) => {
  juegos = juegos.filter((j) => j.id !== parseInt(req.params.id));
  res.status(204).send();
});

// --------------------- RUTAS DE JUGADORES ---------------------

/* Ejemplo para POST /players:
{
  "username": "Juan123",
  "edad": 21,
  "juegoId": 1
}
*/

app.post("/players", (req, res) => {
  const { username, edad, juegoId } = req.body;

  if (!username || !edad || !juegoId) {
    return res
      .status(400)
      .send("Todos los campos son obligatorios: username, edad, juegoId");
  }

  const jugador = {
    id: idJugadorActual++,
    username,
    edad,
    juegoId,
  };

  enviarJugadorASQS(jugador); // Enviar a SQS
  res.status(201).json(jugador);
});

// -------------------------------------------------------------

app.listen(port, () => {
  console.log(`API de Videojuegos corriendo en http://0.0.0.0:${port}`);
});
