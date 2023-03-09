import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TurnosUsers from "./views/TurnosUser";
import General from "./views/General";
import Register from "./views/Register";
import Login from "./views/Login";
import AssistPassword from "./views/AssistPassword";
import RestorePassword from "./views/RestorePassword";
import Users from "./views/Users";
import MyAccount from "./views/MyAccount";
import BranchOffices from "./views/BranchOffices";
import OfficeDetails from "./views/OfficeDetails";
import NewOffice from "./views/NewOffice";
import Welcome from "./views/Welcome";
import MyAppointments from "./views/MyAppointments";
import TurnosOperator from "./views/TurnosOperator"

import style from "./styles/App.module.css";

function App() {
  const [selectedOffice, setSelectedOffice] = useState({});

  const selectOffice = (office) => {
    setSelectedOffice(office);
  };

  return (
    <div className={style.App}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/layout" element={<General />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assist_password" element={<AssistPassword />} />
        <Route path="/restore_password" element={<RestorePassword />} />
        <Route path="/calendar" element={<TurnosUsers />} />
        <Route path="/" element={<Login />} />
        <Route path="/turnos_operator" element={<TurnosOperator />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/assist_password" element={<AssistPassword />} />
        <Route path="/restore_password" element={<RestorePassword />} />
        <Route
          path="/offices"
          element={<BranchOffices selectOffice={selectOffice} />}
        />
        <Route
          path="/officeDetails"
          element={
            <OfficeDetails
              office={selectedOffice}
              selectOffice={selectOffice}
            />
          }
        />
        <Route path="/newOffice" element={<NewOffice />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/myappointments" element={<MyAppointments />} />
        {/* 
        
        <Route path="/branch_offices" element={<BranchOffices />}/>
 */}
      </Routes>
    </div>
  );
}

export default App;
