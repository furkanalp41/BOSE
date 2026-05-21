// Shared auth-token storage helper.
//
// Token is written to BOTH localStorage (per-origin) AND a host-scoped cookie.
// Cookies on `localhost` ignore port → every BOSE Vite app on :5173–:5177
// can read the same `bose_token`. This is the cross-port SSO mechanism.

const COOKIE_NAME = 'bose_token'
const USER_COOKIE = 'bose_user'
const TOKEN_TTL_DAYS = 3

function writeCookie(name, value, days) {
  const max = days * 24 * 60 * 60
  // No `domain` attribute → defaults to current host (`localhost`).
  // No port restriction in cookie spec, so localhost:5173..localhost:5177 share it.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${max}; SameSite=Lax`
}

function readCookie(name) {
  const prefix = `${name}=`
  const found = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix))
  return found ? decodeURIComponent(found.slice(prefix.length)) : null
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function getToken() {
  return readCookie(COOKIE_NAME) || localStorage.getItem(COOKIE_NAME)
}

export function setToken(token, user) {
  if (token) {
    localStorage.setItem(COOKIE_NAME, token)
    writeCookie(COOKIE_NAME, token, TOKEN_TTL_DAYS)
  }
  if (user) {
    const raw = JSON.stringify(user)
    localStorage.setItem(USER_COOKIE, raw)
    writeCookie(USER_COOKIE, raw, TOKEN_TTL_DAYS)
  }
}

export function getUser() {
  const raw = readCookie(USER_COOKIE) || localStorage.getItem(USER_COOKIE)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem(COOKIE_NAME)
  localStorage.removeItem(USER_COOKIE)
  clearCookie(COOKIE_NAME)
  clearCookie(USER_COOKIE)
}

// Furkan service is the auth source of truth. Cross-port login forms in
// other frontends hit this URL directly, regardless of their own baseURL.
export const FURKAN_AUTH_BASE = 'http://localhost:8080/api/v1'
