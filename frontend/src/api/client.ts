import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';

const request = async (endpoint: string, options: RequestInit = {}) => {
    const token = Cookies.get('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const api = {
    get: (endpoint: string) => request(endpoint, { method: 'GET' }),
    post: (endpoint: string, body: unknown) =>
        request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    patch: (endpoint: string, body: unknown) =>
        request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    put: (endpoint: string, body: unknown) =>
        request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
};