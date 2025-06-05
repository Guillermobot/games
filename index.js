const express = require("express");
const app = express();
const port = 3000;
const rutas = require("./rutas");

app.use(express.json());
app.use("/", rutas);

app.listen(port, () => {
  console.log(`API de Videojuegos corriendo en http://0.0.0.0:${port}`);
});
