import React, { useState } from "react";
import services_user from "../../services/servicesUsuario";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function LoginGeneral() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

 async function ingresarInfo() {

  if (!correo.trim() || !contrasena.trim()) {
    Swal.fire("Error", "Debes ingresar correo y contraseña.", "error");
    return;
  }

  try {
    const data = await services_user.loginUsuario(correo, contrasena);

    console.log("Respuesta login:", data);

    const { access, refresh, role, id } = data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);

    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: "Inicio de sesión exitoso.",
    }).then(async()=> {
      if (role === "paciente") navigate("/paciente");
      else if (role === "psicologo") navigate("/psicologo");
      else if (role === "admin") navigate("/admin");

    });

  } catch (error) {
    Swal.fire("Error", "Credenciales incorrectas.", "error");
  }
}

  return (
    <div>
      <div className='login'>
        <h2>Inicio de sesión</h2>
        <label htmlFor="correo">Correo electrónico</label>
        <input type="email" placeholder="Ingresa tu correo..." value={correo} onChange={(e) => setCorreo(e.target.value)}className="usuario"/>
        <br />

        <label htmlFor="contrasena">Contraseña</label>
        <input type="password" placeholder="Ingresa tu contraseña..." value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="usuario"/>
        <br />

        <button onClick={ingresarInfo} className="boton-primario">Iniciar Sesión</button>
        <button onClick={() => navigate("/registro")} className="boton-secundario">No tengo cuenta</button>
      </div>
    </div>
  );
}

export default LoginGeneral;
