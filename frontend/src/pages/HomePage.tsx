import BookshelfRow from "../components/BookshelfRow";
import "./HomePage.css";

const HomePage = () => {
    const rows = [
        {
            books: [
                { height: 150, color: "#6b4f3a" },
                { height: 165, color: "#3f6b43" },
                { height: 148, color: "#4d7a4f" },
                { height: 160, color: "#5a4632" },
                { height: 172, color: "#5c2f6e" },
                { height: 180, color: "#9a3940" },
                { height: 170, color: "#3f6f8f" },
                { height: 158, color: "#3f6b43" },
                { height: 168, color: "#9a5a32" },
                { height: 166, color: "#1f6d63" },
                { height: 154, color: "#9c7a53" },
            ],
            decor: ["candle", "plant"],
        },
        {
            books: [
                { height: 152, color: "#5d4b7c" },
                { height: 146, color: "#5a4632" },
                { height: 160, color: "#204d7a" },
                { height: 168, color: "#3d2a72" },
                { height: 164, color: "#2f5177" },
                { height: 162, color: "#9a3940" },
                { height: 156, color: "#6b4f3a" },
                { height: 172, color: "#5c7693" },
                { height: 170, color: "#2f6483" },
            ],
            decor: ["clock", "stack"],
        },
        {
            books: [
                { height: 145, color: "#9a4d58" },
                { height: 170, color: "#8a8c91" },
                { height: 145, color: "#3f6b43" },
                { height: 156, color: "#437568" },
                { height: 172, color: "#466534" },
                { height: 174, color: "#5b7088" },
                { height: 168, color: "#1f7a42" },
                { height: 180, color: "#c48ea2" },
                { height: 172, color: "#7b6f67" },
                { height: 180, color: "#5c4b88" },
            ],
            decor: ["candleSmall", "globe", "bookStackLeft"],
        },
        { 
            books: [
                { height: 152, color: "#9a4b37" },
                { height: 148, color: "#6d84a0" },
                { height: 158, color: "#5c6488" },
                { height: 170, color: "#2b6b5d" },
                { height: 174, color: "#d8a3be" },
                { height: 150, color: "#4f3279" },
                { height: 160, color: "#7a6930" },
                { height: 172, color: "#3f7a53" },
            ],
            decor: ["magnifier", "bear"],
        },
    ];

    return (
        <div className="home-page">
            <header className="home-topbar">
                <div className="brand">📖 Bookmarked</div>
            <div className="topbar-actions">
            <button className="topbar-btn">↗ 7 Trending</button>
            <button className="topbar-btn">⊕ Post</button>
            <button className="profile-btn">◯</button>
            </div>
        </header>

        <main className="bookshelf-wrapper">
            {rows.map((row, index) => (
                <BookshelfRow key={index} books={row.books} decor={row.decor} />
            ))}
        </main>

        <footer className="home-footer">
            Discover your next favorite book • Driven by community reviews
        </footer>
    </div>
    );   
};

export default HomePage;