import Book from "./Book";
import DecorItem from "./DecorItem";
import { useNavigate } from "react-router-dom";

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
};

type Shelf = {
  id: string;
  name: string;
};

type BookshelfRowProps = {
  shelf: Shelf;
  books: UserBook[];
  onBookClick: (book: UserBook) => void;
  onSearchClick: () => void;
};

const BookshelfRow = ({
  shelf,
  books,
  onBookClick,
  onSearchClick,
}: BookshelfRowProps) => {
  const navigate = useNavigate();

  return (
    <section className="shelf-row">
      <div className="shelf-inner">

        {books.map((book) => (
          <Book
            key={book.id}
            title={book.title}
            author={book.author}
            height={book.height}
            width={book.width}
            color={book.color}
            tilt={book.tilt}
            onClick={() => onBookClick(book)}
          />
        ))}

        {shelf.id === "currently-reading" && (
          <>
            <button className="decor-btn" onClick={onSearchClick} aria-label="Search">
              <DecorItem type="magnifier" label="Search" />
            </button>

            <button
              className="decor-btn"
              onClick={() => navigate("/discovery")}
              aria-label="Discovery"
            >
              <DecorItem type="globe" label="Discover" />
            </button>
          </>
        )}

        {shelf.id === "want-to-read" && (
          <button
            className="decor-btn"
            onClick={() => navigate("/profile")}
            aria-label="Profile"
          >
            <DecorItem type="bear" label="Profile" />
          </button>
        )}

        {shelf.id === "finished" && (
          <>
            <button
              className="decor-btn"
              onClick={() => navigate("/social")}
              aria-label="Social Feed"
            >
              <DecorItem type="plant" label="Social" />
            </button>

            <button
              className="decor-btn"
              onClick={() => navigate("/reviews")}
              aria-label="Reviews"
            >
              <DecorItem type="candleSmall" label="Reviews" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default BookshelfRow;