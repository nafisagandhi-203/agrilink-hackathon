// Centralized API Client for ASP.NET Core Web API & FastAPI AI Engine
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AI_BASE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('agripulse_token');
  }

  public setToken(token: string | null) {
    if (token) {
      localStorage.setItem('agripulse_token', token);
    } else {
      localStorage.removeItem('agripulse_token');
    }
  }

  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  public async get<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(options?.headers),
        ...options,
      });

      if (!response.ok) {
        console.warn(`API GET ${url} returned ${response.status}`);
        return null;
      }

      const json = await response.json();
      return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
    } catch (err) {
      console.warn(`API GET ${endpoint} network error (using offline fallback):`, err);
      return null;
    }
  }

  public async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T | null> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(options?.headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok) {
        console.warn(`API POST ${url} returned ${response.status}`);
        return null;
      }

      const json = await response.json();
      return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
    } catch (err) {
      console.warn(`API POST ${endpoint} network error (using offline fallback):`, err);
      return null;
    }
  }

  public async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T | null> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(options?.headers),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        ...options,
      });

      if (!response.ok) {
        console.warn(`API PUT ${url} returned ${response.status}`);
        return null;
      }

      const json = await response.json();
      return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
    } catch (err) {
      console.warn(`API PUT ${endpoint} network error (using offline fallback):`, err);
      return null;
    }
  }

  public async delete<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(options?.headers),
        ...options,
      });

      if (!response.ok) {
        console.warn(`API DELETE ${url} returned ${response.status}`);
        return null;
      }

      const json = await response.json();
      return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
    } catch (err) {
      console.warn(`API DELETE ${endpoint} network error:`, err);
      return null;
    }
  }

  // Direct AI Microservice Invocation (Port 8000) with fallback support
  public async callAi<T>(endpoint: string, body?: any): Promise<T | null> {
    try {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${AI_BASE_URL}${cleanEndpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        console.warn(`AI Service ${url} returned ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (err) {
      console.warn(`AI Service ${endpoint} network error:`, err);
      return null;
    }
  }
}

export const apiClient = new ApiClient();
