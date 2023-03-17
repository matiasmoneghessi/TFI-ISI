import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";
import parseJwt from "../hooks/parseJwt";
import capitalize from "../hooks/capitalize";
//import countdown from "../utils/countdown";
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';


import style from "../styles/CustomNavbar.module.css";
import { emptyBranchOffice } from "../features/branchOffice";
import { emptyAppointment } from "../features/appointment";
import { useDispatch } from "react-redux";

const CustomNavbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  const role = payload.admin ? "AD" : payload.operator ? "OP" : "CL";

  Confirm.init({
    className: 'notiflix-confirm',
    width: '400px',
    zindex: 4003,
    position: 'center',
    distance: '10px',
    backgroundColor: '#f8f8f8',
    borderRadius: '25px',
    backOverlay: true,
    backOverlayColor: 'rgba(0,0,0,0.5)',
    rtl: false,
    fontFamily: 'Quicksand',
    cssAnimation: true,
    cssAnimationDuration: 300,
    cssAnimationStyle: 'fade',
    plainText: true,
    titleColor: '#20A4F3',
    titleFontSize: '20px',
    titleMaxLength: 34,
    messageColor: '#1E1E1E',
    messageFontSize: '16px',
    messageMaxLength: 110,
    buttonsFontSize: '15px',
    buttonsMaxLength: 34,
    okButtonColor: '#F8F8F8',
    okButtonBackground: '#20A4F3',
    cancelButtonColor: '#F8F8F8',
    cancelButtonBackground: '#A9A9A9',
    });

  const handleLogout = () => {
    Confirm.show(
      "TuTurno",
      "¿Confirma que desea finalizar la sesión?",
      "Si",
      "No",
      () => {
      localStorage.removeItem("endTime");
      localStorage.removeItem("user");
      localStorage.removeItem("branches");
      dispatch(emptyAppointment());
      dispatch(emptyBranchOffice())
        navigate("/");
      },
    );
  };

  return (
    <div>
      <Navbar variant="dark" expand="lg" className={style.navbar}>
        <Container fluid className="mx-4">
          {!payload.admin && !payload.operator ? 
          <Navbar.Brand href="/welcome">
            {/* <img 
              src={require("../images/3.png")}
              height="36px"
              className="d-inline-block align-top"
              alt="Logo mi turno"
            /> */}
          </Navbar.Brand> : 
          <Navbar.Brand href="/users">
          {/* <img 
            src={require("../images/3.png")}
            height="36px"
            className="d-inline-block align-top"
            alt="Logo mi turno"
          /> */}
        </Navbar.Brand>
          }
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <a className="navbar-brand ms-5" href="#">
            Hola {capitalize(payload.fname)}
          </a>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {role === "AD" ? (
                <>
                  <Nav.Link href="/offices" className="mx-3 fs-5">
                    Sucursales
                  </Nav.Link>
                  <Nav.Link href="/users" className="mx-3 fs-5">
                    Usuarios
                  </Nav.Link>
                </>
              ) : role === "OP" ? (
                <>
                  <Nav.Link href="/turnos_operator" className="mx-3 fs-5">
                    Turnos
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Item className="navbar-brand ms-5">
                    {/* {countdown()} */}
                  </Nav.Item>
                  <Nav.Link href="/calendar" className="mx-3 fs-5">
                    Reservar
                  </Nav.Link>
                  <Nav.Link href="/myappointments" className="mx-3 fs-5">
                    Mis Turnos
                  </Nav.Link>
                </>
              )}
              <Nav.Link href="/myaccount" className="mx-3 fs-5">
                Mi Perfil
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="mx-3 fs-5">
                LOGOUT
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
