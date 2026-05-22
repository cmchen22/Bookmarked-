import Book from "./Book";
import DecorItem from "./DecorItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type UserBook = {
  id: string;
  title: string;
  author: string;
  status: "currently-reading" | "want-to-read" | "finished";
  shelfId: string;
  color: string;
  height: number;
  width: number;
  tilt: number;
  isFavorite: boolean;
};

type Shelf = {
  id: string;
  name: string;
};

type BookshelfRowProps = {
  shelf: Shelf;
  books: UserBook[];
  onBookClick: (book: UserBook) => void;
  onDeleteBook: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
  onSearchClick: () => void;
  showDecor: boolean;
  isEditingShelf: boolean;
};

const BookshelfRow = ({
  shelf,
  books,
  onDeleteBook,
  onToggleFavorite,
  onSearchClick,
  showDecor,
  isEditingShelf
}: BookshelfRowProps) => {
  const navigate = useNavigate();
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const decorUnlocked = books.length >= 3;

  return (
    <section className="shelf-row">
      <div className="shelf-inner">

        {books.map((book) => (
          <div className="book-with-actions" key={book.id}>
          <Book
            title={book.title}
            author={book.author}
            height={book.height}
            width={book.width}
            color={book.color}
            tilt={book.tilt}
            onClick={() => 
              setActiveBookId(activeBookId === book.id ? null : book.id)
            }
          />
          {activeBookId === book.id && (
            <div className="book-action-menu">
              <button onClick={() => navigate(`/books/${book.id}`)}>
                Details
              </button>

              <button onClick={() => alert("Rename feature coming soon!")}>
                Rename
              </button>

              <button onClick={() => onToggleFavorite(book.id)}>
                {book.isFavorite ? "Unfavorite" : "Favorite"}
              </button>

              <button
                className="danger"
                onClick={() => onDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        ))}

        {showDecor && decorUnlocked && shelf.id === "currently-reading" && (
          <>
            <div className="decor-container">
              <button
                className="decor-btn"
                onClick={onSearchClick}
                aria-label="Search"
              >
                <DecorItem type="magnifier" label="Search" />
              </button>

              {isEditingShelf && (
                <div className="decor-controls">
                  <button>←</button>
                  <button>→</button>
                </div>
              )}
            </div>

            <div className="decor-container">
              <button
                className="decor-btn"
                onClick={() => navigate("/discovery")}
                aria-label="Discovery"
              >
                <DecorItem type="globe" label="Discover" />
              </button>

              {isEditingShelf && (
                <div className="decor-controls">
                  <button>←</button>
                  <button>→</button>
                </div>
              )}
            </div>
          </>
        )}

        {showDecor && decorUnlocked && shelf.id === "want-to-read" && (
          <div className="decor-container">
            <button
              className="decor-btn"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
            >
              <DecorItem type="bear" label="Profile" />
            </button>

            {isEditingShelf && (
              <div className="decor-controls">
                <button>←</button>
                <button>→</button>
              </div>
            )}
          </div>
        )}

        {showDecor && decorUnlocked && shelf.id === "finished" && (
          <div className="decor-container">
            <button
              className="decor-btn"
              onClick={() => navigate("/social")}
              aria-label="Social Feed"
            >
              <DecorItem type="plant" label="Social" />
            </button>

            {isEditingShelf && (
              <div className="decor-controls">
                <button>←</button>
                <button>→</button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookshelfRow;