import React, { useState, useEffect } from "react";
import ServicesSolicitudesPsicologos from "../../services/ServicesSolicitudesPsicologos";
import Swal from "sweetalert2";
import "./AdminComponente.css"; // Opcional, para estilos tipo dashboard

export default function AdminComponente() {
  const [solicitudes, setSolicitudes] = useState([]);

  // Cargar solicitudes al iniciar
  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const data = await ServicesSolicitudesPsicologos.getSolicitudes();
        console.log(data)
        setSolicitudes(data.filter(s => s.estado === "pendiente"));
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
      }
    };
    cargarSolicitudes();
  }, []);

  // Aprobar solicitud
  const aprobarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.aprobarSolicitud(id);
      Swal.fire("Aprobado", "Solicitud aprobada correctamente", "success");
      setSolicitudes(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (id) => {
    try {
      await ServicesSolicitudesPsicologos.rechazarSolicitud(id);
      Swal.fire("Rechazado", "Solicitud rechazada", "info");
      setSolicitudes(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo rechazar la solicitud", "error");
    }
  };

  return (
    <div className="AdminSolicitudes">
      <h1>Solicitudes de Psicólogos</h1>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes</p>
      ) : (
        <div className="dashboard">
          {solicitudes.map(s => (
            <div className="card" key={s.id}>
              <h3>{s.nombre} {s.apellido}</h3>
              <p><strong>Especialidad:</strong> {s.especialidad}</p>
              <p><strong>Correo:</strong> {s.correo}</p>
              <p><strong>Teléfono:</strong> {s.telefono}</p>
              {s.cv && (
                <p>
                  <strong>CV:</strong>{" "}
                  <a href={s.cv} target="_blank" download="CV.pdf">Ver CV</a>
                  {/* <a href={s.cv + '?response-content-disposition=attachment'} target="_blank" rel="noopener noreferrer">Descargar CV</a> */}
                </p>
              )}
              <div className="acciones">
                <button className="btn-approve" onClick={() => aprobarSolicitud(s.id)}>Aprobar</button>
                <button className="btn-reject" onClick={() => rechazarSolicitud(s.id)}>Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
