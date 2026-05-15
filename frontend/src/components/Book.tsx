type BookProps = {
  height: number;
  color: string;
  width?: number;
  tilt?: number;
  title?: string;
  author?: string;
  onClick?: () => void;
};

const Book = ({
  height,
  color,
  width = 40,
  tilt = 0,
  title,
  author,
  onClick,
}: BookProps) => {
  return (
    <button
      className="book-wrapper"
      onClick={onClick}
      title={title && author ? `${title} by ${author}` : title}
    >
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

        {title && <span className="book-title">{title}</span>}
      </div>
    </button>
  );
};

export default Book;