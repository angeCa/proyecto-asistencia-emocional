// ServicesMensajes.jsx
async function postMensaje(data) {
  const access = localStorage.getItem("access");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/mensajes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access}`
        
      },
      
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    throw error;
  }
}


export default {
  postMensaje
};
