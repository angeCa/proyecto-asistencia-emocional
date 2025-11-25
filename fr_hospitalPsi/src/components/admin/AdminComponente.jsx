import React, { useState, useEffect } from "react";
import ServicesSolicitudesPsicologos from "../../services/ServicesSolicitudesPsicologos";
import ServicesPsicologos from "../../services/ServicesPsicologo";

import Swal from "sweetalert2";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import "./AdminComponente.css"; // Opcional, para estilos tipo dashboard
import descargar from './Prueba'

export default function AdminComponente() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [psicologos, setPsicologos] = useState([]);


  const pendientes = solicitudes.filter(s => s.estado === "pendiente");
  const aprobados = solicitudes.filter(s => s.estado === "aprobado");
  const rechazados = solicitudes.filter(s => s.estado === "rechazado");


  // Cargar solicitudes al iniciar
  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const data = await ServicesSolicitudesPsicologos.getSolicitudes();
        console.log(data)
        setSolicitudes(data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
      }
    };
    cargarSolicitudes();

    const cargarPsicologos = async () => {
      try {
        const data = await ServicesPsicologos.getPsicologos();
        setPsicologos(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargarPsicologos();


  }, []);

  // Aprobar 
const aprobarSolicitud = async (id) => {
  try {
    await ServicesSolicitudesPsicologos.aprobarSolicitud(id);

    Swal.fire("Aprobado", "Solicitud aprobada correctamente", "success");

    // 1. Eliminamos de pendientes
    setSolicitudes(prev => prev.filter(s => s.id !== id));

    // 2. RECARGAMOS PSICÓLOGOS DESDE LA API
    const data = await ServicesPsicologos.getPsicologos();
    setPsicologos(data);

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
  }
};


  // Rechazar 
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

  //Editar 
  const editarPsicologo = (id) => {
    Swal.fire("Editar", `Editar psicólogo ${id}`, "info");
  };
  //eliminar
  const eliminarPsicologo = (id) => {
    Swal.fire("Eliminar", `Psicólogo ${id} eliminado`, "warning");
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
                    <button className="btn-edit" onClick={() => editarPsicologo(p.id)}>Editar</button>
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
                      <a
                        href={`${s.cv}${s.cv_name ? '.' + s.cv_name.split('.').pop() : ''}`}
                        download={s.cv_name || "cv.pdf"}
                      >
                        Ver CV
                      </a>
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
