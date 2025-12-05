import { useEffect, useState } from "react";
import { getMisChats } from "../../services/ServicesMensajesPsicologo";
import ChatPsicologo from "../chatPP/ChatPsicologo";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import ServicesUsuario from "../../services/ServicesUsuario";
import "./Psicologo.css";
import DiariosPaciente from "../diariospacientes/DiariosPaciente";



function PsicologoComponente() {
  const [listaChats, setListaChats] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const miId = parseInt(localStorage.getItem("id_psicologo"));

  useEffect(() => {
    cargarChats();
  }, []);

  const cargarChats = async () => {
    try {
      const chats = await getMisChats();
      console.log("🔥 CHATS RECIBIDOS:", chats);
      setListaChats(Array.isArray(chats) ? chats : []);
    } catch (error) {
      console.error("Error al cargar chats:", error);
    }
  };
  const cargarPacientes = async function () {
    try {
      const pacientes = await getUsuarios();

    } catch (error) {

    }

  }

  return (
    <div className="psicologo-container">
      <NavBar />

      <div className="psicologo-contenido">

        {/* 🔵 LISTA DE PACIENTES ARRIBA */}
        <div className="lista-pacientes">
          <h2>Mis Pacientes</h2>

          {listaChats.length === 0 ? (
            <p>No tienes chats aún.</p>
          ) : (
            listaChats.map((p) => (
              <div
                key={p.id}
                className={`item-paciente ${pacienteSeleccionado === p.id ? "active" : ""}`}
                onClick={() => {
                  console.log("📌 PACIENTE SELECCIONADO:", p);
                  setPacienteSeleccionado(p.id);
                }}
              >
                {p.nombre} {p.apellido}
              </div>
            ))
          )}
        </div>

        {/* 🔵 ABAJO: CHAT IZQUIERDA + DIARIOS DERECHA */}
        <div className="zona-inferior">

          {/* Chat del psicólogo */}
          <div className="zona-chat">
            {pacienteSeleccionado ? (
              <ChatPsicologo
                otroUsuarioId={pacienteSeleccionado}
                yoId={miId}
              />
            ) : (
              <p className="mensaje-info">Selecciona un paciente para abrir el chat</p>
            )}
          </div>

          <div className="zona-diarios">
            {pacienteSeleccionado ? (
              <DiariosPaciente pacienteId={pacienteSeleccionado} />
            ) : (
              <p className="mensaje-info">Selecciona un paciente para ver sus diarios</p>
            )}
          </div>


        </div>
      </div>

      <Footer />
    </div>
  );

}

export default PsicologoComponente;
