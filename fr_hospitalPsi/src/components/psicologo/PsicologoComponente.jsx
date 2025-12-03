import { useEffect, useState } from "react";
import { getMisChats } from "../../services/ServicesMensajesPsicologo";
import ChatPsicologo from "../chatPP/ChatPsicologo";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";

import "./Psicologo.css";

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
      setListaChats(Array.isArray(chats) ? chats : []);
    } catch (error) {
      console.error("Error al cargar chats:", error);
    }
  };

  return (
    <div className="psicologo-container">
      <div><NavBar /></div>
      <div className="psicologo-contenido">

        <div className="lista-pacientes">
          <h2>Mis Pacientes</h2>

          {listaChats.length === 0 ? (
            <p>No tienes chats aún.</p>
          ) : (
            listaChats.map((p) => (
              <div
                key={p.id}
                className={`item-paciente ${pacienteSeleccionado === p.id ? "active" : ""
                  }`}
                onClick={() => setPacienteSeleccionado(p.id)}
              >
                {p.nombre} {p.apellido}
              </div>
            ))
          )}
        </div>

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

      </div>
      <div><Footer /></div>
    </div>
  );
}

export default PsicologoComponente;
