import React, { useState } from "react";
import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
//import './Registropsicologia.css'
import Footer from "../footer/Footer";
import './Registropsicologia.css'
import ServicesSolicitudesPsicologos from "../../services/ServicesSolicitudesPsicologos";

function RegistroPsicologo() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [titulo, setTitulo] = useState("");
  const [cv, setCv] = useState(null);

  const validarCampos = () => {
    if (!nombre || !apellido || !correo || !telefono || !especialidad || !titulo) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("correo", correo);
    formData.append("telefono", telefono);
    formData.append("direccion", direccion);
    formData.append("especialidad", especialidad);
    formData.append("titulo", titulo);
    if (cv) formData.append("cv", cv);

    try {
      await ServicesSolicitudesPsicologos.crearSolicitudPsicologo(formData);

      Swal.fire("Enviado", "Tu solicitud fue enviada al administrador", "success");

      setNombre("");
      setApellido(""); setCorreo("");
      setTelefono(""); setDireccion(""); setEspecialidad("");
      setTitulo(""); setCv(null);
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      Swal.fire("Error", "Ocurrió un error al enviar la solicitud", "error");
    }
  };

   return (
    <div>
      <NavBar />

      {/* Fondo con imagen importada */}
      <div 
        className="registro-psicologo-container"
        //style={{ backgroundImage: `url(${fondo})` }}
      >
        <div className="registro-psicologo">
          <h1>Registro de Psicólogo</h1>
          <form onSubmit={handleSubmit}>

            <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
            <input placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} />
            <input placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} />
            <input placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
            <input placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
            <input placeholder="Especialidad" value={especialidad} onChange={e => setEspecialidad(e.target.value)} />
            <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
            <input type="file" accept=".pdf" onChange={e => setCv(e.target.files[0])} />

            <button type="submit">Enviar solicitud</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );

}

export default RegistroPsicologo;
