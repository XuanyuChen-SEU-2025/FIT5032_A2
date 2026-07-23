import { seedEvents } from '../data/seedEvents'
import { safeParseJson, sanitizePlainText, validateRole } from './securityService'

const KEYS = {
  events: 'neighbourhub.events',
  users: 'neighbourhub.users',
  bookings: 'neighbourhub.bookings',
  ratings: 'neighbourhub.ratings',
  session: 'neighbourhub.session',
}

const DEMO_ADMIN = {
  id: 'admin-demo',
  name: 'NeighbourHub Admin',
  email: 'admin@neighbourhub.org.au',
  passwordSalt: 'fde8fc387d9c0b5eb53ffc2350cd0a58',
  passwordHash: 'f56d71dbed846898f71fcfc555a647357630f34e5e801141f2bdfa1afe8ba789',
  role: 'admin',
  createdAt: '2026-07-21T00:00:00.000Z',
}

function readArray(key, validator) {
  const value = localStorage.getItem(key)
  return safeParseJson(value, [], (data) => Array.isArray(data) && data.every(validator))
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function validateEvent(event) {
  return (
    event &&
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.date === 'string' &&
    typeof event.time === 'string' &&
    Number.isInteger(Number(event.capacity)) &&
    Number(event.capacity) > 0
  )
}

function validateUser(user) {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.passwordHash === 'string' &&
    typeof user.passwordSalt === 'string' &&
    ['user', 'admin'].includes(user.role)
  )
}

function validateBooking(booking) {
  return (
    booking &&
    typeof booking.id === 'string' &&
    typeof booking.userId === 'string' &&
    typeof booking.eventId === 'string' &&
    ['active', 'cancelled'].includes(booking.status)
  )
}

function validateRating(rating) {
  return (
    rating &&
    typeof rating.id === 'string' &&
    typeof rating.userId === 'string' &&
    typeof rating.eventId === 'string' &&
    Number.isInteger(Number(rating.score)) &&
    Number(rating.score) >= 1 &&
    Number(rating.score) <= 5
  )
}

export function normalizeEvent(event) {
  return {
    id: sanitizePlainText(event.id, 80),
    title: sanitizePlainText(event.title, 100),
    description: sanitizePlainText(event.description, 700),
    category: sanitizePlainText(event.category, 60),
    language: sanitizePlainText(event.language, 40),
    date: sanitizePlainText(event.date, 20),
    time: sanitizePlainText(event.time, 10),
    location: sanitizePlainText(event.location, 120),
    facilitator: sanitizePlainText(event.facilitator, 80),
    capacity: Number(event.capacity),
    accessibilityInfo: sanitizePlainText(event.accessibilityInfo, 300),
  }
}

export async function initializeApplicationData() {
  if (!localStorage.getItem(KEYS.events)) {
    writeEvents(seedEvents.map(normalizeEvent))
  }

  const users = readUsers()
  const hasAdmin = users.some((user) => user.email === DEMO_ADMIN.email)
  if (!hasAdmin) {
    writeUsers([...users, DEMO_ADMIN])
  }

  if (!localStorage.getItem(KEYS.bookings)) {
    writeBookings([])
  }
  if (!localStorage.getItem(KEYS.ratings)) {
    writeRatings([])
  }
}

export function readEvents() {
  return readArray(KEYS.events, validateEvent).map(normalizeEvent)
}

export function writeEvents(events) {
  writeArray(KEYS.events, events.filter(validateEvent).map(normalizeEvent))
}

export function readUsers() {
  return readArray(KEYS.users, validateUser).map((user) => ({
    ...user,
    name: sanitizePlainText(user.name, 80),
    email: sanitizePlainText(user.email, 254).toLowerCase(),
    role: validateRole(user.role),
  }))
}

export function writeUsers(users) {
  writeArray(KEYS.users, users.filter(validateUser))
}

export function readBookings() {
  return readArray(KEYS.bookings, validateBooking)
}

export function writeBookings(bookings) {
  writeArray(KEYS.bookings, bookings.filter(validateBooking))
}

export function readRatings() {
  return readArray(KEYS.ratings, validateRating).map((rating) => ({
    ...rating,
    score: Number(rating.score),
  }))
}

export function writeRatings(ratings) {
  writeArray(KEYS.ratings, ratings.filter(validateRating))
}

export function readSession() {
  return safeParseJson(sessionStorage.getItem(KEYS.session), null, (session) => {
    return session && typeof session.userId === 'string' && ['user', 'admin'].includes(session.role)
  })
}

export function writeSession(session) {
  sessionStorage.setItem(KEYS.session, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(KEYS.session)
}
