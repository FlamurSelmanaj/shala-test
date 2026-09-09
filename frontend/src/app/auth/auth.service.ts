import { Injectable, computed, signal } from '@angular/core';

import { API_BASE } from '../content/api-base';

const STORAGE_KEY = 'shalaj-admin-token';

/** Session-only if `localStorage` is unavailable (private mode, etc). */
function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * JWT-based admin auth. `ContentService` reads `token()` to attach an
 * `Authorization` header to mutation requests; `authGuard` reads
 * `isAuthenticated()` to gate the admin shell.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal<string | null>(readStoredToken());
  readonly isAuthenticated = computed(() => this.token() !== null);

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }

    const body = (await response.json()) as { token: string };
    this.token.set(body.token);
    try {
      localStorage.setItem(STORAGE_KEY, body.token);
    } catch {
      // storage unavailable — stay logged in for this session only
    }
  }

  logout(): void {
    this.token.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
