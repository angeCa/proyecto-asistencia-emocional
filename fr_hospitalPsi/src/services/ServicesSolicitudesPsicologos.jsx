// ServicesSolicitudesPsicologos.js

const API = "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("access") || "";
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}
 
async function crearSolicitudPsicologo(formData) {
  const token = getToken();

  const response = await fetch(`${API}/solicitudes/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await safeJson(response);

  if (!response.ok) {
    const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : null;
    const msg =
      data?.detail ||
      (firstKey && Array.isArray(data[firstKey]) ? data[firstKey][0] : null) ||
      "No se pudo enviar la solicitud";
    throw new Error(msg);
  }

  return data;
}


async function getSolicitudes() {
  const token = getToken();

  const response = await fetch(`${API}/solicitudes/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.detail || "No se pudieron cargar las solicitudes");
  }

  return data;
}


async function aprobarSolicitud(id) {
  const token = getToken();

  const response = await fetch(`${API}/solicitud/${id}/aprobar/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.detail || "No se pudo aprobar la solicitud");
  }

  return data;
}

async function rechazarSolicitud(id) {
  const token = getToken();

  const response = await fetch(`${API}/solicitud/${id}/rechazar/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data?.detail || "No se pudo rechazar la solicitud");
  }

  return data;
}

export default {
  crearSolicitudPsicologo,
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};
