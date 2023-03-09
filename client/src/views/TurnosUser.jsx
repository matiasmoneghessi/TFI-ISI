import React, { useState } from "react";
import CustomNavbar from "../commons/CustomNavbar";
import AppointmentDetails from "../commons/AppointmentDetails";
import { getInitialDate } from "../utils/getFullDate";

import style from "../styles/Users.module.css";
import BranchOfficeSelector from "../commons/BranchOfficeSelector";
import { branchOfficesGetter } from '../features/branchOfficesList';
import { useSelector, useDispatch } from "react-redux";

const TurnosUsers = () => {

  //const pickedDate = useSelector(state => state.appointment.value)

  

  /* const initialBranchOffice = {} //definir cómo nos llega la suc seleccionada en Welcome
  const initialDate = getInitialDate()
  const initialTime = ""

  const [branchOffice, setBranchOffice] = useState(initialBranchOffice)
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState(initialTime)

  console.log('SUCURSAL ES ', branchOffice)
  console.log('DATE ES ', date)
  console.log('TIME ES ', time) */

  return (
    // condicionar el renderizado del fragment de abajo a que haya un usuario logueado. Si no, redirigir a /login
    <>
      <CustomNavbar />

      <div className={style.mainContainer}>      
        <div className={style.sideContainer}>
          <AppointmentDetails
            /* branchOffice={branchOffice}
            date={date}
            time={time} */
          />
        </div>

        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            
            <BranchOfficeSelector />
            
            
          </div>
        </div>

      </div>
    </>
  );
};

export default TurnosUsers;
