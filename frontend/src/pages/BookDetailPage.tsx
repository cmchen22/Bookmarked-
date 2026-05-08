import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

type RatingSource = 'google-books' | 'starter'

type DiscoveryStateBook = {
  id: string
  title: string
  author: string
  genre: string
  rating: number
  reviews: number
  ratingSource: RatingSource
  image: string
  year?: number
  publisher?: string
  editionCount?: number
  subtitle?: string
}

type OpenLibraryAuthorRef = {
  author?: {
    key?: string
  }
}

type OpenLibraryWorkResponse = {
  key?: string
  title?: string
  description?: string | { value?: string }
  first_publish_date?: string
  first_publish_year?: number
  subjects?: string[]
  covers?: number[]
  authors?: OpenLibraryAuthorRef[]
}

type OpenLibraryAuthorResponse = {
  name?: string
}

type OpenLibraryEditionsResponse = {
  entries?: Array<{
    key?: string
    publish_date?: string
    physical_format?: string
    publishers?: string[]
    isbn_13?: string[]
  }>
}

type GoogleBooksResponse = {
  items?: Array<{
    volumeInfo?: {
      averageRating?: number
      ratingsCount?: number
      publishedDate?: string
      categories?: string[]
      description?: string
      imageLinks?: {
        thumbnail?: string
      }
    }
  }>
}

type BookIssue = {
  id: string
  label: string
  year: string
  format: string
  publisher: string
}

type CommunityReview = {
  id: string
  user: string
  date: string
  stars: number
  votes: number
  body: string
}

type BookDetailData = {
  id: string
  title: string
  subtitle?: string
  author: string
  coverUrl: string
  synopsis: string
  released: string
  year: number
  rating: number
  ratingsCount: number
  ratingSource: RatingSource
  rankLabel: string
  friendsRating: number
  friendsCount: number
  genres: string[]
  movements: string[]
  descriptors: string[]
  issues: BookIssue[]
  reviews: CommunityReview[]
}

const starterRatingFromSeed = (seed: string) => {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  const rating = 3.6 + (hash % 10) * 0.09
  const reviews = 160 + (hash % 2200)

  return {
    rating: Number(rating.toFixed(1)),
    reviews
  }
}

const hashSeed = (seed: string) => {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 33 + seed.charCodeAt(index)) >>> 0
  }
  return hash
}

const cleanDescription = (description: OpenLibraryWorkResponse['description']) => {
  if (typeof description === 'string') {
    return description
  }

  if (typeof description?.value === 'string') {
    return description.value
  }

  return ''
}

const getGoogleBooksRating = async (
  title: string,
  author: string,
  signal: AbortSignal
) => {
  const attempts = [`intitle:${title} inauthor:${author}`, `intitle:${title}`]

  for (const query of attempts) {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&printType=books`,
      { signal }
    )

    if (!response.ok) {
      continue
    }

    const data = (await response.json()) as GoogleBooksResponse
    const volumeInfo = data.items?.[0]?.volumeInfo

    if (typeof volumeInfo?.averageRating === 'number' && typeof volumeInfo?.ratingsCount === 'number') {
      return {
        rating: Number(volumeInfo.averageRating.toFixed(1)),
        ratingsCount: volumeInfo.ratingsCount,
        publishedDate: volumeInfo.publishedDate,
        categories: volumeInfo.categories,
        description: volumeInfo.description,
        image: volumeInfo.imageLinks?.thumbnail
      }
    }
  }

  return null
}

const buildMockReviews = (title: string, author: string, seed: string): CommunityReview[] => {
  const hash = hashSeed(seed)
  const templates = [
    `A surprisingly immersive read. ${title} has the kind of pacing that rewards patient readers and keeps the atmosphere consistent all the way through.`,
    `I came in for the premise and stayed for the voice. ${author} writes with confidence and a lot of emotional control.`,
    `This one benefits from reading slowly. The details stack up and the final stretch lands harder because of it.`
  ]

  return templates.map((body, index) => ({
    id: `${seed}-review-${index + 1}`,
    user: ['readscope', 'marginline', 'shelfthread'][index],
    date: ['23 Apr 2026', '14 Apr 2026', '06 Apr 2026'][index],
    stars: Number((3.5 + ((hash + index * 17) % 4) * 0.5).toFixed(1)),
    votes: 3 + ((hash + index * 11) % 24),
    body
  }))
}

const normalizeWorkKey = (idFromRoute: string | undefined) => {
  if (!idFromRoute) {
    return ''
  }

  const decoded = decodeURIComponent(idFromRoute)
  if (decoded.startsWith('/works/')) {
    return decoded
  }

  if (decoded.startsWith('OL') && decoded.endsWith('W')) {
    return `/works/${decoded}`
  }

  return decoded
}

const toYear = (value: string | number | undefined, fallback = 0) => {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return fallback
  }

  const matched = value.match(/\d{4}/)
  return matched ? Number(matched[0]) : fallback
}

export function BookDetailPage() {
  const { bookId } = useParams()
  const location = useLocation()
  const seededBook = (location.state as { book?: DiscoveryStateBook } | null)?.book

  const [book, setBook] = useState<BookDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const workKey = normalizeWorkKey(bookId)

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!workKey) {
          throw new Error('Invalid book id')
        }

        const workResponse = await fetch(`https://openlibrary.org${workKey}.json`, { signal: controller.signal })
        if (!workResponse.ok) {
          throw new Error('Could not load book details')
        }

        const work = (await workResponse.json()) as OpenLibraryWorkResponse

        const authorName = await (async () => {
          const authorKey = work.authors?.[0]?.author?.key
          if (!authorKey) {
            return seededBook?.author ?? 'Unknown'
          }

          const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`, {
            signal: controller.signal
          })
          if (!authorResponse.ok) {
            return seededBook?.author ?? 'Unknown'
          }

          const authorData = (await authorResponse.json()) as OpenLibraryAuthorResponse
          return authorData.name ?? seededBook?.author ?? 'Unknown'
        })()

        const editionsResponse = await fetch(`https://openlibrary.org${workKey}/editions.json?limit=4`, {
          signal: controller.signal
        })
        const editionsData = editionsResponse.ok
          ? ((await editionsResponse.json()) as OpenLibraryEditionsResponse)
          : { entries: [] }

        const googleRating = await getGoogleBooksRating(work.title ?? seededBook?.title ?? 'Untitled', authorName, controller.signal).catch(
          () => null
        )

        const starter = starterRatingFromSeed(work.key ?? seededBook?.id ?? workKey)
        const rating = googleRating?.rating ?? seededBook?.rating ?? starter.rating
        const ratingsCount = googleRating?.ratingsCount ?? seededBook?.reviews ?? starter.reviews
        const ratingSource: RatingSource = googleRating ? 'google-books' : 'starter'

        const firstYear =
          toYear(work.first_publish_date, 0) ||
          work.first_publish_year ||
          seededBook?.year ||
          toYear(googleRating?.publishedDate, 0) ||
          0

        const releaseLabel = firstYear > 0 ? `${firstYear}` : 'Unknown'
        const seed = work.key ?? seededBook?.id ?? workKey
        const hash = hashSeed(seed)

        const subjects = (work.subjects ?? []).slice(0, 20)
        const genres =
          subjects
            .filter((subject) => subject.length <= 24)
            .slice(0, 6)
            .map((subject) => subject.trim())
            .filter(Boolean) || []

        const movementCandidates = subjects
          .filter((subject) => /movement|literature|writing|fiction|poetry|culture/i.test(subject))
          .slice(0, 4)

        const movements = movementCandidates.length > 0 ? movementCandidates : ['Emerging Community Favorite']

        const descriptors = subjects
          .filter((subject) => subject.length <= 28)
          .slice(0, 18)
          .map((subject) => subject.toLowerCase())

        const issues: BookIssue[] = (editionsData.entries ?? []).slice(0, 4).map((entry, index) => ({
          id: entry.key ?? `${seed}-issue-${index}`,
          label: index === 0 ? 'Primary issue' : `Issue ${index + 1}`,
          year: entry.publish_date ?? releaseLabel,
          format: entry.physical_format ?? 'Print',
          publisher: entry.publishers?.[0] ?? seededBook?.publisher ?? 'Unknown publisher'
        }))

        const fallbackCover =
          seededBook?.image ??
          (work.covers?.[0] ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg` : 'https://via.placeholder.com/360x520?text=No+Cover')

        const synopsis =
          cleanDescription(work.description) ||
          googleRating?.description ||
          seededBook?.subtitle ||
          'No synopsis has been added yet.'

        const detail: BookDetailData = {
          id: work.key ?? seededBook?.id ?? workKey,
          title: work.title ?? seededBook?.title ?? 'Untitled',
          subtitle: seededBook?.subtitle,
          author: authorName,
          coverUrl: googleRating?.image ?? fallbackCover,
          synopsis,
          released: releaseLabel,
          year: firstYear,
          rating,
          ratingsCount,
          ratingSource,
          rankLabel: `#${120 + (hash % 700)} for ${firstYear > 0 ? firstYear : 'this period'}`,
          friendsRating: Number((3.7 + (hash % 8) * 0.1).toFixed(2)),
          friendsCount: 3 + (hash % 12),
          genres: genres.length > 0 ? genres : [seededBook?.genre ?? 'General'],
          movements,
          descriptors: descriptors.length > 0 ? descriptors : ['readable', 'character-driven', 'atmospheric'],
          issues,
          reviews: buildMockReviews(work.title ?? seededBook?.title ?? 'This book', authorName, seed)
        }

        if (!controller.signal.aborted) {
          setBook(detail)
          setLoading(false)
        }
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setError('Could not load this book page right now. Please try another title.')
        setLoading(false)
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [bookId, seededBook])

  const descriptorText = useMemo(() => {
    if (!book) {
      return ''
    }

    return book.descriptors.join(', ')
  }, [book])

  if (loading) {
    return (
      <main className="book-record-shell">
        <div className="book-detail-skeleton">
          <div className="book-detail-skeleton-cover" />
          <div className="book-detail-skeleton-info">
            <div className="skeleton-line skeleton-line-title" style={{ height: '1.6rem', width: '70%' }} />
            <div className="skeleton-line skeleton-line-sub" style={{ marginTop: '0.6rem' }} />
            <div className="skeleton-line skeleton-line-short" style={{ marginTop: '0.5rem' }} />
            <div className="skeleton-line" style={{ marginTop: '1.2rem', width: '90%' }} />
            <div className="skeleton-line" style={{ marginTop: '0.4rem', width: '80%' }} />
            <div className="skeleton-line" style={{ marginTop: '0.4rem', width: '60%' }} />
          </div>
        </div>
      </main>
    )
  }

  if (error || !book) {
    return (
      <main className="book-record-shell">
        <div className="book-record-error">{error ?? 'Book not found.'}</div>
        <Link className="book-record-back-link" to="/discovery">
          Back to Discovery
        </Link>
      </main>
    )
  }

  return (
    <main className="book-record-shell">
      <section className="book-record-header-row">
        <Link className="book-record-back-link" to="/discovery">
          Discovery
        </Link>
        <span className="book-record-separator">. . . . . . .</span>
      </section>

      <section className="book-record-main">
        <aside className="book-record-cover-column">
          <img alt={`${book.title} cover`} className="book-record-cover" src={book.coverUrl} />
          <div className="book-record-rate-card">
            <h3>Rate/Catalog</h3>
            <button className="book-record-rate-button" type="button">
              Rate {book.title}
            </button>
            <button className="book-record-secondary-button" type="button">
              Catalog
            </button>
            <button className="book-record-secondary-button" type="button">
              Set reading status
            </button>
          </div>
        </aside>

        <section className="book-record-content-column">
          <h1>{book.title}</h1>
          <div className="book-record-subline">{book.subtitle ?? 'Book page'}</div>

          <dl className="book-record-metadata-grid">
            <dt>Author</dt>
            <dd>{book.author}</dd>

            <dt>Type</dt>
            <dd>Book</dd>

            <dt>Released</dt>
            <dd>{book.released}</dd>

            <dt>Bookmarked Rating</dt>
            <dd>
              {`${book.rating.toFixed(2)} / 5.0 from ${book.ratingsCount.toLocaleString()} ratings`}
              <span className="book-record-source-pill">
                {book.ratingSource === 'google-books' ? 'Source: Google Books' : 'Source: Starter estimate'}
              </span>
            </dd>

            <dt>Friends</dt>
            <dd>{`${book.friendsRating.toFixed(2)} from ${book.friendsCount} ratings`}</dd>

            <dt>Ranked</dt>
            <dd>{book.rankLabel}</dd>

            <dt>Genres</dt>
            <dd>{book.genres.join(', ')}</dd>

            <dt>Movements</dt>
            <dd>{book.movements.join(', ')}</dd>

            <dt>Descriptors</dt>
            <dd>{descriptorText}</dd>
          </dl>

          <section className="book-record-synopsis">
            <h2>Synopsis</h2>
            <p>{book.synopsis}</p>
          </section>

          <section className="book-record-issues">
            <div className="book-record-section-head">
              <h2>Issues</h2>
              <button className="book-record-add-button" type="button">
                Add issue
              </button>
            </div>
            <ul>
              {book.issues.map((issue) => (
                <li key={issue.id}>
                  <span>{issue.label}</span>
                  <span>{issue.year}</span>
                  <span>{issue.format}</span>
                  <span>{issue.publisher}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="book-record-reviews">
            <div className="book-record-section-head">
              <h2>{`${book.reviews.length} Reviews`}</h2>
              <span>Sort: votes · date · length · positive · negative</span>
            </div>

            {book.reviews.map((review) => (
              <article className="book-record-review" key={review.id}>
                <header>
                  <strong>{review.user}</strong>
                  <span>{review.date}</span>
                  <span>{`${review.stars.toFixed(2)} stars`}</span>
                  <span>{`+${review.votes}`}</span>
                </header>
                <p>{review.body}</p>
              </article>
            ))}
          </section>
        </section>
      </section>
    </main>
  )
}
