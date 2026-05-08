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

export function LandingPage() {
  const [activeCover, setActiveCover] = useState(0)
  const slideWidth = 200
  const slideGap = 14
  const trackOffset = (300 - slideWidth) / 2 - activeCover * (slideWidth + slideGap)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveCover((current) => (current + 1) % landingCarouselImages.length)
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <div className="brandmark brandmark-landing">
          <img
            src="/Logo.png"
            alt="Bookmarked logo"
            className="brandmark-icon"
            style={{ width: '32px', height: '32px' }}
          />
          <span>Bookmarked</span>
        </div>

        <nav className="landing-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/signin" className="sign-in-btn">
            Sign In
          </Link>
        </nav>
      </header>

      <main className="landing-main simple-landing">
        <section className="landing-hero simple-hero">
          <div className="landing-copy">
            <p className="landing-kicker">A social app for book lovers</p>

            <h1>Track your books. Share your taste.</h1>

            <p className="landing-lede">
              Bookmarked helps you save books, rate what you read, and discover new favorites
              through other readers.
            </p>

            <div className="landing-cta-row">
              <Link className="primary-cta" to="/signin">
                Get Started
              </Link>

              <Link className="secondary-cta" to="/discovery">
                Browse Books
              </Link>

              <Link className="secondary-cta" to="/social">
                Social Feed
              </Link>
            </div>
          </div>

          <aside className="landing-showcase">
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h2 style={{ marginBottom: '1rem', color: '#2b241e' }}>
                Top Trending Books Right Now
              </h2>

              <Link
                to="/discovery"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <div className="landing-carousel" aria-label="Top trending books carousel">
                  <div
                    className="landing-carousel-track"
                    style={{ transform: `translateX(${trackOffset}px)` }}
                  >
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
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}