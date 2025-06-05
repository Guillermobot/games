const AWS = require("aws-sdk");

// Configuración de AWS SOLO con la región
AWS.config.update({
  region: "us-east-1",
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueURL =
  "https://sqs.us-east-1.amazonaws.com/823681268597/ProyectoFinal";

/**
 * Envía un mensaje a SQS con los datos de un jugador.
 * @param {Object} jugador - Objeto con username, edad y juegoId
 */
function enviarJugadorASQS(jugador) {
  const datos = {
    DelaySeconds: 0,
    MessageAttributes: {
      gamertag: {
        DataType: "String",
        StringValue: String(jugador.gamertag || ""),
      },
      comentario: {
        DataType: "String",
        StringValue: String(jugador.comentario || ""),
      },
      calificacion: {
        DataType: "Number",
        StringValue: String(Number(jugador.calificacion)),
      },
    },
    MessageBody: JSON.stringify(jugador),
    QueueUrl: queueURL,
  };

  sqs.sendMessage(datos, (err, data) => {
    if (err) {
      console.error("❌ Error al enviar jugador a SQS:", err);
    } else {
      console.log("✅ Jugador enviado a SQS:", data.MessageId);
    }
  });
}

/**
 * Envía un mensaje a SQS con los datos de un juego.
 * @param {Object} juego - Objeto con nombre, genero y fechaLanzamiento
 */
function enviarJuegoASQS(juego) {
  const params = {
    DelaySeconds: 0,
    MessageAttributes: {
      Nombre: {
        DataType: "String",
        StringValue: juego.nombre,
      },
      Genero: {
        DataType: "String",
        StringValue: juego.genero,
      },
      FechaLanzamiento: {
        DataType: "String",
        StringValue: juego.fechaLanzamiento,
      },
    },
    MessageBody: JSON.stringify(juego),
    QueueUrl: queueURL,
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error("❌ Error al enviar juego a SQS:", err);
    } else {
      console.log("✅ Juego enviado a SQS. ID:", data.MessageId);
    }
  });
}

// Exportar funciones para usarlas en index.js
module.exports = {
  enviarJuegoASQS,
  enviarJugadorASQS,
};
