// src/services/ServicesMensajes.jsx
// Servicio unificado para chat (conversación + lista de chats + enviar mensaje)

const API_URL = "http://127.0.0.1:8000/api";

// ✅ Siempre usamos el mismo access token que guarda tu Login (localStorage.setItem('access', ...))
function getToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * GET conversación con otro usuario.
 * Backend: /api/mensajes/conversacion/<id>/
 */
export async function getConversacion(otroUsuarioId) {
  const token = getToken();

  const res = await fetch(`${API_URL}/mensajes/conversacion/${otroUsuarioId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.detail || "No se pudo cargar la conversación.");
  return data;
}

/**
 * POST enviar mensaje.
 * Backend: /api/mensajes/
 */
export async function postMensaje(payload) {
  const token = getToken();

  const res = await fetch(`${API_URL}/mensajes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.detail || "No se pudo enviar el mensaje.");
  return data;
}

/**
 * GET lista de chats (últimas conversaciones).
 * Backend: /api/mensajes/mis-chats/
 * ❌ Antes estabas llamando /mis_chats/ (underscore) y eso daba 404.
 */
export async function getMisChats() {
  const token = getToken();

  const res = await fetch(`${API_URL}/mensajes/mis-chats/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.detail || "No se pudo cargar la lista de chats.");
  return data;
}
