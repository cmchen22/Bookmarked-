import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const navigate = useNavigate();

export default function SignInPage() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("bookmarkedUser") ? true : false
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNewUser) {
      const newUser = { name, email, password };
      localStorage.setItem("bookmarkedUser", JSON.stringify(newUser));
      setIsLoggedIn(true);
      alert("Account created and signed in.");
      navigate("/home");
    } else {
      const savedUser = localStorage.getItem("bookmarkedUser");

      if (!savedUser) {
        alert("No account found. Please sign up first.");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.email === email && parsedUser.password === password) {
        setIsLoggedIn(true);
        alert("Signed in successfully.");
        navigate("/home");
      } else {
        alert("Invalid email or password.");
      }
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    alert("Signed out successfully.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3ebdf",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "32px",
          borderRadius: "18px",
          backgroundColor: "#fffaf3",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#4b2e2e",
              fontSize: "28px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <img
              src="/Logo.png"
              alt="logo"
              style={{ width: "32px", height: "32px" }}
            />
            Bookmarked
          </Link>

          <p style={{ marginTop: "8px", color: "#7a6a58" }}>
            Your social space for books
          </p>
        </div>

        {isLoggedIn ? (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#4b2e2e", marginBottom: "16px" }}>
              You are signed in
            </h2>
            <button
              onClick={handleSignOut}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#6b4f3a",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #d8cbb8",
              }}
            >
              <button
                onClick={() => setIsNewUser(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  backgroundColor: !isNewUser ? "#6b4f3a" : "#f5efe6",
                  color: !isNewUser ? "white" : "#4b2e2e",
                  cursor: "pointer",
                }}
              >
                Existing User
              </button>
              <button
                onClick={() => setIsNewUser(true)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  backgroundColor: isNewUser ? "#6b4f3a" : "#f5efe6",
                  color: isNewUser ? "white" : "#4b2e2e",
                  cursor: "pointer",
                }}
              >
                New User
              </button>
            </div>

            <form onSubmit={handleAuth}>
              {isNewUser && (
                <>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginBottom: "16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    required
                  />
                </>
              )}

              <label style={{ display: "block", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                required
              />

              <label style={{ display: "block", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                required
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#6b4f3a",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {isNewUser ? "Create Account" : "Sign In"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}