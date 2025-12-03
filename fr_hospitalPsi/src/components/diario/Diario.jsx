import { useEffect, useState } from "react";
import {
  getDiarios,
  postDiario,
  getDiarioById,
  updateDiario,
  deleteDiario,
} from "../../services/ServicesDiario";
import "./Diario.css";

function DiarioEmocional() {
  const [diarios, setDiarios] = useState([]);
  const [modo, setModo] = useState("lista"); // lista | crear | editar | detalle
  const [diarioActual, setDiarioActual] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    emocion_principal: "",
    nivel_intensidad: 1,
    visible_para_psicologo: false,
  });

  useEffect(() => {
    cargarDiarios();
  }, []);

  async function cargarDiarios() {
    const data = await getDiarios();
    setDiarios(data);
  }

  function abrirCrear() {
    setForm({
      titulo: "",
      descripcion: "",
      emocion_principal: "",
      nivel_intensidad: 1,
      visible_para_psicologo: false,
    });
    setModo("crear");
  }

  async function abrirEditar(id) {
    const data = await getDiarioById(id);
    setDiarioActual(data.id);
    setForm({
      titulo: data.titulo,
      descripcion: data.descripcion,
      emocion_principal: data.emocion_principal,
      nivel_intensidad: data.nivel_intensidad,
      visible_para_psicologo: data.visible_para_psicologo,
    });
    setModo("editar");
  }

  async function abrirDetalle(id) {
    const data = await getDiarioById(id);
    setDiarioActual(data);
    setModo("detalle");
  }

  async function enviarForm(e) {
    e.preventDefault();

    if (modo === "crear") {
      await postDiario(form);
    } else if (modo === "editar") {
      await updateDiario(diarioActual, form);
    }

    cargarDiarios();
    setModo("lista");
  }

  async function eliminar(id) {
    if (confirm("¿Seguro que deseas eliminar esta entrada?")) {
      await deleteDiario(id);
      cargarDiarios();
    }
  }

  // Cambiar inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  return (
    <div className="diario-container">
      {/* ---------------- LISTA ---------------- */}
      {modo === "lista" && (
        <>
          <h2>📘 Diario Emocional</h2>

          <button className="btn-crear" onClick={abrirCrear}>
            + Nueva entrada
          </button>

          <div className="diario-lista">
            {diarios.length === 0 ? (
              <p>No tienes entradas aún.</p>
            ) : (
              diarios.map((d) => (
                <div key={d.id} className="diario-card">
                  <h3>{d.titulo}</h3>
                  <p className="fecha">{d.fecha}</p>

                  <div className="card-btns">
                    <button onClick={() => abrirDetalle(d.id)}>Ver</button>
                    <button onClick={() => abrirEditar(d.id)}>Editar</button>
                    <button className="eliminar" onClick={() => eliminar(d.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ---------------- DETALLE ---------------- */}
      {modo === "detalle" && (
        <div className="detalle-card">
          <h2>{diarioActual.titulo}</h2>
          <p className="fecha">📅 {diarioActual.fecha}</p>

          <p>
            <b>Emoción principal:</b> {diarioActual.emocion_principal}
          </p>
          <p>
            <b>Intensidad:</b> {diarioActual.nivel_intensidad}/10
          </p>
          <p className="descripcion">{diarioActual.descripcion}</p>

          <button onClick={() => setModo("lista")}>Volver</button>
        </div>
      )}

      {/* ---------------- FORMULARIO ---------------- */}
      {(modo === "crear" || modo === "editar") && (
        <form className="diario-form" onSubmit={enviarForm}>
          <h2>{modo === "crear" ? "Nueva entrada" : "Editar entrada"}</h2>

          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="5"
            required
          />

          {/* Selector de emoción */}
<label>Emoción principal</label>
<div className="emoji-selector">
  {[
    { emoji: "😄", value: "Feliz" },
    { emoji: "🙂", value: "Tranquilo" },
    { emoji: "😟", value: "Preocupado" },
    { emoji: "😢", value: "Triste" },
    { emoji: "😡", value: "Enojado" },
    { emoji: "😱", value: "Ansioso" },
    { emoji: "😴", value: "Cansado" },
    { emoji: "😌", value: "Aliviado" },
  ].map((e) => (
    <div
      key={e.value}
      className={
        form.emocion_principal === e.value
          ? "emoji-item seleccionado"
          : "emoji-item"
      }
      onClick={() =>
        setForm({ ...form, emocion_principal: e.value })
      }
    >
      <span className="emoji">{e.emoji}</span>
      <p>{e.value}</p>
    </div>
  ))}
</div>


          <label>Intensidad (1–10)</label>
          <input
            type="number"
            name="nivel_intensidad"
            value={form.nivel_intensidad}
            min="1"
            max="10"
            onChange={handleChange}
            required
          />

          <label className="check">
            <input
              type="checkbox"
              name="visible_para_psicologo"
              checked={form.visible_para_psicologo}
              onChange={handleChange}
            />
            Visible para mi psicólogo
          </label>

          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button
              type="button"
              className="cancel"
              onClick={() => setModo("lista")}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default DiarioEmocional;
