const express = require("express");
const router = express.Router();

const { enviarJuegoASQS, enviarJugadorASQS } = require("./sqs");

// Array para guardar juegos
let juegos = [];
let idJuegoActual = 1;
let idJugadorActual = 1;

// --------------------- RUTAS DE JUEGOS ---------------------

// GET /games - Obtener todos los juegos
router.get("/games", (req, res) => {
  res.json(juegos);
});

// GET /games/:id - Obtener juego por ID
router.get("/games/:id", (req, res) => {
  const juego = juegos.find((j) => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send("Juego no encontrado");
  res.json(juego);
});

/* POST /games - Crear nuevo juego

Estructura Ejemplo :
{
nombre:"The Legend of Zelda"
genero: "Aventura",
fechaLanzamiento": "1986-02-021"

gamertag":"usuario134",
comentario":"buen juego, recomendado para fines de semana"
}
*/

router.post("/games", (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send("El cuerpo de la solicitud está vacío o mal formado.");
  }

  const {
    nombre,
    genero,
    fechaLanzamiento,
    gamertag,
    comentario,
    calificacion,
  } = req.body;

  if (
    !nombre ||
    !genero ||
    !fechaLanzamiento ||
    !gamertag ||
    !comentario ||
    !calificacion
  ) {
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

  const nuevoJugador = {
    gamertag: req.body.gamertag,
    comentario: req.body.comentario,
    idJuego: nuevoJuego.id,
    calificacion: req.body.calificacion,
  };

  juegos.push(nuevoJuego);
  enviarJugadorASQS(nuevoJugador);

  res.status(201).json(nuevoJuego);
});

// PUT /games/:id - Actualizar juego
router.put("/games/:id", (req, res) => {
  const juego = juegos.find((j) => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send("Juego no encontrado");

  juego.nombre = req.body.nombre;
  juego.genero = req.body.genero;
  juego.fechaLanzamiento = req.body.fechaLanzamiento;

  res.json(juego);
});

// DELETE /games/:id - Eliminar juego
router.delete("/games/:id", (req, res) => {
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

router.post("/players", (req, res) => {
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

module.exports = router;
