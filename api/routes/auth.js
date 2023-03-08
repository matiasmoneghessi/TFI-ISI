const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const transport = require("../config/emailer");
const {
  htmlTemplateRegister,
  htmlTemplateReset,
  htmlTemplatePassSuccessfully,
} = require("../config/html");

/*
(1) Usuario - Login.
(2) Usuario - Register.
*/


const schemaRegister = Joi.object({
  fname: Joi.string().min(3).max(255).required(),
  lname: Joi.string().min(2).max(255).required(),
  dni: Joi.number().integer().required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(8).max(1024).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(4).max(1024).required(),
});

// (1) Usuario - Login.
router.post("/login", async (req, res) => {
  //validaciones de usuario (ingreso)
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: true, mensaje: "Email no registrado" });

  const passValida = await bcrypt.compare(req.body.password, user.password);
  if (!passValida)
    return res.status(400).json({ error: true, mensaje: "Contraseña errónea" });

  //crear token
  const token = jwt.sign(
    {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      dni: user.dni,
      admin: user.admin,
      operator: user.operator,
      branchOffice: user.branchOffice,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

//(2) Usuario - Register.
router.post("/register", async (req, res) => {
  //validaciones de usuarios (registro)
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existeEmail = await User.findOne({ email: req.body.email });
  if (existeEmail) {
    return res
      .status(400)

      .json({ error: true, mensaje: "Email ya registrado" });
  }

  const existeDni = await User.findOne({ dni: req.body.dni });
  if (existeDni) {
    return res.status(400).json({ error: true, mensaje: "DNI ya registrado" });
  }

  //hash contraseña
  const saltos = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, saltos);

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    dni: req.body.dni,
    email: req.body.email,
    password: password,
  });

  try {
    const userDB = await user.save();
    const info = {
      from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
      to: `${userDB.email}`, //correo del usuario al cual se le enviará el mensaje. Correo de registro exitoso
      subject: `Hola ${userDB.fname[0].toUpperCase()}${userDB.fname.substring(
        1
      )}, bienvenid@ a miTurno`,
      text: "Muchas gracias por utilizar nuestro servicio",
      html: htmlTemplateRegister,
    };
    transport.sendMail(info); //con esta sentencia enviamos el mail
    res.json({
      success: true,
      msg: "Registrado correctamente",
      error: null,
      data: userDB,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: true, mensaje: "Email requerido" });
  }
  const message = "Verificá tu email para restablecer tu contraseña";
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: true, mensaje: "Email no registrado" });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.RESET_PASSWORD_KEY,
    { expiresIn: "1h" }
  ); // expiresIn indica el tiempo de vida del token

  //Guardar el token en la base de datos
  try {
    await user
      .updateOne({ resetLink: token }, (err, result) => {
        if (err) {
          return res.status(400).json({
            error: true,
            mensaje: "Link de reseteo de password incorrecto",
          });
        } else {
          const info = {
            from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
            to: `${user.email}`, //correo del usuario al cual se le enviará el mensaje. Correo con link para restablecer contraseña
            subject: `Hola ${user.fname[0].toUpperCase()}${user.fname.substring(
              1
            )}, bienvenid@ a miTurno`,
            text: "Muchas gracias por utilizar nuestro servicio",
            html: htmlTemplateReset(token),
          };
          transport.sendMail(info, function (err, body) {
            if (err) {
              return res
                .status(400)
                .json({ error: true, mensaje: "Error al enviar email" });
            } else {
              return res
                .status(200)
                .json({ error: false, mensaje: "Email enviado correctamente" });
            }
          });
        }
      })
      .clone();
    res.header("rtoken", token).json({ error: false, data: { token } });
  } catch (error) {
    res.json(error);
  }
});

//Creación de una nueva contraseña
router.put("/newPassword", async (req, res) => {
  const token = req.body.headers.rtoken;

  console.log(token);
  console.log(req.body.body.password);

  const saltos = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.body.password, saltos);

  if (!token) return res.status(401).json({ error: "Error de autenticación" });
  else {
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      function (error, decodedData) {
        if (error) {
          return res
            .status(400)
            .json({ error: "Token no valido o sesión expirada" });
        }
      }
    );
    User.findOne({ resetLink: token }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "No existe el usuario con este token" });
      }
      user.password = password;
      user.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ err: "Error al resetear la contraseña" });
        } else {
          return res
            .status(200)
            .json({ mensaje: "La contraseña ha sido cambiada" });
        }
      });
      const info = {
        from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
        to: `${user.email}`, //correo del usuario al cual se le enviará el mensaje. Correo de cambio de contraseña exitoso
        subject: `Hola ${user.fname[0].toUpperCase()}${user.fname.substring(
          1
        )}, bienvenid@ a miTurno`,
        text: "Muchas gracias por utilizar nuestro servicio",
        html: htmlTemplatePassSuccessfully,
      };
      transport.sendMail(info, function (err, body) {
        if (err) {
          return res
            .status(400)
            .json({ error: true, mensaje: "Error al enviar email" });
        } else {
          return res
            .status(200)
            .json({ error: false, mensaje: "Email enviado correctamente" });
        }
      });
    });
  }
});

module.exports = router;
