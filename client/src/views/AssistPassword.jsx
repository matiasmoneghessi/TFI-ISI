import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
//import useInput from '../hooks/useInput';
import style from "../styles/General.module.css";
import { Report } from "notiflix/build/notiflix-report-aio";

function AssistPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [resetToken, setResetToken] = useState();

  // const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    axios
      .put(`http://localhost:3001/api/user/forgotPassword`, {
        email: email,
      })
      .then((res) => {
        Report.success(
          "TuTurno",
          "Revisá tu email para seguir las indicaciones",
          "Okay"
        );
        navigate("/");
      })
      .catch((err) => {
        // console.log(err.response.data.mensaje);
        Report.warning("TuTurno", err.response.data.mensaje, "Ok");
      });
  };

  return (
    <div className={style.containerBoxForgotPass}>
      <div className={style.midContainerFP}>
        <div className={style.midContainerForgotPass}>
          <div className={style.headerLogIn}>
            <h1 className={style.labelsTitulos}>Asistencia</h1>
          </div>
          <Form className={style.formPageForgotPass} onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="formEmail">
              <Form.Label>Email para recuperar contraseña</Form.Label>
              <Form.Control
                placeholder="Ingrese su email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <div className={style.boton}>
              <button className={style.btnSignIn} type="submit">
                Continuar
              </button>
            </div>

            <div className={style.btnLinkForgotPass}>
              <div className={style.boton}>
                <Link className={style.linkPageFP} to="/login">
                  Tengo cuenta
                </Link>
              </div>
              
              <div className={style.boton}>
              <Link className={style.linkPageFP} to="/register">
                Registrarme
              </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AssistPassword;
