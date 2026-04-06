import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Review = {
  id: string
  userName: string
  handle: string
  bookId: string
  rating: number
  spoilerFree: boolean
  review: string
  createdAt: string
}

type Book = {
  id: string
  title: string
  author: string
  year: number
  coverUrl: string
  genres: string[]
  synopsis: string
  avgRating: number
  ratingsCount: number
  featuredQuote: string
  reviews: Review[]
}

type ReviewFeedItem = Review & {
  book: Pick<Book, 'id' | 'title' | 'author' | 'coverUrl'> | null
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? ''

const initialForm = {
  bookId: '',
  userName: '',
  handle: '@',
  rating: '4.5',
  spoilerFree: true,
  review: ''
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [feed, setFeed] = useState<ReviewFeedItem[]>([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        const [booksResponse, reviewsResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/books`),
          fetch(`${apiBaseUrl}/api/reviews`)
        ])

        if (!booksResponse.ok || !reviewsResponse.ok) {
          throw new Error('Unable to load Bookmarked right now.')
        }

        const booksPayload = (await booksResponse.json()) as { books: Book[] }
        const reviewsPayload = (await reviewsResponse.json()) as { reviews: ReviewFeedItem[] }

        setBooks(booksPayload.books)
        setFeed(reviewsPayload.reviews)
        setForm((current) => ({
          ...current,
          bookId: current.bookId || booksPayload.books[0]?.id || ''
        }))
      } catch (loadError) {
        const message =
          loadError instanceof Error ? loadError.message : 'Something went wrong while loading.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  const stats = useMemo(() => {
    const ratingsCount = books.reduce((total, book) => total + book.ratingsCount, 0)
    const averageRating =
      books.length === 0
        ? 0
        : books.reduce((total, book) => total + book.avgRating, 0) / books.length

    return {
      totalBooks: books.length,
      ratingsCount,
      averageRating: averageRating.toFixed(2)
    }
  }, [books])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookId: form.bookId,
          userName: form.userName,
          handle: form.handle,
          rating: Number(form.rating),
          spoilerFree: form.spoilerFree,
          review: form.review
        })
      })

      if (!response.ok) {
        throw new Error('Could not publish your review.')
      }

      const payload = (await response.json()) as { review: Review; book: Book }

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book.id === payload.book.id
            ? {
                ...book,
                avgRating: payload.book.avgRating,
                ratingsCount: payload.book.ratingsCount,
                reviews: [payload.review, ...book.reviews]
              }
            : book
        )
      )

      const matchedBook = books.find((book) => book.id === payload.review.bookId)

      setFeed((currentFeed) => [
        {
          ...payload.review,
          book: matchedBook
            ? {
                id: matchedBook.id,
                title: matchedBook.title,
                author: matchedBook.author,
                coverUrl: matchedBook.coverUrl
              }
            : null
        },
        ...currentFeed
      ])

      setForm((current) => ({
        ...initialForm,
        bookId: current.bookId,
        userName: current.userName,
        handle: current.handle
      }))
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Something went wrong while publishing.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Bookmarked</p>
          <h1>Letterboxd energy, Rate Your Music obsession, but for books.</h1>
          <p className="lede">
            Track what you finished, write short sharp reviews, and turn your reading taste
            into something social.
          </p>

          <div className="stat-row">
            <article>
              <strong>{stats.totalBooks}</strong>
              <span>featured books</span>
            </article>
            <article>
              <strong>{stats.ratingsCount.toLocaleString()}</strong>
              <span>ratings logged</span>
            </article>
            <article>
              <strong>{stats.averageRating}</strong>
              <span>average score</span>
            </article>
          </div>
        </div>

        <div className="hero-card-stack" aria-hidden="true">
          <div className="stack-card stack-card-primary">
            <span>Staff pick</span>
            <strong>Piranesi</strong>
            <small>haunting, tidal, impossible</small>
          </div>
          <div className="stack-card stack-card-secondary">
            <span>Top shelf</span>
            <strong>Quietly devastating</strong>
            <small>Never Let Me Go</small>
          </div>
          <div className="stack-card stack-card-tertiary">
            <span>Classic core</span>
            <strong>Le Guin season</strong>
            <small>politics, climate, intimacy</small>
          </div>
        </div>
      </section>

      {error ? <div className="banner-error">{error}</div> : null}

      <section className="content-grid">
        <div className="left-column">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Discovery</p>
                <h2>Books people are arguing about in a good way</h2>
              </div>
              <span className="chip">MVP shelf</span>
            </div>

            <div className="book-grid">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <article className="book-card skeleton-card" key={index} />
                  ))
                : books.map((book) => (
                    <article className="book-card" key={book.id}>
                      <img src={book.coverUrl} alt={`${book.title} cover`} className="book-cover" />
                      <div className="book-body">
                        <div className="book-meta">
                          <p>{book.author}</p>
                          <span>{book.year}</span>
                        </div>
                        <h3>{book.title}</h3>
                        <p className="book-synopsis">{book.synopsis}</p>
                        <div className="tag-row">
                          {book.genres.map((genre) => (
                            <span className="tag" key={genre}>
                              {genre}
                            </span>
                          ))}
                        </div>
                        <div className="book-footer">
                          <div>
                            <strong>{book.avgRating.toFixed(2)}</strong>
                            <span>{book.ratingsCount.toLocaleString()} ratings</span>
                          </div>
                          <blockquote>{book.featuredQuote}</blockquote>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Recent reviews</p>
                <h2>The feed reads like taste, not homework</h2>
              </div>
            </div>

            <div className="review-feed">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <article className="review-card skeleton-card" key={index} />
                  ))
                : feed.map((entry) => (
                    <article className="review-card" key={entry.id}>
                      <div className="review-card-top">
                        <div>
                          <p className="review-user">{entry.userName}</p>
                          <span>{entry.handle}</span>
                        </div>
                        <div className="rating-pill">{entry.rating.toFixed(1)} / 5</div>
                      </div>
                      <h3>{entry.book?.title ?? 'Unknown book'}</h3>
                      <p className="review-author">{entry.book?.author ?? 'Unknown author'}</p>
                      <p className="review-body">{entry.review}</p>
                      <div className="review-card-bottom">
                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                        <span>{entry.spoilerFree ? 'Spoiler-free' : 'Spoilers'}</span>
                      </div>
                    </article>
                  ))}
            </div>
          </section>
        </div>

        <aside className="right-column">
          <section className="panel composer-panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Write a review</p>
                <h2>Post something sharper than “I liked it.”</h2>
              </div>
            </div>

            <form className="review-form" onSubmit={handleSubmit}>
              <label>
                Book
                <select
                  value={form.bookId}
                  onChange={(event) => setForm((current) => ({ ...current, bookId: event.target.value }))}
                >
                  {books.map((book) => (
                    <option value={book.id} key={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-two-up">
                <label>
                  Name
                  <input
                    value={form.userName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, userName: event.target.value }))
                    }
                    placeholder="Maya Chen"
                  />
                </label>

                <label>
                  Handle
                  <input
                    value={form.handle}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, handle: event.target.value }))
                    }
                    placeholder="@pagefragments"
                  />
                </label>
              </div>

              <div className="form-two-up">
                <label>
                  Rating
                  <select
                    value={form.rating}
                    onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                  >
                    {['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'].map((score) => (
                      <option value={score} key={score}>
                        {score} / 5
                      </option>
                    ))}
                  </select>
                </label>

                <label className="checkbox-row">
                  <span>Spoiler-free</span>
                  <input
                    type="checkbox"
                    checked={form.spoilerFree}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, spoilerFree: event.target.checked }))
                    }
                  />
                </label>
              </div>

              <label>
                Review
                <textarea
                  value={form.review}
                  onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))}
                  placeholder="What worked? What dragged? What would make someone add it to their list?"
                  rows={7}
                />
              </label>

              <button type="submit" disabled={submitting || loading || books.length === 0}>
                {submitting ? 'Publishing...' : 'Publish review'}
              </button>
            </form>
          </section>

          <section className="panel notes-panel">
            <p className="section-kicker">Why this works</p>
            <ul>
              <li>Short-form reviews make reading taste legible fast.</li>
              <li>Average score plus quote gives every book a clear vibe.</li>
              <li>The stack is ready for lists, profiles, follows, and reading logs.</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
