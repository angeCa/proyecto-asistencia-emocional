// servicesDiario.js

const BASE_URL = "http://127.0.0.1:8000/api/diario/";

function getToken() {
    return localStorage.getItem("access_psicologo");
    
}

async function getDiarios(pacienteId) {
    try {
        const token = getToken();

        let url = `${BASE_URL}?paciente_id=${pacienteId}`;

        console.log("📡 URL solicitada:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        const data = await response.json();
        console.log("📥 Respuesta del backend:", data);
        return data;

    } catch (error) {
        console.error("❌ Error al obtener los diarios", error);
        throw error;
    }
}




async function postDiario(data) {
    try {
        const token = getToken();

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Error al crear el diario", error);
        throw error;
    }
}

async function patchDiario(id, data) {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Error al hacer PATCH del diario", error);
        throw error;
    }
}

async function updateDiario(id, data) {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el diario", error);
        throw error;
    }
}

async function deleteDiario(id) {
    try {
        const token = getToken();

        const response = await fetch(`${BASE_URL}${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        return response.status === 204;
    } catch (error) {
        console.error("Error al eliminar el diario", error);
        throw error;
    }
}

export default {
    getDiarios,
    postDiario,
    patchDiario,
    updateDiario,
    deleteDiario
};
