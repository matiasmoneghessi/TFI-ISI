import React from "react";
import CustomNavbar from "../commons/CustomNavbar";
import AppointmentDetailsOperator from "../commons/AppointmentDetailsOperator";
import style from "../styles/Users.module.css";
import BranchOfficeSelector from "../commons/BranchOfficeSelector";
import OfficeOperator from "./OfficeOperator";

const TurnosOperator = () => {
  return (
    <>
      <CustomNavbar />

      <div className={style.mainContainer}>      
        <div className={style.sideContainer}>
          <AppointmentDetailsOperator />
        </div>

        <div className={style.contentContainer}>
          <div className={style.tableContainer}>         
            <OfficeOperator />
          </div>
        </div>

      </div>
    </>
  );
};

export default TurnosOperator;