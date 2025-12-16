import React, { useState } from "react";
import services_user from "../../services/servicesUsuario";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Limg from "../img/loginImg.jpg";
import "./LoginGeneral.css";

function LoginGeneral() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  async function ingresarInfo() {
    if (!correo.trim() || !contrasena.trim()) {
      Swal.fire("Error", "Debes ingresar correo y contraseña.", "error");
      return;
    }

    try {
      const data = await services_user.loginUsuario(correo, contrasena);
      console.log("✅ RESPUESTA LOGIN:", data);

      const access = data?.access;
      const refresh = data?.refresh;

      if (!access || !refresh) {
        throw new Error("El backend no devolvió tokens.");
      }

      // limpia local
      localStorage.clear();

      //  Guarda tokens 
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);


      const jwtPayload = parseJwt(access);
      const id_usuario = data?.id_usuario ?? jwtPayload?.user_id;
      if (id_usuario) localStorage.setItem("id_usuario", String(id_usuario));


      const rol = data?.rol;
      if (rol) localStorage.setItem("rol", rol);

      // extras
      if (data?.email) localStorage.setItem("email", data.email);
      if (data?.username) localStorage.setItem("username", data.username);
      //manda a una página segura (o dashboard general)
      let destino = "/dashboard";
      if (rol === "psicologo") destino = "/psicologo";
      else if (rol === "paciente") destino = "/paciente";
      else if (rol === "admin") destino = "/admin";

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Inicio de sesión exitoso.",
      }).then(() => navigate(destino));
    } catch (error) {
      Swal.fire("Error", error?.message || "Credenciales incorrectas.", "error");
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
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
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
