import React, { useEffect, useState } from "react";
import ServicesPsicologos from "../../services/ServicesPsicologo";
import ServicesMensajes from "../../services/ServicesMensajes";


export default function PacienteComponente() {
  const [psicologos, setPsicologos] = useState([]);
  const [psicologoSeleccionado, setPsicologoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");

  //Escoger psicologo
  useEffect(() => {
    ServicesPsicologos.getPsicologos()
      .then(data => {
        // Solo mostrar aprobados
        const aprobados = data.filter(p => p.estado === "aprobado");
        setPsicologos(aprobados);
      })
      .catch(err => console.error("Error cargando psicólogos", err));
  }, []);

  //enviar mensaje


  const enviarMensaje = async () => {
    const nuevaData = {
      destinatario: psicologoSeleccionado,
      contenido: mensaje
    };

    try {
    await ServicesMensajes.postMensaje(nuevaData);
    alert("Mensaje enviado correctamente");
    setMensaje(""); // limpiar textarea
  } catch (error) {
    console.error(error);
    alert("No se pudo enviar el mensaje");
  }
};





  return (
    <div>
      <div className="seleccionarPsi">
        <div style={{ padding: "20px" }}>
          <h2>Enviar Consulta</h2>

          <label>Selecciona bien a tu Psicólogo:</label>
          <select
            value={psicologoSeleccionado}
            onChange={(e) => setPsicologoSeleccionado(e.target.value)}
          >
            <option value="">-- Aquí puedes escoger un psicologo para enviar consulta--</option>
            {psicologos.map(ps => (
              <option key={ps.id} value={ps.id}>
                {ps.usuario.first_name} {ps.usuario.last_name} {ps.especialidad}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="EnviarCon">
        <textarea
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Escriba su consulta..."
        />
        <button onClick={enviarMensaje}>Enviar mensaje</button>
      </div>


    </div>

  );
}
