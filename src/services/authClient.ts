import { buildApiUrl } from '../config/api';
import { getAccessToken, setAccessToken } from './tokenStore';
import {
  AuthResponse,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from '../types/api';
import { ApiError } from './ragClient';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(body || `Request failed with status ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

async function authenticate(path: string, request: LoginRequest | SignUpRequest) {
  const response = await requestJson<AuthResponse>(path, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  await setAccessToken(response.accessToken);
  return response;
}

export function login(request: LoginRequest) {
  return authenticate('/auth/login', request);
}

export function signUp(request: SignUpRequest) {
  return authenticate('/auth/signup', request);
}

export function forgotPassword(request: ForgotPasswordRequest) {
  return requestJson<{ ok?: boolean }>('/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function resetPassword(request: ResetPasswordRequest) {
  return requestJson<{ ok?: boolean }>('/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function getAuthMe() {
  return requestJson<AuthUser>('/auth/me');
}

export function getMe() {
  return requestJson<AuthUser>('/me');
}
