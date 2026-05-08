type BookProps = {
  height: number;
  color: string;
  width?: number;
  tilt?: number;
};

const Book = ({ height, color, width = 40, tilt = 0 }: BookProps) => {
  return (
    <div
      className="book"
      style={{
        height: `${height}px`,
        width: `${width}px`,
        backgroundColor: color,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <div className="book-line top"></div>
      <div className="book-line bottom"></div>
      <div className="book-shine"></div>
    </div>
  );
};
export default Book;