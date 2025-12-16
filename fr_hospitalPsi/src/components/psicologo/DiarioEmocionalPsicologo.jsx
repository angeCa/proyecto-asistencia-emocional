import { useEffect, useState } from "react";
import DiarioService from "../../services/ServicesDiarioEmocional";
import "./Psicologo.css";

export default function DiarioEmocionalPsicologo({ pacienteId, nombrePaciente }) {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!pacienteId) return;
    cargar();
  }, [pacienteId]);

  async function cargar() {
    setLoading(true);
    setMsg("");
    try {
      const data = await DiarioService.diariosPorPaciente(pacienteId);
      setEntradas(Array.isArray(data) ? data : []);
      if (!data || data.length === 0) {
        setMsg("No hay entradas visibles para el psicólogo.");
      }
    } catch (err) {
      console.error(err);
      setMsg("No se pudieron cargar las entradas del diario.");
      setEntradas([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="diario-psico-container">
      <div className="diario-psico-head">
        <h4>Entradas visibles</h4>
        <button className="diario-psico-refresh" onClick={cargar} disabled={loading}>
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>

      <p className="diario-psico-sub">
        Paciente: <strong>{nombrePaciente || pacienteId}</strong>
      </p>

      {msg && <p className="diario-psico-msg">{msg}</p>}

      <div className="diario-psico-list">
        {entradas.map((d) => (
          <div key={d.id} className="diario-psico-item">
            <div className="diario-psico-meta">
              <span><strong>Fecha:</strong> {d.fecha}</span>
              <span><strong>Emoción:</strong> {d.emocion_principal}</span>
              <span><strong>Intensidad:</strong> {d.nivel_intensidad}/10</span>
            </div>

            <p className="diario-psico-titulo">{d.titulo}</p>
            <p className="diario-psico-desc">{d.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
