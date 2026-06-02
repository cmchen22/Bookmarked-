import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { books, reviews, type Review } from './data.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

const reviewSchema = z.object({
  bookId: z.string().min(1),
  userName: z.string().min(2).max(40),
  handle: z.string().min(2).max(30),
  rating: z.number().min(0.5).max(5).multipleOf(0.5),
  spoilerFree: z.boolean(),
  review: z.string().min(20).max(600)
})

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

if (process.env.NODE_ENV !== 'production') {
  app.get('/', (_req, res) => {
    res.json({
      name: 'Bookmarked API',
      ok: true,
      frontend: 'http://localhost:5173',
      routes: ['/health', '/api/books', '/api/reviews']
    })
  })
}

app.get('/api/books', (_req, res) => {
  const payload = books.map((book) => ({
    ...book,
    reviews: reviews
      .filter((review) => review.bookId === book.id)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
  }))

  res.json({ books: payload })
})

app.get('/api/reviews', (_req, res) => {
  const payload = reviews
    .map((review) => ({
      ...review,
      book: books.find((book) => book.id === review.bookId) ?? null
    }))
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))

  res.json({ reviews: payload })
})

app.post('/api/reviews', (req, res) => {
  const parsed = reviewSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid review payload', issues: parsed.error.flatten() })
    return
  }

  const book = books.find((entry) => entry.id === parsed.data.bookId)

  if (!book) {
    res.status(404).json({ error: 'Book not found' })
    return
  }

  const review: Review = {
    id: `review-${reviews.length + 1}`,
    ...parsed.data,
    createdAt: new Date().toISOString()
  }

  reviews.unshift(review)

  const matchingReviews = reviews.filter((entry) => entry.bookId === review.bookId)
  const total = matchingReviews.reduce((sum, entry) => sum + entry.rating, 0)
  book.avgRating = Number((total / matchingReviews.length).toFixed(2))
  book.ratingsCount += 1

  res.status(201).json({ review, book })
})

app.listen(port, () => {
  console.log(`Bookmarked API listening on http://localhost:${port}`)
})

// Serve the frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../../frontend/dist')
  app.use(express.static(frontendDist))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}