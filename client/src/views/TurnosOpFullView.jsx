import React from "react";
import { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter, selectFilter} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
import AppDetailsOp from "../commons/AppDetailsOp";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { useDispatch, useSelector } from "react-redux";
import { selectAppToEdit, emptyAppToEdit } from "../features/editAppointment";
import { Report } from "notiflix";
import style from "../styles/Users.module.css";
import { useNavigate } from "react-router-dom";

const TurnosOpFullView = () => {
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
        const appsConstructor = appointments.map((appointment, i) => {           
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
            status: appointment.state ? capitalize(appointment.state) : "",            
            actions:
              appointment.state === undefined ||
              appointment.state === "reservado" ||
              appointment.state === "confirmado" ? (
                <>
                  <Badge
                    bg="secondary"
                    role="button"
                    data-bs-toggle="tooltip"
                    title="Asistio"
                    onClick={() => handleAssitance(appointment._id)}
                  >
                    <i className="bbi bi-check2-square"></i>
                  </Badge>
                  &nbsp;&nbsp;                 
                  <Badge
                    bg="secondary"
                    role="button"
                    data-bs-toggle="tooltip"
                    title="Cancelar"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    <i className="bi bi-trash3"></i>
                  </Badge>
                </>
              ) : (
                <></>
              ),
          };
        });
        setApps(appsConstructor);
      })
      .catch((err) => console.log(err));
  };

  const handleAppSelection = (id) => {
    const appointment = apps.filter((appointment) => appointment._id === id)[0];
    setSelectedApp(appointment);
  };

  const handleDelete = (appointmentId) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea cancelar este turno?",
      "Si",
      "No",
      () => {
        axios
          .put(
            `http://localhost:3001/api/appointment/${payload.id}/myAppointment/remove`,
            { id: appointmentId }
          )
          .then((res) => {
            setLoad(!load);
          })
          .catch((err) => console.log(err));
      }
    );
  };

  const handleAssitance = (appointmentId) => {    
    axios
      .put(
        `http://localhost:3001/api/appointment/${appointmentId}/myAppointment/asisted`,
        { id: appointmentId }
      )
      .then((res) => {
        console.log(res, "res");
        Report.success(
          "TuTurno",
          "Se confirmó la asistencia del usuario",
          "Ok"
        );
      })
      .catch((err) => Report.failure("TuTurno", { err }, "Ok"));
  };

  function headerFormatter(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={ { display: 'flex', flexDirection: 'column' } }>
        { filterElement }        
        { sortElement }
      </div>
    );
  }

  // Table setups

  const selectOptions = {
    Reservado: "Reservado",
    Cancelado: "Cancelado",
    Asistido: "Asistido",
    Confirmado: "Confirmado",
  };
  const columns = [
    {
      dataField: "id",
      text: "ID Turno",      
      headerStyle: (column, colIndex) => {
        return { width: "8em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "date",
      text: "Fecha",
      headerStyle: (column, colIndex) => {
        return { width: "14em" };
      },
      headerAlign: "center",
      align: "center",
      headerFormatter: headerFormatter,
      filter: textFilter({placeholder: 'Ingrese fecha del turno'}),
    },
    {
      dataField: "time",
      text: "Hora",
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "paciente",
      text: "Paciente",
      headerAlign: "center",
      align: "center",
      headerFormatter: headerFormatter,
      filter: textFilter({placeholder: 'Ingrese nombre del paciente'})
    },
    {
      dataField: "status",
      text: "Estado",
      headerStyle: (column, colIndex) => {
        return { width: "14em" };
      },
      headerAlign: "center",
      align: "center",
      headerFormatter: headerFormatter,
      formatter: (cell) => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions,
        placeholder: 'Ingrese estado del turno'
      }),
    },
    {
      dataField: "actions",
      text: "Acciones",
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
      headerAlign: "center",
      align: "center",
    },
  ];
  const defaultSorted = [
    {
      dataField: "date",
      order: "asc",
    },
  ];
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      handleAppSelection(row._id);
    },
  };
  const CaptionElement = () => <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: '#20A4F3', border: '2px solid #007BFF', padding: '0.5em' }}>TURNOS</h3>;
  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.sideContainer}>
          <AppDetailsOp
            appointment={selectedApp}
            handleDelete={handleDelete}
            handleAssitance={handleAssitance}
          />
        </div>
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
              rowEvents={rowEvents}
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

export default TurnosOpFullView;
