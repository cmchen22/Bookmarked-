import { Link } from 'react-router-dom'

const featuredShelves = [
  {
    title: 'Read with receipts',
    copy: 'Log finished books, attach your rating, and leave a short review that actually says something.',
    stat: '10,482 reviews this week'
  },
  {
    title: 'Taste-first discovery',
    copy: 'Find new books through people with suspiciously compatible taste instead of generic recommendation sludge.',
    stat: '1,240 curated lists'
  },
  {
    title: 'Profiles with a pulse',
    copy: 'Reading streaks, current reads, favorite genres, and yearly goals all live in one shareable page.',
    stat: '238 active streaks today'
  }
]

const communityNotes = [
  {
    label: 'Trending review',
    title: 'Piranesi is what happens when atmosphere becomes plot',
    meta: '@pagefragments • 4.5 stars'
  },
  {
    label: 'List climbing fast',
    title: 'Books for people who want one more winter before spring arrives',
    meta: '642 saves in 24 hours'
  },
  {
    label: 'Shelf energy',
    title: 'The feed should feel like a smart friend pushing a book into your hands',
    meta: 'Design principle #01'
  }
]

export function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-topbar">
        <div className="brandmark brandmark-landing">
          <span className="brandmark-icon">◫</span>
          <span>Bookmarked</span>
        </div>

        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#community">Community</a>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-copy">
            <p className="landing-kicker">A social home for readers with taste</p>
            <h1>Letterboxd for books, but warmer, sharper, and built for obsession.</h1>
            <p className="landing-lede">
              Track your reading life, rate what you finish, browse real reactions, and make your
              profile feel like a living bookshelf instead of a spreadsheet.
            </p>

            <div className="landing-cta-row">
              <Link className="primary-cta" to="/dashboard">
                View dashboard
              </Link>
              <a className="secondary-cta" href="#features">
                Explore features
              </a>
            </div>

            <div className="landing-proof-row">
              <article>
                <strong>50k+</strong>
                <span>books waiting in queues</span>
              </article>
              <article>
                <strong>4.8/5</strong>
                <span>average community review depth</span>
              </article>
              <article>
                <strong>365</strong>
                <span>days of streak fuel</span>
              </article>
            </div>
          </div>

          <div className="landing-showcase card-surface">
            <div className="showcase-header">
              <span>Tonight on Bookmarked</span>
              <strong>Reader moodboard</strong>
            </div>

            <div className="showcase-stack">
              <article className="showcase-note showcase-note-dark">
                <p>Currently reading</p>
                <strong>Project Hail Mary</strong>
                <span>30% through • still impossible to put down</span>
              </article>
              <article className="showcase-note showcase-note-bronze">
                <p>Most liked review</p>
                <strong>Never Let Me Go wrecked me politely</strong>
                <span>2 min read • spoiler-free</span>
              </article>
              <article className="showcase-note showcase-note-sage">
                <p>Top shelf this week</p>
                <strong>Quiet books with catastrophic undertones</strong>
                <span>Saved by 412 readers</span>
              </article>
            </div>
          </div>
        </section>

        <section className="feature-grid" id="features">
          {featuredShelves.map((feature) => (
            <article className="feature-card card-surface" key={feature.title}>
              <p>{feature.title}</p>
              <h2>{feature.copy}</h2>
              <span>{feature.stat}</span>
            </article>
          ))}
        </section>

        <section className="community-section" id="community">
          <div className="community-copy">
            <p className="landing-kicker">Built around reading behavior</p>
            <h2>The landing page sells the feeling. The dashboard proves the product.</h2>
            <p>
              Bookmarked is strongest when the homepage frames the social reading loop clearly:
              discover a book, log progress, review it, and let that taste graph build itself over time.
            </p>
          </div>

          <div className="community-notes">
            {communityNotes.map((note) => (
              <article className="community-card card-surface" key={note.title}>
                <p>{note.label}</p>
                <h3>{note.title}</h3>
                <span>{note.meta}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-preview card-surface">
          <div>
            <p className="landing-kicker">Preview</p>
            <h2>Profiles turn reading habits into identity.</h2>
            <p>
              Reading streaks, current books, recent activity, favorite genres, and yearly goals all
              live in the dashboard view you already designed in Figma.
            </p>
          </div>

          <div className="preview-actions">
            <Link className="primary-cta" to="/dashboard">
              Open the dashboard
            </Link>
            <span>Use this as the signed-in destination after onboarding.</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        Read deeper • review better • find your people
      </footer>
    </div>
  )
}