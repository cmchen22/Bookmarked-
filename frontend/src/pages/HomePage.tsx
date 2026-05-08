import BookshelfRow from "../components/BookshelfRow";
import "./HomePage.css";

type BookItem = {
  kind: "book";
  height: number;
  color: string;
  width?: number;
  tilt?: number;
};

type DecorItem = {
  kind: "decor";
  type: string;
  label: string;
  path: string;
};

type ShelfItem = BookItem | DecorItem;

type Row = {
  items: ShelfItem[];
};

const HomePage = () => {
    const rows: Row[] = [
    {
        items: [
        { kind: "book", height: 150, width: 38, color: "#6b4f3a", tilt: -1 },
        { kind: "book", height: 165, width: 40, color: "#2f6b43", tilt: 1 },
        { kind: "book", height: 145, width: 38, color: "#477a4f", tilt: -1 },
        { kind: "book", height: 160, width: 38, color: "#5a4632", tilt: 1 },

        { kind: "decor", type: "candle", label: "Reviews", path: "/reviews" },

        { kind: "book", height: 170, width: 40, color: "#5c2f6e", tilt: -1 },
        { kind: "book", height: 180, width: 42, color: "#9a3940", tilt: 1 },
        { kind: "book", height: 160, width: 40, color: "#3f6f8f", tilt: -2 },

        { kind: "decor", type: "plant", label: "Community", path: "/social" },

        { kind: "book", height: 155, width: 40, color: "#2f6b43", tilt: 1 },
        { kind: "book", height: 168, width: 42, color: "#9a5a32", tilt: -1 },
        { kind: "book", height: 160, width: 40, color: "#1f6d63", tilt: 1 },
        { kind: "book", height: 150, width: 36, color: "#9c7a53", tilt: -1 },
        ],
    },
    {
        items: [
        { kind: "book", height: 150, width: 42, color: "#5d4b7c" },
        { kind: "book", height: 140, width: 38, color: "#5a4632" },

        { kind: "decor", type: "clock", label: "Progress", path: "/progress" },

        { kind: "book", height: 160, width: 40, color: "#204d7a", tilt: -2 },
        { kind: "book", height: 170, width: 42, color: "#3d2a72" },
        { kind: "book", height: 162, width: 40, color: "#2f5177", tilt: 1 },
        { kind: "book", height: 158, width: 40, color: "#9a3940", tilt: -1 },
        { kind: "book", height: 150, width: 38, color: "#6b4f3a" },
        { kind: "book", height: 170, width: 40, color: "#5c7693", tilt: 1 },

        { kind: "decor", type: "stack", label: "Lists", path: "/lists" },

        { kind: "book", height: 168, width: 42, color: "#2f6483", tilt: -1 },
        ],
    },
    {
        items: [
        { kind: "decor", type: "bookStackLeft", label: "Lists", path: "/lists" },

        { kind: "book", height: 145, width: 40, color: "#9a4d58" },
        { kind: "book", height: 170, width: 42, color: "#8a8c91", tilt: 1 },
        { kind: "book", height: 145, width: 40, color: "#3f6b43" },
        { kind: "book", height: 156, width: 40, color: "#437568", tilt: -1 },

        { kind: "decor", type: "candleSmall", label: "Favorites", path: "/favorites" },

        { kind: "book", height: 172, width: 40, color: "#466534" },
        { kind: "book", height: 164, width: 40, color: "#5b7088" },
        { kind: "book", height: 168, width: 40, color: "#1f7a42" },
        { kind: "book", height: 180, width: 42, color: "#c48ea2" },

        { kind: "decor", type: "globe", label: "Discover", path: "/discovery" },

        { kind: "book", height: 172, width: 40, color: "#7b6f67" },
        { kind: "book", height: 180, width: 42, color: "#5c4b88", tilt: 1 },
        ],
    },
    {
        items: [
        { kind: "book", height: 152, width: 40, color: "#9a4b37" },
        { kind: "book", height: 148, width: 40, color: "#6d84a0" },
        { kind: "book", height: 158, width: 40, color: "#5c6488" },

        { kind: "decor", type: "magnifier", label: "Search", path: "/search" },

        { kind: "book", height: 170, width: 40, color: "#2b6b5d", tilt: -1 },
        { kind: "book", height: 174, width: 40, color: "#d8a3be" },
        { kind: "book", height: 150, width: 40, color: "#4f3279" },

        { kind: "decor", type: "bear", label: "Profile", path: "/profile" },

        { kind: "book", height: 160, width: 40, color: "#7a6930" },
        { kind: "book", height: 172, width: 40, color: "#3f7a53", tilt: 2 },
        ],
    },
    ];

    return (
        <div className="home-page">
            <header className="home-topbar">
            <div className="brand">
                <img src="/Logo.svg" alt="Bookmarked logo" className="logo" />
                <span>Bookmarked</span>
            </div>

            <div className="topbar-actions">
                <button className="topbar-btn">↗ 7 Trending</button>
                <button className="topbar-btn">⊕ Post</button>
                <button className="profile-btn">◯</button>
            </div>
            </header>

            <main className="bookshelf-wrapper">
            {rows.map((row, index) => (
                <BookshelfRow key={index} items={row.items} />
            ))}
            </main>

            <footer className="home-footer">
            Discover your next favorite book • Driven by community reviews
            </footer>
        </div>
    );
};
export default HomePage;