import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const landingCarouselImages = [
  'https://covers.openlibrary.org/b/id/6476166-L.jpg', 
  'https://covers.openlibrary.org/b/id/7905691-L.jpg', 
  'https://covers.openlibrary.org/b/id/8416123-L.jpg', 
  'https://covers.openlibrary.org/b/id/8389403-L.jpg', 
  'https://covers.openlibrary.org/b/id/10318515-L.jpg'
]

export function LandingPage() {
  const [activeCover, setActiveCover] = useState(0)
  const slideWidth = 200
  const slideGap = 14
  const trackOffset = -activeCover * (slideWidth + slideGap)

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
            <div className="landing-carousel" aria-label="Featured books carousel">
              <div
                className="landing-carousel-track"
                style={{ transform: `translateX(${trackOffset}px)` }}
              >
                {landingCarouselImages.map((cover, index) => (
                  <img
                    key={cover}
                    src={cover}
                    alt={`Featured book cover ${index + 1}`}
                    className={`landing-cover ${activeCover === index ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}