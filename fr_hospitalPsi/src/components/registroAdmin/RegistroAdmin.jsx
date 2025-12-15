import { useState } from "react";
import "./RegistroAdmin.css"

function RegistroAdmin() {
  const [form, setForm] = useState({
    codigo_admin: "",
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/registro-admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al registrar administrador.");
        return;
      }

      setOk("Administrador creado correctamente. Ya puedes iniciar sesión.");
      setForm({
        codigo_admin: "",
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
      });
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  }

  return (
    <div className="registro-admin-container">
  <h2>Registro de administrador</h2>

  {error && <p className="msg-error">{error}</p>}
  {ok && <p className="msg-ok">{ok}</p>}

  <form onSubmit={handleSubmit} className="registro-admin-form">
    <label>
      Código de administrador
      <input
        type="password"
        name="codigo_admin"
        value={form.codigo_admin}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Usuario
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Nombre
      <input
        type="text"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
      />
    </label>

    <label>
      Apellido
      <input
        type="text"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
      />
    </label>

    <label>
      Correo
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
    </label>

    <label>
      Contraseña
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />
    </label>

    <button type="submit">Crear admin</button>
  </form>
</div>

  );
}

export default RegistroAdmin;
