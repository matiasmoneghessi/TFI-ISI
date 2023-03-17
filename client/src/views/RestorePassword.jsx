import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import style from "../styles/General.module.css";
import parseJwt from "../hooks/parseJwt";
import axios from "axios";
import { Report } from "notiflix/build/notiflix-report-aio";

function RestorePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState();
  const [rePassword, setRePassword] = useState();

  // const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  const [resetToken, setResetToken] = useState();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get("token");
    setResetToken(queryValue);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3001/api/user/newPassword`, {
        headers: {
          "rtoken": resetToken,
        },
        body: {
          "password": password,
        },
      })
      .then((res) => {
        Report.success(
          "TuTurno",
          "Tu contraseña se restableció correctamente",
          "Okay"
        );
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Report.warning("TuTurno", err.response.data.mensaje, "Ok");
      });
  };

  return (
    <div className={style.mainContainer}>
      <div className={style.logoContainer}>
        {/* <img
          className={style.largeLogo}
          src={require("../images/1.png")}
          alt="TuTurno"
        />
        <img
          className={style.smallLogo}
          src={require("../images/2.png")}
          alt="TuTurno"
        /> */}
      </div>
      <div className={style.contentContainer}>
        <div>
          <h2>Restablecer contraseña</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                placeholder="Elija una contraseña (8 a 20 caracteres, al menos 1 mayúscula y 1 número)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Repetir la nueva contraseña</Form.Label>
              <Form.Control
                placeholder="Repetir la nueva contraseña"
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className={style.boton}>
              <Button variant="secondary" type="submit">
                Restablecer
              </Button>
            </div>

            {/* <Link className={style.link} to="/assist_password">
              Olvidé mi contraseña
            </Link> */}

            <div className={style.unregistred}>
              <p className={style.p}>Aún no tengo una cuenta</p>
              <Link to="/register">Registrarme</Link>
              {/* <Button variant="secondary" onClick={() => navigate("/register")}>
            Registrarme
          </Button>  */}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RestorePassword;
