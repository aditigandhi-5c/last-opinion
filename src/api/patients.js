const API_BASE = "http://127.0.0.1:8000";

export async function createPatient(patientData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(patientData),
    credentials: "include",
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
  if (!res.ok) {
    const msg = data.detail || data.message || res.statusText;
    throw new Error(msg);
  }
  return data;
}









