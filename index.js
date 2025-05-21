import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

//Array para guardar los juegos
let juegos = [];
let idActual = 1;

//CRUD para los juegos
app.get('/games', (req,res) =>{
    res.json(juegos);
});


// GET /games/:id - obtener uno
app.get('/games/:id', (req, res) => {
  const juego = juegos.find(j => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send('Juego no encontrado');
  res.json(juego);
});

// POST /games - registrar juego

/*Ejemplo de estructura {
  "nombre": "The Legend of Zelda",
  "genero": "Aventura",
  "fechaLanzamiento": "1986-02-21"
}
  */
app.post('/games', (req, res) => {
  const nuevoJuego = {
    id: idActual++,
    nombre: req.body.nombre,
    genero: req.body.genero,
    fechaLanzamiento: req.body.fechaLanzamiento
  };
  juegos.push(nuevoJuego);
  res.status(201).json(nuevoJuego);
});

// PUT /games/:id - actualizar juego
app.put('/games/:id', (req, res) => {
  const juego = juegos.find(j => j.id === parseInt(req.params.id));
  if (!juego) return res.status(404).send('Juego no encontrado');

  juego.nombre = req.body.nombre;
  juego.genero = req.body.genero;
  juego.fechaLanzamiento = req.body.fechaLanzamiento;

  res.json(juego);
});

// DELETE /games/:id - eliminar juego
app.delete('/games/:id', (req, res) => {
  juegos = juegos.filter(j => j.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`API de Videojuegos corriendo en 0.0.0.0:${port}`);
});