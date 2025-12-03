import React, { useState, useEffect } from "react";
import ServicesSolicitudesPsicologos from "../../services/ServicesSolicitudesPsicologos";
import ServicesPsicologos from "../../services/ServicesPsicologo";
import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./AdminComponente.css";

export default function AdminComponente() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [psicologos, setPsicologos] = useState([]);

  const [showSolicitudes, setShowSolicitudes] = useState(false); // Toggle global
  const [showPendientes, setShowPendientes] = useState(false);
  const [showAprobados, setShowAprobados] = useState(false);
  const [showRechazados, setShowRechazados] = useState(false);

  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const rechazados = solicitudes.filter(s => s.estado === "rechazado");

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

  useEffect(() => {
    cargarSolicitudes();
    cargarPsicologos();
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
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    setPsicologos(prev => prev.filter(ps => ps.id !== id));

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

  return (
    <div className="AppContainer">
      <NavBar />

      <div className="DivGeneral">
        <div className="AdminSolicitudes">
          <h1>Administración de Psicólogos</h1>

          {/* Botón global */}
          <button
            className="btn-toggle-global"
            onClick={() => setShowSolicitudes(!showSolicitudes)}
          >
            {showSolicitudes
              ? "Ocultar solicitudes de psicólogos"
              : "¿Quieres ver las solicitudes de psicólogos?"}
          </button>

          {showSolicitudes && (
            <div className="SolicitudesContainer">

              {/* Pendientes */}
              <button className="btn-toggle" onClick={() => setShowPendientes(!showPendientes)}>
                ⏳ Pendientes ({pendientes.length})
              </button>
              {showPendientes && (
                <div className="dashboard">
                  {pendientes.length === 0 ? <p>No hay solicitudes pendientes</p> :
                    pendientes.map(s => (
                      <div className="card" key={s.id}>
                        <h3>{s.nombre} {s.apellido}</h3>
                        <p><strong>Correo:</strong> {s.correo}</p>
                        <p><strong>Teléfono:</strong> {s.telefono}</p>
                        {s.cv && <p><strong>CV:</strong> <a href={s.cv} download>Ver CV</a></p>}
                        <div className="acciones">
                          <button className="btn-approve" onClick={() => aprobarSolicitud(s.id)}>Aprobar</button>
                          <button className="btn-reject" onClick={() => rechazarSolicitud(s.id)}>Rechazar</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Aprobados */}
              <button className="btn-toggle" onClick={() => setShowAprobados(!showAprobados)}>
                ✔ Aprobados ({psicologos.length})
              </button>
              {showAprobados && (
                <div className="dashboard">
                  {psicologos.length === 0 ? <p>No hay psicólogos aprobados</p> :
                    psicologos.map(p => (
                      <div className="card" key={p.id}>
                        <h3>{p.usuario?.first_name} {p.usuario?.last_name}</h3>
                        <p><strong>Especialidad:</strong> {p.especialidad}</p>
                        <p><strong>Correo:</strong> {p.usuario?.email}</p>
                        <p><strong>Teléfono:</strong> {p.usuario?.telefono}</p>
                        {p.cv && <p><strong>CV:</strong> <a href={p.cv} download>Ver CV</a></p>}
                        <div className="acciones">
                          <button className="btn-delete" onClick={() => eliminarPsicologo(p.id)}>Eliminar usuario</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* Rechazados */}
              <button className="btn-toggle" onClick={() => setShowRechazados(!showRechazados)}>
                ❌ Rechazados ({rechazados.length})
              </button>
              {showRechazados && (
                <div className="dashboard">
                  {rechazados.length === 0 ? <p>No hay solicitudes rechazadas</p> :
                    rechazados.map(s => (
                      <div className="card" key={s.id}>
                        <h3>{s.nombre} {s.apellido}</h3>
                        <p><strong>Correo:</strong> {s.correo}</p>
                        <p><strong>Teléfono:</strong> {s.telefono}</p>
                        {s.cv && <p><strong>CV:</strong> <a href={s.cv} download>Ver CV</a></p>}
                      </div>
                    ))
                  }
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
