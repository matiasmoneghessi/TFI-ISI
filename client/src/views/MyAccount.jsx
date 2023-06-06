import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/Button";
import parseJwt from "../hooks/parseJwt";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import capitalize from "../hooks/capitalize";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { useNavigate } from "react-router-dom";


import style from "../styles/MyAccount.module.css";

const MyAccount = () => {
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);

  useEffect(() => {
    loadUserData();
  }, []);

  const [userData, setUserData] = useState(payload);

  const loadUserData = () => {
    axios
      .get(`http://localhost:3001/api/users/me/${payload.id}`)
      // .then((res) => setUserData(res.data))
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (values) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea aplicar los cambios en su perfil?",
      "Si",
      "No",
      () => {
        axios
          .put(`http://localhost:3001/api/users/me/${payload.id}`, values)
          .then((res) => {
            loadUserData();
          })
          .catch((err) => console.log(err));
        setIsEditing(false);
      }
    );
  };

  const handleDelete = () => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea eliminar su cuenta?",
      "Si",
      "No",
      () => {
        axios
          .delete(
            `http://localhost:3001/api/users/delete/${payload.id}`            
          )
          .then((res) => {
            localStorage.removeItem("user");
            navigate("/");
          })
          .catch((err) => console.log(err));
      }
    );
  };

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <Formik
          initialValues={{
            lname: capitalize(userData.lname),
            fname: capitalize(userData.fname),
            dni: userData.dni,
            email: userData.email,
            birthdate: userData.birthdate,
            phone: userData.phone,
            address: userData.address,
          }}
          // validationSchema={validate}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(formik, isSubmitting) => (
            <div className={style.contentContainer}>
              <Form className={style.formProfilePage}>
                <div className={style.userDetails}>
                  <ul className={style.listProfilePage}>

                    <div className={style.containerProfileInfo}>
                      <div className={style.containerProfileTitle}>
                        <h3>Perfil</h3>
                        <li>
                          ID:&emsp;{payload.id}
                          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        </li>
                        <li>
                          Rol:{" "}
                          {userData.admin ? "AD" : userData.operator ? "OP" : "CL"}
                        </li>
                      </div>
                      <h3>Datos</h3>
                      <li>
                        Apellido:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="lname"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          capitalize(userData.lname)
                        )}
                      </li>
                      <li>
                        Nombre:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="fname"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          capitalize(userData.fname)
                        )}
                      </li>
                      <li>
                        DNI:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="dni"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          userData.dni
                        )}
                      </li>
                      <li>
                        E-mail:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="email"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          userData.email
                        )}
                      </li>
                      <li>
                        Fecha de nacimiento:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              placeholder="Formato fecha: xx/xx/xxxx"
                              name="birthdate"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                            <p></p>
                          </div>
                        ) : (
                          userData.birthdate
                        )}
                      </li>
                      <li>
                        Teléfono:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="phone"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          userData.phone
                        )}
                      </li>
                      <li>
                        Domicilio:&emsp;
                        {isEditing ? (
                          <div className="form-group">
                            <Field
                              name="address"
                              className={
                                formik.touched.name && formik.errors.name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              type="text"
                            />
                            {formik.touched.name && formik.errors.name ? (
                              <div className="invalid-feedback">
                                {formik.errors.name}
                              </div>
                            ) : null}
                          </div>
                        ) : userData.address ? (
                          capitalize(userData.address)
                        ) : (
                          userData.address
                        )}
                      </li>

                      <div className={style.buttonsContainer}>

                        {isEditing == false ? (
                          <>
                            <button
                              className={style.btnEditsButton}
                              onClick={() => {
                                setIsEditing(true);
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>
                              &nbsp;&nbsp;Editar
                            </button>
                            <button
                              variant="secondary"
                              className={style.btnDeleteProfile}
                              onClick={() => {
                                handleDelete();
                              }}
                            >
                              <i className="bi bi-trash3-fill"></i>
                              &nbsp;&nbsp;Eliminar mi cuenta
                            </button>
                          </>
                        ) : (
                          <></>
                        )}

                        {isEditing ? (
                          <>
                            <button
                              className={style.btnEditsButton}
                              onClick={() => {
                                formik.resetForm();
                                setIsEditing(false);
                              }}
                            >
                              <i className="bi bi-x-circle"></i>
                              &nbsp;&nbsp;Descartar Cambios
                            </button>
                            <button
                              type="submit"
                              className={style.btnEditsButton}
                            >
                              <i className="bi bi-check-circle"></i>
                              &nbsp;&nbsp;Confirmar Cambios
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  
                  </ul>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default MyAccount;
