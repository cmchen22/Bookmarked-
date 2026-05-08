import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignInPage.css";

type StatusMsg = { type: "success" | "error"; text: string } | null;

const navigate = useNavigate();

export default function SignInPage() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("bookmarkedUser")
  );
  const [status, setStatus] = useState<StatusMsg>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNewUser) {
      const newUser = { name, email, password };
      localStorage.setItem("bookmarkedUser", JSON.stringify(newUser));
      setIsLoggedIn(true);
      setStatus({ type: "success", text: "Account created — welcome!" });
      navigate("/home");
    } else {
      const savedUser = localStorage.getItem("bookmarkedUser");

      if (!savedUser) {
        setStatus({ type: "error", text: "No account found. Please sign up first." });
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.email === email && parsedUser.password === password) {
        setIsLoggedIn(true);
        setStatus({ type: "success", text: "Signed in successfully." });
        navigate("/home");
      } else {
        setStatus({ type: "error", text: "Invalid email or password." });
      }
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setStatus({ type: "success", text: "You have been signed out." });
  };

  return (
    <div className="signin-shell">
      <div className="signin-card">
        <div className="signin-brand">
          <Link to="/" className="signin-brand-link">
            <img src="/Logo.png" alt="Bookmarked logo" />
            Bookmarked
          </Link>
          <p className="signin-tagline">Your social space for books</p>
        </div>

        {status && (
          <p className={`signin-status ${status.type}`}>{status.text}</p>
        )}

        {isLoggedIn ? (
          <div className="signin-logged-in">
            <h2>You are signed in</h2>
            <button className="signin-signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <div className="signin-tab-row">
              <button
                className={`signin-tab ${!isNewUser ? "active" : "inactive"}`}
                onClick={() => { setIsNewUser(false); setStatus(null); }}
              >
                Sign In
              </button>
              <button
                className={`signin-tab ${isNewUser ? "active" : "inactive"}`}
                onClick={() => { setIsNewUser(true); setStatus(null); }}
              >
                Create Account
              </button>
            </div>

            <form className="signin-form" onSubmit={handleAuth}>
              {isNewUser && (
                <>
                  <label className="signin-label">Name</label>
                  <input
                    className="signin-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </>
              )}

              <label className="signin-label">Email</label>
              <input
                className="signin-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <label className="signin-label">Password</label>
              <input
                className="signin-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <button className="signin-submit" type="submit">
                {isNewUser ? "Create Account" : "Sign In"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}