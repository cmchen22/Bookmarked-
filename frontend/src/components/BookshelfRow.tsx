import Book from "./Book";
import DecorItem from "./DecorItem";

type BookData = {
  height: number;
  color: string;
};

type DecorData = {
  type: string;
  label: string;
  path: string;
};

type BookshelfRowProps = {
  books: BookData[];
  decor: DecorData[];
  bookLabel: string;
  bookPath: string;
};

const BookshelfRow = ({ books, decor, bookLabel, bookPath }: BookshelfRowProps) => {
  const middleIndex = Math.ceil(books.length / 2);
  const leftBooks = books.slice(0, middleIndex);
  const rightBooks = books.slice(middleIndex);

  return (
    <div className="shelf-row">
      <div className="shelf-inner">
        <button
          className="book-group-btn"
          onClick={() => console.log(bookPath)}
          aria-label={bookLabel}
        >
          {leftBooks.map((book, index) => (
            <Book key={`left-${index}`} height={book.height} color={book.color} />
          ))}
        </button>

        {decor.map((item, index) => (
          <button
            key={index}
            className="decor-btn"
            onClick={() => console.log(item.path)}
            aria-label={item.label}
          >
            <DecorItem type={item.type} />
          </button>
        ))}

        <button
          className="book-group-btn"
          onClick={() => console.log(bookPath)}
          aria-label={bookLabel}
        >
          {rightBooks.map((book, index) => (
            <Book key={`right-${index}`} height={book.height} color={book.color} />
          ))}
        </button>
      </div>
    </div>
  );
};
export default BookshelfRow;