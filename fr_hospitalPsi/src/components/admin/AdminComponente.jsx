

import React, { useState, useEffect } from "react";
import ServicesSolicitudesPsicologos from "../../services/ServicesSolicitudesPsicologos";
import ServicesPsicologos from "../../services/ServicesPsicologo";
import ServicesPacientes from "../../services/ServicesPacientes";
import ServicesUsuario from "../../services/servicesUsuario";
import ServicesRecursos from "../../services/ServicesRecursos";
import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./AdminComponente.css";

export default function AdminComponente() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [showSolicitudes, setShowSolicitudes] = useState(false);
  const [showPendientes, setShowPendientes] = useState(false);
  const [showAprobados, setShowAprobados] = useState(false);
  const [showRechazados, setShowRechazados] = useState(false);

  const [showPacientes, setShowPacientes] = useState(false);
  const [showRecursos, setShowRecursos] = useState(false);

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const rechazados = solicitudes.filter((s) => s.estado === "rechazado");

  const cargarSolicitudes = async () => {
    try {
      const data = await ServicesSolicitudesPsicologos.getSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };

  const cargarPsicologos = async () => {
    try {
      const data = await ServicesPsicologos.getPsicologos();
      setPsicologos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarPacientesYUsuarios = async () => {
    try {
      const [pacs, usrs] = await Promise.all([
        ServicesPacientes.getPacientes(),
        ServicesUsuario.getUsuarios(),
      ]);
      setPacientes(pacs);
      setUsuarios(usrs);
    } catch (error) {
      console.error("Error cargando pacientes o usuarios", error);
      Swal.fire("Error", "No se pudieron cargar los pacientes", "error");
    }
  };

  const cargarRecursos = async () => {
    try {
      const data = await ServicesRecursos.getRecursos();
      setRecursos(data);
    } catch (error) {
      console.error("Error cargando recursos", error);
      Swal.fire("Error", "No se pudieron cargar los recursos", "error");
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarPsicologos();
    cargarPacientesYUsuarios();
    cargarRecursos();
  }, []);

  const aprobarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.aprobarSolicitud(id);
      Swal.fire("Aprobado", "Solicitud aprobada correctamente", "success");
      await cargarSolicitudes();
      await cargarPsicologos();
    } catch (error) {
      Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
    }
  };

  const rechazarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.rechazarSolicitud(id);
      Swal.fire("Rechazado", "Solicitud rechazada", "info");
      await cargarSolicitudes();
    } catch (error) {
      Swal.fire("Error", "No se pudo rechazar la solicitud", "error");
    }
  };

  const eliminarPsicologo = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar psicólogo?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setPsicologos((prev) => prev.filter((ps) => ps.id !== id));

    try {
      const ok = await ServicesPsicologos.deletePsicologo(id);
      if (ok) {
        Swal.fire("Eliminado", "Psicólogo eliminado", "success");
        cargarPsicologos();
      } else {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const eliminarPaciente = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar paciente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setPacientes((prev) => prev.filter((p) => p.id !== id));

    try {
      const ok = await ServicesPacientes.deletePacientes(id);
      if (ok) {
        Swal.fire("Eliminado", "Paciente eliminado", "success");
        cargarPacientesYUsuarios();
      } else {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };
  const getUserFromPaciente = (paciente) => {
    if (!paciente) return null;

    if (typeof paciente.usuario === "object" && paciente.usuario !== null) {
      return paciente.usuario;
    }

    return usuarios.find((u) => u.id === paciente.usuario) || null;
  };

  const getUsernamePaciente = (paciente) => {
    const user = getUserFromPaciente(paciente);
    return user?.username || "Sin username";
  };

  const getNombreCompletoPaciente = (paciente) => {
    const user = getUserFromPaciente(paciente);
    const nombre = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return nombre || "Sin nombre";
  };

  const getIdUsuarioPaciente = (paciente) => {
    const user = getUserFromPaciente(paciente);
    return user?.id || "N/A";
  };



  return (
    <div className="AppContainer">
      <NavBar />

      <div className="DivGeneral">
        <div className="AdminSolicitudes">
          <h1>Panel de administración</h1>

          {/* Solicitudes de psicólogos */}
          <button
            className="btn-toggle-global"
            onClick={() => setShowSolicitudes(!showSolicitudes)}
          >
            {showSolicitudes
              ? "Ocultar solicitudes de psicólogos"
              : "Ver solicitudes de psicólogos"}
          </button>

          {showSolicitudes && (
            <div className="SolicitudesContainer">
              {/* Pendientes */}
              <button
                className="btn-toggle"
                onClick={() => setShowPendientes(!showPendientes)}
              >
                <span>⏳ Pendientes</span>
                <span>({pendientes.length})</span>
              </button>
              {showPendientes && (
                <div className="dashboard">
                  {pendientes.length === 0 ? (
                    <p>No hay solicitudes pendientes</p>
                  ) : (
                    pendientes.map((s) => (
                      <div className="card" key={s.id}>
                        <h3>
                          {s.nombre} {s.apellido}
                        </h3>
                        <p>
                          <strong>Correo:</strong> {s.correo}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {s.telefono}
                        </p>
                        {s.cv && (
                          <p>
                            <strong>CV:</strong>{" "}
                            <a href={s.cv} target="_blank" rel="noreferrer">
                              Ver CV
                            </a>
                          </p>
                        )}
                        <div className="acciones">
                          <button
                            className="btn-approve"
                            onClick={() => aprobarSolicitud(s.id)}
                          >
                            Aprobar
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => rechazarSolicitud(s.id)}
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Aprobados */}
              <button
                className="btn-toggle"
                onClick={() => setShowAprobados(!showAprobados)}
              >
                <span>✔ Psicólogos aprobados</span>
                <span>({psicologos.length})</span>
              </button>
              {showAprobados && (
                <div className="dashboard">
                  {psicologos.length === 0 ? (
                    <p>No hay psicólogos aprobados</p>
                  ) : (
                    psicologos.map((p) => (
                      <div className="card" key={p.id}>
                        <h3>
                          {p.usuario?.first_name} {p.usuario?.last_name}
                        </h3>
                        <p>
                          <strong>Especialidad:</strong> {p.especialidad}
                        </p>
                        <p>
                          <strong>Correo:</strong> {p.usuario?.email}
                        </p>
                        <div className="acciones">
                          <button
                            className="btn-delete"
                            onClick={() => eliminarPsicologo(p.id)}
                          >
                            Eliminar psicólogo
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Rechazados */}
              <button
                className="btn-toggle"
                onClick={() => setShowRechazados(!showRechazados)}
              >
                <span>❌ Rechazados</span>
                <span>({rechazados.length})</span>
              </button>
              {showRechazados && (
                <div className="dashboard">
                  {rechazados.length === 0 ? (
                    <p>No hay solicitudes rechazadas</p>
                  ) : (
                    rechazados.map((s) => (
                      <div className="card" key={s.id}>
                        <h3>
                          {s.nombre} {s.apellido}
                        </h3>
                        <p>
                          <strong>Correo:</strong> {s.correo}
                        </p>
                        <p>
                          <strong>Teléfono:</strong> {s.telefono}
                        </p>
                        {s.cv && (
                          <p>
                            <strong>CV:</strong>{" "}
                            <a href={s.cv} target="_blank" rel="noreferrer">
                              Ver CV
                            </a>
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/*  Pacientes */}
          <button
            className="btn-toggle-global"
            onClick={() => setShowPacientes(!showPacientes)}
          >
            {showPacientes
              ? "Ocultar lista de pacientes"
              : "Ver pacientes registrados"}
          </button>

          {showPacientes && (
            <div className="SolicitudesContainer">
              <button className="btn-toggle" disabled>
                <span>👥 Pacientes</span>
                <span>({pacientes.length})</span>
              </button>

              <div className="dashboard">
                {pacientes.length === 0 ? (
                  <p>No hay pacientes registrados.</p>
                ) : (
                  pacientes.map((p) => (
                    <div className="card" key={p.id}>
                      <h3>{getNombreCompletoPaciente(p)}</h3>

                      <p>
                        <strong>Username:</strong> {getUsernamePaciente(p)}
                      </p>

                      <p>
                        <strong>ID usuario:</strong> {getIdUsuarioPaciente(p)}
                      </p>

                      <p>
                        <strong>ID paciente:</strong> {p.id}
                      </p>

                      <div className="acciones">
                        <button className="btn-delete" onClick={() => eliminarPaciente(p.id)}>
                          Eliminar paciente
                        </button>
                      </div>
                    </div>

                  ))
                )}
              </div>
            </div>
          )}

          {/* Recursos */}
          <button
            className="btn-toggle-global"
            onClick={() => setShowRecursos(!showRecursos)}
          >
            {showRecursos
              ? "Ocultar recursos publicados"
              : "Ver recursos publicados"}
          </button>

          {showRecursos && (
            <div className="SolicitudesContainer">
              <button className="btn-toggle" disabled>
                <span>📚 Recursos</span>
                <span>({recursos.length})</span>
              </button>

              <div className="dashboard">
                {recursos.length === 0 ? (
                  <p>No hay recursos publicados.</p>
                ) : (
                  recursos.map((r) => (
                    <div className="card" key={r.id}>
                      <h3>{r.titulo || "Recurso sin título"}</h3>
                      {r.descripcion && (
                        <p>
                          <strong>Descripción:</strong> {r.descripcion}
                        </p>
                      )}
                      {r.tipo && (
                        <p>
                          <strong>Tipo:</strong> {r.tipo}
                        </p>
                      )}
                      {r.enlace && (
                        <p>
                          <strong>Enlace:</strong>{" "}
                          <a
                            href={r.enlace}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver recurso
                          </a>
                        </p>
                      )}
                      {r.fecha_publicacion && (
                        <p>
                          <strong>Publicado:</strong>{" "}
                          {new Date(r.fecha_publicacion).toLocaleString()}
                        </p>
                      )}
                      {r.psicologo && (
                        <p>
                          <strong>Creado por:</strong>{" "}
                          {r.psicologo.usuario
                            ? `${r.psicologo.usuario.first_name} ${r.psicologo.usuario.last_name}`
                            : `Psicólogo #${r.psicologo.id || r.psicologo}`}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
