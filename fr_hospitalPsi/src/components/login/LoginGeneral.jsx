import React, { useState } from "react";
import services_user from "../../services/servicesUsuario";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Limg from "../img/loginImg.jpg"
import "./LoginGeneral.css";

function LoginGeneral() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function ingresarInfo() {
    if (!correo.trim() || !contrasena.trim()) {
      Swal.fire("Error", "Debes ingresar correo y contraseña.", "error");
      return;
    }

    try {
      const data = await services_user.loginUsuario(correo, contrasena);
      const { access, refresh, role, id } = data;

      if (role === "psicologo") {
        localStorage.setItem("access_psicologo", access);
        localStorage.setItem("refresh_psicologo", refresh);
        localStorage.setItem("role_psicologo", role);
        localStorage.setItem("id_psicologo", id);
      } else if (role === "paciente") {
        localStorage.setItem("access_paciente", access);
        localStorage.setItem("refresh_paciente", refresh);
        localStorage.setItem("role_paciente", role);
        localStorage.setItem("id_paciente", id);
      } else if (role === "admin") {
        localStorage.setItem("access_admin", access);
        localStorage.setItem("refresh_admin", refresh);
        localStorage.setItem("role_admin", role);
        localStorage.setItem("id_admin", id);
      }

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio de sesión exitoso.",
      }).then(() => {
        navigate("/dashboard");
      });

    } catch (error) {
      Swal.fire("Error", "Credenciales incorrectas.", "error");
    }
  }

  return (
    <div>
      <NavBar />

      <div className="login-container">

        <div className="login-img">
          <img src={Limg} alt="imagen-login" />
          <div className="login-message">
            <h2>Nos alegra que más personas den el paso hacia el bienestar</h2>
            <p>Tu salud mental importa. Estamos aquí para acompañarte en cada momento.</p>
          </div>
        </div>

        <div className="login-box">
          <h2>Inicio de sesión</h2>

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo..."
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="usuario"
          />

          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña..."
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="usuario"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>


          <button onClick={ingresarInfo} className="boton-primario">Iniciar Sesión</button>
          <button onClick={() => navigate("/registro")} className="boton-secundario">No tengo cuenta</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginGeneral;
