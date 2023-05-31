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
          <Navbar.Brand href="/calendar">
             <img 
              src={require("../images/TuTu3.png")}
              height="36px"
              className="d-inline-block align-top"
              alt="Logo mi turno"
            />
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
          <a className={style.userHeaderNavBar}>
            Hola {capitalize(payload.fname)} &nbsp;
            <i class="bi bi-clipboard-heart"></i>
          </a>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {role === "AD" ? (
                <>
                  <Nav.Link href="/offices" className={style.linkNavBar}>
                    Sucursales
                  </Nav.Link>
                  <Nav.Link href="/users" className={style.linkNavBar}>
                    Usuarios
                  </Nav.Link>
                </>
              ) : role === "OP" ? (
                <>
                  <Nav.Link href="/turnos_operator" className={style.linkNavBar}>
                    Calendario
                  </Nav.Link>
                  <Nav.Link href="/turnos_opFullView" className={style.linkNavBar}>
                    Turnos 
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Item className="navbar-brand ms-5">
                    {/* {countdown()} */}
                  </Nav.Item>
                  <Nav.Link href="/calendar" className={style.linkNavBar}>
                    Reservar
                  </Nav.Link>
                  <Nav.Link href="/myappointments" className={style.linkNavBar}>
                    Mis Turnos
                  </Nav.Link>
                </>
              )}
              <Nav.Link href="/myaccount" className={style.linkNavBar}>
                Mi Perfil
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className={style.linkNavBar}>
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
