import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearAuthStorage,
  getDefaultRouteForRole,
  getStoredSession,
  isRoleAllowed,
  isTokenExpired,
  normalizeRole,
  saveAuthSession,
} from '../src/utils/auth.js';

function makeToken(expSecondsFromNow = 3600) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })).toString('base64url');
  return `${header}.${payload}.signature`;
}

function installBrowserStorageMock() {
  const values = new Map();
  globalThis.window = {
    dispatchEvent() {},
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type) { this.type = type; }
  };
  globalThis.localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

test('normalizes Spring and plain role names', () => {
  assert.equal(normalizeRole('ROLE_RECRUITER'), 'RECRUITER');
  assert.equal(normalizeRole('job_seeker'), 'JOB_SEEKER');
  assert.equal(normalizeRole(null), '');
});

test('returns the correct landing route for each role', () => {
  assert.equal(getDefaultRouteForRole('ADMIN'), '/admin/dashboard');
  assert.equal(getDefaultRouteForRole('RECRUITER'), '/dashboard');
  assert.equal(getDefaultRouteForRole('JOB_SEEKER'), '/dashboard');
});

test('checks role authorization without trusting casing or ROLE_ prefix', () => {
  assert.equal(isRoleAllowed('ROLE_RECRUITER', ['RECRUITER']), true);
  assert.equal(isRoleAllowed('job_seeker', ['RECRUITER']), false);
});

test('recognizes valid and expired JWTs', () => {
  assert.equal(isTokenExpired(makeToken(3600)), false);
  assert.equal(isTokenExpired(makeToken(-10)), true);
});

test('persists and restores a valid login session', () => {
  installBrowserStorageMock();
  const token = makeToken(3600);

  saveAuthSession({
    token,
    role: 'ROLE_ADMIN',
    name: 'Admin',
    userId: 42,
    email: 'admin@example.com',
    profileImageUrl: '/uploads/admin.png',
  });

  const session = getStoredSession();
  assert.equal(session.token, token);
  assert.equal(session.role, 'ADMIN');
  assert.equal(session.userEmail, 'admin@example.com');
  assert.equal(session.userId, '42');

  clearAuthStorage();
  assert.equal(getStoredSession(), null);
});
