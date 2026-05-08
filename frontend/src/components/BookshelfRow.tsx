import Book from "./Book";
import DecorItem from "./DecorItem";

type BookItem = {
  kind: "book";
  height: number;
  color: string;
  width?: number;
  tilt?: number;
};

type DecorItemData = {
  kind: "decor";
  type: string;
  label: string;
  path: string;
};

type ShelfItem = BookItem | DecorItemData;

type BookshelfRowProps = {
  items: ShelfItem[];
};

const BookshelfRow = ({ items }: BookshelfRowProps) => {
  return (
    <div className="shelf-row">
      <div className="shelf-inner">
        {items.map((item, index) => {
          if (item.kind === "book") {
            return (
              <button
                key={index}
                className="book-btn"
                onClick={() => console.log("book group clicked")}
              >
                <Book
                  height={item.height}
                  color={item.color}
                  width={item.width}
                  tilt={item.tilt}
                />
              </button>
            );
          }

          return (
            <button
              key={index}
              className="decor-btn"
              onClick={() => console.log(item.path)}
              aria-label={item.label}
            >
              <DecorItem type={item.type} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default BookshelfRow;