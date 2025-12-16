// src/services/ServicesPacientes.jsx

const BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return (
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access") ||
     localStorage.getItem("token") 
  );
}

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function getPacientes() {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/pacientes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(data?.detail || "Error al obtener pacientes");
    }

    return data;
  } catch (error) {
    console.error("Hay un error al obtener los pacientes", error);
    throw error;
  }
}
export async function getDiariosPaciente() {
  const token = getToken();

  const response = await fetch(`${BASE_URL}/diario/`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data?.detail || "Error al obtener diarios");
  }

  return data;
}

async function postPacientes(data) {

  return registrarPaciente(data);
}

async function registrarPaciente(data) {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/pacientes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    const resData = await parseJsonSafe(response);

    if (!response.ok) {
      const firstKey = resData && typeof resData === "object" ? Object.keys(resData)[0] : null;
      const msg =
        resData?.detail ||
        (firstKey && Array.isArray(resData[firstKey]) ? resData[firstKey][0] : null) ||
        "Error registrando paciente";

      throw new Error(msg);
    }

    return resData;
  } catch (error) {
    console.error("Hay un error al registrar el paciente", error);
    throw error;
  }
}

async function patchPacientes(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function updatePacientes(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}
async function deletePacientes(id) {
  try {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/pacientes/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 204) return true;

    const data = await parseJsonSafe(response);
    if (!response.ok) {
      throw new Error(data?.detail || "No se pudo eliminar el paciente");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar paciente", error);
    throw error;
  }
}



export default {
  getPacientes,
  postPacientes,
  updatePacientes,
  patchPacientes,
  deletePacientes,
  registrarPaciente,
};
