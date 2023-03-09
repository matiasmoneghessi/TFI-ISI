import React from "react";
import { Link } from "react-router-dom";
import CustomNavbar from "../commons/CustomNavbar";
import parseJwt from "../hooks/parseJwt";
import style from "../styles/Welcome.module.css";

const Welcome = () => {
  

      const token = JSON.parse(localStorage.getItem("user")).data.token;
      const payload = parseJwt(token)
      //console.log(payload)
      if(!payload.admin && !payload.operator)
      return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.logoContainer}>
          {/* <img
            className={style.largeLogo}
            src={require("../images/1.png")}
            alt="TuTurno"
          />
          <img
            className={style.smallLogo}
            src={require("../images/2.png")}
            alt="TuTurno"
          /> */}
        </div>
          <div className={style.contentContainer}>
              <div>
                  <Link to="/calendar" style={{textDecoration:"none"}}>
                      <h3>Sacar un turno</h3>
                  </Link>
              </div>
              <div >
                  <Link to="/myappointments" style={{textDecoration:"none"}}>
                      <h3>Ver mis turnos</h3>
                  </Link>
              </div>
              
          </div>
      </div>
    </>
  );
};

export default Welcome;