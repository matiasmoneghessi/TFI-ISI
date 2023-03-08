//Importo la collection y el middleware (parseId) usadas para esta funcionalidad.
const Appointment = require("../models/Appointment");
const parseId = require("./functions")

// Como argumento se le pasa el id del appointment al que le vamos a cambiar el estado cancelado.
const Cancelar = async (appointmentId) => {
  
  // Hago cambios en collection Appointment. La propiedad available pasa a ser 'true', ya que el turno queda disponible y el estado pasa a ser 'cancelado'.

  await Appointment.findOneAndUpdate({ _id: parseId(appointmentId) }, [
    { $set: { available: { $eq: [false, "$available"] } } },
  ]);

  const appointmentCanceled = await Appointment.findOneAndUpdate(
    { _id: parseId(appointmentId) },
    [{ $set: { state: "cancelado" } }]
  );
  return
}

module.exports = Cancelar;