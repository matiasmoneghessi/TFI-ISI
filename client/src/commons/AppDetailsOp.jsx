import React from "react";
import Button from "react-bootstrap/Button";
import style from "../styles/Users.module.css";


const AppDetailsOp = ({ appointment }) => {  
  return appointment._id ? (
    
    <div className={style.userDetails}>
      <h5>Detalle del turno</h5>
      <ul>
        <li>Paciente: {appointment.paciente} </li> 
        <li>Teléfono: {appointment.pacienteTel}</li>
        <li>E-mail: {appointment.pacienteEmail}</li>
        <li>Fecha: {appointment.date}</li>
        <li>Hora: {appointment.time}</li>        
        <li>Estado: {appointment.status}</li>
      </ul>
    </div>
  ) : (
    <></>
  );
};

export default AppDetailsOp;
