import Book from "./Book";
import DecorItem from "./DecorItem";

type BookType = {
  height: number;
  color: string;
};

type BookshelfRowProps = {
  books: BookType[];
  decor: string[];
};

const BookshelfRow = ({ books, decor }: BookshelfRowProps) => {
  return (
    <div className="shelf-row">
      <div className="shelf-inner">
        {books.slice(0, 4).map((book, index) => (
          <Book key={`first-${index}`} height={book.height} color={book.color} />
        ))}

        {decor[0] && <DecorItem type={decor[0]} />}

        {books.slice(4, 7).map((book, index) => (
          <Book key={`middle-${index}`} height={book.height} color={book.color} />
        ))}

        {decor[1] && <DecorItem type={decor[1]} />}

        {books.slice(7).map((book, index) => (
          <Book key={`last-${index}`} height={book.height} color={book.color} />
        ))}
      </div>
    </div>
  );
};

export default BookshelfRow;