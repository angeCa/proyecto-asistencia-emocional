import { useEffect, useState } from "react";
import { getHorariosDisponibles, postConsulta } from "../../services/ServicesConsultas";
import "./CalendarioPaciente.css";

export default function CalendarioPaciente({ psicologoId }) {
  const [fecha, setFecha] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");

  const normalizarSlots = (data) => {
    let raw = [];

    if (data && Array.isArray(data.slots)) raw = data.slots;
    else if (Array.isArray(data)) raw = data;
    else if (data && Array.isArray(data.horarios)) raw = data.horarios;
    else if (data && Array.isArray(data.horarios_disponibles)) raw = data.horarios_disponibles;
    else if (data && Array.isArray(data.results)) raw = data.results;

    return raw
      .map((s) => {
        if (typeof s === "string") {
          if (s.includes("T")) return { value: s, label: new Date(s).toLocaleString(), available: true };
          return { value: s, label: s, available: true };
        }

        if (s && typeof s === "object") {
          const dt =
            s.fecha_inicio ??
            s.inicio ??
            s.start ??
            s.start_time ??
            s.datetime ??
            s.date_time ??
            s.fecha_programada ??
            s.value;

          const t =
            s.time ??
            s.hora ??
            s.horario;

          const available = Boolean(s.available ?? s.disponible ?? s.is_available ?? true);

          if (dt) {
            const iso = String(dt);
            const label = iso.includes("T") ? new Date(iso).toLocaleString() : iso;
            return { value: iso, label, available };
          }

          if (t) {
            const timeStr = String(t);
            return { value: timeStr, label: timeStr, available };
          }

          return null;
        }

        return null;
      })
      .filter(Boolean);
  };

  const construirFechaProgramada = (f, seleccionado) => {
    const val = String(seleccionado).trim();
    if (val.includes("T")) return val;

    const horaLimpia = val;
    const horaFinal = horaLimpia.length === 8 ? horaLimpia : `${horaLimpia}:00`;
    return `${f}T${horaFinal}`;
  };


  useEffect(() => {
    if (!psicologoId || !fecha) {
      setHorarios([]);
      setHorarioSeleccionado("");
      return;
    }

    const cargarHorarios = async () => {
      try {
        setMensajeError("");
        setMensajeOk("");
        setLoadingHorarios(true);

        const data = await getHorariosDisponibles(psicologoId, fecha);
        const lista = normalizarSlots(data);
        setHorarios(lista);

        if (horarioSeleccionado && !lista.some((x) => x.time === horarioSeleccionado && x.available)) {
          setHorarioSeleccionado("");
        }
      } catch (error) {
        setHorarios([]);
        setHorarioSeleccionado("");
        setMensajeError(error?.message || "No se pudieron cargar los horarios.");
      } finally {
        setLoadingHorarios(false);
      }
    };

    cargarHorarios();
  }, [psicologoId, fecha]);

  const handleCrearConsulta = async () => {
    setMensajeError("");
    setMensajeOk("");

    if (!psicologoId) return setMensajeError("Debes seleccionar un psicólogo primero.");
    if (!fecha || !horarioSeleccionado) return setMensajeError("Selecciona fecha y horario.");
    if (!motivo.trim()) return setMensajeError("Escribe el motivo de la consulta.");

    const fechaProgramada = construirFechaProgramada(fecha, horarioSeleccionado);

    const body = {
      motivo: motivo.trim(),
      fecha_programada: fechaProgramada,
      psicologo: Number(psicologoId),
    };

    try {
      await postConsulta(body);
      setMensajeOk("Consulta creada correctamente.");
      setMotivo("");
      setHorarioSeleccionado("");
    } catch (error) {
      setMensajeError(error?.message || "Ocurrió un error al crear la consulta.");
    }
  };

  if (!psicologoId) {
    return (
      <div>
        <h2>Programar consulta</h2>
        <p>Selecciona un psicólogo para poder agendar una consulta.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="calendario-consulta">
        <h2 className="titulo-seccion">Programar consulta</h2>

        <div className="campo-form">
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>

        <div className="campo-form">
          <label>Horario disponible</label>

          {loadingHorarios ? (
            <p className="texto-secundario">Cargando horarios...</p>
          ) : horarios.length === 0 ? (
            <p className="texto-secundario">No hay horarios disponibles para esta fecha.</p>
          ) : (
            <select value={horarioSeleccionado} onChange={(e) => setHorarioSeleccionado(e.target.value)}>
              <option value="">-- Selecciona un horario --</option>
              {horarios.map((slot) => (
                <option key={slot.value} value={slot.value} disabled={!slot.available}>
                  {slot.label}
                </option>
              ))}

            </select>
          )}
        </div>

        <div className="campo-form">
          <label>Motivo de la consulta</label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} />
        </div>

        <button className="btn-crear-consulta" onClick={handleCrearConsulta}>
          Crear consulta
        </button>

        {mensajeError && <p className="mensaje-error-consulta">{mensajeError}</p>}
        {mensajeOk && <p className="mensaje-ok-consulta">{mensajeOk}</p>}
      </div>
    </div>
  );
}
