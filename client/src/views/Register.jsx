//import { useState } from 'react';
import Button from "react-bootstrap/Button";
//import Alert from 'react-bootstrap/Alert';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
//import useInput from '../hooks/useInput';
import { useDispatch } from "react-redux";
import { userRegister } from "../features/user";
import style from "../styles/General.module.css";
import { usePasswordToggle } from "../utils/togglePasswordVisibility";
import { Report } from "notiflix/build/notiflix-report-aio";

function Register() {
  const navigate = useNavigate();
  const [inputType, icon] = usePasswordToggle();

  /* const [fname, setFname] = useState();
  const [lname, setLname] = useState();
  const [dni, setDni] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState(); */

  const dispatch = useDispatch();

  if (localStorage.getItem("registered")) localStorage.removeItem("registered");
  /* 
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : {} */

  // const [showPassword, setShowPassword] = useState(false);

  // const user = localStorage.getItem("user")
  //   ? JSON.parse(localStorage.getItem("user"))
  //   : {};

  const handleRegister = (values) => {
    dispatch(
      userRegister({
        fname: values.fname,
        lname: values.lname,
        dni: values.dni,
        email: values.email,
        password: values.password,
      })
    ).then(() => {
      const registered =
        JSON.parse(localStorage.getItem("registered")).data.fname || null;
      console.log("ESTO ES el FNAME de REGISTERED", registered);
      if (registered) {
        Report.success(
          "¡Registro exitoso!",
          "Recibirás un email confirmando tu registro.<br/>Ya podés loguearte y comenzar a utilizar TuTurno.",
          "Ok"
        );
        navigate("/login");
      } else {
        Report.failure(
          "Ocurrió un problema...",
          "Ingresá nuevamente tu información de registro, por favor.",
          "Ok"
        );
        navigate("/register");
      }
      // alert(registered
      // ? 'Hola ' + registered + ', te has registrado exitosamente!'
      // : 'Problema en el registro')
    });
    // .then(() => navigate("/login"));
  };

  const validate = Yup.object({
    fname: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .matches(/^[aA-zZ\s]+$/, "Sólo se permiten letras en este campo")
      .required("Se requiere un nombre"),
    lname: Yup.string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .matches(/^[aA-zZ\s]+$/, "Sólo se permiten letras en este campo")
      .required("Se requiere un apellido"),
    dni: Yup.number()
      .min(1000000, "El formato de número de DNI es incorrecto")
      .required("Se requiere su número de DNI"),
    email: Yup.string()
      .email("El formato de email ingresado no es válido")
      .required("Se requiere un email"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/^(?=.*[a-z])/, "La contraseña debe tener al menos 1 minúscula")
      .matches(/^(?=.*[A-Z])/, "La contraseña debe tener al menos 1 mayúscula")
      .matches(/^(?=.*[0-9])/, "La contraseña debe tener al menos 1 número")
      .required("Se requiere contraseña"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "La contraseña no coincide")
      .required("Se requiere confirmación de contraseña"),
  });

  return (
    <div className={style.containerBox}>
      <Formik
        initialValues={{
          fname: "",
          lname: "",
          dni: "",
          email: "",
          password: "",
          rePassword: "",
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          handleRegister(values);
        }}
      >
        {(formik, isSubmitting) => (
          <div className={style.midContainerRegister}>
            
            <div className={style.midContainerSignUp}>
              <h2 className={style.labelsTitulos}>Log In</h2>
                <div className={style.btnSignUp}>
                  <p className={style.labelsTitulos}>Ya tienes una cuenta?</p>
                  <Link to="/login" className={style.linkPageRegister}>Inicia sesión!</Link>
                </div>
            </div>
            
            <div className={style.midContainerSignIn}>
              <h2 className={style.labelsTitulos}>Registro</h2>
              <Form>
                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="fname">
                    Nombre: 
                    {formik.touched.fname && formik.errors.fname ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.fname}
                      </label>
                    ) : null}
                  </label>
                  <Field
                    name="fname"
                    placeholder="Ingrese su nombre"
                    type="text"
                    className={
                      formik.touched.fname && formik.errors.fname
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="fname">
                    Apellido:
                    {formik.touched.lname && formik.errors.lname ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.lname}
                      </label>
                    ) : null} 
                  </label>
                  <Field
                    name="lname"
                    placeholder="Ingrese su apellido"
                    type="text"
                    className={
                      formik.touched.lname && formik.errors.lname
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="dni">
                    <label className={style.labelsTituloInput}>N° documento:</label>
                    {formik.touched.dni && formik.errors.dni ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.dni}
                      </label>
                    ) : null}
                  </label>
                  <Field
                    name="dni"
                    placeholder="Ingrese su n° de documento (sin puntos. Ej.: 34345345)"
                    type="number"
                    className={
                      formik.touched.dni && formik.errors.dni
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="email">
                    Email:
                    {formik.touched.email && formik.errors.email ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.email}
                      </label>
                    ) : null}
                  </label>
                  <Field
                    name="email"
                    placeholder="Ingrese su email"
                    type="email"
                    className={
                      formik.touched.email && formik.errors.email
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="password">
                    Contraseña:
                    {formik.touched.password && formik.errors.password ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.password}
                      </label>
                    ) : null}
                  </label>
                  <Field
                    name="password"
                    placeholder="Al menos: 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
                    type={inputType}
                    className={
                      formik.touched.password && formik.errors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.inputsRegister}>
                  <label className={style.labelsErrorValidacionAlert} htmlFor="rePassword">
                  <label className={style.labelsTituloInputRepeContra}>Repetir contraseña:</label>
                    {formik.touched.rePassword && formik.errors.rePassword ? 
                    (
                      <label className={style.labelsErrorValidacion}>
                        {formik.errors.rePassword}
                      </label>
                    ) : null}
                  </label>
                  <Field
                    name="rePassword"
                    placeholder="Repetir contraseña"
                    type="password"
                    className={
                      formik.touched.rePassword && formik.errors.rePassword
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                  />
                </div>

                <div className={style.boton}>
                  <button className={style.btnSignIn} variant="secondary" type="submit">
                    Registrarme
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default Register;
