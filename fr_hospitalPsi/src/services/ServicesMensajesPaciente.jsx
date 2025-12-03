export async function postMensaje(data) {
const access = localStorage.getItem("access_paciente") || localStorage.getItem("access_token")  || localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/api/mensajes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access}`
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function getConversacion(otroUsuarioId) {
const access = localStorage.getItem("access_paciente") || localStorage.getItem("access_token")  || localStorage.getItem("token");


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
const access = localStorage.getItem("access_paciente") || localStorage.getItem("access_token")  || localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:8000/api/mensajes/mis_chats/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${access}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
