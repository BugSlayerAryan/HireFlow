import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultRouteForRole, isRoleAllowed, normalizeRole } from '../src/utils/auth.js';

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
