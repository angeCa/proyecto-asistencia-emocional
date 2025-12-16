
import { useState } from "react";
import ServicesRecursos from "../../services/ServicesRecursos";

function RecursoForm() {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    url: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const token =
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!token) {
      setErr("No hay token, inicia sesión como psicólogo.");
      return;
    }

    try {
      await ServicesRecursos.postRecurso(form, token);
      setMsg("Recurso creado con éxito!");
      setForm({ titulo: "", descripcion: "", url: "" });
    } catch {
      setErr("Error al crear recurso");
    }
  }

  return (
    <div className="recurso-form-container">
      <h3>Crear Recurso</h3>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <form onSubmit={handleSubmit}>

        <label>Título</label>
        <input
          name="titulo"
          type="text"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <label>URL del recurso</label>
        <input
          type="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          required
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default RecursoForm;
