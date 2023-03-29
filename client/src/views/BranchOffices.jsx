import React from "react";
import { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../commons/CustomNavbar";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "react-bootstrap/esm/Button";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

import style from "../styles/BranchOffices.module.css";
import { Navigate } from "react-router-dom";

const BranchOffices = ({ selectOffice }) => {
  const [offices, setOffices] = useState([]);
  const [load, setLoad] = useState(true);

  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);

  useEffect(() => {
    loadOffices();
  }, [load]);

  const loadOffices = () => {
    axios
      .get(`http://localhost:3001/api/branchOffice/showBranch`)
      .then((res) => {
        const officesConstructor = res.data.data.map((office, i) => {
          return {
            _id: office._id,
            operator: office.operator,
            id: office._id.slice(-4),
            name: capitalize(office.location + " - " + office.address),
            isOpen:
              office.startTime.toString() +
              " a " +
              office.endTime.toString() +
              " hs",
            simultAppointment: office.simultAppointment,
            price: office.price.$numberDecimal,
            actions: (
              <>
                <Badge
                  bg="secondary"
                  role="button"
                  data-bs-toggle="tooltip"
                  title="Ver/editar detalles"
                  onClick={() => handleDetails(office)}
                >
                  <i className="bi bi-search"></i>
                </Badge>
                &nbsp;&nbsp;
                <Badge
                  bg="secondary"
                  role="button"
                  data-bs-toggle="tooltip"
                  title="Eliminar"
                  onClick={() => handleDelete(office._id)}
                >
                  <i className="bi bi-trash3"></i>
                </Badge>
              </>
            ),
          };
        });
        setOffices(officesConstructor);
      })
      .catch((err) => console.log(err));
  };

  const handleDetails = (office) => {
    selectOffice(office);
    navigate("/officeDetails");
  };

  const handleDelete = (id) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea eliminar la sucursal?",
      "Si",
      "No",
      () => {
        axios
          .delete(
            `http://localhost:3001/api/branchOffice/admin/${payload.id}/delete/${id}`
          )
          .then((res) => {
            setLoad(!load);
          })
          .catch((err) => console.log(err));
      }
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
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
      dataField: "name",
      text: "Sucursal",
      headerAlign: "center",
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
                <i className="bi bi-sort-alpha-down"></i>
              </font>
            </span>
          );
        else if (order === "desc")
          return (
            <span>
              &nbsp;&nbsp;
              <font color="grey">
                <i className="bi bi-sort-alpha-up"></i>
              </font>
            </span>
          );
        return null;
      },
      filter: textFilter(),
    },
    {
      dataField: "isOpen",
      text: "Horario de atención",
      headerStyle: (column, colIndex) => {
        return { width: "14em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "simultAppointment",
      text: "Turnos en simultáneo",
      headerStyle: (column, colIndex) => {
        return { width: "12em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "price",
      text: "Precio del turno (ARS)",
      headerStyle: (column, colIndex) => {
        return { width: "12em" };
      },
      headerAlign: "center",
      align: "center",
    },
    {
      dataField: "actions",
      text: "Acciones",
      headerStyle: (column, colIndex) => {
        return { width: "8em" };
      },
      headerAlign: "center",
      align: "center",
    },
  ];
  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            <BootstrapTable
              keyField="id"
              data={offices}
              columns={columns}
              defaultSorted={defaultSorted}
              filter={filterFactory()}
              filterPosition="top"
              pagination={paginationFactory()}
              striped
              hover
              condensed
            />
          </div>
          <div className={style.buttonsContainer}>
            <button
              href="/newOffice"
              variant="secondary"
              className={style.btnEditsButton}
            >
              + Agregar sucursal
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchOffices;
