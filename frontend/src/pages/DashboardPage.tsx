import { Link } from 'react-router-dom'

type MetricCard = {
  id: string
  value: string
  label: string
  detail: string
  icon: string
  tone: 'brown' | 'amber' | 'slate' | 'olive'
}

type ReadingItem = {
  id: string
  title: string
  author: string
  progress: number
  progressLabel: string
  sessionTime: string
  daysLeft: string
  pageLabel: string
}

type ActivityItem = {
  id: string
  text: string
  time: string
  tone: 'bronze' | 'olive' | 'slate' | 'rose'
}

type GenreItem = {
  name: string
  books: number
  progress: number
}

const profile = {
  name: 'Sarah Mitchell',
  handle: '@sarahreads',
  bio: 'Lover of classic literature and cozy mysteries. Always on the hunt for the next great read. 📚✨',
  initials: 'SM',
  booksRead: 17,
  followers: 24,
  joined: 'January 2025',
  yearlyGoal: 20,
  currentYearProgress: 2
}

const metricCards: MetricCard[] = [
  {
    id: 'total-time',
    value: '8h 24m',
    label: 'Total Time',
    detail: '55 min/day avg',
    icon: '◔',
    tone: 'brown'
  },
  {
    id: 'weekly-time',
    value: '1h 05m',
    label: 'This Week',
    detail: 'Keep it up!',
    icon: '◔',
    tone: 'amber'
  },
  {
    id: 'longest-session',
    value: '180 min',
    label: 'Longest Session',
    detail: 'Your personal best',
    icon: '◎',
    tone: 'slate'
  },
  {
    id: 'reviews-written',
    value: '10',
    label: 'Reviews Written',
    detail: '234 followers',
    icon: '🏆',
    tone: 'olive'
  }
]

const readingItems: ReadingItem[] = [
  {
    id: 'moby-dick',
    title: 'Moby Dick',
    author: 'Herman Melville',
    progress: 59,
    progressLabel: '59% Complete',
    sessionTime: '8h 32m',
    daysLeft: '12 days',
    pageLabel: 'Page 234 of 400'
  },
  {
    id: 'project-hail-mary',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    progress: 30,
    progressLabel: '30% Complete',
    sessionTime: '5h 18m',
    daysLeft: '6 days',
    pageLabel: 'Page 142 of 476'
  }
]

const activityItems: ActivityItem[] = [
  {
    id: 'night-circus',
    text: 'Reviewed The Night Circus - 5 stars',
    time: '2 hours ago',
    tone: 'bronze'
  },
  {
    id: 'educated',
    text: 'Finished reading Educated by Tara Westover',
    time: '1 day ago',
    tone: 'olive'
  },
  {
    id: 'started-phm',
    text: 'Started reading Project Hail Mary',
    time: '3 days ago',
    tone: 'slate'
  },
  {
    id: 'circe-like',
    text: "Liked Emma's review of Circe",
    time: '4 days ago',
    tone: 'rose'
  }
]

const quickStats = [
  { label: 'Books Read', value: '17' },
  { label: 'Currently Reading', value: '2' },
  { label: 'Want to Read', value: '45' },
  { label: 'Reviews', value: '10' }
]

const genres: GenreItem[] = [
  { name: 'Fantasy', books: 42, progress: 74 },
  { name: 'Science Fiction', books: 35, progress: 66 },
  { name: 'Mystery', books: 28, progress: 58 },
  { name: 'Literary Fiction', books: 22, progress: 44 }
]

export function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <Link className="brandmark brandmark-link" to="/">
          <img src="/Logo.png" alt="Bookmarked logo" className="brandmark-icon" style={{ width: '32px', height: '32px' }} />
          <span>Bookmarked</span>
        </Link>
        <div className="topbar-actions">
          <Link className="ghost-link" to="/">
            Home
          </Link>
          <button className="settings-button" type="button">
            Settings
          </button>
        </div>
      </header>

      <main className="dashboard-frame">
        <section className="profile-hero card-surface">
          <div className="profile-main">
            <div className="avatar">{profile.initials}</div>
            <div className="profile-copy">
              <h1>{profile.name}</h1>
              <p className="profile-handle">{profile.handle}</p>
              <p className="profile-bio">{profile.bio}</p>
              <div className="profile-meta">
                <span>{profile.booksRead} books read</span>
                <span>{profile.followers} followers</span>
                <span>Joined {profile.joined}</span>
              </div>
            </div>
          </div>

          <div className="goal-ring-panel">
            <div className="goal-ring">
              <div className="goal-ring-inner">
                <strong>{String(profile.currentYearProgress).padStart(2, '0')}</strong>
                <span>of {profile.yearlyGoal}</span>
                <small>2026 Goal</small>
              </div>
            </div>
          </div>
        </section>

        <section className="metrics-grid">
          {metricCards.map((metric) => (
            <article className="metric-card card-surface" key={metric.id}>
              <div className={`metric-icon metric-icon-${metric.tone}`}>{metric.icon}</div>
              <div>
                <strong>{metric.value}</strong>
                <h2>{metric.label}</h2>
                <p>{metric.detail}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="streak-banner">
          <div>
            <p className="section-label">14 Day Streak</p>
            <span>Keep reading to maintain your streak!</span>
          </div>
          <div className="streak-score">
            <strong>14</strong>
            <span>Goal: 30 days</span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-main-column">
            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Currently Reading</h2>
              </div>

              <div className="reading-list">
                {readingItems.map((item) => (
                  <article className="reading-card card-surface" key={item.id}>
                    <div className="reading-cover">◫</div>
                    <div className="reading-content">
                      <div className="reading-title-row">
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.author}</p>
                        </div>
                        <span>{item.pageLabel}</span>
                      </div>

                      <div className="reading-progress-row">
                        <span>{item.progressLabel}</span>
                      </div>
                      <div className="reading-progress-track">
                        <div style={{ width: `${item.progress}%` }} />
                      </div>

                      <div className="reading-meta-row">
                        <span>{item.sessionTime}</span>
                        <span>{item.daysLeft}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Recent Activity</h2>
              </div>

              <div className="activity-card card-surface">
                {activityItems.map((item) => (
                  <article className="activity-item" key={item.id}>
                    <div className={`activity-dot activity-dot-${item.tone}`}>•</div>
                    <div>
                      <p>{item.text}</p>
                      <span>{item.time}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Stats</h2>
              </div>

              <div className="side-card card-surface stats-table">
                {quickStats.map((item) => (
                  <div className="stats-row" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-heading">
                <h2>Favorite Genres</h2>
              </div>

              <div className="side-card card-surface genre-list">
                {genres.map((genre) => (
                  <article className="genre-item" key={genre.name}>
                    <div className="genre-row">
                      <span>{genre.name}</span>
                      <strong>{genre.books} books</strong>
                    </div>
                    <div className="genre-bar">
                      <div style={{ width: `${genre.progress}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <footer className="dashboard-footer">
        Discover your next favorite book • Driven by community reviews
      </footer>
    </div>
  )
}