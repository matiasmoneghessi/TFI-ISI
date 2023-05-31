import React from "react";
import Button from "react-bootstrap/Button";
import style from "../styles/Users.module.css";


const AppDetailsOp = ({ appointment }) => {
  return appointment._id ? (
    
    <div className={style.userDetails}>
      <h5>Detalle del turno</h5>
      <ul>
        <li>Paciente: {appointment.user[0].fname}</li> 
        <li>Teléfono: {appointment.userPhone}</li>
        <li>E-mail: {appointment.month}</li>
        <li>Fecha: {appointment.date}</li>
        <li>Hora: {appointment.time}</li>
        <li>Precio: {appointment.officePrice}</li>
        <li>Estado: {appointment.status}</li>
      </ul>
    </div>
  ) : (
    <></>
  );
};

export default AppDetailsOp;
