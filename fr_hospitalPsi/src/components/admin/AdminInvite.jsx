import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AdminComponente.css";

function AdminInvite() {
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const CODIGO_SECRETO = "SoloparaAdmin100";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigo.trim()) {
      Swal.fire("Ups", "Debes ingresar un código.", "warning");
      return;
    }

    setCargando(true);

    try {
      if (codigo.trim() === CODIGO_SECRETO) {
        await Swal.fire({
          icon: "success",
          title: "Código correcto",
          text: "Puedes continuar con el registro como administrador.",
          timer: 1700,
          showConfirmButton: false,
        });

        navigate("/registro-admin");
      } else {
        Swal.fire(
          "Código inválido",
          "El código ingresado no es válido. Si crees que es un error, consulta con el equipo administrador.",
          "error"
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="AppContainer">

      <div className="admin-invite-wrapper">
        <div className="admin-invite-card">
          <h2>Acceso a panel de administrador</h2>
          <p className="admin-invite-text">
            Esta sección está reservada para personas autorizadas.
            Si has recibido un <strong>código de invitación</strong> de parte
            del equipo de ConectaMente, ingrésalo a continuación.
          </p>

          <form onSubmit={handleSubmit} className="admin-invite-form">
            <label htmlFor="codigo-admin">Código de invitación</label>
            <input
              id="codigo-admin"
              type="password"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Escribe el código aquí..."
              disabled={cargando}
            />

            <button
              type="submit"
              className="admin-invite-btn"
              disabled={cargando}
            >
              {cargando ? "Verificando..." : "Verificar código"}
            </button>
          </form>

          <p className="admin-invite-note">
            Si no cuentas con un código de invitación, puedes usar la plataforma
            como paciente o psicólogo desde el registro general.
          </p>
        </div>
      </div>

    </div>
  );
}

export default AdminInvite;
