const mongoose = require("mongoose");

// Funcion que toma el id que recibimos de Mongoose y recibirlo como un string.
module.exports = function (id) {
  return mongoose.Types.ObjectId(id);
}