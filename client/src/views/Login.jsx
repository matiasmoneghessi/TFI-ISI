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

  // const ref = useRef(null);
  // const myFunction = () => {
  //   var x = ref.current
  //   if (x.type === "password") {
  //     x.type = "text";
  //   } else {
  //     x.type = "password";
  //   }
  // }

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
          <h2>Login</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Ingrese su email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                placeholder="Ingrese su contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                //id="myInput" ref={ref}
              />
              {/* <input type="checkbox" onClick={myFunction} /> Mostrar Contraseña */}
            </Form.Group>
            <div className={style.boton}>
              <Button variant="secondary" type="submit">
                Ingresar
              </Button>
            </div>

            <Link className={style.link} to="/assist_password">
              Olvidé mi contraseña
            </Link>

            <div className={style.unregistred}>
              <p className={style.p}>Aún no tengo una cuenta</p>
              <Link to="/register">Registrarme</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
