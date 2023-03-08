const nodemailer = require("nodemailer");
const htmlTemplate = require("./html");

// const mail = {
//   user: "nachogarcia_78@yahoo.com.ar",
//   password: "miTurno9",
// };

// (lo que sigue se copia desde el site de nodemailer)

// const createTransp = () => {
//   const transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//       user: "b8662c574f2f90",
//       pass: "d974f6453ba339",
//     },
//   });
//   return transport;
// };

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "96ba089fb4f5a6",
    pass: "92e1ca3bfab405"
  }
});


// const sendMailRegister = async (user) => {
//   const transporter = createTransp();
//   const info = await transporter.sendMail({
//     from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
//     to: `${user.email}`, //correo del usuario al cual se le enviará el mensaje ej: puede ser cuando se registra un usuario o cuando se le envía una contraseña
//     subject: `Hola ${user.fname[0].toUpperCase()}${user.fname.substring(
//       1
//     )}, bienvenid@ a miTurno`,
//     text: "Muchas gracias por utilizar nuestro servicio",
//     html: htmlTemplate,
//   });
//   console.log("Message sent: %s", info.messageId);

//   return;
// };

// const sendMailNewPass = async (user) => {
//   const transporter = createTransp();
//   const info = await transporter.sendMail({
//     from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
//     to: `${user.email}`, //correo del usuario al cual se le enviará el mensaje ej: puede ser cuando se registra un usuario o cuando se le envía una contraseña
//     subject: `Hola ${user.fname[0].toUpperCase()}${user.fname.substring(
//       1
//     )}, bienvenid@ a miTurno`,
//     text: "Muchas gracias por utilizar nuestro servicio",
//     html: `<h3>Por favor clickea sobre el link para resetear tu contraseña</h3>
//     <p>http://localhost:3001/api/user/newPassword/${token}</p>`,
//   });
//   console.log("Message sent: %s", info.messageId);

//   return;
// };

module.exports = transport;