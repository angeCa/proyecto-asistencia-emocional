import { useEffect, useState } from "react";
import { getMisConsultas, cancelarConsulta } from "../../services/ServicesConsultas";
import "./ConsultasPaciente.css";

export default function MisConsultasPaciente() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // modal cancelar
  const [showCancel, setShowCancel] = useState(false);
  const [consultaCancelarId, setConsultaCancelarId] = useState(null);
  const [razon, setRazon] = useState("");

  useEffect(() => {
    cargarConsultas();
  }, []);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const data = await getMisConsultas();
      setConsultas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error obteniendo consultas:", error);
      setMensaje(error?.message || "Error cargando consultas.");
    } finally {
      setLoading(false);
    }
  };

  const abrirCancelar = (id) => {
    setMensaje("");
    setConsultaCancelarId(id);
    setRazon("");
    setShowCancel(true);
  };

  const confirmarCancelar = async () => {
    try {
      setMensaje("");
      await cancelarConsulta(consultaCancelarId, razon);
      setShowCancel(false);
      await cargarConsultas();
      setMensaje("Consulta cancelada correctamente.");
    } catch (e) {
      console.error("Error al cancelar consulta:", e);
      setMensaje(e?.message || "No se pudo cancelar la consulta.");
    }
  };

  if (loading) return <p>Cargando consultas...</p>;

  if (!consultas.length) {
    return <p>No tienes consultas registradas.</p>;
  }

  return (
    <div className="mis-consultas-container">
      <h2 className="titulo-seccion">Mis Consultas</h2>

      {mensaje && <p className="mensaje-info">{mensaje}</p>}

      <div className="mis-consultas-lista">
        {consultas.map((c) => {
          const puedeCancelar = c.estado === "pendiente" || c.estado === "confirmada";

          return (
            <div key={c.id} className="consulta-card">
              <div className="consulta-info">
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
              </div>

              <div className="consulta-acciones">
                {c.enlace_zoom ? (
                  <a
                    href={c.enlace_zoom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-zoom"
                  >
                    🔗 Unirme por Zoom
                  </a>
                ) : (
                  <p className="sin-zoom">Enlace de Zoom aún no disponible.</p>
                )}

                {puedeCancelar && (
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

      {/* MODAL CANCELAR */}
      {showCancel && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Cancelar consulta</h3>
            <p>Indica la razón de la cancelación:</p>

            <textarea
              className="textarea"
              rows={4}
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              placeholder="Ej: No podré asistir por..."
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
