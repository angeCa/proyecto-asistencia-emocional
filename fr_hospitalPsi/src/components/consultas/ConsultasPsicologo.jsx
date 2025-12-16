import { useEffect, useState } from "react";
import {
  getMisConsultas,
  actualizarEstadoConsulta,
  completarConsulta,
  cancelarConsulta,
} from "../../services/ServicesConsultas";
import "./ConsultasPsicologo.css";

export default function ConsultasPsicologo() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // panel de notas
  const [showNotas, setShowNotas] = useState(false);
  const [consultaNotasId, setConsultaNotasId] = useState(null);
  const [notas, setNotas] = useState("");

  // panel para cancelar consulta
  const [showCancel, setShowCancel] = useState(false);
  const [consultaCancelarId, setConsultaCancelarId] = useState(null);
  const [razon, setRazon] = useState("");

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const data = await getMisConsultas();
      setConsultas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error obteniendo consultas del psicólogo:", error);
      setMensaje(error?.message || "Error cargando las consultas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const handleAprobar = async (id) => {
    try {
      setMensaje("");
      await actualizarEstadoConsulta(id, { estado: "confirmada", duracion: 60 });
      setMensaje("Consulta confirmada y enlace de Zoom generado.");
      await cargarConsultas();
    } catch (error) {
      console.error("Error al aprobar consulta:", error);
      setMensaje(error?.message || "No se pudo aprobar la consulta.");
    }
  };

  // función para abrir el modal de notas
  const abrirNotas = (id) => {
    setMensaje("");
    setConsultaNotasId(id);
    setNotas("");
    setShowNotas(true);
  };

  // función para guardar notas y completar la consulta
  const guardarNotasYCompletar = async () => {
    try {
      setMensaje("");
      await completarConsulta(consultaNotasId, notas);
      setShowNotas(false);
      await cargarConsultas();
      setMensaje("Consulta completada y notas guardadas.");
    } catch (e) {
      console.error("Error al completar consulta:", e);
      setMensaje(e?.message || "No se pudo completar la consulta.");
    }
  };

  // función para abrir el modal de cancelación
  const abrirCancelar = (id) => {
    setMensaje("");
    setConsultaCancelarId(id);
    setRazon("");
    setShowCancel(true);
  };

  // función para cancelar la consulta
  const confirmarCancelar = async () => {
    try {
      setMensaje("");
      await cancelarConsulta(consultaCancelarId, razon);
      setShowCancel(false);
      await cargarConsultas();
      setMensaje("Consulta cancelada correctamente.");
    } catch (e) {
      console.error("Error al cancelar consulta:", e);
      setMensaje(e?.message || "No se pudo cancelar.");
    }
  };

  if (loading) return <p>Cargando consultas...</p>;

  if (!consultas.length) {
    return (
      <div className="mis-consultas-psico">
        <h3>Mis Consultas</h3>
        <p>No tienes consultas registradas.</p>
      </div>
    );
  }

  return (
    <div className="mis-consultas-psico">
      <h3 className="titulo-seccion">Mis Consultas</h3>

      {mensaje && <p className="mensaje-info">{mensaje}</p>}

      <div className="lista-consultas-psico">
        {consultas.map((c) => {
          const puedeAprobar = c.estado === "pendiente";
          const puedeCompletar = c.estado === "confirmada";

          const pacienteLabel =
            typeof c.paciente === "object" && c.paciente !== null
              ? (
                  c.paciente.nombre ||
                  c.paciente.username ||
                  `${c.paciente.first_name || ""} ${c.paciente.last_name || ""}`.trim() ||
                  (c.paciente.id ? `Paciente #${c.paciente.id}` : "—")
                )
              : (c.paciente || "—");

          return (
            <div key={c.id} className="consulta-card-psico">
              <div className="consulta-info">
                <p>
                  <span>Paciente:</span> {pacienteLabel}
                </p>
                <p>
                  <span>Motivo:</span> {c.motivo}
                </p>

                <p>
                  <span>Fecha programada:</span>{" "}
                  {c.fecha_programada
                    ? new Date(c.fecha_programada).toLocaleString()
                    : "Sin fecha"}
                </p>

                <p>
                  <span>Estado:</span>{" "}
                  <span className={`estado-tag estado-${c.estado}`}>
                    {c.estado}
                  </span>
                </p>

                {c.estado === "cancelada" && c.razon_cancelacion && (
                  <p>
                    <span>Razón cancelación:</span> {c.razon_cancelacion}
                  </p>
                )}

                {c.estado === "completada" && c.notas_psicologo && (
                  <p>
                    <span>Notas:</span> {c.notas_psicologo}
                  </p>
                )}
              </div>

              <div className="consulta-acciones">
                {c.enlace_zoom ? (
                  <a
                    className="btn-zoom"
                    href={c.enlace_zoom}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🔗 Abrir reunión Zoom
                  </a>
                ) : (
                  <p className="no-zoom">Enlace Zoom aún no generado</p>
                )}

                {puedeAprobar && (
                  <button
                    className="btn-aprobar"
                    onClick={() => handleAprobar(c.id)}
                  >
                    ✔ Aprobar y generar Zoom
                  </button>
                )}

                {puedeCompletar && (
                  <button
                    className="btn-completar"
                    onClick={() => abrirNotas(c.id)}
                  >
                    ✅ Marcar como completada (Notas)
                  </button>
                )}

                {(c.estado === "pendiente" || c.estado === "confirmada") && (
                  <button
                    className="btn-cancelar"
                    onClick={() => abrirCancelar(c.id)}
                  >
                    ✖ Cancelar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel de notas */}
      {showNotas && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Notas del psicólogo</h3>
            <p>Escribe las notas finales de la consulta:</p>

            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={5}
              placeholder="Notas clínicas / seguimiento / recomendaciones..."
              className="textarea"
            />

            <div className="modal-actions">
              <button
                className="btn-secundario"
                onClick={() => setShowNotas(false)}
              >
                Volver
              </button>
              <button className="btn-completar" onClick={guardarNotasYCompletar}>
                Guardar y completar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel de cancelación */}
      {showCancel && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Cancelar consulta</h3>
            <p>Indica la razón de cancelación:</p>

            <textarea
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              rows={4}
              placeholder="Ej: No podré asistir por..."
              className="textarea"
            />

            <div className="modal-actions">
              <button
                className="btn-secundario"
                onClick={() => setShowCancel(false)}
              >
                Volver
              </button>
              <button className="btn-cancelar" onClick={confirmarCancelar}>
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
