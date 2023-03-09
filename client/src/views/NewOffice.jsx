import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/esm/Button";
import parseJwt from "../hooks/parseJwt";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Report } from "notiflix/build/notiflix-report-aio";

import style from "../styles/OfficeDetails.module.css";

const NewOffice = () => {
  // console.log(office);

  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);

  const [operator, setOperator] = useState({});
  const [loadOperator, setLoadOperator] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios
      .post(
        `http://localhost:3001/api/branchOffice/admin/${payload.id}/add`,
        values
      )
      .then((res) => {
        console.log(res);
        Report.success("Se ha creado una nueva sucursal", "Ok");
        navigate("/offices");
      })
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
            address: "",
            location: "",
            phone: "",
            email: "",
            startTime: "",
            endTime: "",
            simultAppointment: "",
            price: "",
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
                  <h4>Nueva Sucursal</h4>
                </div>
                <div className={style.dataContainer}>
                  <div className={style.leftDataContainer}>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de Sucursal</h5>
                      </div>
                      <ul>
                        <li>ID Sucursal:&emsp;sin asignar</li>
                        <li>Nombre:&emsp; sin asignar</li>
                        <li>
                          Dirección:&emsp;
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
                        </li>
                        <li>
                          Localidad:&emsp;
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
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de contacto</h5>
                      </div>
                      <ul>
                        <li>
                          Teléfono:&emsp;
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
                        </li>
                        <li>
                          E-mail:&emsp;
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
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Datos de Atención</h5>
                      </div>
                      <ul>
                        <li>
                          Hora de apertura:&emsp;
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
                        </li>
                        <li>
                          Hora de cierre:&emsp;
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
                        </li>
                        <li>
                          Turnos en simultáneo:&emsp;
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
                        </li>
                        <li>
                          Precio del turno:&emsp;ARS&nbsp;
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
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={style.rightDataContainer}>
                    <div className={style.generalContainer}></div>
                    <div className={style.generalContainer}>
                      <div className={style.generalContainerTitle}>
                        <h5>Operadores asignados a la sucursal</h5>
                      </div>
                      <ul>
                        <li>
                          {/* {operator ? (
                            <>
                              - {operator.lname}, {operator.fname}
                            </>
                          ) : null} */}
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
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      onClick={() => {
                        formik.resetForm();
                      }}
                    >
                      Borrar formulario
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      className={style.buttons}
                    >
                      Crear sucursal
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

export default NewOffice;
