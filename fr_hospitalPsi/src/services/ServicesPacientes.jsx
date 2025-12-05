

async function getPacientes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/pacientes/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al obtener los pacientes", error);
        throw error;
    }
}


export async function getDiariosPaciente() {
  const response = await fetch("http://127.0.0.1:8000/api/diarios/");
  return await response.json();
}


async function postPacientes(data) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/pacientes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al registrar el pacientes", error);
        throw error;
    }
}

async function patchPacientes(id, data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacientes/`, {
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

async function updatePacientes(id, data) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacientes/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al actualizar completamente el pacientes", error);
        throw error;
    }
}

async function deletePacientes(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/pacientes/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.status === 204;
    } catch (error) {
        console.error("Hay un error al eliminar el paciente", error);
        throw error;
    }
}

export default {
    getPacientes,
    postPacientes,
    updatePacientes,
    patchPacientes,
    deletePacientes
};




