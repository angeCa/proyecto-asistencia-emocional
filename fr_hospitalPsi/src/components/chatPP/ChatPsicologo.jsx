import { useEffect, useState, useRef } from "react";
import { getConversacion, postMensaje } from "../../services/ServicesMensajesPsicologo";
import "./ChatPsicologo.css";

function ChatPsicologo({ otroUsuarioId, yoId }) {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const finalChat = useRef(null);

  useEffect(() => {
    if (otroUsuarioId) cargar();
  }, [otroUsuarioId]);

  const cargar = async () => {
    const data = await getConversacion(otroUsuarioId);
    setMensajes(data);
    scrollAbajo();
  };

  const scrollAbajo = () => {
    setTimeout(() => {
      if (finalChat.current) {
        finalChat.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const enviar = async () => {
    if (!texto.trim()) return;

    await postMensaje({
      contenido: texto,
      remitente: yoId,
      destinatario: otroUsuarioId,
    });

    setTexto("");
    cargar();
  };

  return (
    <div className="chat-container">
  <div className="chat-header">Paciente</div>

  <div className="chat-messages">
    {mensajes.map((m) => (
      <div
        key={m.id}
        className={
          m.remitente === yoId
            ? "message message-mine"
            : "message message-other"
        }
      >
        <p>{m.contenido}</p>
      </div>
    ))}

    <div ref={finalChat}></div>
  </div>

  <div className="chat-input-area">
    <input
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
      placeholder="Responder al paciente"
    />
    <button onClick={enviar}>Enviar</button>
  </div>
</div>

  );
}

export default ChatPsicologo;
