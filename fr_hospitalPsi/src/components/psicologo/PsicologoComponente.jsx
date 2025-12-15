import { useEffect, useState } from "react";
import ChatPsicologo from "../chatPP/ChatPsicologo";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import ServicesPacientes from "../../services/ServicesPacientes";
import ServicesUsuario from "../../services/servicesUsuario";
import MisConsultasPsicologo from "../consultas/ConsultasPsicologo";
import RecursoForm from "./RecursosForm";
import DiarioEmocionalPsicologo from "./DiarioEmocionalPsicologo";
import "./Psicologo.css";

function PsicologoComponente() {
  const [pacientes, setPacientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarRecurso, setMostrarRecurso] = useState(false);
  const [mostrarCitas, setMostrarCitas] = useState(false);
  const [mostrarDiario, setMostrarDiario] = useState(false);

  const miId = parseInt(localStorage.getItem("id_usuario"));


  useEffect(() => {
    cargarPacientesYUsuarios();
  }, []);

  const cargarPacientesYUsuarios = async () => {
    try {
      const pacientesData = await ServicesPacientes.getPacientes();
      const usuariosData = await ServicesUsuario.getUsuarios();
      setPacientes(pacientesData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error cargando pacientes o usuarios", error);
    }
  };

  const getNombreCompleto = (paciente) => {
    if (!paciente) return "";
    const usuario = usuarios.find((u) => u.id === paciente.usuario);
    return usuario ? `${usuario.first_name} ${usuario.last_name}` : "Sin nombre";
  };

  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setMostrarLista(false);
  };

  const cerrarChat = () => {
    setPacienteSeleccionado(null);
    setMostrarDiario(false);
  };

  return (
    <div className="conteneGeneral">
      <NavBar />

      <div className="psicologo-container">
        <div className="psicologo-panel">
          <h2>Panel de Psicólogo</h2>

          <div className="psicologo-actions">
            <button
              className="btn-ver-pacientes"
              onClick={() => setMostrarLista(!mostrarLista)}
            >
              {mostrarLista ? "Ocultar pacientes" : "Ver pacientes"}
            </button>

            <button
              className={`btn-accion-panel ${mostrarDiario ? "btn-accion-activo" : ""
                }`}
              onClick={() => setMostrarDiario(!mostrarDiario)}
              disabled={!pacienteSeleccionado}
            >
              {pacienteSeleccionado
                ? "Ver diario emocional"
                : "Selecciona un paciente"}
            </button>

            <button
              className={`btn-accion-panel ${mostrarRecurso ? "btn-accion-activo" : ""
                }`}
              onClick={() => setMostrarRecurso(!mostrarRecurso)}
            >
              ¿Quieres crear un recurso?
            </button>

            <button
              className={`btn-accion-panel ${mostrarCitas ? "btn-accion-activo" : ""
                }`}
              onClick={() => setMostrarCitas(!mostrarCitas)}
            >
              Ver citas
            </button>
          </div>

          {mostrarLista && (
            <div className="lista-pacientes">
              {pacientes.length === 0 ? (
                <p>No hay pacientes disponibles.</p>
              ) : (
                pacientes.map((p) => (
                  <div
                    key={p.id}
                    className={`item-paciente ${pacienteSeleccionado?.id === p.id ? "active" : ""
                      }`}
                    onClick={() => seleccionarPaciente(p)}
                  >
                    {getNombreCompleto(p)}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="zona-inferior">
            <div className="zona-chat">
              {pacienteSeleccionado ? (
                <>
                  <button className="btn-cerrar-chat" onClick={cerrarChat}>
                    Cerrar Chat
                  </button>

                  <ChatPsicologo
                    otroUsuarioId={pacienteSeleccionado.usuario}
                    yoId={miId}
                    cerrarChat={cerrarChat}
                  />
                </>
              ) : (
                <p className="mensaje-info">
                  Selecciona un paciente para abrir el chat
                </p>
              )}
            </div>

            <div className="zona-lateral">
              {mostrarCitas && (
                <div className="zona-consultas-psico">
                  <h3 className="titulo-bloque-lateral">Citas</h3>
                  <MisConsultasPsicologo />
                </div>
              )}

              {mostrarRecurso && (
                <div className="panel-de-psicologia">
                  <RecursoForm />
                </div>
              )}

              {mostrarDiario && pacienteSeleccionado && (
                <div className="diario-psico-panel">
                  <h3 className="titulo-bloque-lateral">
                    Diario emocional de {getNombreCompleto(pacienteSeleccionado)}
                  </h3>
                  <DiarioEmocionalPsicologo
                    pacienteId={pacienteSeleccionado.id}
                    nombrePaciente={getNombreCompleto(pacienteSeleccionado)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PsicologoComponente;
