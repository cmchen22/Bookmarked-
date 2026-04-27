import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <div className="brandmark brandmark-landing">
          <img src="/Logo.png" alt="Bookmarked logo" className="brandmark-icon" />
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
                Find your next favorite book
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}