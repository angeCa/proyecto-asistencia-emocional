function getToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("token")
  );
}

export async function getConversacion(otroId) {
  const token = getToken();

  const response = await fetch(
    `http://127.0.0.1:8000/api/mensajes/conversacion/${otroId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    // aquí normalmente viene {detail: "..."} y eso te explotaba el map
    throw new Error(data?.detail || "No se pudo cargar la conversación.");
  }

  return data;
}

export async function postMensaje(payload) {
  const token = getToken();

  const response = await fetch("http://127.0.0.1:8000/api/mensajes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.detail || "No se pudo enviar el mensaje.");
  return data;
}


export async function getConversacion(otroUsuarioId) {
const access = localStorage.getItem("access") || localStorage.getItem("access_token")  || localStorage.getItem("token");


  const response = await fetch(
    `http://127.0.0.1:8000/api/mensajes/conversacion/${otroUsuarioId}/`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access}`,
        "Content-Type": "application/json",
      }
    }
  );

  return await response.json();
}
export async function getMisChats() {
const access = localStorage.getItem("access") || localStorage.getItem("access_token")  || localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/api/mensajes/mis_chats/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
