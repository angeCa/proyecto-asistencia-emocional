// src/services/ServicesRecursos.jsx

const BASE_URL = "http://127.0.0.1:8000/api/recursos/";
async function getRecursos() {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los recursos");
    }

    const recursos = await response.json();
    return recursos;
  } catch (error) {
    console.error("Hay un error al obtener los recursos", error);
    throw error;
  }
}

// GET: detalle de un recurso
async function getRecurso(id) {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el recurso");
    }

    const recurso = await response.json();
    return recurso;
  } catch (error) {
    console.error("Hay un error al obtener el recurso", error);
    throw error;
  }
}

// POST: crear recurso (solo psicólogo, requiere token)
async function postRecurso(nuevoRecurso, token) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoRecurso),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error al crear recurso:", errorData);
      throw new Error("Error al crear el recurso");
    }

    const recurso = await response.json();
    return recurso;
  } catch (error) {
    console.error("Hay un error al crear el recurso", error);
    throw error;
  }
}

async function putRecurso(id, data, token) {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el recurso");
    }

    const recursoActualizado = await response.json();
    return recursoActualizado;
  } catch (error) {
    console.error("Hay un error al actualizar el recurso", error);
    throw error;
  }
}

async function deleteRecurso(id, token) {
  try {
    const response = await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el recurso");
    }

    return response.status === 204;
  } catch (error) {
    console.error("Hay un error al eliminar el recurso", error);
    throw error;
  }
}

export default {
  getRecursos,
  getRecurso,
  postRecurso,
  putRecurso,
  deleteRecurso,
};
