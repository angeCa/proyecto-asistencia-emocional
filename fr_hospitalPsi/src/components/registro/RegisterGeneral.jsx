import React, { use, useState } from "react";
import services_user from "../../services/servicesUsuario";
import services_usergroup from "../../services/servicesUser_groups"
import ServicesPacientes from "../../services/ServicesPacientes";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./RegistroGeneral.css"
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";

function RegisterGeneral() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha_nacimiento, setFecha_Nacimiento] = useState("")
  const [diagnostico, setDiagnostico] = useState("")
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  //validaciones
  function validarCampos() {
    if (!nombre.trim()) {
      Swal.fire("Error", "Debes llenar esta casilla", "error");
      return false;
    }
    if (!apellido.trim()) {
      Swal.fire("Error", "Debes llenar esta casilla", "error");
      return false;
    }

    if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Swal.fire("Error", "Debes ingresar un correo válido.", "error");
      return;
    }

    const dominiosValidos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
    const dominio = correo.split("@")[1];
    if (!dominiosValidos.includes(dominio)) {
      Swal.fire("Error", "El dominio del correo no es válido.", "error");
      return;
    }


    if (!telefono.trim() || !/^\d{8,}$/.test(telefono)) {
      Swal.fire("Error", "El teléfono debe tener al menos 8 dígitos.", "error");
      return false;
    }

    if (!direccion.trim()) {
      Swal.fire("Error", "La dirección no puede estar vacía.", "error");
      return false;
    }

    if (!contrasena.trim() || contrasena.length < 8) {
      Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres.", "error");
      return false;
    }

    return true;
  }
  async function ingresarInfo() {
    if (!validarCampos()) return;

    try {
      const nuevoUsuario = {
        first_name: nombre,
        last_name: apellido,
        username: correo,
        telefono,
        direccion,
        password: contrasena,
      };

      const respuesta = await services_user.postUsuarios(nuevoUsuario);
      console.log("Usuario registrado:", respuesta);

      const infogroup = { usuario: respuesta.id, group: 2 };
      const respuesta2 = await services_usergroup.postUser_Group(infogroup);
      console.log("Usuario con rol correcto:", respuesta2);


      const pacientePayload = {
        usuario: respuesta.id,
        fecha_nacimiento: fecha_nacimiento || null,
        diagnostico: diagnostico || "",
      };

      const pacienteResp = await ServicesPacientes.postPacientes(pacientePayload);
      console.log("Paciente creado:", pacienteResp);

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/login"));

    } catch (error) {
      console.error("Error al registrar usuario:", error);
      Swal.fire("Error", error?.message || "Ocurrió un error al registrarte.", "error");
    }
  }



  return (
    <div>

      <div><NavBar /></div>

      <div className="registro-container">

        <div className="registro-message-only">
          <h2>¡Nos alegra que quieras dar este paso!</h2>
          <p>Crear tu cuenta es el primer paso hacia un espacio seguro y de apoyo emocional.</p>
        </div>

        <div className='registro-form'>
          <h1>Registro de usuarios</h1>

          <label>Nombre</label>
          <input type="text" placeholder="Ingresa tu nombre..." value={nombre} onChange={(e) => setNombre(e.target.value)} className="usuario" />

          <label>Apellido</label>
          <input type="text" placeholder="Ingresa tu apellido..." value={apellido} onChange={(e) => setApellido(e.target.value)} className="usuario" />

          <label>Correo electrónico</label>
          <input type="email" placeholder="Ingresa tu correo..." value={correo} onChange={(e) => setCorreo(e.target.value)} className="usuario" />

          <label>Teléfono</label>
          <input type="number" placeholder="Ingresa tu teléfono..." value={telefono} onChange={(e) => setTelefono(e.target.value)} className="usuario" />

          <label>Dirección</label>
          <input type="text" placeholder="Ingresa tu país y provincia..." value={direccion} onChange={(e) => setDireccion(e.target.value)} className="usuario" />

          <label>Diagnóstico (opcional)</label>
          <textarea placeholder="¿Tienes un diagnóstico?" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} className="usuario"></textarea>

          <label>Fecha de nacimiento</label>
          <input type="date" value={fecha_nacimiento} onChange={(e) => setFecha_Nacimiento(e.target.value)} className="usuario"
            max={new Date().toISOString().split("T")[0]} />

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



          <button onClick={ingresarInfo} className="boton-primario">Registrarse</button>
          <button onClick={() => navigate("/login")} className="boton-secundario">Ya tengo cuenta</button>
        </div>
      </div>

      <div><Footer /></div>

    </div>
  )
}

export default RegisterGeneral
