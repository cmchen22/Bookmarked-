import { useState } from 'react'
import { Link } from 'react-router-dom'

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
  {
    author: 'Marcus Thompson',
    handle: '@mystery_marcus',
    time: '12h ago',
    title: 'The Silent Patient',
    bookAuthor: 'Alex Michaelides',
    rating: 4,
    genre: 'Mystery',
    excerpt:
      'What a psychological rollercoaster! The twists kept me guessing until the very end. Alex Michaelides masterfully builds tension and explores the complexities of the human mind. A modern classic in psychological suspense.',
    likes: 312,
    comments: 67,
  },
  {
    author: 'Lily Zhang',
    handle: '@lily_loves_romance',
    time: '16h ago',
    title: 'Red, White & Royal Blue',
    bookAuthor: 'Casey McQuiston',
    rating: 5,
    genre: 'Romance',
    excerpt:
      'This book made me laugh, cry, and fall in love with these characters. The chemistry between Alex and Henry is electric! Casey McQuiston\'s writing is witty, heartfelt, and absolutely perfect. A must-read for romance fans.',
    likes: 445,
    comments: 98,
  },
]

export function SocialMediaPage() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [postLikes, setPostLikes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    feedPosts.forEach((post) => {
      const key = `${post.handle}-${post.title}`
      initial[key] = post.likes
    })
    return initial
  })
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    bookAuthor: '',
    rating: 5,
    genre: 'Fiction',
    excerpt: '',
  })
  const [allPosts, setAllPosts] = useState(feedPosts)

  const filteredPosts =
    selectedFilter === 'All'
      ? allPosts
      : allPosts.filter((post) => post.genre === selectedFilter)

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const handleLike = (postKey: string) => {
    const isLiked = likedPosts.has(postKey)

    if (isLiked) {
      // Unlike the post
      setLikedPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postKey)
        return newSet
      })
      setPostLikes((prev) => ({
        ...prev,
        [postKey]: prev[postKey] - 1,
      }))
    } else {
      // Like the post
      setLikedPosts((prev) => new Set([...prev, postKey]))
      setPostLikes((prev) => ({
        ...prev,
        [postKey]: prev[postKey] + 1,
      }))
    }
  }

  const handlePostClick = () => {
    setShowPostModal(true)
  }

  const handleCloseModal = () => {
    setShowPostModal(false)
    setNewPost({
      title: '',
      bookAuthor: '',
      rating: 5,
      genre: 'Fiction',
      excerpt: '',
    })
  }

  const handleSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const post = {
      author: 'Your Name',
      handle: '@yourhandle',
      time: 'now',
      title: newPost.title,
      bookAuthor: newPost.bookAuthor,
      rating: newPost.rating,
      genre: newPost.genre,
      excerpt: newPost.excerpt,
      likes: 0,
      comments: 0,
    }
    const postKey = `${post.handle}-${post.title}`
    setAllPosts([post, ...allPosts])
    setPostLikes((prev) => ({
      ...prev,
      [postKey]: 0,
    }))
    handleCloseModal()
  }

  return (
    <main className="social-shell">
      <section className="social-topbar card-surface">
        <div className="social-brand">
          <Link to="/">
            <img src="/Logo.png" alt="Bookmarked" />
          </Link>
        </div>
        <div className="social-search">
          <span>🔎</span>
          <input type="search" placeholder="Search books, users, reviews..." />
        </div>
        <div className="social-button-row">
          <span className="social-pill">6 Trending</span>
          <button className="primary-cta" type="button" onClick={handlePostClick}>
            Post
          </button>
        </div>
      </section>

      <div className="social-grid">
        <section className="social-main">
          <div className="social-meta card-surface">
            <div>
              <h1>Social feed</h1>
              <span>{filteredPosts.length} reviews · Latest posts</span>
            </div>
            <div className="social-filter-row">
              <button
                className={`social-pill ${selectedFilter === 'All' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('All')}
              >
                All
              </button>
              <button
                className={`social-pill ${selectedFilter === 'Fiction' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('Fiction')}
              >
                Fiction
              </button>
              <button
                className={`social-pill ${selectedFilter === 'Mystery' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('Mystery')}
              >
                Mystery
              </button>
              <button
                className={`social-pill ${selectedFilter === 'Romance' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('Romance')}
              >
                Romance
              </button>
              <button
                className={`social-pill ${selectedFilter === 'Science Fiction' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('Science Fiction')}
              >
                Science Fiction
              </button>
              <button
                className={`social-pill ${selectedFilter === 'Fantasy' ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedFilter('Fantasy')}
              >
                Fantasy
              </button>
            </div>
          </div>

          <div className="social-feed">
            {filteredPosts.map((post) => (
              <article key={`${post.handle}-${post.title}`} className="social-card">
                <div className="social-card-header">
                  <div className="social-avatar">{post.author.charAt(0)}</div>
                  <div className="social-author">
                    <h3>{post.author}</h3>
                    <span>
                      {post.handle} · {post.time}
                    </span>
                  </div>
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
                  <button 
                    type="button"
                    className={likedPosts.has(`${post.handle}-${post.title}`) ? 'liked' : ''}
                    onClick={() => handleLike(`${post.handle}-${post.title}`)}
                  >
                    ❤️ {postLikes[`${post.handle}-${post.title}`]}
                  </button>
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

      {showPostModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create a Post</h2>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="post-form">
              <div className="form-group">
                <label htmlFor="title">Book Title</label>
                <input
                  id="title"
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Book Author</label>
                <input
                  id="author"
                  type="text"
                  value={newPost.bookAuthor}
                  onChange={(e) =>
                    setNewPost({ ...newPost, bookAuthor: e.target.value })
                  }
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <select
                    id="rating"
                    value={newPost.rating}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        rating: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <select
                    id="genre"
                    value={newPost.genre}
                    onChange={(e) =>
                      setNewPost({ ...newPost, genre: e.target.value })
                    }
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Fantasy">Fantasy</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="excerpt">Your Review</label>
                <textarea
                  id="excerpt"
                  value={newPost.excerpt}
                  onChange={(e) =>
                    setNewPost({ ...newPost, excerpt: e.target.value })
                  }
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-cta"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-cta">
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
