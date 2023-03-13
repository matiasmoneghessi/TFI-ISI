import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, Link } from "react-router-dom";
//import useInput from '../hooks/useInput';
import { useDispatch } from "react-redux";
import { branchOfficesGetter } from '../features/branchOfficesList';
import { userLogin, userLogout } from "../features/user";
import style from "../styles/General.module.css";
import parseJwt from "../hooks/parseJwt";
import { Report } from "notiflix/build/notiflix-report-aio";

function Login() {
  const dispatch = useDispatch();
  //dispatch(branchOfficesGetter());

  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  if (localStorage.getItem("user")) localStorage.removeItem("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      userLogin({
        email,
        password,
      })
    )
      .then((user) => {
        const token = JSON.parse(localStorage.getItem("user")).data.token;
        const payload = parseJwt(token);
        console.log(payload);

        payload.admin
          ? navigate("/users")
          : payload.operator
            ? navigate("/turnos_operator")
            : navigate("/welcome");
      })
      .catch((err) => {
        Report.failure(
          "Error en login",
          "Por favor, verifique su email y password.",
          "Ok"
        );
      });
  };

  return (
    <div className={style.containerBox}>
      {/*<div className={style.logoContainer}>
         <img
          className={style.largeLogo}
          src={require("../images/1.png")}
          alt="TuTurno"
        />
        <img
          className={style.smallLogo}
          src={require("../images/2.png")}
          alt="TuTurno"
        /> 
      </div>*/}
      <div className={style.midContainer}>
        <div className={style.midContainerSignIn}>
          <div className={style.headerLogIn}>
            <h1 className={style.labelsTitulos}>Log In</h1>
          </div>

          <div className={style.midPageLogIn}>
            <Form className={style.formPageLogIn} onSubmit={handleSubmit}>
              <Form.Group className={style.inputsSingIn} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder="Ingrese su email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className={style.inputsSingIn}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  placeholder="Ingrese su contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Link className={style.labelOlvidoContraseña} to="/assist_password">
                Olvidé mi contraseña
              </Link>

              <div className={style.boton}>
                <Button className={style.btnSignIn} variant="secondary" type="submit">
                  Ingresar
                </Button>
              </div>
            </Form>
          </div>
          
          <div className={style.footerSocialMedia}>
            <a href="#" className={style.btnSocialMedia}><i className="bi bi-facebook"></i></a>
            <a href="#" className={style.btnSocialMedia}><i className="bi bi-github"></i></a>
            <a href="#" className={style.btnSocialMedia}><i className="bi bi-linkedin"></i></a>
          </div>

        </div>
        <div className={style.midContainerSignUp}>
          <h2 className={style.labelsTitulos}>Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <div className={style.btnSignUp}>
              <p>Aún no tienes cuenta?</p>
              <Link to="/register" className={style.linkPageRegister}>Registrate!</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
