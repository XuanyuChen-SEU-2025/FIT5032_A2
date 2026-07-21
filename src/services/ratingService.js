import { readEvents, readRatings, writeRatings } from './storageService'
import { getCurrentUser } from './authService'

export function getRatingSummary(eventId) {
  const ratings = readRatings().filter((rating) => rating.eventId === eventId)
  if (!ratings.length) {
    return { average: null, count: 0, label: 'No ratings yet' }
  }
  const total = ratings.reduce((sum, rating) => sum + Number(rating.score), 0)
  const average = total / ratings.length
  return { average, count: ratings.length, label: `${average.toFixed(1)} (${ratings.length})` }
}

export function getUserRating(eventId) {
  const user = getCurrentUser()
  if (!user) return null
  return readRatings().find((rating) => rating.eventId === eventId && rating.userId === user.id) ?? null
}

export function saveRating(eventId, score) {
  const user = getCurrentUser()
  if (!user) return { ok: false, message: 'Please log in before rating this event.' }
  if (!readEvents().some((event) => event.id === eventId)) return { ok: false, message: 'Event was not found.' }
  const ratingScore = Number(score)
  if (!Number.isInteger(ratingScore) || ratingScore < 1 || ratingScore > 5) {
    return { ok: false, message: 'Rating must be an integer from 1 to 5.' }
  }

  const ratings = readRatings()
  const existingIndex = ratings.findIndex((rating) => rating.eventId === eventId && rating.userId === user.id)
  const timestamp = new Date().toISOString()
  if (existingIndex >= 0) {
    ratings[existingIndex] = { ...ratings[existingIndex], score: ratingScore, updatedAt: timestamp }
  } else {
    ratings.push({
      id: crypto.randomUUID(),
      userId: user.id,
      eventId,
      score: ratingScore,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }
  writeRatings(ratings)
  return { ok: true, message: 'Your rating has been saved.' }
}

export function getOverallAverageRating() {
  const ratings = readRatings()
  if (!ratings.length) return null
  return ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
}
