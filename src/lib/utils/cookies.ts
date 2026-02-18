import { cookies } from 'next/headers';

export async function setCookie(name: string, value: string) {
  (await cookies()).set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Set max age to 1 hour (Firebase ID tokens expire after 1 hour)
    maxAge: 60 * 60,
  });
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}

export async function getCookie(name: string) {
  return (await cookies()).get(name)?.value;
}