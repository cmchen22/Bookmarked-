type BookProps = {
  height: number;
  color: string;
};

const Book = ({ height, color }: BookProps) => {
  return (
    <div
      className="book"
      style={{
        height: `${height}px`,
        backgroundColor: color,
      }}
    >
      <div className="book-shine"></div>
    </div>
  );
};

export default Book;