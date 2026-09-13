// Centralized API Client for ASP.NET Core Web API & FastAPI AI Engine
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_HOST = API_BASE_URL.replace(/\/api\/?$/, '');
export const AI_BASE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

export const DEFAULT_CROP_PLACEHOLDER = '/crops/tomato.jpg';

export const CROP_DEFAULT_IMAGES: Record<string, string> = {
  tomato: '/crops/tomato.jpg',
  potato: '/crops/potato.jpg',
  wheat: '/crops/wheat.jpg',
  onion: '/crops/onion.jpg',
  cotton: '/crops/cotton.jpg',
  chilli: '/crops/chilli.jpg',
  chili: '/crops/chilli.jpg',
  cabbage: '/crops/cabbage.jpg',
  brinjal: '/crops/brinjal.jpg',
  eggplant: '/crops/brinjal.jpg',
  groundnut: '/crops/groundnut.jpg',
  peanut: '/crops/groundnut.jpg',
  soybean: '/crops/soybean.jpg',
  soya: '/crops/soybean.jpg',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  paddy: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
  corn: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
  ginger: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=600'
};

export function getSafeSvgFallback(cropName: string = 'Produce'): string {
  const emojiMap: Record<string, string> = {
    tomato: '🍅',
    potato: '🥔',
    wheat: '🌾',
    onion: '🧅',
    cotton: '🌱',
    chilli: '🌶️',
    chili: '🌶️',
    cabbage: '🥬',
    brinjal: '🍆',
    eggplant: '🍆',
    groundnut: '🥜',
    peanut: '🥜',
    soybean: '🫘',
    soya: '🫘',
    rice: '🌾',
    paddy: '🌾',
    maize: '🌽',
    corn: '🌽',
    garlic: '🧄',
    ginger: '🫚'
  };
  const lower = cropName.toLowerCase();
  let emoji = '🌾';
  for (const [key, icon] of Object.entries(emojiMap)) {
    if (lower.includes(key)) {
      emoji = icon;
      break;
    }
  }
  const cleanName = (cropName || 'Produce').trim();
  const displayName = cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Produce';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f4f8f0"/>
        <stop offset="100%" stop-color="#e2ebd9"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    <circle cx="200" cy="130" r="56" fill="#ffffff" fill-opacity="0.9" stroke="#538d22" stroke-width="1.5" stroke-opacity="0.2"/>
    <text x="200" y="148" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    <text x="200" y="228" font-size="18" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" fill="#143601" text-anchor="middle">${displayName}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getCropDefaultImage(cropName?: string): string {
  if (!cropName || !cropName.trim()) return DEFAULT_CROP_PLACEHOLDER;
  const lower = cropName.trim().toLowerCase();
  for (const [key, url] of Object.entries(CROP_DEFAULT_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return url;
    }
  }
  return DEFAULT_CROP_PLACEHOLDER;
}

class ApiClient {
  public getToken(): string | null {
    return localStorage.getItem('agripulse_token');
  }

  public setToken(token: string | null) {
    if (token) {
      localStorage.setItem('agripulse_token', token);
    } else {
      localStorage.removeItem('agripulse_token');
    }
  }

  public resolveImageUrl(
    imageUrl?: string | null,
    cropName?: string,
    fallback?: string
  ): string {
    const defaultForCrop = getCropDefaultImage(cropName);
    const effectiveFallback = fallback || defaultForCrop;

    if (!imageUrl || !imageUrl.trim()) {
      return effectiveFallback;
    }

    // Auto-correct stale tomato placeholder when assigned to other crops
    if (
      imageUrl.includes('photo-1592924357228-91a4daadcfea') &&
      cropName &&
      !cropName.toLowerCase().includes('tomato')
    ) {
      return defaultForCrop;
    }

    if (imageUrl.startsWith('/crops/')) {
      return imageUrl;
    }

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('data:') ||
      imageUrl.startsWith('blob:')
    ) {
      return imageUrl;
    }

    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${SERVER_HOST}${cleanPath}`;
  }

  private getHeaders(customHeaders: HeadersInit = {}, isFormData: boolean = false): HeadersInit {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return { ...headers, ...customHeaders };
  }

  public async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(headers)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.message || (json.errors && json.errors.join(', ')) || errorMsg;
      } catch {
        // use fallback text
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  }

  public async post<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.message || (json.errors && json.errors.join(', ')) || errorMsg;
      } catch {
        // use fallback text
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  }

  public async put<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.message || (json.errors && json.errors.join(', ')) || errorMsg;
      } catch {
        // use fallback text
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  }

  public async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(headers)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.message || (json.errors && json.errors.join(', ')) || errorMsg;
      } catch {
        // use fallback text
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  }

  public async uploadFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(headers, true),
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.message || (json.errors && json.errors.join(', ')) || errorMsg;
      } catch {
        // use fallback text
      }
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
  }

  public async callAi<T>(endpoint: string, body?: any, method: string = 'POST'): Promise<T> {
    const url = `${AI_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service Error ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient();
export const resolveImageUrl = (
  imageUrl?: string | null,
  cropName?: string,
  fallback?: string
): string => apiClient.resolveImageUrl(imageUrl, cropName, fallback);

