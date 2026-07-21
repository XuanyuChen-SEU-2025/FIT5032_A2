const VALID_ROLES = ['user', 'admin']

export function sanitizePlainText(value, maxLength = 250) {
  const text = String(value ?? '')
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
  return text.slice(0, maxLength)
}

export function normalizeEmail(value) {
  return sanitizePlainText(value, 254).toLowerCase()
}

export function safeParseJson(rawValue, fallbackValue, validator = null) {
  try {
    const parsed = JSON.parse(rawValue)
    if (validator && !validator(parsed)) {
      return fallbackValue
    }
    return parsed ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

export function validateRole(role) {
  return VALID_ROLES.includes(role) ? role : 'user'
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

export function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0
}

export function isAllowedOption(value, options) {
  return options.includes(value)
}
