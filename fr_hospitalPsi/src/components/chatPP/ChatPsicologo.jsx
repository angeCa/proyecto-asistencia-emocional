import { useEffect, useState, useRef } from "react";
import { getConversacionCon, postMensaje } from "../../services/ServicesMensajesPsicologo";
import "./ChatPsicologo.css";

function ChatPsicologo({ otroUsuarioId, yoId, cerrarChat }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const finalChat = useRef(null);

  useEffect(() => {
    if (otroUsuarioId) {
      cargar();
    } else {
      setMensajes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otroUsuarioId]);

  useEffect(() => {
    scrollAbajo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajes]);

  async function cargar() {
    try {
      setMensajeError("");
      const data = await getConversacionCon(otroUsuarioId);
      console.log("Mensajes Psicólogo:", data);

      setMensajes(Array.isArray(data) ? data : []);
    } catch (e) {
      setMensajes([]);
      setMensajeError(e?.message || "No se pudo cargar la conversación.");
    }
  }

  const scrollAbajo = () => {
    setTimeout(() => {
      if (finalChat.current) {
        finalChat.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const enviar = async () => {
    if (!texto.trim() || !otroUsuarioId) return;

    try {
      setMensajeError("");

      await postMensaje({
        contenido: texto.trim(),
        destinatario: otroUsuarioId,
      });

      setTexto("");
      await cargar();
    } catch (e) {
      setMensajeError(e?.message || "No se pudo enviar el mensaje.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Paciente
        <button className="cerrar-chat" onClick={cerrarChat}>
          X
        </button>
      </div>

      {mensajeError && <p className="chat-error">{mensajeError}</p>}

      <div className="chat-messages">
        {(Array.isArray(mensajes) ? mensajes : []).map((m) => {
          const esDelOtro = Number(m.remitente) === Number(otroUsuarioId);
          const esMio = !esDelOtro;

          return (
            <div
              key={m.id}
              className={esMio ? "message message-mine" : "message message-other"}
            >
              <span className="msg-name">{esMio ? "Yo" : "Paciente"}</span>
              <p>{m.contenido}</p>
            </div>
          );
        })}

        <div ref={finalChat}></div>
      </div>

      <div className="chat-input-area">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatPsicologo;
