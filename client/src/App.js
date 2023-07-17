import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TurnosUsers from "./views/TurnosUser";
import Register from "./views/Register";
import Login from "./views/Login";
import AssistPassword from "./views/AssistPassword";
import RestorePassword from "./views/RestorePassword";
import Users from "./views/Users";
import MyAccount from "./views/MyAccount";
import BranchOffices from "./views/BranchOffices";
import OfficeDetails from "./views/OfficeDetails";
import NewOffice from "./views/NewOffice";
import MyAppointments from "./views/MyAppointments";
import TurnosOperator from "./views/TurnosOperator"
import TurnosOpFullView from "./views/TurnosOpFullView"
import CajaDiaria from "./views/CajaDiaria"
import CajaDiariaUser from "./views/CajaDiariaUser"
import Reports from "./views/Reports";

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
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assist_password" element={<AssistPassword />} />
        <Route path="/restore_password" element={<RestorePassword />} />
        <Route path="/calendar" element={<TurnosUsers />} />
        <Route path="/" element={<Login />} />
        <Route path="/turnos_operator" element={<TurnosOperator />} />
        <Route path="/turnos_operator_table" element={<TurnosOpFullView />} />
        <Route path="/CajaDiaria" element={<CajaDiaria />} />
        <Route path="/CajaDiariaUser" element={<CajaDiariaUser />} />
        <Route path="/myaccount" element={<MyAccount />} />        
        <Route path="/reports" element={<Reports />} />
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
        <Route path="/myappointments" element={<MyAppointments />} />
        {/* 
        
        <Route path="/branch_offices" element={<BranchOffices />}/>
 */}
      </Routes>
    </div>
  );
}

export default App;
