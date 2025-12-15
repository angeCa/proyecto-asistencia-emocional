import { useEffect, useState } from "react";
import DiarioService from "../../services/ServicesDiarioEmocional";
import "./PacienteComponente.css";

function DiarioEmocionalPaciente() {
  const [diarios, setDiarios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [diarioEditandoId, setDiarioEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    emocion_principal: "",
    nivel_intensidad: 5,
    visible_para_psicologo: false,
  });

  const [msgOk, setMsgOk] = useState("");
  const [msgError, setMsgError] = useState("");

  // 🔹 Cargar diarios al entrar
  useEffect(() => {
    cargarDiarios();
  }, []);

  async function cargarDiarios() {
    try {
      const data = await DiarioService.getMisDiarios();
      setDiarios(data);
    } catch (error) {
      console.error(error);
      setMsgError("No se pudieron cargar tus entradas.");
    }
  }

  // 🔹 Manejar cambios en el form
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm({
      titulo: "",
      descripcion: "",
      emocion_principal: "",
      nivel_intensidad: 5,
      visible_para_psicologo: false,
    });
    setModoEdicion(false);
    setDiarioEditandoId(null);
    setMsgError("");
    setMsgOk("");
  }

  // 🔹 Crear / editar
  async function handleSubmit(e) {
    e.preventDefault();
    setMsgError("");
    setMsgOk("");

    // 🚨 IMPORTANTE: usar los mismos nombres que el backend espera
    const payload = {
  titulo: form.titulo,
  descripcion: form.descripcion,
  emocion_principal: form.emocion_principal,
  nivel_intensidad: form.nivel_intensidad,
  visible_para_psicologo: form.visible_para_psicologo,
};


    try {
      if (modoEdicion && diarioEditandoId) {
        const actualizado = await DiarioService.actualizarDiario(
          diarioEditandoId,
          payload
        );
        setDiarios((prev) =>
          prev.map((d) => (d.id === diarioEditandoId ? actualizado : d))
        );
        setMsgOk("Entrada actualizada correctamente.");
      } else {
        const creado = await DiarioService.crearDiario(payload);
        setDiarios((prev) => [creado, ...prev]);
        setMsgOk("Entrada creada correctamente.");
      }

      resetForm();
      cargarDiarios();
    } catch (error) {
      console.error(error);
      setMsgError("Ocurrió un error al guardar la entrada.");
    }
  }

  // 🔹 Cargar datos al form para editar
  function handleEditar(d) {
    setModoEdicion(true);
    setDiarioEditandoId(d.id);
    setForm({
      titulo: d.titulo || "",
      descripcion: d.descripcion || "",
      emocion_principal: d.emocion_principal || "",
      nivel_intensidad: d.nivel_intensidad || 5,
      visible_para_psicologo: d.visible_para_psicologo ?? false,
    });
    setMsgError("");
    setMsgOk("");
  }

  // 🔹 Eliminar entrada
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta entrada?")) return;

    try {
      await DiarioService.eliminarDiario(id);
      setDiarios((prev) => prev.filter((d) => d.id !== id));
      setMsgOk("Entrada eliminada correctamente.");
    } catch (error) {
      console.error(error);
      setMsgError("No se pudo eliminar la entrada.");
    }
  }

  return (
    <div className="diario-container">
      {/* FORMULARIO */}
      <div className="diario-form-card">
        <h2>{modoEdicion ? "Editar entrada" : "Nueva entrada"}</h2>

        {msgOk && <p className="diario-msg ok">{msgOk}</p>}
        {msgError && <p className="diario-msg error">{msgError}</p>}

        <form className="diario-form" onSubmit={handleSubmit}>
          <div className="diario-field">
            <label>Emoción principal</label>
            <input
              type="text"
              name="emocion_principal"
              placeholder="Ansiedad, tristeza, estrés..."
              value={form.emocion_principal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="diario-field">
            <label>Intensidad (1 a 10)</label>
            <input
              type="number"
              name="nivel_intensidad"
              min="1"
              max="10"
              value={form.nivel_intensidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="diario-field">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              placeholder="¿Qué pasó hoy?"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="diario-field">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Describe lo que sientes o lo que ocurrió..."
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="diario-checkbox">
            <label>
              <input
                type="checkbox"
                name="visible_para_psicologo"
                checked={form.visible_para_psicologo}
                onChange={handleChange}
              />{" "}
              Permitir que mi psicólogo vea esta entrada
            </label>
          </div>

          <button type="submit" className="diario-btn-guardar">
            {modoEdicion ? "Guardar cambios" : "Guardar entrada"}
          </button>

          {modoEdicion && (
            <button
              type="button"
              className="diario-btn-editar"
              onClick={resetForm}
            >
              Cancelar edición
            </button>
          )}
        </form>
      </div>

      {/* LISTA DE ENTRADAS */}
      <div className="diario-lista-card">
        <h3>Mis entradas</h3>

        <div className="diario-lista">
          {diarios.length === 0 ? (
            <p className="diario-empty">
              Aún no tienes entradas. Empieza escribiendo cómo te sientes hoy.
            </p>
          ) : (
            diarios.map((d) => (
              <div key={d.id} className="diario-item">
                <div className="diario-item-header">
                  <span className="diario-fecha">{d.fecha}</span>
                  <span className="diario-emocion">
                    {d.emocion_principal}
                  </span>
                  <span className="diario-intensidad">
                    Intensidad: {d.nivel_intensidad}
                  </span>
                </div>

                <p className="diario-titulo">{d.titulo}</p>
                <p className="diario-descripcion">{d.descripcion}</p>

                <p className="diario-visibilidad">
                  {d.visible_para_psicologo
                    ? "Visible para tu psicólogo"
                    : "Solo tú puedes ver esta entrada"}
                </p>

                <div className="diario-actions">
                  <button
                    type="button"
                    className="diario-btn-editar"
                    onClick={() => handleEditar(d)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="diario-btn-eliminar"
                    onClick={() => handleEliminar(d.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DiarioEmocionalPaciente;
