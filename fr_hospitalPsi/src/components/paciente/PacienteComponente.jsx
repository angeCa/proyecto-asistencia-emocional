import React, { useEffect, useState } from "react";
import ServicesPsicologos from "../../services/ServicesPsicologo";
import ChatPaciente from "../chatPP/ChatPaciente";
import "./PacienteComponente.css"
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Diario from "../diario/Diario"

export default function PacienteComponente() {
  const [psicologos, setPsicologos] = useState([]);
  const [psicologoSeleccionado, setPsicologoSeleccionado] = useState("");

  // ID del usuario logueado
  const miId = localStorage.getItem("id_paciente");

  console.log(miId);

  //aprobar psicologo
  useEffect(() => {
    ServicesPsicologos.getPsicologos()
      .then(data => {
        const aprobados = data.filter(p => p.estado === "aprobado");
        setPsicologos(aprobados);
      })
      .catch(err => console.error("Error cargando psicólogos", err));
  }, []);

  console.log(psicologos);


  return (
    <div><div className="AppContainer">
  <NavBar />

  <div className="PrincipalDiv">
    {/* Contenedor principal de 2 columnas */}
    <div className="DosColumnas">

      {/* Columna izquierda: Psicólogo + Chat */}
      <div className="ColumnaIzquierda">
        <div className="ContenedorPrin">
          <div className="seleccionarPsi">
            <div style={{ padding: "20px" }}>
              <h2>Enviar Consulta</h2>

              <label>Selecciona tu Psicólogo:</label>
              <select
                value={psicologoSeleccionado}
                onChange={(e) => setPsicologoSeleccionado(e.target.value)}
              >
                <option value="">-- Selecciona un psicólogo --</option>
                {psicologos.map(ps => (
                  <option key={ps.usuario.id} value={ps.usuario.id}>
                    {ps.usuario.first_name} {ps.usuario.last_name} ({ps.especialidad})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {psicologoSeleccionado && (
            <div className="ChatPacienteContainer">
              <ChatPaciente
                otroUsuarioId={psicologoSeleccionado}
                yoId={miId}
              />
            </div>
          )}
        </div>
      </div>

      {/* Columna derecha: Diario emocional */}
      <div className="ColumnaDerecha">
        <Diario />
      </div>

    </div>
  </div>

  {/* Footer centrado abajo */}
  <Footer />
</div>


    </div>

  );
}
