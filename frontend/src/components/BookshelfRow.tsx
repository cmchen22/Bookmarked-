import { use } from "react";
import Book from "./Book";
import DecorItem from "./DecorItem";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()
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
              onClick={() => navigate(item.path)}
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