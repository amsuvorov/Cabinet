import { test, expect } from '@playwright/test';

const loginPath = '/api/v1/auth/jwt/create/';
const jsonHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

// positive
test('JWT create — positive', async ({ request }) => {
  const res = await request.post(loginPath, {
    headers: jsonHeaders,
    data: {
      email: 'ams93ams1+8@gmail.com',
      password: '@Ndrii93',
    },
  });

  const body = await res.json();
  console.log('Status:', res.status());
  console.log('Body:', body);

  expect(res.status()).toBe(200);
  expect(body).toHaveProperty('access');
  expect(body).toHaveProperty('refresh');
  expect(typeof body.access).toBe('string');
});

// incorrect password → 400 + message: ["Incorrect password."]
test('JWT create — incorrect password', async ({ request }) => {
  const res = await request.post(loginPath, {
    headers: jsonHeaders,
    data: {
      email: 'ams93ams1+8@gmail.com',
      password: 'wrong_password',
    },
  });

  const body = await res.json();
  console.log('Status:', res.status());
  console.log('Body:', body);

  expect(res.status()).toBe(400);
  expect(body).toHaveProperty('message');
  expect(Array.isArray(body.message)).toBeTruthy();
  expect(String(body.message[0])).toMatch(/incorrect password/i);
});

// incorrect email → 400 + message: ["The user with the entered data does not exist..."]
test('JWT create — incorrect email', async ({ request }) => {
  const res = await request.post(loginPath, {
    headers: jsonHeaders,
    data: {
      email: 'amsams1+8@gmail.com', // неіснуючий
      password: '@Ndrii93',
    },
  });

  const body = await res.json();
  console.log('Status:', res.status());
  console.log('Body:', body);

  expect(res.status()).toBe(400);
  expect(body).toHaveProperty('message');
  expect(String(body.message[0])).toMatch(/does not exist/i);
});

// empty password → 400 + password: ["Це поле не може бути порожнім."]
test('JWT create — empty password', async ({ request }) => {
  const res = await request.post(loginPath, {
    headers: jsonHeaders,
    data: {
      email: 'ams93ams1+8@gmail.com',
      password: '',
    },
  });

  const body = await res.json();
  console.log('Status:', res.status());
  console.log('Body:', body);

  expect(res.status()).toBe(400);
  expect(body).toHaveProperty('password');
  expect(Array.isArray(body.password)).toBeTruthy();
  expect(String(body.password[0])).toMatch(/blank|порожн/i);
});
