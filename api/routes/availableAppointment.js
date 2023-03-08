const { Router } = require("express");
const router = Router();
const Appointment = require("../models/Appointment");
const BranchOffice = require("../models/BranchOffice");

// (1) Muetra en formato arreglo de objetos todos los turnos disponibles para un día, horario y sucursal. Restando en la disponibilidad la cantidad de turnos dados que la simultaneidad le permita. Lógica a utilizar en el calendario.

let start,
  limit,
  simultAppointment = "";

// Paso 1 - Arreglo de todos los turnos en la franja horaria para una fecha y una sucursal determinada.
router.get("/", async (req, res) => {
  const { date, month, year } = req.headers;
  const branchOfficeId = req.headers.id;
  const findBranch = await BranchOffice.find({ _id: branchOfficeId }).exec();

  start = findBranch[0].startTime;
  limit = findBranch[0].endTime;
  simultAppointment = findBranch[0].simultAppointment;

  //   ----------------------- ----------------------------
  // Paso 2 - Capturar los datos de la consulta y armar la franja horaria.

  let hsArray = [];

  // Datos necesarios para su correcto funcionamiento. 
  // let start = "7:15" - Horario de inicio.
  // let limit = "17:30" - Horario de de cierre.
  let intervaloTurno = "00:15"; // Tiempo del turno.
  // let simultAppointment = 2; // Cantidad de personas que se pueden atender en un mismo horario.

  // 'start' pasado a string de 5 digitos. (Ejemplo: 7:00 --> 07:00)
  startString = start.length == 4 ? `0${start}` : start;

  // 'limit' pasado a string de 5 digitos. (Ejemplo: 7:00 --> 07:00)
  limitString = limit.length == 4 ? `0${limit}` : limit;

  // 'start' fragmentation. (digitos de hora)
  const startHs = parseInt(start.slice(0, 2));

  // 'start' fragmentation. (digitos de minutos)
  const startMinutes = parseInt(start.slice(3, 5));

  // 'limit' fragmentation. (digitos de hora)
  const limitHs = parseInt(limit.slice(0, 2));

  // 'start' fragmentation. (digitos de minutos)
  const limitMinutes = parseInt(limit.slice(3, 5));

  // 'intervaloTurno' fragmentation. (digitos de hora)
  const turnosxHS = 60 / parseInt(intervaloTurno.slice(3, 5)) - 1;

  // 'intervaloTurno' fragmentation. (digitos de minutos)
  const intervaloMinutos = parseInt(intervaloTurno.slice(3, 5));

  // Arreglo de franja horaria.
  for (h = startHs; h <= limitHs; h++) {
    for (m = 0; m <= turnosxHS; m++)
      hsArray.push(
        (h <= 9 ? `0${h}` : `${h}`) +
        ":" +
        (m === 0 ? "00" : m * intervaloMinutos)
      );
  }

  // Ajustar el inicio del arreglo.
  hsArray = hsArray.slice(hsArray.indexOf(startString));

  // Ajustar el fin del arreglo
  hsArray = hsArray.slice(0, hsArray.indexOf(limitString));

  // 'arrFranjaHoraria ' - Arreglo inicial de los turnos en determinada sucursal con su simultaneidad.
  let arrFranjaHoraria = [];
  hsArray.map((num) => {
    arrFranjaHoraria.push({ [num]: simultAppointment });
  });

  // Paso 3 - Arreglo de objetos de todos los turnos tomados en la franja horaria para una fecha y una sucursal determinada.
  const findAppointment = await Appointment.find({
    date,
    month,
    year,
    id: branchOfficeId,
    available: false,
  }).exec();

  let reservedAppointment = [];

  findAppointment.map((turno) => reservedAppointment.push(turno.time));

  const reservedAppointmentCounts = {};

  // 'reservedAppointmentCounts' - Arreglo de objetos que devuelve, en el mismo formato que 'arrFranjaHoraria', solo los turnos dados y la cantidad.
  reservedAppointment.forEach(function (i) {
    reservedAppointmentCounts[i] = reservedAppointmentCounts[i]
      ? reservedAppointmentCounts[i] + 1
      : 1;
  });
  const reservedAppointmentObj = Object.keys(reservedAppointmentCounts).map(
    (key) => {
      return { [key]: reservedAppointmentCounts[key] };
    }
  );

  // 'arrFranjaHoraria' - Arreglo de objetos que devuelve la cantidad de turnos disponibles final.
  arrFranjaHoraria.map((franja) => {
    for (let horario in franja) {
      reservedAppointmentObj.map((franja2) => {
        for (let horario2 in franja2) {
          if (horario === horario2) {
            franja[horario] = franja[horario] - franja2[horario2];
          }
        }
      });
    }
  });

  res.json({ data: arrFranjaHoraria });
});

module.exports = router;