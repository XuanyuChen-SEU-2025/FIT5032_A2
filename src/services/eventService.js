import { eventLanguages } from '../data/seedEvents'
import { getCurrentUser } from './authService'
import { getRatingSummary } from './ratingService'
import {
  normalizeEvent,
  readBookings,
  readEvents,
  readRatings,
  writeBookings,
  writeEvents,
  writeRatings,
} from './storageService'
import { isAllowedOption, isPositiveInteger, sanitizePlainText } from './securityService'

export function isEventPast(event) {
  const eventDate = new Date(`${event.date}T${event.time || '23:59'}`)
  const today = new Date()
  return eventDate < today
}

export function getActiveBookingCount(eventId) {
  return readBookings().filter((booking) => booking.eventId === eventId && booking.status === 'active').length
}

export function getAvailablePlaces(event) {
  return Math.max(0, Number(event.capacity) - getActiveBookingCount(event.id))
}

export function enrichEvent(event) {
  const summary = getRatingSummary(event.id)
  return {
    ...event,
    capacity: Number(event.capacity),
    availablePlaces: getAvailablePlaces(event),
    isPast: isEventPast(event),
    ratingAverage: summary.average,
    ratingCount: summary.count,
    ratingLabel: summary.label,
  }
}

export function getEvents() {
  return readEvents().map(enrichEvent)
}

export function getEventById(id) {
  const event = readEvents().find((candidate) => candidate.id === id)
  return event ? enrichEvent(event) : null
}

function requireAdmin() {
  const user = getCurrentUser()
  return Boolean(user && user.role === 'admin')
}

export function validateEventForm(form, editingId = null) {
  const errors = {}
  const title = sanitizePlainText(form.title, 100)
  const description = sanitizePlainText(form.description, 700)
  const requiredFields = [
    'title',
    'description',
    'category',
    'language',
    'date',
    'time',
    'location',
    'facilitator',
    'capacity',
    'accessibilityInfo',
  ]

  requiredFields.forEach((field) => {
    if (!sanitizePlainText(form[field], field === 'description' ? 700 : 150)) {
      errors[field] = 'This field is required.'
    }
  })

  if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.'
  if (description.length > 700) errors.description = 'Description must be 700 characters or fewer.'
  if (!isPositiveInteger(form.capacity)) errors.capacity = 'Capacity must be a positive whole number.'
  if (form.date && new Date(`${form.date}T00:00:00`) < new Date(new Date().toDateString())) {
    errors.date = 'Date cannot be earlier than today.'
  }
  if (form.language && !isAllowedOption(form.language, eventLanguages)) {
    errors.language = 'Choose a listed language option.'
  }

  const duplicateTitle = readEvents().some((event) => {
    return event.id !== editingId && event.title.toLowerCase() === title.toLowerCase()
  })
  if (duplicateTitle) errors.title = 'An event with this title already exists.'

  return errors
}

export function createEvent(form) {
  if (!requireAdmin()) return { ok: false, errors: { permission: 'Admin role is required.' } }
  const errors = validateEventForm(form)
  if (Object.keys(errors).length) return { ok: false, errors }
  const event = normalizeEvent({ ...form, id: crypto.randomUUID(), capacity: Number(form.capacity) })
  writeEvents([...readEvents(), event])
  return { ok: true, event }
}

export function updateEvent(id, form) {
  if (!requireAdmin()) return { ok: false, errors: { permission: 'Admin role is required.' } }
  const events = readEvents()
  const index = events.findIndex((event) => event.id === id)
  if (index < 0) return { ok: false, errors: { form: 'Event was not found.' } }
  const errors = validateEventForm(form, id)
  if (Object.keys(errors).length) return { ok: false, errors }
  events[index] = normalizeEvent({ ...form, id, capacity: Number(form.capacity) })
  writeEvents(events)
  return { ok: true, event: events[index] }
}

export function deleteEvent(id) {
  if (!requireAdmin()) return { ok: false, message: 'Admin role is required.' }
  writeEvents(readEvents().filter((event) => event.id !== id))
  writeBookings(readBookings().filter((booking) => booking.eventId !== id))
  writeRatings(readRatings().filter((rating) => rating.eventId !== id))
  return { ok: true }
}
