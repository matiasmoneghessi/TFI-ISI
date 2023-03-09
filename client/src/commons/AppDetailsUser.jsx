import React from "react";
import Button from "react-bootstrap/Button";
import style from "../styles/Users.module.css";
import capitalize from "../hooks/capitalize";

const AppDetailsUser = ({ appointment, handleDelete, handleEdit }) => {
  return appointment._id ? (
    <div className={style.userDetails}>
      <h5>Detalle del turno</h5>
      <ul>
        <li>Sucursal: {appointment.office}</li>
        <li>Dirección: {appointment.officeAddress}</li>
        <li>Teléfono: {appointment.officePhone}</li>
        <li>E-mail: {appointment.officeEmail}</li>
        <li>Fecha: {appointment.date}</li>
        <li>Hora: {appointment.time}</li>
        <li>Precio: {appointment.officePrice}</li>
      </ul>
      {appointment.status === "Reservado" ? (
        <>
          <Button
            variant="secondary"
            className={style.sideButton}
            onClick={() => handleEdit(appointment._id)}
          >
            Reprogramar
          </Button>
          <Button
            variant="secondary"
            className={style.sideButton}
            onClick={() => handleDelete(appointment._id)}
          >
            Cancelar
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default AppDetailsUser;
