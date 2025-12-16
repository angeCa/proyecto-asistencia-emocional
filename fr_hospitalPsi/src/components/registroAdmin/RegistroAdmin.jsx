import { useState } from "react";
import "./RegistroAdmin.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { registroAdmin } from "../../services/ServicesRegistroAdmin";

function RegistroAdmin() {
  const [form, setForm] = useState({
    codigo_admin: "",
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log("📤 Payload registro-admin:", form);

      await registroAdmin(form);

      Swal.fire("Éxito", "Administrador creado correctamente.", "success")
        .then(() => navigate("/login"));
    } catch (err) {
      Swal.fire("Error", err?.message || "No se pudo registrar el admin.", "error");
    }
  }

  return (
    <div className="registro-admin-container">
      <h2>Registro de administrador</h2>

      <form onSubmit={handleSubmit} className="registro-admin-form">
        <label>
          Código de administrador
          <input type="password" name="codigo_admin" value={form.codigo_admin} onChange={handleChange} required />
        </label>

        <label>
          Usuario
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>

        <label>
          Nombre
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} />
        </label>

        <label>
          Apellido
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} />
        </label>

        <label>
          Correo
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Contraseña
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        <button type="submit">Crear admin</button>
      </form>
    </div>
  );
}

export default RegistroAdmin;
