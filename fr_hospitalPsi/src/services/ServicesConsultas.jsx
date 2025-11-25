// servicesPsicologos.js

async function getConsultas() {
    const access = localStorage.getItem("access");

    try {
        const response = await fetch('http://127.0.0.1:8000/api/consultas/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access}`
            }
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al obtener los consultas", error);
        throw error;
    }
}

async function postConsultas(data) {
    const access = localStorage.getItem("access");

    try {
        const response = await fetch('http://127.0.0.1:8000/api/consultas/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access}`
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al registrar el consultas", error);
        throw error;
    }
}

async function patchConsultas(id, data) {
    const access = localStorage.getItem("access");

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/consultas/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access}`
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al actualizar el consultas", error);
        throw error;
    }
}

async function updateConsultas(id, data) {
    const access = localStorage.getItem("access");

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/consultas/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access}`
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Hay un error al actualizar completamente el consultas", error);
        throw error;
    }
}

async function deleteConsultas(id) {
    const access = localStorage.getItem("access");

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/consultas/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${access}`
            }
        });

        return response.status === 204;
    } catch (error) {
        console.error("Hay un error al eliminar el consultas", error);
        throw error;
    }
}

export default {
    getConsultas,
    postConsultas,
    updateConsultas,
    patchConsultas,
    deleteConsultas
};
