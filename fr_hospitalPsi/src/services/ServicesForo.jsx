// src/services/ServicesForo.jsx

function getToken() {
  // Si tú guardas el access con otro nombre, cámbialo aquí.
  const t =
    localStorage.getItem("access") ||
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_admin") ||
    localStorage.getItem("access_paciente") ||
    localStorage.getItem("token");

  return t;
}

// ---------- POSTS ----------

async function getPostsForo() {
  try {
    const token = getToken();

    const response = await fetch("http://127.0.0.1:8000/api/foro/posts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const posts = await response.json();

    if (!response.ok) {
      // Si el backend manda detail, lo mostramos
      throw new Error(posts?.detail || "Error al obtener los posts del foro.");
    }

    return posts;
  } catch (error) {
    console.error("Hay un error al obtener los posts del foro", error);
    throw error;
  }
}

async function postForo(nuevoPost) {
  try {
    const token = getToken();

    const response = await fetch("http://127.0.0.1:8000/api/foro/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoPost),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Error al crear el post.");
    }

    return data;
  } catch (error) {
    console.error("Hay un error al crear el post del foro", error);
    throw error;
  }
}

async function updatePostForo(id, data) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/posts/${id}/`,
      {
        method: "PATCH", // mejor PATCH para editar solo algunos campos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const updated = await response.json();

    if (!response.ok) {
      throw new Error(updated?.detail || "Error al actualizar el post.");
    }

    return updated;
  } catch (error) {
    console.error("Hay un error al actualizar el post del foro", error);
    throw error;
  }
}

async function deletePostForo(id) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/posts/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Normalmente DELETE responde 204 sin body
    return response.status === 204 || response.ok;
  } catch (error) {
    console.error("Hay un error al eliminar el post del foro", error);
    throw error;
  }
}

// ---------- COMENTARIOS ----------

async function getComentarios(postId) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/comentarios/?post=${postId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const comentarios = await response.json();

    if (!response.ok) {
      throw new Error(
        comentarios?.detail || "Error al obtener los comentarios."
      );
    }

    return comentarios;
  } catch (error) {
    console.error("Hay un error al obtener los comentarios del foro", error);
    throw error;
  }
}

async function postComentario(nuevoComentario) {
  try {
    const token = getToken();

    const response = await fetch(
      "http://127.0.0.1:8000/api/foro/comentarios/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoComentario),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Error al crear el comentario.");
    }

    return data;
  } catch (error) {
    console.error("Hay un error al crear el comentario del foro", error);
    throw error;
  }
}

async function updateComentario(id, data) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/comentarios/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const updated = await response.json();

    if (!response.ok) {
      throw new Error(updated?.detail || "Error al actualizar el comentario.");
    }

    return updated;
  } catch (error) {
    console.error("Hay un error al actualizar el comentario del foro", error);
    throw error;
  }
}

async function deleteComentario(id) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/comentarios/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 204 || response.ok;
  } catch (error) {
    console.error("Hay un error al eliminar el comentario del foro", error);
    throw error;
  }
}

// ---------- LIKES ----------

async function toggleLikeComentario(comentarioId) {
  try {
    const token = getToken();

    const response = await fetch(
      `http://127.0.0.1:8000/api/foro/comentarios/${comentarioId}/toggle_like/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Error al dar/quitar like.");
    }

    return data; // { liked: true/false, likes_count: n }
  } catch (error) {
    console.error("Hay un error al dar/quitar like", error);
    throw error;
  }
}

export default {
  getPostsForo,
  postForo,
  updatePostForo,
  deletePostForo,
  getComentarios,
  postComentario,
  updateComentario,
  deleteComentario,
  toggleLikeComentario,
};
