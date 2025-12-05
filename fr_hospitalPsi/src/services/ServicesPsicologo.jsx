// servicesPsicologos.js

async function getPsicologos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/psicologos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al obtener los psicólogos", error);
        throw error;
    }
}

export async function getDiariosPaciente(pacienteId) {
  const token =
    localStorage.getItem("access_psicologo") ||
    localStorage.getItem("access_token");

  const res = await fetch(
    `http://127.0.0.1:8000/api/diario/?paciente_id=${pacienteId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}


async function postPsicologo(data) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/psicologos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al registrar el psicólogo", error);
        throw error;
    }
}

async function patchPsicologo(id, data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/psicologos/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al actualizar el psicólogo", error);
        throw error;
    }
}

async function updatePsicologo(id, data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/psicologos/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al actualizar completamente el psicólogo", error);
        throw error;
    }
}

async function deletePsicologo(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/psicologos/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.status === 204;
    } catch (error) {
        console.error("Hay un error al eliminar el psicólogo", error);
        throw error;
    }
}

export default {
    getPsicologos,
    postPsicologo,
    updatePsicologo,
    patchPsicologo,
    deletePsicologo
};




