// Lógica inicial para el arreglo de turnos disponibles. Este archivo no tiene una funcionalidad puntual. Funcionalidad final utilizada en Carpeta 'routes' - Archivo 'availableAppointment.js'.
//Recomendamos usar con Quokka para ver los console.log.

let hsArray = [];

// Variables a setear
let start = "7:15";
let limit = "17:30";
let intervaloTurno = "00:15";
let simultAppointment = 2;

// Start pasado a string de 5 digitos (de 7:00 a 07:00) 
startString = start.length ==4? `0${start}`: start;
console.log(startString);

limitString = limit.length ==4? `0${limit}`: limit;
console.log(limitString);

// Start fragmentation
const startHs = parseInt(start.slice(0, 2));
console.log(startHs);

const startMinutes = parseInt(start.slice(3, 5));
console.log(startMinutes);

// Limit fragmentation
const limitHs = parseInt(limit.slice(0, 2));
console.log(limitHs);

const limitMinutes = parseInt(limit.slice(3, 5));
console.log(limitMinutes);

// IntervaloTurno fragmentation
const turnosxHS = 60 / parseInt(intervaloTurno.slice(3, 5)) - 1;
console.log(turnosxHS);

const intervaloMinutos = parseInt(intervaloTurno.slice(3, 5));
console.log(intervaloMinutos);

// Arreglo de franja horaria
for (h = startHs; h <= limitHs; h++) {
  for (m = 0; m <= turnosxHS; m++)
    hsArray.push(
      (h<= 9 ? `0${h}` : `${h}`) +
        ":" +
        (m === 0 ? "00" : m * intervaloMinutos)
    );
};

hsArray;

// Ajustar el inicio del arreglo
hsArray = hsArray.slice(hsArray.indexOf(startString));

hsArray;

// Ajustar el fin del arreglo
hsArray = hsArray.slice(0, hsArray.indexOf(limitString));

hsArray;

arrFinal = [];

// Arreglo Final
hsArray.map((num) => {arrFinal.push({[num]:simultAppointment})});

console.log(arrFinal);