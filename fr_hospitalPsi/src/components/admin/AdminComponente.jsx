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

  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const rechazados = solicitudes.filter(s => s.estado === "rechazado");

  // Cargar datos
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

  // APROBAR
  const aprobarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.aprobarSolicitud(id);

      Swal.fire("Aprobado", "Solicitud aprobada correctamente", "success");

      await cargarSolicitudes();
      await cargarPsicologos();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
    }
  };

  // RECHAZAR
  const rechazarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.rechazarSolicitud(id);

      Swal.fire("Rechazado", "Solicitud rechazada", "info");

      await cargarSolicitudes();

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo rechazar la solicitud", "error");
    }
  };



  // ELIMINAR
const eliminarPsicologo = async (id) => {

  const confirm = await Swal.fire({
    title: "¿Eliminar psicólogo?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  // 🔴 Si NO confirma, no hacemos nada
  if (!confirm.isConfirmed) return;

  // 🟢 Ocultar en pantalla
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
    <div>
      <div className="NavBar"><NavBar /></div>

      <div className="DivGeneral">
        <div className="AdminSolicitudes">
          <h1>Solicitudes de Psicólogos</h1>

          {/* Pendientes */}
          <h2>⏳ Pendientes</h2>
          {pendientes.length === 0 ? (
            <p>No hay solicitudes pendientes</p>
          ) : (
            <div className="dashboard">
              {pendientes.map(s => (
                <div className="card" key={s.id}>
                  <h3>{s.nombre} {s.apellido}</h3>
                  <p><strong>Correo:</strong> {s.correo}</p>
                  <p><strong>Teléfono:</strong> {s.telefono}</p>

                  {s.cv && (
                    <p>
                      <strong>CV:</strong>{" "}
                      <a href={s.cv} download>Ver CV</a>
                    </p>
                  )}

                  <div className="acciones">
                    <button className="btn-approve" onClick={() => aprobarSolicitud(s.id)}>
                      Aprobar
                    </button>
                    <button className="btn-reject" onClick={() => rechazarSolicitud(s.id)}>
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aprobados */}
          <h2>✔ Aprobados</h2>
          {psicologos.length === 0 ? (
            <p>No hay psicólogos aprobados</p>
          ) : (
            <div className="dashboard">
              {psicologos.map(p => (
                <div className="card" key={p.id}>
                  <h3>{p.usuario?.first_name} {p.usuario?.last_name}</h3>
                  <p><strong>Especialidad:</strong> {p.especialidad}</p>
                  <p><strong>Correo:</strong> {p.usuario?.email}</p>
                  <p><strong>Teléfono:</strong> {p.usuario?.telefono}</p>

                  {p.cv && (
                    <p>
                      <strong>CV:</strong>{" "}
                      <a href={p.cv} download>Ver CV</a>
                    </p>
                  )}

                  <div className="acciones">
                    <button className="btn-delete" onClick={() => eliminarPsicologo(p.id)}>Eliminar usuario</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rechazados */}
          <h2>❌ Rechazados</h2>
          {rechazados.length === 0 ? (
            <p>No hay solicitudes rechazadas</p>
          ) : (
            <div className="dashboard">
              {rechazados.map(s => (
                <div className="card" key={s.id}>
                  <h3>{s.nombre} {s.apellido}</h3>
                  <p><strong>Correo:</strong> {s.correo}</p>
                  <p><strong>Teléfono:</strong> {s.telefono}</p>

                  {s.cv && (
                    <p>
                      <strong>CV:</strong>{" "}
                      <a href={s.cv} download>Ver CV</a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="Footer"><Footer /></div>
    </div>
  );
}
