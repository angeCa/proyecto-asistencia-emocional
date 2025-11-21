import React, { use, useState } from "react";
import services_user from "../../services/servicesUsuario";
import services_usergroup from "../../services/servicesUser_groups"
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
        last_name: apellido /* crear */,
        username: correo,
        telefono,
        direccion,
        password: contrasena
      };
      //aqui envio el usuario
      const respuesta = await services_user.postUsuarios(nuevoUsuario);
      console.log("Usuario registrado:", respuesta);

      //aqui envio el rol
      const infogroup = {
        usuario : respuesta.id,
        group : 2
      }
      const respuesta2 = await services_usergroup.postUser_Group(infogroup)
      console.log("Usuario con rol correcto:", respuesta2);
      

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al registrarte. Intenta nuevamente.",
        "error"
      );
    }
  }


  return (
    <div>
      <div className='registro'>
        <h1>Registro de usuarios</h1>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" placeholder="Ingresa tu nombre..." value={nombre} onChange={(e) => setNombre(e.target.value)} className="usuario" />
                  <br />
                  <label htmlFor="apellido">Apellido</label>
                <input type="text" placeholder="Ingresa tu apellido..." value={apellido} onChange={(e) => setApellido(e.target.value)} className="usuario" />
                  <br />
                <label htmlFor="correo">Correo electrónico</label>
                <input type="email" placeholder="Ingresa tu correo..." value={correo} onChange={(e) => setCorreo(e.target.value)} className="usuario" />
                  <br />
                <label htmlFor="telefono">Telefono</label>
                <input type="number" placeholder="Ingresa tu telefono..." value={telefono} onChange={(e) => setTelefono(e.target.value)} className="usuario" />
                  <br />
                <label htmlFor="direccion">Direccion</label>
                <input type="text" placeholder="Ingresa tu país y provincia..." value={direccion} onChange={(e) => setDireccion(e.target.value)} className="usuario" />
                  <br />
                <label htmlFor="diagnostico">Diagnostico</label>
                <textarea name="diagnostico" placeholder="¿Tienes un diagnostico?" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} className="usuario" ></textarea>
                  <br />
                  <label htmlFor="fecha_nacimiento">fecha_nacimiento</label>
                <input type="date" placeholder="Ingresa tu fecha de nacimiento" value={fecha_nacimiento} onChange={(e) => setFecha_Nacimiento(e.target.value)} className="usuario" />
                  <br />
                  <label htmlFor="contrasena">Contraseña</label>
                <input type="password" placeholder="Ingresa tu contraseña..." value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="usuario" />
                  <br />
                  <br />
                <button onClick={ingresarInfo} className="boton-primario">Registrarse</button>
                <button onClick={() => navigate("/login")} className="boton-secundario">Ya tengo cuenta</button>
                
      </div>
    </div>
  )
}

export default RegisterGeneral
