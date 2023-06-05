import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
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
            importe: appointment.state === "asistido" ? ("$" + appointment.branchOffice[0].price.$numberDecimal) : ( <></> ),
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

  const handleEdit = (appointmentId) => {
    dispatch(selectAppToEdit(appointmentId));
    navigate("/calendar");
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

  // Table setups

  
  const columns = [
    {
      dataField: "id",
      text: "ID Turno",
      headerStyle: (column, colIndex) => {
        return { width: "6em" };
      },
      headerAlign: "center",
      align: "center",
      sort: true,
      sortCaret: (order, column) => {
        if (!order)
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-arrow-down-up"></i>
              </font>
            </span>
          );
        else if (order === "asc")
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-sort-numeric-down"></i>
              </font>
            </span>
          );
        else if (order === "desc")
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-sort-numeric-up"></i>
              </font>
            </span>
          );
        return null;
      },
    },
    {
      dataField: "date",
      text: "Fecha",
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
      headerAlign: "center",
      align: "center",
      sort: true,
      sortCaret: (order, column) => {
        if (!order)
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-arrow-down-up"></i>
              </font>
            </span>
          );
        else if (order === "asc")
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-sort-numeric-down"></i>
              </font>
            </span>
          );
        else if (order === "desc")
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-sort-numeric-up"></i>
              </font>
            </span>
          );
        return null;
      },
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
      filter: textFilter(),
      headerStyle: (column, colIndex) => {
        return { width: "20em" };
      },
    },
    {
      dataField: "status",
      text: "Estado",
      headerStyle: (column, colIndex) => {
        return { width: "10em" };
      },
    },
    {
      dataField: "importe",
      text: "Importe",
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

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            <BootstrapTable
              keyField="id"
              data={apps}
              columns={columns}
              defaultSorted={defaultSorted}
              filter={filterFactory()}
              filterPosition="top"
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
