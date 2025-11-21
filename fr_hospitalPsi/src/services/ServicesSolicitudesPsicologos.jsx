// ServicesSolicitudesPsicologos.js

async function crearSolicitudPsicologo(formData) {
    const response = await fetch("http://127.0.0.1:8000/api/solicitudes/", {
        method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error("No se pudo enviar la solicitud");
    return await response.json();
}

async function getSolicitudes() {
    const response = await fetch("http://127.0.0.1:8000/api/solicitudes/");
    return await response.json();
}

async function aprobarSolicitud(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/solicitud/${id}/aprobar/`,
        { method: "POST" });
    return await response.json();
}

async function rechazarSolicitud(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/solicitud/${id}/rechazar/`,
        { method: "POST" });
    return await response.json();
}

export default {
    crearSolicitudPsicologo,
    getSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud
};
