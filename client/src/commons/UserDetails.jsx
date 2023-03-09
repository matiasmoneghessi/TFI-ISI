import React from "react";
import Button from "react-bootstrap/Button";
import style from "../styles/Users.module.css";
import capitalize from "../hooks/capitalize";

const UserDetails = ({ user, handleDelete, handleRoleChange }) => {
  console.log(user.lname);

  return user._id ? (
    <div className={style.userDetails}>
      <h5>Detalle de usuario</h5>
      <ul>
        <li>ID: {user._id}</li>
        {/* <li>Rol: {user.admin ? "AD" : user.operator ? "OP" : "CL"}</li> */}
        <li>Apellido: {capitalize(user.lname)}</li>
        <li>Nombre: {capitalize(user.fname)}</li>
        <li>DNI: {user.dni}</li>
        <li>E-mail: {user.email}</li>
        <li>Fecha de nacimiento: {user.birthdate}</li>
        <li>Teléfono: {user.phone}</li>
        <li>Domicilio: {user.address}</li>
      </ul>
      {user.admin ? (
        <></>
      ) : (
        <>
          <Button
            variant="secondary"
            className={style.sideButton}
            onClick={() =>
              handleRoleChange(user._id, user.admin, user.operator)
            }
          >
            Cambiar Rol
          </Button>
          <Button
            variant="secondary"
            className={style.sideButton}
            onClick={() => handleDelete(user._id)}
          >
            Eliminar
          </Button>
        </>
      )}
    </div>
  ) : (
    <></>
  );
};

export default UserDetails;
