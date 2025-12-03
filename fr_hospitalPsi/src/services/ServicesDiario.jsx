const API_URL = "http://127.0.0.1:8000/api/diario/";

// 🔐 Función central para obtener SIEMPRE el token correcto
function getToken() {
  return (
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    null
  );
}

// 🟩 Obtener todos los diarios del paciente logueado
export async function getDiarios() {
  const token = getToken();

  const response = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return await response.json();
}

// 🟦 Crear un nuevo diario emocional
export async function postDiario(data) {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// 🟨 Obtener un diario por ID
export async function getDiarioById(id) {
  const token = getToken();

  const response = await fetch(`${API_URL}${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return await response.json();
}

// 🟧 Actualizar un diario
export async function updateDiario(id, data) {
  const token = getToken();

  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

// 🟥 Eliminar un diario
export async function deleteDiario(id) {
  const token = getToken();

  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return response.status === 204;
}
