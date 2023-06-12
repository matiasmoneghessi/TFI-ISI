import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
import { useDispatch, useSelector } from "react-redux";
import {  emptyAppToEdit } from "../features/editAppointment";
import style from "../styles/Users.module.css";
import { useNavigate } from "react-router-dom";

const CajaDiaria = () => {
  const [appsRaw, setAppsRaw] = useState([]);
  const [apps, setApps] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedApp, setSelectedApp] = useState({});
  const userLocalStorage = parseJwt(
    JSON.parse(localStorage.getItem("user")).data.token
  );
  const userBranch = userLocalStorage.branchOffice[0];

  const editApp = useSelector((state) => state.editApp);
  const dispatch = useDispatch();

  dispatch(emptyAppToEdit());

  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);

  useEffect(() => {
    loadApps();
    setSelectedApp({});
  }, [load]);

  const loadApps = () => {
    let appointments;

    axios
      .get(
        `http://localhost:3001/api/appointment/${userBranch}/showAppointmentsBranch`
      )
      .then((res) => {
        appointments = res.data.data;
        setAppsRaw(appointments);
      })
      .then(() => {
        const newArray = appointments.filter(function (el) {
          return el.state === 'asistido';          
        })

        const appsConstructor = newArray.map((appointment, i) => {  
          const year = parseInt(appointment.year);
          const month = parseInt(appointment.month) + 1;
          const day = parseInt(appointment.date);
          const date = new Date(year, month, day);          
          return {
            _id: appointment._id,
            id: appointment._id.slice(-4),
            date:
              date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear(),
            time: appointment.time + " hs",
            paciente: capitalize(appointment.user[0].fname + " " + appointment.user[0].lname),
            pacienteTel: appointment.user[0].phone,
            pacienteEmail: appointment.user[0].email,
            status: appointment.state === "asistido" ? (    capitalize(appointment.state)       ) : ( <></> ),
            importe: appointment.state === "asistido" ? ( appointment.branchOffice[0].price) : ( <></> ),
          };
        
        });
        setApps(appsConstructor);
      })
      .catch((err) => console.log(err));
  };

  // Table setups
  function headerFormatter(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={ { display: 'flex', flexDirection: 'column' } }>
        { filterElement }        
        { sortElement }
      </div>
    );
  }
  const columns = [
    {
      dataField: "id",
      text: "ID Turno",
      headerStyle: (column, colIndex) => {
        return { width: "6em" };
      },
      headerAlign: "center",
      align: "center",
      footer: '',
    },
    {
      dataField: "date",
      text: "Fecha",
      headerFormatter: headerFormatter,
      footer: '',
      headerStyle: (column, colIndex) => {
        return { width: "13em" };
      },
      headerAlign: "center",
      align: "center",
      filter: textFilter({placeholder: 'Ingrese fecha para filtrar'}),
    },
    {
      dataField: "time",
      text: "Hora",
      footer: '',
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "paciente",
      filter: textFilter({placeholder: 'Ingrese nombre de paciente para filtrar'}),
      text: "Paciente",
      headerFormatter: headerFormatter,
      headerAlign: "center",
      align: "center",      
      footer: '',
      
      headerStyle: (column, colIndex) => {
        return { width: "20em" };
      },
    },
    {
      dataField: "status",
      text: "Estado",
      headerAlign: "center",
      align: "center",
      footer: 'Importe Total: $',
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
    },
    {
      dataField: "importe",      
      text: "Importe $",
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
      headerAlign: "center",
      align: "center",
      footerAlign: (column, colIndex) => 'center',
      footer:  columnData => columnData.reduce((acc, item) => acc + item, 0)
    },
  ];
  const defaultSorted = [
    {
      dataField: "date",
      order: "asc",
    },
  ];
  const CaptionElement = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: '#20A4F3', border: '2px solid #007BFF', padding: '0.5em' }}>CAJA DIARIA</h3>;

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainerCajaDiaria}>
        
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>          
            <BootstrapTable
              keyField="id"
              data={apps}
              caption={<CaptionElement />}
              columns={columns}
              defaultSorted={defaultSorted}
              filter={filterFactory()}             
              pagination={paginationFactory()}
              striped
              hover
              condensed
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CajaDiaria;
