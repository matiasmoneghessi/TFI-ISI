import { createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import axios from 'axios';

export const userRegister = createAsyncThunk("USER_REGISTER", (data) => {
    console.log(data)
    return axios.post("http://localhost:3001/api/user/register", data) // chequear ruta
        .then(user => {
            localStorage.setItem('registered', JSON.stringify(user.data))
            return user.data
        })
        .catch(err => console.log(err))
});

export const userLogin = createAsyncThunk("USER_LOGIN", (data) => {
    console.log(data)
    return axios.post("http://localhost:3001/api/user/login", data)
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user.data))
            return user.data
        });
});

export const userLogout = createAsyncThunk("USER_LOGOUT", () => {
    return axios.post("http://localhost:3001/api/user/logout")
        .then(() => {
            localStorage.removeItem('user')
            return { }
        })
});

const userReducer = createReducer({}, {
    [userRegister.fulfilled]: (state, action) => action.payload,
    [userLogin.fulfilled]: (state, action) => action.payload,
    [userLogout.fulfilled]: (state, action) => action.payload,
});

export default userReducer;

/* npm i nodemailer
         uuid
         jsonwebtoken

Tokens jwt estas 2 funciones se setearian en el back -------------------------

const getToken = payload => {
    return jwt.sign({
        data: payload
    }, 'SECRET', { expiresIn: '1h' });
}

const getTokenData = token => {
    let data = null;
    jwt.verify(token, 'SECRET', (err, decoded) => {
        if(err) {
            console.log('Error al obtener data del token');
        } else {
            data = decoded;
        }
    });
    return data;
}

---------------------------------------------

se sugiere setear lo siguiente en un archivo aparte (por ej: /config/ mail.config.js)

const nodemailer = require('nodemailer');

const mail = {
    user: user.mail,
    password: ''
}

(lo que sigue se copia desde el site de nodemailer)

let transporter = nodemailer.createTransport({
    host: "completar con el host de nuestro mail",
    port: 587 (en el video lo cambió por 2525) es el puerto de salida smtp,
    tls: {
        rejectUnauthorized: false
    },
    secure: false, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      password: mail.password, // generated ethereal password
    },
  });

  const sendEmail = async (email, subject, html) => {
    try {
        await transporter.sendMail({
            from: `miTurno <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Hello world?", // plain text body
            html, // html body
        });
    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  const getTemplate = (name, token) => {
      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>

        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${ name }</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:3001/api/user/confirm/${ token }"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `    
  }

  module.exports = {
    sendEmail,
    getTemplate
    (ambas se llamarian desde la funcion signup del back)
  }
 
*/