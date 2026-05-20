import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const landingCarouselImages = [
  {
    id: '1',
    title: 'Fourth Wing',
    cover: 'https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg',
  },
  {
    id: '2',
    title: 'Iron Flame',
    cover: 'https://covers.openlibrary.org/b/isbn/9781649374172-L.jpg',
  },
  {
    id: '3',
    title: 'The Women',
    cover: 'https://covers.openlibrary.org/b/isbn/9781250178633-L.jpg',
  },
  {
    id: '4',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    cover: 'https://covers.openlibrary.org/b/isbn/9780593321201-L.jpg',
  },
  {
    id: '5',
    title: 'Happy Place',
    cover: 'https://covers.openlibrary.org/b/isbn/9780593441275-L.jpg',
  },
]

const communityActivity = [
  {
    name: 'Bennett',
    action: 'just rated',
    book: 'Fourth Wing',
    rating: '★★★★★',
    avatar: 'B',
    review: 'A fast and exciting read. I could not put it down.',
    quote: 'A reader lives a thousand lives before they die.',
  },
  {
    name: 'James',
    action: 'just rated',
    book: 'Iron Flame',
    rating: '★★★★☆',
    avatar: 'J',
    review: 'Really fun story with strong characters and good pacing.',
    quote: 'Books are a uniquely portable magic.',
  },
  {
    name: 'Sophia',
    action: 'just reviewed',
    book: 'The Women',
    rating: '★★★★★',
    avatar: 'S',
    review: 'Emotional, powerful, and beautifully written.',
    quote: 'There is no friend as loyal as a book.',
  },
  {
    name: 'Emily',
    action: 'added to favorites',
    book: 'Happy Place',
    rating: '★★★★★',
    avatar: 'E',
    review: 'Sweet, funny, and perfect for a weekend read.',
    quote: 'So many books, so little time.',
  },
  {
    name: 'Lucas',
    action: 'just rated',
    book: 'Tomorrow, and Tomorrow, and Tomorrow',
    rating: '★★★★★',
    avatar: 'L',
    review: 'One of the best books I have read this year.',
    quote: 'Reading gives us someplace to go when we have to stay where we are.',
  },
]

const heroBgBooks = [
  { title: 'Fourth Wing', isbn: '9781649374042' },
  { title: 'Iron Flame', isbn: '9781649374172' },
  { title: 'The Women', isbn: '9781250178633' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', isbn: '9780593321201' },
  { title: 'Happy Place', isbn: '9780593441275' },
  { title: 'Lessons in Chemistry', isbn: '9780385547345' },
  { title: 'Project Hail Mary', isbn: '9780593135204' },
  { title: 'The Midnight Library', isbn: '9780525559474' },
  { title: 'Atomic Habits', isbn: '9780735211292' },
  { title: 'Where the Crawdads Sing', isbn: '9780735224292' },
]

const recentBooks = [
  { title: 'The Covenant of Water', isbn: '9780802162175' },
  { title: 'Hello Beautiful', isbn: '9780593597538' },
  { title: 'Demon Copperhead', isbn: '9780063251984' },
  { title: 'Trust', isbn: '9780593420317' },
  { title: 'Birnam Wood', isbn: '9780385549394' },
  { title: 'Fourth Wing', isbn: '9781649374042' },
  { title: 'Iron Flame', isbn: '9781649374172' },
  { title: 'Happy Place', isbn: '9780593441275' },
  { title: 'The Women', isbn: '9781250178633' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', isbn: '9780593321201' },
  { title: 'Lessons in Chemistry', isbn: '9780385547345' },
  { title: 'Project Hail Mary', isbn: '9780593135204' },
  { title: 'The Midnight Library', isbn: '9780525559474' },
  { title: 'Atomic Habits', isbn: '9780735211292' },
]

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    text: "Keep track of every book you've ever read (or just start from the day you join)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    text: 'Show some love for your favorite books, lists and reviews with a "like"',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    text: 'Write and share reviews, and follow friends and other members to read theirs',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    text: 'Rate each book on a five-star scale to record and share your reaction',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    text: "Keep a reading diary to track what you've read and when you read it",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    text: 'Compile and share lists of books on any topic and keep a reading list to tackle',
  },
]

export function LandingPage() {
  const [activeCover, setActiveCover] = useState(0)
  const slideWidth = 200
  const trackOffset = -activeCover * slideWidth

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveCover((current) => (current + 1) % landingCarouselImages.length)
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [])

  const leftReview = communityActivity[(activeCover + 2) % communityActivity.length]
  const rightReview = communityActivity[activeCover % communityActivity.length]

  const reviewCardStyle = {
    width: '200px',
    height: '280px',
    borderRadius: '22px',
    background: 'rgba(255, 255, 255, 0.72)',
    border: '1px solid rgba(123, 87, 61, 0.14)',
    boxShadow: '0 14px 30px rgba(58, 39, 24, 0.12)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    transition: 'all 0.4s ease',
  }

  const avatarStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #8b5e3c, #3a2a20)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.95rem',
    flexShrink: 0,
  }

  return (
    <div className="lbx-shell">
      <header className="lbx-topbar">
        <div className="brandmark lbx-brand">
          <img src="/Logo.png" alt="Bookmarked logo" className="brandmark-icon" style={{ width: '30px', height: '30px' }} />
          <span>Bookmarked</span>
        </div>
        <nav className="lbx-nav">
          <Link to="/signin">Sign In</Link>
          <Link to="/signin" className="lbx-create-btn">Create Account</Link>
          <Link to="/discovery">Browse</Link>
          <Link to="/social">Members</Link>
        </nav>
      </header>

      <section className="lbx-hero">
        <div className="lbx-hero-bg" aria-hidden="true">
          {heroBgBooks.map((b) => (
            <img key={b.isbn} src={`https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`} alt="" />
          ))}
        </div>
        <div className="lbx-hero-vignette" aria-hidden="true" />
        <div className="lbx-hero-content">
          <h1 className="lbx-headline">
            Track books you've read.<br />
            Save those you want to read.<br />
            Tell your friends what's good.
          </h1>
          <Link className="lbx-get-started" to="/signin">
            Get started — it's free!
          </Link>
          <p className="lbx-hero-sub">The social network for book lovers.</p>
        </div>
      </section>

      <section className="lbx-covers-section">
        <div className="lbx-covers-meta">
          <span>JUST READ…</span>
          <span>1,200,000+ books tracked</span>
        </div>
        <div className="lbx-covers-row">
          {recentBooks.map((b) => (
            <Link key={b.isbn} to="/discovery" title={b.title}>
              <img src={`https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`} alt={b.title} className="lbx-cover-thumb" />
            </Link>
          ))}
        </div>
      </section>

      <div className="lbx-features-wrapper">
        <section className="lbx-features">
          <p className="lbx-features-header">BOOKMARKED LETS YOU…</p>
          <div className="lbx-features-grid">
            {features.map((f, i) => (
              <div key={i} className="lbx-feature-tile">
                <span className="lbx-feature-icon">{f.icon}</span>
                <p>{f.text}</p>
              </div>
            ))}
          </div>

          <aside className="landing-showcase">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.2rem',
                width: '100%',
                flexWrap: 'wrap',
              }}
            >
              <Link to="/social" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={reviewCardStyle}>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 800, color: '#8b5e3c' }}>
                    BOOK QUOTE
                  </p>

                  <p style={{ margin: 0, color: '#4a3728', fontSize: '1rem', lineHeight: 1.45 }}>
                    “{leftReview.quote}”
                  </p>

                  <span style={{ marginTop: '1rem', color: '#8b5e3c', fontSize: '0.82rem', fontWeight: 700 }}>
                    Shared by {leftReview.name}
                  </span>
                </div>
              </Link>

              <Link
                to="/discovery"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div className="landing-carousel" aria-label="Top trending books carousel">
                  <div className="landing-carousel-track" style={{ transform: `translateX(${trackOffset}px)` }}>
                    {landingCarouselImages.map((book, index) => (
                      <img
                        key={book.id}
                        src={book.cover}
                        alt={book.title}
                        title={book.title}
                        className={`landing-cover ${activeCover === index ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </Link>

              <Link to="/social" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={reviewCardStyle}>
                  <p style={{ margin: '0 0 0.9rem', fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 800, color: '#8b5e3c' }}>
                    LIVE REVIEW
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                    <div style={avatarStyle}>{rightReview.avatar}</div>
                    <div>
                      <strong style={{ color: '#3f2d22', fontSize: '0.95rem' }}>{rightReview.name}</strong>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#7a6a58' }}>
                        {rightReview.action}
                      </p>
                    </div>
                  </div>

                  <p style={{ margin: 0, color: '#4a3728', fontSize: '0.9rem', lineHeight: 1.35 }}>
                    <em>{rightReview.book}</em>
                  </p>

                  <span style={{ marginTop: '0.8rem', color: '#8b5e3c', fontSize: '0.9rem', letterSpacing: '0.06em' }}>
                    {rightReview.rating}
                  </span>
                </div>
              </Link>
            </div>
          </aside>
        </section>
      </div>

      <section className="lbx-promo">
        <div className="lbx-promo-inner">
          <div className="lbx-promo-text">
            <span className="lbx-promo-badge">BOOK CLUB</span>
            <p>A curated space built for reading discovery. Browse shelves by genre, mood, or theme.</p>
            <Link to="/discovery" className="lbx-promo-browse">Browse shelves</Link>
          </div>
          <div className="lbx-promo-covers">
            {recentBooks.slice(0, 6).map((b) => (
              <img key={b.isbn} src={`https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`} alt={b.title} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 