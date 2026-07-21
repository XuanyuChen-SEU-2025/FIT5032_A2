import {
  clearSession,
  readSession,
  readUsers,
  writeSession,
  writeUsers,
} from './storageService'
import {
  isStrongPassword,
  isValidEmail,
  normalizeEmail,
  sanitizePlainText,
  validateRole,
} from './securityService'

function notifyAuthChanged() {
  window.dispatchEvent(new CustomEvent('auth-changed'))
}

function bytesToHex(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomHex(bytes = 16) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return bytesToHex(buffer)
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return bytesToHex(digest)
}

export async function hashPassword(password, salt) {
  return sha256(`${password}:${salt}`)
}

export function validateRegisterForm(form) {
  const errors = {}
  const name = sanitizePlainText(form.name, 80)
  const email = normalizeEmail(form.email)

  if (!name) errors.name = 'Name is required.'
  if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.'
  if (!email) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  else if (readUsers().some((user) => user.email === email)) errors.email = 'This email is already registered.'
  if (!form.password) errors.password = 'Password is required.'
  else if (!isStrongPassword(form.password)) {
    errors.password = 'Password must be at least 8 characters and include uppercase, lowercase and a number.'
  }
  if (!form.confirmPassword) errors.confirmPassword = 'Confirm password is required.'
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.'

  return errors
}

export async function register(form) {
  const errors = validateRegisterForm(form)
  if (Object.keys(errors).length) {
    return { ok: false, errors }
  }

  const salt = randomHex()
  const user = {
    id: crypto.randomUUID(),
    name: sanitizePlainText(form.name, 80),
    email: normalizeEmail(form.email),
    passwordSalt: salt,
    passwordHash: await hashPassword(form.password, salt),
    role: 'user',
    createdAt: new Date().toISOString(),
  }

  writeUsers([...readUsers(), user])
  return { ok: true, user }
}

export function validateLoginForm(form) {
  const errors = {}
  const email = normalizeEmail(form.email)
  if (!email) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!form.password) errors.password = 'Password is required.'
  return errors
}

export async function login(form) {
  const errors = validateLoginForm(form)
  if (Object.keys(errors).length) {
    return { ok: false, errors }
  }

  const email = normalizeEmail(form.email)
  const user = readUsers().find((candidate) => candidate.email === email)
  if (!user) {
    return { ok: false, errors: { credentials: 'Invalid email or password.' } }
  }

  const hash = await hashPassword(form.password, user.passwordSalt)
  if (hash !== user.passwordHash) {
    return { ok: false, errors: { credentials: 'Invalid email or password.' } }
  }

  writeSession({ userId: user.id, role: validateRole(user.role), createdAt: new Date().toISOString() })
  notifyAuthChanged()
  return { ok: true, user }
}

export function logout() {
  clearSession()
  notifyAuthChanged()
}

export function getCurrentUser() {
  const session = readSession()
  if (!session) return null
  const user = readUsers().find((candidate) => candidate.id === session.userId)
  if (!user || validateRole(user.role) !== session.role) {
    clearSession()
    return null
  }
  return user
}

export function hasRole(role) {
  const user = getCurrentUser()
  return Boolean(user && user.role === role)
}
