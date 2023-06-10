import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import style from "../styles/Users.module.css";
import { getFullDate } from "../utils/getFullDate";
import { getFixedTime } from "../utils/getFixedTime";
import parseJwt from "../hooks/parseJwt";
import { emptyAppointment } from "../features/appointment";
import countdown from "../utils/countdown";
import { useNavigate } from "react-router-dom";

import { Report } from "notiflix/build/notiflix-report-aio";

const AppointmentDetails = () => {
  const dispatch = useDispatch()                    

  //// AGREGADO PARA FUNCIONALIDAD DE CAMBIAR TURNO 
  const editApp = useSelector((state) => state.editApp);
  const navigate = useNavigate();
  const [hasClickedDetailsButton, setHasClickedDetailsButton] = useState(false)
  const pickedDate = useSelector(state => state.appointment)
  const pickedBranchOffice = useSelector(state => state.branchOffice.clickedOffice)
  const user = parseJwt(JSON.parse(localStorage.getItem('user')).data.token)
  //const [selectedDate, setSelectedDate] = useState(initialSelectedDate.getDate().toString());

  const [appointmentId, setAppointmentId] = useState("")

  const handleSaveAppointment = () => {
    axios.post(`http://localhost:3001/api/appointment/${user.id}`, {
      date: pickedDate.date,
      month: pickedDate.month,
      year: pickedDate.year,
      day: pickedDate.day,
      time: getFixedTime(pickedDate),
      branchId: pickedBranchOffice._id,
      appointId: editApp
    })
      .then((appointment) => {
      setAppointmentId(appointment.data._id)
      Report.info('TuTurno', 'Tenés 3 minutos para confirmar el turno', 'Ok')
      // if (editApp) navigate("/myappointments");
    })
    .catch(err => console.log(err, 'err makina'))
  }
  const handleConfirm = () => {
    axios.put(`http://localhost:3001/api/appointment/${user.id}/myAppointment/confirmed`, {
      id: appointmentId
    })
      .then(() =>{
        localStorage.removeItem('endTime')
        dispatch(emptyAppointment())
        Report.success('TuTurno', 'El turno fue confirmado', 'Ok')
        navigate("/myappointments")
      })
      .catch(err => Report.failure('Turno ya dado','Turno no disponible', 'Ok', () => {
        handleCancel();
      }))
      
  }

  const handleCancel = () => {
    axios.delete(`http://localhost:3001/api/appointment/${user.id}/myAppointment/deleteAppointment`,{data: {
      appointId: appointmentId,
      branchId: pickedBranchOffice
    }})
      .then(() => {
        localStorage.removeItem('endTime')
        dispatch(emptyAppointment())
        Report.warning('TuTurno', 'El turno fue cancelado', 'Ok')
      })
      .catch(err => Report.failure(`${err}`))
  }

  useEffect(() => {
    setHasClickedDetailsButton(false);
  }, [pickedDate]);

  return pickedDate.date ? (
    <div className={style.userDetails}>
      <h5>Detalle del turno</h5>
      <ul>
        <li>Sucursal: {pickedBranchOffice.location.toUpperCase()}</li>
        <li>Dirección: {pickedBranchOffice.address}</li>
        <li>Teléfono: {pickedBranchOffice.phone}</li>
        <li>Email: {pickedBranchOffice.email}</li>
        <li>Fecha: {getFullDate(pickedDate)}</li>
        <li>Hora: {getFixedTime(pickedDate)} hs</li>
        <li>Precio: ${pickedBranchOffice.price}</li>
      </ul>
      
      {!hasClickedDetailsButton
        ? (<>
            <Button
              variant="secondary"
              className={style.sideButton}
              onClick={() => {
                handleSaveAppointment()
                setHasClickedDetailsButton(true)
                }
              }
            >
              Reservar
            </Button>
            <Button
              variant="secondary"
              className={style.sideButton}
              onClick={() => {dispatch(emptyAppointment())}}
            >
              Cancelar
            </Button>
          </>)
        : (<>
            { countdown(handleCancel) }

            <Button
              variant="secondary"
              className={style.sideButton}
              onClick={() => {
                handleConfirm()
                }
              }
            >
              Confirmar reserva
            </Button>
            
            <Button
              variant="secondary"
              className={style.sideButton} 
              onClick={() => {
                handleCancel()
                }
              } 
            >
              Cancelar reserva
            </Button> 
            
          </>)
      }    

    </div>
  ) : (
    //selectedDate.setDate(Number(pickedDate.date))
    <></>
  );
};

export default AppointmentDetails;