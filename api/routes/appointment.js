const { Router } = require("express");
const router = Router();
const cron = require("node-cron");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const BranchOffice = require("../models/BranchOffice");
const parseId = require("../utils/functions");
const NewAppointment = require("../utils/NewAppoinment");
const Cancelar = require("../utils/Cancelar");
require("dotenv").config();
const transport = require("../config/emailer");
const {
  htmlTemplateReserved,
  htmlTemplateCanceled,
  htmlTemplateReminder,
} = require("../config/html");


/* Rutas
(1) Usuario - Crear turno / modifica un turno existente cancelandolo. (Cambia estado de available false a true y state de reservado a cancelado)
(2) Usuario - Cancelar un turno.
(3) Usuario - Mostrar todos sus turnos tomados con todos sus estados.
(4) Operador - Confirmar un turno.
(5) Operador - Muestra todos los turnos para un día, horario y sucursal seleccionada.
(6) Mostrar todos los turnos con el formato de arreglo de objetos sin ningún tipo de validación. (Comentada porque no se utiliza)
(7) Usuario - Cambia el estado del turno a confirmado desde la selección del turno para activar el contador.
(8) Usuario - Destruye la existencia del turno ya que solo entra a un estado de elección de turno una vez que finaliza el tiempo del contador o el usuario cancela el turno en ese tiempo.
*/

// (1) Usuario - Crear turno / modifica un turno existente cancelandolo. (Cambia estado de available false a true y state de reservado a cancelado). Logica de negocio hecha en Lucidchart.
//A - Crear un nuevo turno
router.post("/:id", async (req, res) => {
  const userId = req.params.id;
  const { date, month, year, day, time } = req.body;
  const branchOfficeId = req.body.branchId;
  const appointmentId = req.body.appointId;

  const newAppointment = new Appointment({
    date,
    month,
    year,
    day,
    time,
    branchOffice: branchOfficeId,
    user: userId,
  });
  // Busco turno para ese mismo dia, horario, sucursal
  //ej Hoy 15:00 en RG1

  try {
    const branchOffice = await BranchOffice.findOne({
      _id: parseId(branchOfficeId),
    });

    const appointment = await Appointment.find({
      date,
      month,
      year,
      day,
      time,
      branchOffice: branchOfficeId,
    });

    //APPOINTMENTFALSE = Turno tomado
    const appointmentFALSE = await Appointment.find({
      date,
      month,
      year,
      day,
      time,
      branchOffice: branchOfficeId,
      available: false,
    });

    const appointmentTRUE = await Appointment.find({
      date,
      month,
      year,
      day,
      time,
      branchOffice: branchOfficeId,
      available: true,
    });

    const appointmentSameUser = await Appointment.find({
      date,
      month,
      year,
      available: false,
      user: userId,
    });

    // (A.1) Existe en Base Appoiment un turno para ese mismo dia, horario, sucursal

    if (appointment.length === 0) {
      // (A.1) No Existe. Ahora Consulto si el Usuario ya tiene turno para ese dia
      // (A.1.1) Si tiene le rechazo la peticion
      if (appointmentSameUser.length > 0) {
        return res
          .status(200)
          .json({ error: "Usted ya tiene un turno activo para este dia" });
        // (A.1.2) Si no tiene, le acepto el turno
      } else {
        const saveAppointment = await newAppointment.save();
        const saveAppointmentId = saveAppointment._id;
        NewAppointment(branchOfficeId, userId, saveAppointmentId);
        // (B) Ademas, si esto sucede desde modificar, el turno anterior que figura en el req.body lo cancelo
        if (appointmentId) {
          Cancelar(appointmentId);
        }
        return res.status(200).json(saveAppointment);
      }
    }

    // (A.2) Si existe.
    // Ahora Consulto si el Usuario ya tiene turno para ese dia
    // (A.2.1)Si tiene, le rechazo la peticion
    if (appointmentSameUser.length > 0) {
      return res
        .status(200)
        .json({ error: "Usted ya tiene un turno activo para este dia" });
    }

    // (A.2.2) No tiene, avanzo con el siguiente filtro
    // Permite Base brandOffice otro turno en simultaneo
    if (appointment) {
      if (branchOffice.simultAppointment === 1) {
        // (A.2.2.1) No, no permite
        return res.json({
          error:
            "Turno no disponible dado que no se permiten turnos simultaneos",
        });
      }
      // (A.2.2.2) Si permite
      else {
        if (appointmentFALSE.length < branchOffice.simultAppointment) {
          // (A.2.2.2.1) no lo supera, tomo turno
          const saveAppointment = await newAppointment.save();
          const saveAppointmentId = saveAppointment._id;
          NewAppointment(branchOfficeId, userId, saveAppointmentId);
          // (B) Ademas, si esto sucede desde modificar, el turno anterior que figura en el req.body lo cancelo
          if (appointmentId) {
            Cancelar(appointmentId);
          }
          return res.status(200).json(saveAppointment);
        } else {
          // (A.2.2.2.2) Si lo supera,no tomo turno
          return res.json({
            error:
              "Turno no disponible, ya se han otorgado todos los disponibles",
          });
        }
      }
    }
  } catch (error) {
    return res.status(405).json(error);
  }
});

// (2) Usuario - Cancelar un turno.
router.put("/:appointmentId/myAppointment/remove", async (req, res) => {
  const { appointmentId } = req.params;
  const appId = req.body.id;

  try {
    await Appointment.findOneAndUpdate({ _id: parseId(appId) }, [
      { $set: { available: { $eq: [false, "$available"] } } },
    ]);
    const appointmentCanceled = await Appointment.findOneAndUpdate(
      { _id: parseId(appId) },
      [{ $set: { state: "cancelado" } }]
    );
    const branchOffice = await BranchOffice.findOne({
      _id: appointmentCanceled.branchOffice,
    });
    const userData = await User.find({ _id: parseId(userId) });
    const info = {
      from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
      to: `${userData[0].email}`, //correo del usuario al cual se le enviará el mensaje. Correo con link para restablecer contraseña
      subject: `TuTurno del ${appointmentCanceled.date}/${appointmentCanceled.month}/${appointmentCanceled.year} a las ${appointmentCanceled.time}hs en sucursal ${branchOffice.location}`, //Asunto del mensaje
      text: "Muchas gracias por utilizar nuestro servicio",
      html: htmlTemplateCanceled,
    };
    transport.sendMail(info);
    res.status(200).json("Turno cancelado");
  } catch (err) {
    res.status(404).json(err);
  }
});

// (3) Usuario - Mostrar todos sus turnos tomados con todos sus estados.
router.get("/:id/showAppointments", async (req, res) => {
  const { id } = req.params;
  try {
    await Appointment.find({ user: id }, (err, result) => {
      if (err) {
        return res.json({ err: "Error" });
      } else {
        return res.json({ data: result });
      }
    })
      .clone()
      .exec();
  } catch (err) {
    res.status(404).json(err);
  }
});

// (4) Operador - Confirmar asistencia de un turno.
router.put("/:appointmentId/myAppointment/asisted", async (req, res) => {
  const {appointmentId} = req.params;
  const appId = req.body.id;
  try {
      await Appointment.findOneAndUpdate({ _id: parseId(appId) }, [
        { $set: { available: { $eq: [false, "$available"] } } },
      ]);
      await Appointment.findOneAndUpdate({ _id: parseId(appId) }, 
      [{ $set: { state: "asistido" } }]);
      res.status(200).json("Turno asistido/confirmado");
  } catch (err) {
    res.status(404).json(err);
  }
});

//get branch appointments
router.get("/:id/showAppointmentsBranch", async (req, res) => {
  const { id } = req.params;
  try {
    await Appointment.find({ branchOffice: id }, (err, result) => {
      if (err) {
        return res.json({ err: "Error" });
      } else {
        return res.json({ data: result });
      }
    })
      .populate("user")
      .populate("branchOffice")
      .clone()
      .exec();
  } catch (err) {
    res.status(404).json(err);
  }
});

// (5) Operador - Muestra todos los turnos para un día, horario y sucursal seleccionada.
// A desarrollar: Datos del usuario y turnos que esten en available: false
router.get("/:operatorId/dayAppointments", async (req, res) => {
  const { operatorId } = req.params;
  const { date, month, year, time, user } = req.body;
  const branchOfficeId = req.body.id;

try {
    const userOperator = await User.findOne({ _id: parseId(operatorId) });
    if (userOperator.operator === true) {
      await Appointment.find(
        { date, month, year, time, branchOffice: branchOfficeId, user },
        (err, result) => {
          if (err) {
            res.json({ err: "Error" });
          } else {
            res.json({ data: result });
          }
        }
      )
        .clone()
        .exec();        
    } else {
      res
        .send("You don't have permission to create a new branch office")
        .status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// (6) Mostrar todos los turnos con el formato de arreglo de objetos sin ningún tipo de validación. (Comentada porque no se utilizaría)
 router.get("/allAppointments", async (req, res) => {
   try {    
      Appointment.find({}, (err, result) => {
        if (err) {
          res.json({ err: "Error" });
        } else {
          res.json({ data: result });
        }
      });    
   } catch (error) {
    res.status(404).json(error);
   }
 });

// (7) Usuario - Cambia el estado del turno a confirmado desde la selección del turno para activar el contador.
router.put("/:userId/myAppointment/confirmed", async (req, res) => {
  const { userId } = req.params;
  const appointmentId = req.body.id;
  const userData = await User.find({ _id: parseId(userId) });
  try {
    const appointmentConfirm = await Appointment.findOneAndUpdate(
      { _id: parseId(appointmentId) },
      [{ $set: { state: "confirmado" } }]
    )
    console.log("TURNO CONFIRMADO", appointmentConfirm);
    console.log("USUARIO", userData);
    const branchOfficeId = appointmentConfirm.branchOffice[0];
    const branchOffice = await BranchOffice.findOne({_id: parseId(branchOfficeId)});
    console.log("BRANCH", branchOfficeId);
    const info = {
      from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
      to: `${userData[0].email}`, //correo del usuario al cual se le enviará el mensaje. Correo con link para restablecer contraseña
      subject: `TuTurno del ${appointmentConfirm.date}/${appointmentConfirm.month}/${appointmentConfirm.year} a las ${appointmentConfirm.time}hs en sucursal ${branchOffice.location}`, //Asunto del mensaje
      text: "Muchas gracias por utilizar nuestro servicio",
      html: htmlTemplateReserved,
    };
    
    transport.sendMail(info);
    const infoReminder = {
      from: `info@miturno.com`, //correo desde el cual se envía el mensaje ej: info@miturno.com
      to: `${userData[0].email}`, //correo del usuario al cual se le enviará el mensaje. Correo con link para restablecer contraseña
      subject: `TuTurno del ${appointmentConfirm.date}/${appointmentConfirm.month}/${appointmentConfirm.year} a las ${appointmentConfirm.time}hs en sucursal ${branchOffice.location}`, //Asunto del mensaje
      text: "Muchas gracias por utilizar nuestro servicio",
      html: htmlTemplateReminder,
    };
    cron.schedule("* * 2 * * *", function() {
      transport.sendMail(infoReminder);
    }); //este bloque de código envía el correo de recordatorio al cliente a los 30 segundos simulando las 24 hs
    
    res.status(200).json("TuTurno ha sido confirmado!");
  } catch (err) {
    res.status(404).json(err);
  }
});

// (8) Usuario - Destruye la existencia del turno ya que solo entra a un estado de elección de turno una vez que finaliza el tiempo del contador o el usuario cancela el turno en ese tiempo.
router.delete("/:userId/myAppointment/deleteAppointment", async (req, res) => {
  const { userId } = req.params;
  const appointmentId = req.body.appointId;
  const branchOfficeId = req.body.branchId;

  try {
    const deleteAppointment = await Appointment.deleteOne({
      _id: parseId(appointmentId),
    });
    res.status(204).json("Su reserva a caducado");
    // elimina de BranchOffice el turno
    const deleteAppointmentBranch = await BranchOffice.findByIdAndUpdate(
      branchOfficeId,
      {
        $pull: { appointment: parseId(appointmentId) },
      }
    );
    // elimina de User el turno
    const deleteAppointmentUser = await User.findByIdAndUpdate(userId, {
      $pull: { appointment: parseId(appointmentId) },
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
