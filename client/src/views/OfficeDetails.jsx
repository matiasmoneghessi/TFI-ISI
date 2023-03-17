import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/esm/Button";
import Dropdown from "react-bootstrap/Dropdown";
import parseJwt from "../hooks/parseJwt";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import capitalize from "../hooks/capitalize";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

import style from "../styles/OfficeDetails.module.css";

const OfficeDetails = ({ office, selectOffice }) => {

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);

  const [edited, setEdited] = useState(false);
  const [isEditingBranch, setIsEditingBranch] = useState(false);
  const [isEditingManager, setIsEditingManager] = useState(false);
  const [isEditingAppointments, setIsEditingAppointments] = useState(false);
  const [isEditingOperators, setIsEditingOperators] = useState(false);
  const [operator, setOperator] = useState({});
  const [loadOperator, setLoadOperator] = useState(false);
  const [operatorsList, setOperatorsList] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadAssignedOperator();
    loadOperatorsList();
  }, [loadOperator]);

  const stopEditing = () => {
    setEdited(false);
    setIsEditingBranch(false);
    setIsEditingManager(false);
    setIsEditingAppointments(false);
    setIsEditingOperators(false);
    setSelectedOperator(operator);
  };

  const handleSubmit = (values) => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea aplicar los cambios en esta sucursal?",
      "Si",
      "No",
      () => {
        axios
          .put(
            `http://localhost:3001/api/branchOffice/admin/${payload.id}/${office._id}`,
            values
          )
          .then(() => {
            axios
              .put(
                `http://localhost:3001/api/branchOffice/admin/${payload.id}/showBranch/${office._id}`,
                selectedOperator
              )
              .then((res) => console.log(res));
          })
          .then(() => {
            axios
              .get(`http://localhost:3001/api/branchOffice/showBranch`)
              .then((res) => res.data.data)
              .then(
                (updatedOffices) =>
                  updatedOffices.filter(
                    (updatedOffice) => updatedOffice._id === office._id
                  )[0]
              )
              .then((updatedOffice) => selectOffice(updatedOffice));
          })
          .catch((err) => console.log(err));
        stopEditing();
        setOperator(selectedOperator);
      }
    );
  };

  const loadAssignedOperator = () => {
    axios
      .get(`http://localhost:3001/api/users/admin/${payload.id}/showUsers`)
      .then((res) => {
        return res.data.data;
      })
      .then((users) => {
        const op = users.filter((user) => user._id === office.operator[0])[0];
        setOperator(op);
        setSelectedOperator(op);
      })
      .catch((err) => console.log(err));
  };

  const loadOperatorsList = () => {
    axios
      .get(
        `http://localhost:3001/api/branchOffice/admin/${payload.id}/showBranch/${office._id}/operator`
      )
      .then((res) => {
        console.log(res.data.data);
        return res.data.data;
      })
      .then((operators) => setOperatorsList(operators))
      .catch((err) => console.log(err));
  };

  const validate = Yup.object({
    address: Yup.string().required("Ingresar una dirección."),
    location: Yup.string().required("Ingresar una dirección."),
  });

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <Formik
          initialValues={{
            address: capitalize(office.address),
            location: capitalize(office.location),
            phone: office.phone,
            email: office.email,
            startTime: office.startTime,
            endTime: office.endTime,
            simultAppointment: office.simultAppointment,
            price: office.price.$numberDecimal,
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(formik, isSubmitting) => (
            <div className={style.contentContainer}>
              <Form>
                <div className={style.nameContainer}>
                  <h4>
                    Sucursal{" "}
                    {capitalize(office.location + " - " + office.address)}
                  </h4>
                </div>
                <div className={style.dataContainer}>
                  <div className={style.leftDataContainer}>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de Sucursal</h5>
                        <Button
                          variant="secondary"
                          className={style.buttons}
                          onClick={() => {
                            setEdited(true);
                            setIsEditingBranch(true);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                          &nbsp;&nbsp;Editar
                        </Button>
                      </div>
                      <ul>
                        <li>ID Sucursal:&emsp;{office._id}</li>
                        <li>
                          Nombre:&emsp;
                          {capitalize(office.location + " - " + office.address)}
                        </li>
                        <li>
                          Dirección:&emsp;
                          {isEditingBranch ? (
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
                          ) : (
                            capitalize(office.address)
                          )}
                        </li>
                        <li>
                          Localidad:&emsp;
                          {isEditingBranch ? (
                            <div className="form-group">
                              <Field
                                name="location"
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
                            capitalize(office.location)
                          )}
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de contacto</h5>
                        <Button
                          variant="secondary"
                          className={style.buttons}
                          onClick={() => {
                            setEdited(true);
                            setIsEditingManager(true);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                          &nbsp;&nbsp;Editar
                        </Button>
                      </div>
                      <ul>
                        <li>
                          Teléfono:&emsp;
                          {isEditingManager ? (
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
                            office.phone
                          )}
                        </li>
                        <li>
                          E-mail:&emsp;
                          {isEditingManager ? (
                            <div className="form-group">
                              <Field
                                name="email"
                                className={
                                  formik.touched.name && formik.errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="email"
                              />
                              {formik.touched.name && formik.errors.name ? (
                                <div className="invalid-feedback">
                                  {formik.errors.name}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            office.email
                          )}
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de Atención</h5>
                        <Button
                          variant="secondary"
                          className={style.buttons}
                          onClick={() => {
                            setEdited(true);
                            setIsEditingAppointments(true);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                          &nbsp;&nbsp;Editar
                        </Button>
                      </div>
                      <ul>
                        <li>
                          Hora de apertura:&emsp;
                          {isEditingAppointments ? (
                            <div className="form-group">
                              <Field
                                name="startTime"
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
                            office.startTime + " hs"
                          )}
                        </li>
                        <li>
                          Hora de cierre:&emsp;
                          {isEditingAppointments ? (
                            <div className="form-group">
                              <Field
                                name="endTime"
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
                            office.endTime + " hs"
                          )}
                        </li>
                        <li>
                          Turnos en simultáneo:&emsp;
                          {isEditingAppointments ? (
                            <div className="form-group">
                              <Field
                                name="simultAppointment"
                                className={
                                  formik.touched.name && formik.errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="number"
                              />
                              {formik.touched.name && formik.errors.name ? (
                                <div className="invalid-feedback">
                                  {formik.errors.name}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            office.simultAppointment
                          )}
                        </li>
                        <li>
                          Precio del turno:&emsp;ARS{" "}
                          {isEditingAppointments ? (
                            <div className="form-group">
                              <Field
                                name="price"
                                className={
                                  formik.touched.name && formik.errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                type="number"
                              />
                              {formik.touched.name && formik.errors.name ? (
                                <div className="invalid-feedback">
                                  {formik.errors.name}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            office.price.$numberDecimal
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={style.rightDataContainer}>
                    <div className={style.generalContainer}></div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Operadores asignados a la sucursal</h5>
                        <Button
                          variant="secondary"
                          className={style.buttons}
                          onClick={() => {
                            setEdited(true);
                            setIsEditingOperators(true);
                            setLoadOperator(!loadOperator);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                          &nbsp;&nbsp;Editar
                        </Button>
                      </div>
                      <ul>
                        <li>
                          {isEditingOperators ? (
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-basic"
                                size="sm"
                              >
                                {selectedOperator ? (
                                  <>
                                    {capitalize(
                                      selectedOperator.lname +
                                        ", " +
                                        selectedOperator.fname
                                    )}
                                  </>
                                ) : (
                                  "Sin operadores asignados"
                                )}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => {
                                    setSelectedOperator();
                                  }}
                                  size="sm"
                                >
                                  Sin operadores asignados
                                </Dropdown.Item>
                                {operatorsList.map((operator, i) => {
                                  return (
                                    <Dropdown.Item
                                      onClick={() => {
                                        setSelectedOperator(operator);
                                      }}
                                      key={i}
                                    >
                                      {capitalize(operator.lname)},{" "}
                                      {capitalize(operator.fname)}
                                    </Dropdown.Item>
                                  );
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
                          ) : (
                            <>
                              {operator ? (
                                <>
                                  {capitalize(
                                    operator.lname + ", " + operator.fname
                                  )}
                                </>
                              ) : (
                                "- Sin operadores asignados"
                              )}
                            </>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={style.buttonsContainer}>
                  <div className={style.startButtons}>
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      href="/offices"
                    >
                      <i className="bi bi-arrow-left-circle-fill"></i>
                      &nbsp;&nbsp;Volver
                    </Button>
                  </div>
                  <div className={style.endButtons}>
                    {edited ? (
                      <>
                        <Button
                          variant="secondary"
                          className={style.buttons}
                          onClick={() => {
                            formik.resetForm();
                            stopEditing();
                          }}
                        >
                          Descartar Cambios
                        </Button>
                        <Button
                          type="submit"
                          variant="secondary"
                          className={style.buttons}
                        >
                          Confirmar Cambios
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}
                    <Button
                      href="/newOffice"
                      variant="secondary"
                      className={style.buttons}
                    >
                      + Agregar sucursal
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default OfficeDetails;
