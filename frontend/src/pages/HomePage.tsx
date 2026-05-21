import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookshelfRow from "../components/BookshelfRow";
import "./HomePage.css";

type BookStatus = "currently-reading" | "want-to-read" | "finished";

export type UserBook = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  shelfId: string;
  color: string;
  height: number;
  width: number;
  tilt: number;
};

export type Shelf = {
  id: string;
  name: string;
};

const defaultShelves: Shelf[] = [
  { id: "currently-reading", name: "Currently Reading" },
  { id: "want-to-read", name: "Want to Read" },
  { id: "finished", name: "Finished" },
];

const bookColors = [
  "#6b4f3a",
  "#2f6b43",
  "#9a3940",
  "#3f6f8f",
  "#5c2f6e",
  "#9a5a32",
  "#1f6d63",
];

export default function HomePage() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<UserBook[]>(() => {
    const savedBooks = localStorage.getItem("bookmarked-books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [readingGoal, setReadingGoal] = useState<number>(() => {
    const savedGoal = localStorage.getItem("bookmarked-reading-goal");
    return savedGoal ? Number(savedGoal) : 20;
  });

  useEffect(() => {
    localStorage.setItem("bookmarked-reading-goal", String(readingGoal));
  }, [readingGoal]);

  const [shelves, setShelves] = useState<Shelf[]>(defaultShelves);

  const [showAddBook, setShowAddBook] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("want-to-read");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("bookmarked-books", JSON.stringify(books));
  }, [books]);

  const addBook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBook: UserBook = {
      id: crypto.randomUUID(),
      title,
      author,
      status,
      shelfId: status,
      color: bookColors[Math.floor(Math.random() * bookColors.length)],
      height: 145 + Math.floor(Math.random() * 35),
      width: 36 + Math.floor(Math.random() * 8),
      tilt: Math.random() > 0.5 ? 1 : -1,
    };

    setBooks([...books, newBook]);
    setTitle("");
    setAuthor("");
    setStatus("want-to-read");
    setShowAddBook(false);
  };

  const deleteBook = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  const addShelf = () => {
    const shelfName = prompt("Name your new shelf:");
    if (!shelfName) return;

    const id = shelfName.toLowerCase().replace(/\s+/g, "-");

    setShelves([...shelves, { id, name: shelfName }]);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/discovery?search=${encodeURIComponent(searchQuery)}`);
  };

  const booksRead = books.filter((book) => book.status === "finished").length;
  const currentlyReading = books.filter(
    (book) => book.status === "currently-reading"
  ).length;
  const wantToRead = books.filter((book) => book.status === "want-to-read").length;

  const suggestedAuthors = [
    {
      name: "Taylor Jenkins Reid",
      genre: "Contemporary Fiction",
    },
    {
      name: "R.F. Kuang",
      genre: "Fantasy",
    },
    {
      name: "Fredrik Backman",
      genre: "Literary Fiction",
    },
    {
      name: "Ali Hazelwood",
      genre: "Romance",
    },
  ];

  const updateReadingGoal = () => {
  const newGoal = prompt("Set your reading goal:", String(readingGoal));

  if (!newGoal) return;

  const goalNumber = Number(newGoal);

  if (!Number.isNaN(goalNumber) && goalNumber > 0) {
    setReadingGoal(goalNumber);
  }
};

  return (
    <div className="home-page">
      <header className="home-topbar">
        <Link to="/" className="brand-link">
          <div className="brand">
            <img src="/Logo.svg" alt="Bookmarked logo" className="logo" />
            <span>Bookmarked</span>
          </div>
        </Link>

        <div className="topbar-actions">
          <button className="topbar-btn" onClick={() => setShowAddBook(true)}>
            ⊕ Add Book
          </button>

          <button className="topbar-btn" onClick={() => navigate("/lists")}>
            My Lists
          </button>

          <button className="profile-btn" onClick={() => navigate("/profile")}>
            ◯
          </button>
        </div>
      </header>

      <div className="home-dashboard">
        <aside className="left-panel">
          <section className="continue-card">
            <h3>Continue Reading</h3>

            <div className="cover-placeholder">
              {currentlyReading === 0 ? (
                <p>No current book yet</p>
              ) : (
                <p>{currentlyReading} book{currentlyReading > 1 ? "s" : ""} in progress</p>
              )}
            </div>
          </section>

          <section className="stats-panel">
            <h3>Your Stats</h3>

            <div className="stats-grid">
              <div className="stat-box">
                <strong>{booksRead}</strong>
                <span>Books Read</span>
              </div>

              <div className="stat-box">
                <strong>{books.length}</strong>
                <span>Total Books</span>
              </div>

              <div className="stat-box">
                <strong>{currentlyReading}</strong>
                <span>Reading Now</span>
              </div>

              <div className="stat-box">
                <strong>{wantToRead}</strong>
                <span>Want to Read</span>
              </div>
            </div>

            <h4>My Library</h4>

            <div className="library-list">
              <button>📖 All Books</button>
              <button>⭐ Favorites</button>
              <button>🕘 Currently Reading</button>
              <button>✅ Finished</button>
              <button>📌 Want to Read</button>
              <button>💬 Reviews</button>
            </div>
          </section>
        </aside>

        <main className="shelves-area">
          <div className="shelves-header">
            <h2>My Shelves</h2>
            <p>Add books and build your digital library.</p>
          </div>

          {shelves.map((shelf) => {
            const shelfBooks = books.filter((book) => book.shelfId === shelf.id);

            return (
              <BookshelfRow
                key={shelf.id}
                shelf={shelf}
                books={shelfBooks}
                onBookClick={(book) => console.log("Clicked book:", book)}
                onDeleteBook={deleteBook}
                onSearchClick={() => setShowSearch(true)}
              />
            );
          })}

          <button className="add-shelf-box" onClick={addShelf}>
            + Add a New Shelf
          </button>
        </main>

        <aside className="right-panel">
          <section className="right-card">
            <div className="card-title-row">
              <h3>Friends Activity</h3>
              <span>×</span>
            </div>

            <div className="activity-row">👤</div>
            <div className="activity-row">👤</div>
            <div className="activity-row">👤</div>
            <div className="activity-row">👤</div>
          </section>

          <section className="right-card">
            <div className="card-title-row">
              <h3>Suggested Authors</h3>
              <span>×</span>
            </div>

            {suggestedAuthors.map((author) => (
              <div className="author-row" key={author.name}>
                <div className="author-avatar">
                  {author.name.charAt(0)}
                </div>

                <div className="author-info">
                  <strong>{author.name}</strong>
                  <span>{author.genre}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="right-card challenge-card">
            <div className="card-title-row">
              <h3>Reading Challenge</h3>
              <span>×</span>
            </div>

            <div className="challenge-box">
              <strong>2026 Goal: {readingGoal} Books</strong>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min((booksRead / readingGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <p>{booksRead} of {readingGoal} complete</p>
              <button className="edit-goal-btn" onClick={updateReadingGoal}>
                Edit Goal
              </button>
            </div>
          </section>
        </aside>
      </div>

      {showAddBook && (
        <div className="modal-backdrop">
          <form className="book-modal" onSubmit={addBook}>
            <h2>Add a Book</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              required
            />

            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
            >
              <option value="currently-reading">Currently Reading</option>
              <option value="want-to-read">Want to Read</option>
              <option value="finished">Finished</option>
            </select>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowAddBook(false)}>
                Cancel
              </button>
              <button type="submit">Add Book</button>
            </div>
          </form>
        </div>
      )}

      {showSearch && (
        <div className="modal-backdrop">
          <form className="book-modal" onSubmit={handleSearch}>
            <h2>Search Books</h2>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, or genre"
              required
            />

            <div className="modal-actions">
              <button type="button" onClick={() => setShowSearch(false)}>
                Cancel
              </button>
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}