const BASE_URL = "http://127.0.0.1:8000/api/diario/";

function getToken() {
  return (
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") 
  );
}

// 🔹 Obtener mis diarios (lado paciente)
async function getMisDiarios() {
  const token = getToken();

  const resp = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) throw new Error("No se pudo obtener los diarios");
  return await resp.json();
}

// 🔹 Crear entrada
async function crearDiario(payload) {
  const token = getToken();

  // 🔥 Normalizamos los campos para que el backend no se queje
  const body = {
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    emocion_principal:
      payload.emocion_principal ?? payload.emocion ?? "",
    nivel_intensidad:
      payload.nivel_intensidad ?? payload.intensidad ?? 5,
    visible_para_psicologo: !!payload.visible_para_psicologo,
  };

  const resp = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    console.log("Error al crear diario:", err);
    throw new Error("No se pudo crear el diario");
  }

  return await resp.json();
}

// 🔹 Editar entrada (PATCH)
async function actualizarDiario(id, payload) {
  const token = getToken();

  const body = {
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    emocion_principal:
      payload.emocion_principal ?? payload.emocion ?? "",
    nivel_intensidad:
      payload.nivel_intensidad ?? payload.intensidad ?? 5,
    visible_para_psicologo: !!payload.visible_para_psicologo,
  };

  const resp = await fetch(`${BASE_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    console.log("Error al actualizar diario:", err);
    throw new Error("No se pudo actualizar el diario");
  }

  return await resp.json();
}


// 🔹 Eliminar entrada
async function eliminarDiario(id) {
  const token = getToken();

  const resp = await fetch(`${BASE_URL}${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok && resp.status !== 204) {
    console.log("Error al eliminar diario:", resp.status);
    throw new Error("No se pudo eliminar el diario");
  }

  return true;
}

// 🔹 Para el psicólogo: ver diarios de un paciente
async function diariosPorPaciente(pacienteId) {
  const token = getToken();
  const resp = await fetch(`${BASE_URL}paciente/${pacienteId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) throw new Error("No se pudo obtener diarios del paciente");
  return await resp.json();
}

export default {
  getMisDiarios,
  crearDiario,
  actualizarDiario,
  eliminarDiario,
  diariosPorPaciente,
};
