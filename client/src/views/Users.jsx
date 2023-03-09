import React from "react";
import { useState, useEffect } from "react";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import UserDetails from "../commons/UserDetails";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

import style from "../styles/Users.module.css";

const Users = () => {
  const [usersRaw, setUsersRaw] = useState([]);
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(true);
  const [selectedUser, setSelectedUser] = useState({});

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  console.log(payload);

  useEffect(() => {
    loadUsers();
  }, [load]);

  const loadUsers = () => {
    axios
      .get(`http://localhost:3001/api/users/admin/${payload.id}/showUsers`)
      .then((res) => {
        console.log(res.data.data);
        setUsersRaw(res.data.data);
        const usersConstructor = res.data.data.map((user, i) => {
          return {
            _id: user._id,
            id: user._id.slice(-4),
            lname: capitalize(user.lname),
            fname: capitalize(user.fname),
            dni: user.dni,
            role: user.admin ? "AD" : user.operator ? "OP" : "CL",
            actions: user.admin ? (
              <></>
            ) : (
              <>
                <Badge
                  bg="secondary"
                  role="button"
                  data-bs-toggle="tooltip"
                  title="Cambiar rol"
                  onClick={() =>
                    handleRoleChange(user._id, user.admin, user.operator)
                  }
                >
                  <i className="bi bi-toggles"></i>
                </Badge>
                &nbsp;&nbsp;
                <Badge
                  bg="secondary"
                  role="button"
                  data-bs-toggle="tooltip"
                  title="Eliminar"
                  onClick={() => handleDelete(user._id)}
                >
                  <i className="bi bi-trash3"></i>
                </Badge>
              </>
            ),
          };
        });
        console.log(usersConstructor);
        setUsers(usersConstructor);
      })
      .catch((err) => console.log(err));
  };

  const handleRoleChange = (id, isAdmin, isOperator) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea cambiar el rol del usuario?",
      "Si",
      "No",
      () => {
        console.log(id, isAdmin, isOperator);
        if (isAdmin) console.log("No se puede cambiar rol de un administrador");
        else
          axios
            .put(
              `http://localhost:3001/api/users/admin/${payload.id}/role/${id}`,
              {
                operator: !isOperator,
              }
            )
            .then((res) => {
              console.log(res);
              setLoad(!load);
              console.log(selectedUser._id, selectedUser.operator);
            })
            .catch((err) => console.log(err));
      }
    );
  };

  const handleDelete = (id) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea eliminar el usuario?",
      "Si",
      "No",
      () => {
        axios
          .delete(
            `http://localhost:3001/api/users/admin/${payload.id}/delete/${id}`
          )
          .then((res) => {
            console.log(res);
            setSelectedUser({});
            setLoad(!load);
          })
          .catch((err) => console.log(err));
      }
    );
  };

  const handleUserSelection = (id) => {
    const user = usersRaw.filter((user) => user._id === id)[0];
    console.log("Clicked on user with ID: ", user);
    setSelectedUser(user);
  };

  // Table setups

  const selectOptions = {
    CL: "CL",
    OP: "OP",
    AD: "AD",
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
      dataField: "lname",
      text: "Apellido",
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
      dataField: "fname",
      text: "Nombre",
      headerAlign: "center",
      filter: textFilter(),
    },
    {
      dataField: "dni",
      text: "DNI",
      headerStyle: (column, colIndex) => {
        return { width: "8em" };
      },
      headerAlign: "center",
      align: "center",
      filter: textFilter(),
    },
    {
      dataField: "role",
      text: "Rol",
      headerStyle: (column, colIndex) => {
        return { width: "8em" };
      },
      headerAlign: "center",
      align: "center",
      formatter: (cell) => selectOptions[cell],
      filter: selectFilter({
        options: selectOptions,
      }),
    },
    {
      dataField: "actions",
      text: "Acciones",
      headerStyle: (column, colIndex) => {
        return { width: "6em" };
      },
      headerAlign: "center",
      align: "center",
      sort: false,
    },
  ];
  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      handleUserSelection(row._id);
    },
  };

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.sideContainer}>
          <UserDetails
            user={selectedUser}
            handleDelete={handleDelete}
            handleRoleChange={handleRoleChange}
          />
        </div>
        <div className={style.contentContainer}>
          <div className={style.tableContainer}>
            <BootstrapTable
              keyField="id"
              data={users}
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

export default Users;
