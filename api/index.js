const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyparser = require("body-parser");
const routes = require("./routes/index");
const authRoutes = require('./routes/auth');

// Para que funcione el .env
require("dotenv").config();

// Constantes traidas del .env
const PORT = process.env.PORT;
const uri = process.env.MONGODB_CONNECTION_STRING;

const app = express();

//Permiso cors
var corsOptions = {
  origin: '*', // reemplazar con dominio
  optionSuccessStatus:200
};
app.use(cors(corsOptions));

//capturar body
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.json());

// Conexion a base de datos MongoDB Atlas 
mongoose.set('strictQuery', false);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  })
  .then(() => console.log("database is connected to mongodb_atlas"))
  .catch((err) => console.log(err));

// Importo routes
app.use("/api/user", authRoutes);
app.use("/api", routes);

// Route middlewares
app.use(morgan("tiny"));

app.listen(PORT, ()=> {
  console.log(`servidor online en: ${PORT}`)
});