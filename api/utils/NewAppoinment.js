//Importo las collection y el middleware (parseId) usadas para esta funcionalidad.
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const BranchOffice = require("../models/BranchOffice");
const parseId = require("../utils/functions");

// Como argumentos debe recibir los datos que son utilizados para que la función pueda ejectuarse.
const NewAppointment = async (branchOfficeId, userId, saveAppointmentId) => {

  // Previo a guardar el turno. Hago cambios en collection BrandOffice. Le pusheo el id del nuevo turno creado a la propiedad 'appointment'.
  const updateBranchOffice = await BranchOffice.updateOne(
    { _id: branchOfficeId },
    { $push: { appointment: parseId(saveAppointmentId) } }
  ).populate("branchOffice")

  // Hago cambios en collection User. Le pusheo el id del nuevo turno creado a la propiedad 'appointment'.
  const updateUser = await User.updateOne(
    { _id: userId },
    {
      $push: {
        appointment: parseId(saveAppointmentId)
      },
    }
  ).populate("user");

  // Hago cambios en collection Appointment. La propiedad available pasa a ser 'false', ya que el turno fue tomado y el estado pasa a ser 'reservado'.
  await Appointment.findOneAndUpdate(
    { _id: parseId(saveAppointmentId) },
    [{ $set: { available: { $eq: [false, "$available"] } } }]
  );
  await Appointment.findOneAndUpdate(
    { _id: parseId(saveAppointmentId) },
    [{ $set: { state: "reservado" } }]
  )
  return
}

module.exports = NewAppointment;