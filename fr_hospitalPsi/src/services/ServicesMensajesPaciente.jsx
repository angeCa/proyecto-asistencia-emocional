const API = "http://127.0.0.1:8000/api";

function getToken() {
  return (
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getConversacion(otroUsuarioId) {
  const token = getToken();

  const resp = await fetch(`${API}/mensajes/conversacion/${otroUsuarioId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await safeJson(resp);

  if (!resp.ok) {
    throw new Error(data?.detail || "No autorizado o error al cargar la conversación.");
  }

  return data;
}

export async function postMensaje(payload) {
  const token = getToken();

  const resp = await fetch(`${API}/mensajes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(resp);

  if (!resp.ok) {
    throw new Error(data?.detail || "No se pudo enviar el mensaje.");
  }

  return data;
}
