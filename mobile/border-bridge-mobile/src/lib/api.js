import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

let onUnauthorized = null;
export function setUnauthorizedCallback(cb) {
  onUnauthorized = cb;
}

async function getToken() {
  try {
    return (await AsyncStorage.getItem('token')) || '';
  } catch {
    return '';
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      await AsyncStorage.multiRemove(['token', 'user']);
      if (onUnauthorized) onUnauthorized();
    }
    const error = new Error(data.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function loginUser(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getPersons(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/persons${qs ? `?${qs}` : ''}`);
}

export function getPersonByCaseId(caseId) {
  return apiRequest(`/persons/${caseId}`);
}

export function createPerson(payload) {
  return apiRequest('/persons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function addCaseNote(personId, content) {
  return apiRequest(`/cases/${personId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function translateText(text, sourceLang = 'Autodetect', targetLang = 'en') {
  return await apiRequest('/translate', {
    method: 'POST',
    body: JSON.stringify({ text, source: sourceLang, target: targetLang }),
  });
}
