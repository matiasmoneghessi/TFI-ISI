import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import style from "../styles/Users.module.css";
import { getFullDate } from "../utils/getFullDate";
import { getFixedTime } from "../utils/getFixedTime";
import parseJwt from "../hooks/parseJwt";
import { Report } from "notiflix";
import capitalize from "../hooks/capitalize";


const AppointmentDetailsOperator = () => {
  const [selectData, setData] = useState([]);  
  const userLocalStorage = parseJwt(JSON.parse(localStorage.getItem("user")).data.token);
  const userBranch = userLocalStorage.branchOffice[0];
  const pickedDate = useSelector((state) => state.appointment);
  const pickedBranchOffice = useSelector((state) => state.branchOffice.clickedOffice);
  
  const handleAssitance = (appointment) => {
    axios.put(`http://localhost:3001/api/appointment/${userLocalStorage.id}/showAppointments`, {
      id: (appointment)
  })
      .then(() => {
        //appointments.splice(appointments.indexOf(appointment), 1)
        Report.success('TuTurno', 'Se confirmó la asistencia del usuario', 'Ok');
      })
      .catch(err => Report.failure('TuTurno', {err}, 'Ok'))
  }

  useEffect(() => {
    const loadApps = () => {
      let appointments;
       axios
         .get(`http://localhost:3001/api/appointment/${userBranch}/showAppointmentsBranch`)
         .then((res) => {
           appointments = res.data.data;           
           setData(appointments)
         });
    };
    loadApps();

  }, [pickedDate]);
  
  return pickedDate.date ? (
    <div className={style.userDetails}>
      <h5>Detalles del turno:</h5>
      <ul>
        {<li>Sucursal: {pickedBranchOffice.location.toUpperCase()}</li>}
        {<li>Fecha: {capitalize(getFullDate(pickedDate))}</li>}        
      </ul>
      {selectData.length ? (
        <>
          <h5 className={style.agendados}> Turnos de usuarios: </h5>
          <ul>
            {selectData.map((e) => {
              if ( pickedDate.date === e.date && pickedDate.month === e.month && pickedDate.year === e.year){
                return (
                  <>                 
                    <div className={style.asistentes}>                      
                      {e.user?.map((user) => {
                        return <li> {user.fname.toUpperCase()} {user.lname.toUpperCase()}</li>
                      })}                      
                      {<li> Estado {e.state} </li>}
                      {<li> {getFullDate(pickedDate)} </li>}
                      {<li> Hora: {e.time}</li>}                     
                                            
                      <Button
                        variant="secondary"
                        className={style.sideButton}
                        onClick={() => {
                          handleAssitance(e.id);
                        }}
                      >
                        Asistió
                      </Button>
                    </div>
                  </>
                );
              } else {return null}
            })}
          </ul>
        </>
      ) : (
        <h5>NO HAY USUARIOS PARA ESTE TURNO</h5>
      )}
    </div>
  ) : (
    <></>
  );
};

export default AppointmentDetailsOperator;