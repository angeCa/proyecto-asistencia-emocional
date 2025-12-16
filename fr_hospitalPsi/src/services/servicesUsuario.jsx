
async function getUsuarios() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/usuarios/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const usuarios = await response.json();
        return usuarios;
    } catch (error) {
        console.error("Hay un error al obtener los usuarios", error);
        throw error;
    }
}

async function postUsuarios(nuevoUsuario) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/usuarios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });
        const usuarios = await response.json();
        return usuarios;
    } catch (error) {
        console.error("Hay un error al crear el usuario", error);
        throw error;
    }
}

async function updateUsuarios(id, data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const updatedUsuario = await response.json();
        return updatedUsuario;
    } catch (error) {
        console.error("Hay un error al actualizar el usuario", error);
        throw error;
    }
}

async function deleteUsuarios(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status === 204;
    } catch (error) {
        console.error("Hay un error al eliminar el usuario", error);
        throw error;
    }
}

async function loginUsuario(email, password) {
  try {
    const payload = {
      username: (email || "").trim(), // puede ser correo o username
      password: password || "",
    };

    console.log("🔎 Payload login enviado:", payload);

    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ Leer JSON incluso si es error (para ver qué devuelve el backend)
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    console.log("🔎 Respuesta backend token:", response.status, data);

    if (!response.ok) {
      // SimpleJWT normalmente responde:
      // {detail: "..."} o {username: ["..."]} o {password: ["..."]}
      const firstKey =
        data && typeof data === "object" ? Object.keys(data)[0] : null;

      const msg =
        data?.detail ||
        (firstKey && Array.isArray(data[firstKey]) ? data[firstKey][0] : null) ||
        `Error al iniciar sesión (${response.status})`;

      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}






export default {
    getUsuarios,
    postUsuarios,
    updateUsuarios,
    deleteUsuarios,
    loginUsuario 
};
