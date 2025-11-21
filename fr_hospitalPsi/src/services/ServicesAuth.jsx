const API_URL = "http://127.0.0.1:8000/api/token/refresh/";

async function refreshToken() {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
        console.warn("No hay refresh token guardado");
        return null;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh })
        });

        if (!response.ok) {
            console.error("Error al refrescar token");
            return null;
        }

        const data = await response.json();

        // Guardar nuevo access
        localStorage.setItem("access", data.access);

        return data.access;

    } catch (error) {
        console.error("Error en refresh token:", error);
        return null;
    }
}

export default { refreshToken };
