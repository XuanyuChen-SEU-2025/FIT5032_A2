import { getCurrentUser } from './authService'
import { getEventById, getEvents, isEventPast } from './eventService'
import { readBookings, writeBookings } from './storageService'

export function createBooking(eventId) {
  const user = getCurrentUser()
  if (!user) return { ok: false, message: 'Please log in before booking this event.' }
  const event = getEventById(eventId)
  if (!event) return { ok: false, message: 'Event was not found.' }
  if (event.availablePlaces <= 0) return { ok: false, message: 'This event has no places available.' }
  if (isEventPast(event)) return { ok: false, message: 'This event has already ended.' }

  const bookings = readBookings()
  const duplicate = bookings.some((booking) => {
    return booking.userId === user.id && booking.eventId === eventId && booking.status === 'active'
  })
  if (duplicate) return { ok: false, message: 'You already have an active booking for this event.' }

  const booking = {
    id: crypto.randomUUID(),
    userId: user.id,
    eventId,
    createdAt: new Date().toISOString(),
    status: 'active',
  }
  writeBookings([...bookings, booking])
  return { ok: true, booking }
}

export function getBookingsForCurrentUser() {
  const user = getCurrentUser()
  if (!user) return []
  const events = getEvents()
  return readBookings()
    .filter((booking) => booking.userId === user.id)
    .map((booking) => ({
      ...booking,
      event: events.find((event) => event.id === booking.eventId) ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function cancelBooking(bookingId) {
  const user = getCurrentUser()
  if (!user) return { ok: false, message: 'Please log in before cancelling a booking.' }
  const bookings = readBookings()
  const index = bookings.findIndex((booking) => booking.id === bookingId && booking.userId === user.id)
  if (index < 0) return { ok: false, message: 'Booking was not found.' }
  if (bookings[index].status !== 'active') return { ok: false, message: 'This booking is already cancelled.' }
  bookings[index] = { ...bookings[index], status: 'cancelled', cancelledAt: new Date().toISOString() }
  writeBookings(bookings)
  return { ok: true }
}

export function getAllBookingsForAdmin() {
  const user = getCurrentUser()
  if (!user || user.role !== 'admin') return []
  const events = getEvents()
  return readBookings()
    .map((booking) => ({
      ...booking,
      event: events.find((event) => event.id === booking.eventId) ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getActiveBookingTotal() {
  return readBookings().filter((booking) => booking.status === 'active').length
}
