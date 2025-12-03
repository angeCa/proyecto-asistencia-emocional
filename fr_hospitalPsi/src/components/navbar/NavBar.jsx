import React, { useState } from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function NavBar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const CerrarSesion = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Espera",
      text: "¿Seguro que quieres cerrar sesión?",
      showCancelButton: true,
      confirmButtonText: "Sí, Cerrar Sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      localStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "¡Hasta luego!",
        text: "Has cerrado sesión correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">ConectaMente</div>

      <ul className="navbar-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/nosotros">Nosotros</a></li>
        <li><a href="/login">Login</a></li>
      </ul>

      <div className="nav-right">
        <button className="logout-btn" onClick={CerrarSesion}>Cerrar sesión</button>

        <div className="perfil">
          <button className="user-btn" onClick={() => setOpenMenu(!openMenu)}>
            👤
          </button>

          {openMenu && (
            <div className="user-menu">
              <p className="menu-title">Mi Perfil</p>
              <a href="/mi-perfil">Ver Perfil</a>
              <a href="/configuracion">Configuración</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
