import React, { useEffect, useState } from "react";
import ServicesPsicologos from "../../services/ServicesPsicologo";
import ChatPaciente from "../chatPP/ChatPaciente";
import "./PacienteComponente.css";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import DiarioEmocionalPaciente from "./DiarioEmocionalPaciente";
import CalendarioAgendar from "../calendario/CalendarioPaciente";
import MisConsultasPaciente from "../consultas/ConsultasPacientes";

export default function PacienteComponente() {
  const [psicologos, setPsicologos] = useState([]);
  const [psicologoSeleccionadoUsuarioId, setPsicologoSeleccionadoUsuarioId] =
    useState("");
  const [psicologoSeleccionadoPerfilId, setPsicologoSeleccionadoPerfilId] =
    useState("");
  const miIdUsuario =
  parseInt(localStorage.getItem("id_usuario")) ||
  parseInt(localStorage.getItem("id_usuario_paciente"));

  const [mostrarDiario, setMostrarDiario] = useState(true);

  useEffect(() => {
    ServicesPsicologos.getPsicologos()
      .then((data) => {
        const aprobados = data.filter((p) => p.estado === "aprobado");
        setPsicologos(aprobados);
      })
      .catch((err) => console.error("Error cargando psicólogos", err));
  }, []);

  const handleSelectPsicologo = (e) => {
    const usuarioId = parseInt(e.target.value) || "";
    setPsicologoSeleccionadoUsuarioId(usuarioId);

    const ps = psicologos.find((p) => p.usuario && p.usuario.id === usuarioId);
    if (ps) {
      setPsicologoSeleccionadoPerfilId(ps.id);
    } else {
      setPsicologoSeleccionadoPerfilId("");
    }
  };

  return (
    <div className="AppContainer">
      <NavBar />

      <div className="PrincipalDiv">
        <div className="DosColumnasPaciente">
          <div className="FilaSuperiorPaciente">
            <div className="ColumnaSuperior ColumnaChatPaciente">
              <div className="ContenedorPrin">
                <h2>Enviar Consulta</h2>
                <label>Selecciona tu Psicólogo:</label>

                <select
                  className="select-psicologo-estilizado"
                  value={psicologoSeleccionadoUsuarioId}
                  onChange={handleSelectPsicologo}
                >
                  <option value="">-- Selecciona un psicólogo --</option>
                  {psicologos.map((ps) => (
                    <option key={ps.id} value={ps.usuario.id}>
                      {ps.usuario.first_name} {ps.usuario.last_name} ({ps.especialidad})
                    </option>
                  ))}
                </select>

              </div>

              <div className="ChatPacienteContainer">
                {psicologoSeleccionadoUsuarioId ? (
                  <ChatPaciente
                    otroUsuarioId={psicologoSeleccionadoUsuarioId}
                    yoId={miIdUsuario}
                  />
                ) : (
                  <p className="mensaje-info-paciente">
                    Selecciona un psicólogo para iniciar el chat.
                  </p>
                )}
              </div>
            </div>

            <div className="ColumnaSuperior ColumnaDiarioPaciente">
              <div className="ContenedorPrin DiarioPanel">
                <div className="DiarioHeader">
                  <h2>Diario emocional</h2>
                  <button
                    className="btn-ver-diario"
                    onClick={() => setMostrarDiario(!mostrarDiario)}
                  >
                    {mostrarDiario ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {mostrarDiario ? (
                  <div className="DiarioContenido">
                    <DiarioEmocionalPaciente />
                  </div>
                ) : (
                  <p className="mensaje-info-paciente">
                    Haz clic en “Mostrar” para ver tu diario emocional.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="FilaInferiorPaciente">
            <div className="ColumnaInferior">
              <div className="ColumnaDerecha">
                <div className="ContenedorPrin">
                  <h2>Agendar cita</h2>
                  <CalendarioAgendar psicologoId={psicologoSeleccionadoPerfilId} />
                </div>
              </div>
            </div>

            <div className="ColumnaInferior">
              <div className="ColumnaDerecha PanelMisConsultas">
                <div className="ContenedorPrin">
                  <h2>Mis consultas</h2>
                  <MisConsultasPaciente />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
