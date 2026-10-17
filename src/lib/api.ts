/* ------------------------------------------------------------------ */
/* Small fetch helpers for the two session types (admin + student)     */
/* ------------------------------------------------------------------ */

const ADMIN_TOKEN_KEY = 'attri_admin_token';
const STUDENT_TOKEN_KEY = 'attri_student_token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function getStudentToken(): string | null {
  try {
    return localStorage.getItem(STUDENT_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStudentToken(token: string) {
  try {
    localStorage.setItem(STUDENT_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearStudentToken() {
  try {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(path, { ...init, headers });
  } catch {
    throw new ApiError(0, 'Network error. Check your connection and try again.');
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return data as T;
}

/* ---------------------------- Admin API ---------------------------- */

export const adminApi = {
  get<T = any>(path: string) {
    return request<T>(path, {}, getAdminToken());
  },
  post<T = any>(path: string, body?: unknown) {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }, getAdminToken());
  },
  put<T = any>(path: string, body?: unknown) {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }, getAdminToken());
  },
  del<T = any>(path: string) {
    return request<T>(path, { method: 'DELETE' }, getAdminToken());
  },
};

/* --------------------------- Student API --------------------------- */

export const studentApi = {
  login<T = any>(body: { username: string; password: string }) {
    return request<T>('/api/student/login', { method: 'POST', body: JSON.stringify(body) });
  },
  session<T = any>() {
    return request<T>('/api/student/session', {}, getStudentToken());
  },
  me<T = any>() {
    return request<T>('/api/student/me', {}, getStudentToken());
  },
};
