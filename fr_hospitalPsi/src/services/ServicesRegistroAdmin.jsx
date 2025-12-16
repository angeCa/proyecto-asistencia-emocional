// src/services/ServicesRegistroAdmin.js
const BASE_URL = "http://127.0.0.1:8000/api";

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function registroAdmin(payload) {
  const response = await fetch(`${BASE_URL}/registro-admin/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    console.log("❌ Backend registro-admin:", data);

    const firstKey =
      data && typeof data === "object" ? Object.keys(data)[0] : null;

    const msg =
      data?.detail ||
      (firstKey && Array.isArray(data[firstKey]) ? data[firstKey][0] : null) ||
      "Error registrando admin";

    throw new Error(msg);
  }

  return data;
}
