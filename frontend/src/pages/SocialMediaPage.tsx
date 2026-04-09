const trendingBooks = [
  {
    rank: 1,
    title: 'Moby Dick',
    author: 'Herman Melville',
    rating: '4.32',
    reviews: '18,759',
  },
  {
    rank: 2,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    rating: '4.5',
    reviews: '12,427',
  },
  {
    rank: 3,
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    rating: '4.8',
    reviews: '21,003',
  },
  {
    rank: 4,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    rating: '4.9',
    reviews: '18,586',
  },
  {
    rank: 5,
    title: 'House of Dragons',
    author: 'Jessica Cluess',
    rating: '4.6',
    reviews: '12,234',
  },
  {
    rank: 6,
    title: 'Educated',
    author: 'Tara Westover',
    rating: '4.8',
    reviews: '28,901',
  },
]

const suggestedUsers = [
  {
    name: 'Emma Rodriguez',
    handle: '@bookworm_emma',
    avatar: 'E',
    reviews: '127 reviews',
  },
  {
    name: 'James Chen',
    handle: '@sci_fi_james',
    avatar: 'J',
    reviews: '234 reviews',
  },
  {
    name: 'Sofia Mitchell',
    handle: '@sofia.reads',
    avatar: 'S',
    reviews: '198 reviews',
  },
]

const feedPosts = [
  {
    author: 'Emma Rodriguez',
    handle: '@bookworm_emma',
    time: '2h ago',
    title: 'The Midnight Library',
    bookAuthor: 'Matt Haig',
    rating: 5,
    genre: 'Fiction',
    excerpt:
      'This book completely changed my perspective on life. The concept of infinite possibilities and parallel lives is explored so beautifully. Matt Haig’s writing is both philosophical and deeply emotional.',
    likes: 234,
    comments: 45,
  },
  {
    author: 'James Chen',
    handle: '@sci_fi_james',
    time: '5h ago',
    title: 'Project Hail Mary',
    bookAuthor: 'Andy Weir',
    rating: 5,
    genre: 'Science Fiction',
    excerpt:
      "Andy Weir does it again! Project Hail Mary is an absolute masterpiece of science fiction. The scientific accuracy combined with humor and heart makes this one of the best sci-fi novels I've ever read.",
    likes: 567,
    comments: 89,
  },
  {
    author: 'Sofia Mitchell',
    handle: '@sofia.reads',
    time: '8h ago',
    title: 'Circe',
    bookAuthor: 'Madeline Miller',
    rating: 4,
    genre: 'Fantasy',
    excerpt:
      'A stunning reimagining of myth and the female experience. Circe feels both powerful and fragile, and every scene is lush with mythic detail. Highly recommended for fans of literary fantasy.',
    likes: 178,
    comments: 32,
  },
]

export function SocialMediaPage() {
  return (
    <main className="social-shell">
      <section className="social-topbar card-surface">
        <div className="social-brand">
          <span>Bookmarked</span>
        </div>
        <div className="social-search">
          <span>🔎</span>
          <input type="search" placeholder="Search books, users, reviews..." />
        </div>
        <div className="social-button-row">
          <span className="social-pill">6 Trending</span>
          <button className="primary-cta" type="button">
            Post
          </button>
        </div>
      </section>

      <div className="social-grid">
        <section className="social-main">
          <div className="social-meta card-surface">
            <div>
              <h1>Social feed</h1>
              <span>6 reviews · Latest posts</span>
            </div>
            <div className="social-filter-row">
              <button className="social-pill active" type="button">
                All
              </button>
              <button className="social-pill" type="button">
                Fiction
              </button>
              <button className="social-pill" type="button">
                Mystery
              </button>
              <button className="social-pill" type="button">
                Romance
              </button>
              <button className="social-pill" type="button">
                Science Fiction
              </button>
              <button className="social-pill" type="button">
                Fantasy
              </button>
            </div>
          </div>

          <div className="social-feed">
            {feedPosts.map((post) => (
              <article key={`${post.handle}-${post.title}`} className="social-card">
                <div className="social-card-header">
                  <div className="social-avatar">{post.author.charAt(0)}</div>
                  <div className="social-author">
                    <h3>{post.author}</h3>
                    <span>
                      {post.handle} · {post.time}
                    </span>
                  </div>
                  <button className="ghost-link" type="button">
                    •••
                  </button>
                </div>

                <div className="social-post-book-card">
                  <h4>{post.title}</h4>
                  <p>by {post.bookAuthor}</p>
                  <div className="review-rating">
                    <span>⭐ {post.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>{post.genre}</span>
                  </div>
                </div>

                <p className="social-card-text">{post.excerpt}</p>

                <div className="social-card-footer">
                  <button type="button">❤️ {post.likes}</button>
                  <button type="button">💬 {post.comments}</button>
                  <button type="button">🔖 Save</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="social-sidebar">
          <section className="social-aside-card">
            <div className="social-aside-header">
              <div>
                <h2>Trending Books</h2>
                <span>What readers are buzzing about</span>
              </div>
              <button className="ghost-link" type="button">
                View all
              </button>
            </div>
            <div className="trending-list">
              {trendingBooks.map((book) => (
                <div key={book.rank} className="trending-book">
                  <div className="trending-rank">{book.rank}</div>
                  <div className="trending-info">
                    <h3>{book.title}</h3>
                    <span>
                      {book.author} · {book.rating} ({book.reviews})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="social-aside-card">
            <div className="social-aside-header">
              <div>
                <h2>Suggested Users</h2>
                <span>Find people with great taste</span>
              </div>
            </div>
            <div className="suggested-list">
              {suggestedUsers.map((user) => (
                <div key={user.handle} className="suggested-user">
                  <div className="suggested-avatar">{user.avatar}</div>
                  <div className="suggested-copy">
                    <h3>{user.name}</h3>
                    <span>
                      {user.handle} · {user.reviews}
                    </span>
                  </div>
                  <button className="suggested-action" type="button">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}
