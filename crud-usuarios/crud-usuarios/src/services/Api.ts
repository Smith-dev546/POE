const TOKEN_KEY = 'token';

export const Api = {
  get token(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken(t: string | null): void {
    if (t) sessionStorage.setItem(TOKEN_KEY, t);
    else sessionStorage.removeItem(TOKEN_KEY);
  },
  async request<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const res = await fetch('/api' + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        this.setToken(null);
        window.dispatchEvent(new Event('auth:expired'));
      }
      throw new Error((data as { error?: string }).error ?? 'Error de servidor');
    }
    return data as T;
  }
};

export const Auth = {
  async login(email: string, password: string): Promise<void> {
    const r = await Api.request<{ token: string }>('/auth/login', 'POST', { email, password });
    Api.setToken(r.token);
  },
  async register(email: string, password: string): Promise<void> {
    const r = await Api.request<{ token: string }>('/auth/register', 'POST', { email, password });
    Api.setToken(r.token);
  },
  logout: (): void => Api.setToken(null),
  isLoggedIn: (): boolean => !!Api.token
};
