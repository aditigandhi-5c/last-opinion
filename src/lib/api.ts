export type RegisterPayload = { email: string; password: string };
export type LoginPayload = { email: string; password: string };
export type TokenResponse = { access_token: string; token_type: string };
export type PatientPayload = {
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
};

const API_BASE = "http://127.0.0.1:8000";

async function request<T>(path: string, body: unknown): Promise<T> {
  const token = (() => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? raw.replace(/^\"|\"$/g, "").trim() : null;
    } catch {
      return null;
    }
  })();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: "include",
    mode: "cors",
  });

  const text = await res.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    let msg: string = res.statusText || "Request failed";
    if (data) {
      const d = (data as any);
      if (Array.isArray(d.detail)) {
        msg = d.detail.map((e: any) => e?.msg || e?.detail || JSON.stringify(e)).join("; ");
      } else if (typeof d.detail === "string") {
        msg = d.detail;
      } else if (d.message) {
        msg = typeof d.message === "string" ? d.message : JSON.stringify(d.message);
      }
    }
    throw new Error(msg);
  }
  return data as T;
}

async function getRequest<T>(path: string): Promise<T> {
  const token = (() => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? raw.replace(/^\"|\"$/g, "").trim() : null;
    } catch {
      return null;
    }
  })();

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers,
    credentials: "include",
    mode: "cors",
  });

  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : undefined; } catch { /* ignore */ }
  if (!res.ok) {
    let msg: string = res.statusText || "Request failed";
    if (data) {
      const d = data as any;
      if (Array.isArray(d.detail)) msg = d.detail.map((e: any) => e?.msg || e?.detail || JSON.stringify(e)).join("; ");
      else if (typeof d.detail === "string") msg = d.detail;
      else if (d.message) msg = typeof d.message === "string" ? d.message : JSON.stringify(d.message);
    }
    throw new Error(msg);
  }
  return data as T;
}

export async function register(payload: RegisterPayload): Promise<{ id: number; email: string }> {
  return request("/auth/signup", payload);
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const data = await request<TokenResponse>("/auth/login", payload);
  if (data && (data as any).access_token) {
    try {
      localStorage.setItem("token", (data as any).access_token);
    } catch {
      /* ignore */
    }
  }
  return data;
}

export async function createPatient(payload: PatientPayload): Promise<{ id: number } & PatientPayload> {
  return request("/patients", payload);
}

export async function optInWhatsApp(phone: string): Promise<any> {
  const res = await fetch(`${API_BASE}/test-whatsapp-optin?phone=${encodeURIComponent(phone)}`);
  const dataText = await res.text();
  try { return dataText ? JSON.parse(dataText) : {}; } catch { return {}; }
}
// Optional: exchange Firebase ID token for backend JWT
export async function exchangeFirebaseIdToken(idToken: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/firebase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
    credentials: "include",
    mode: "cors",
  });
  const dataText = await res.text();
  let data: any = undefined;
  try { data = dataText ? JSON.parse(dataText) : undefined; } catch { /* ignore */ }
  if (!res.ok) {
    throw new Error((data && (data.detail || data.message)) || res.statusText || "Exchange failed");
  }
  if (data && data.access_token) {
    try { localStorage.setItem("token", data.access_token); } catch { /* ignore */ }
  }
  return data as TokenResponse;
}


export async function fetchMyPatient(): Promise<{
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
}> {
  return getRequest("/patients/me");
}


export async function getLatestStructuredReportByPatient(patientId: number): Promise<{
  id: number;
  status?: string;
  view_generated_url: string;
  download_generated_url: string;
  view_original_url: string;
  download_original_url: string;
}> {
  return getRequest(`/reports/latest?patient_id=${encodeURIComponent(String(patientId))}`);
}

export async function getLatestStructuredReportByCase(caseId: number): Promise<{
  id: number;
  status?: string;
  view_generated_url: string;
  download_generated_url: string;
  view_original_url: string;
  download_original_url: string;
}> {
  return getRequest(`/reports/latest?case_id=${encodeURIComponent(String(caseId))}`);
}


export async function getPresignedViewUrl(objectKey: string): Promise<{ view_url: string }> {
  return getRequest(`/storage/presign-view?key=${encodeURIComponent(objectKey)}`);
}

export async function getLatestPresignedViewUrl(patientId: number | string): Promise<{ view_url: string; key: string }> {
  return getRequest(`/storage/presign-view-latest?patient_id=${encodeURIComponent(String(patientId))}`);
}

export async function requestConsultation(preferredDatetime: string): Promise<{ success: boolean; message: string }> {
  return request("/patients/consultation-request", { preferred_datetime: preferredDatetime });
}

