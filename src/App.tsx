import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Parola home">
          <span className="brand-mark" aria-hidden="true">
            p
          </span>
          <span>parola</span>
        </a>
        <span className="language-badge">
          <span aria-hidden="true">🇮🇹</span>
          Italian
        </span>
      </header>

      <main className="welcome" id="main-content">
        <div className="welcome-copy">
          <p className="eyebrow">A LITTLE PRACTICE GOES A LONG WAY</p>
          <h1>
            Italian, one word <span>at a time.</span>
          </h1>
          <p className="welcome-description">
            Grow your vocabulary with quick, focused flashcard sessions. No
            pressure—just a few words and a little progress every day.
          </p>
        </div>

        <div className="lesson-note" aria-label="How it works">
          <span className="lesson-note-icon" aria-hidden="true">
            ✳
          </span>
          <div>
            <p className="lesson-note-title">Your daily dose of Italian</p>
            <p className="lesson-note-description">
              Read an English prompt, type the Italian, and learn as you go.
            </p>
          </div>
          <span className="lesson-note-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </main>

      <footer className="footer">
        <span>Made for curious minds</span>
        <span className="footer-dot" aria-hidden="true">
          ·
        </span>
        <span>Andiamo!</span>
      </footer>
    </div>
  );
}

export default App;
