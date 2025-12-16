const API_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return (
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access") ||
     localStorage.getItem("token") 
  );
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function extractErrorMessage(data) {
  return (
    data?.error ||
    data?.detail ||
    data?.enlace_zoom ||
    data?.fecha_programada ||
    data?.non_field_errors?.[0] ||
    (typeof data === "string" ? data : null) ||
    JSON.stringify(data)
  );
}


export async function getMisConsultas() {
  const token = getToken();

  const response = await fetch(`${API_URL}/consultas/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return Array.isArray(data) ? data : [];
}


export async function actualizarEstadoConsulta(id, payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/consultas/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(response);

  console.log("Respuesta backend al actualizar consulta:", data);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

export async function cancelarConsulta(id, razon_cancelacion) {
  const token = getToken();

  const payload = {
    estado: "cancelada",
    razon_cancelacion: razon_cancelacion || "",
  };

  const response = await fetch(`${API_URL}/consultas/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(response);

  console.log("Respuesta backend al cancelar consulta:", data);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}


export async function completarConsulta(id, notas_psicologo) {
  const token = getToken();

  const payload = {
    estado: "completada",
    notas_psicologo: notas_psicologo || "",
  };

  const response = await fetch(`${API_URL}/consultas/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(response);

  console.log("Respuesta backend al completar consulta:", data);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

export async function getHorariosDisponibles(psicologoId, fecha) {
  const token = getToken();

  const params = new URLSearchParams();
  if (fecha) params.append("fecha", fecha);

  const url = `${API_URL}/psicologos/${psicologoId}/horarios-disponibles/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data?.results ?? data;
}





export async function postConsulta(payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/consultas/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(response);

  console.log("Respuesta backend al crear consulta:", data);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}
