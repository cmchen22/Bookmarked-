# Bookmarked → RYM Parity: Solo Dev Checklist

> One developer. Phase by phase. Check every box to reach full parity with Rate Your Music.
> Each task is something you can literally sit down and do in a session.
> Phases must be done in order — later phases depend on earlier ones.

---

## PHASE 1 — Make the Database Real

> Right now everything lives in memory and disappears on restart. Fix that first.

### 1.1 Postgres Setup

- [ ] Install Postgres locally (or spin up a free Railway/Supabase instance)
- [ ] Create a database named `bookmarked`
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Set `DATABASE_URL` in `backend/.env` to your Postgres connection string

### 1.2 Wire Prisma to Runtime

- [ ] Run `npx prisma generate` inside `backend/`
- [ ] Run `npx prisma migrate dev --name init` to push the schema
- [ ] In `backend/src/server.ts`, import `PrismaClient` and instantiate it
- [ ] Replace the in-memory `books` array in `data.ts` with `prisma.book.findMany()`
- [ ] Replace the in-memory `reviews` array with `prisma.review.findMany()`
- [ ] Replace `POST /api/reviews` write with `prisma.review.create(...)`
- [ ] Delete the in-memory arrays from `data.ts` entirely
- [ ] Confirm: restart the server, post a review, restart again — the review survives

### 1.3 Seed Real Data

- [ ] Populate `backend/prisma/seed.ts` with 20+ real books (title, author, genre, cover, description)
- [ ] Run `npx prisma db seed` and verify data appears in the DB
- [ ] Update `GET /api/books` to query Prisma with optional genre and search filters

**Phase 1 done when:** The app runs with zero in-memory state. All data lives in Postgres.

---

## PHASE 2 — User Accounts

> Every feature after this requires knowing who the user is.

### 2.1 Auth Backend

- [ ] Add `bcrypt` and `jsonwebtoken` to `backend/package.json`
- [ ] Add `User` model to Prisma schema if not already there: `id, email, username, passwordHash, createdAt`
- [ ] Run `npx prisma migrate dev --name add-user`
- [ ] Create `POST /api/auth/register` — hash password, create user, return JWT
- [ ] Create `POST /api/auth/login` — verify password, return JWT
- [ ] Create `GET /api/auth/me` — decode JWT from `Authorization` header, return user profile
- [ ] Write a middleware function `requireAuth` that reads the JWT and attaches `req.user`
- [ ] Protect `POST /api/reviews` with `requireAuth`

### 2.2 Auth Frontend

- [ ] Build a `SignInPage` form that calls `POST /api/auth/login` and stores the JWT in `localStorage`
- [ ] Build a `RegisterPage` form that calls `POST /api/auth/register`
- [ ] Add a route for `/register` in `App.tsx`
- [ ] Create an `AuthContext` (React context) that holds the current user and exposes `login()` / `logout()`
- [ ] Show username + logout button in the nav when logged in; show sign-in link when not
- [ ] Redirect unauthenticated users away from protected pages (dashboard, profile)

### 2.3 User Profiles

- [ ] Create a `ProfilePage` at `/user/:username`
- [ ] `GET /api/users/:username` returns public profile info (username, join date, review count)
- [ ] Profile page shows the user's recent reviews pulled from the API
- [ ] Add a route for `/user/:username` in `App.tsx`

**Phase 2 done when:** You can register, log in, stay logged in across refreshes, and visit a profile URL.

---

## PHASE 3 — Real Ratings and Reviews

> Right now reviews are mocked. Make them real and fully featured.

### 3.1 Data Model

- [ ] Add `rating` (Float), `text` (String?), `spoiler` (Boolean), `userId` (FK) to the `Review` model
- [ ] Add a unique constraint: one review per user per book (`@@unique([userId, bookId])`)
- [ ] Run `npx prisma migrate dev --name real-reviews`

### 3.2 API

- [ ] `POST /api/reviews` — enforce the unique constraint, reject duplicates with a 409
- [ ] `PUT /api/reviews/:id` — let users edit their own review (check `req.user.id === review.userId`)
- [ ] `DELETE /api/reviews/:id` — let users delete their own review
- [ ] `GET /api/books/:id/reviews` — return reviews with `?sort=recent|rating|helpful`
- [ ] `POST /api/reviews/:id/vote` — upvote/downvote a review as helpful (store in a `ReviewVote` table)

### 3.3 Detail Page

- [ ] Replace mock reviews on `BookDetailPage.tsx` with real reviews fetched from `GET /api/books/:id/reviews`
- [ ] Show reviewer username, date, rating, and text for each review
- [ ] Add sort controls: Recent / Highest rated / Most helpful
- [ ] If the logged-in user already has a review, show their review at the top with Edit/Delete buttons
- [ ] Add a spoiler toggle — blur spoiler review text until clicked
- [ ] Add a "Report" button on each review (stores a flag in a `ReviewReport` table, no UI needed yet)

### 3.4 Rating Histogram

- [ ] `GET /api/books/:id/ratings` returns the count of each rating value (0.5–5.0)
- [ ] Render a bar chart histogram on the detail page using those real counts
- [ ] Show real average rating and total rating count (not Google Books data)

**Phase 3 done when:** A logged-in user can rate/review a book, edit it, delete it, and all reviews are real DB records shown on the detail page.

---

## PHASE 4 — Personal Library (Catalog)

> This is one of RYM's most-used features. Users track what they've read.

### 4.1 Data Model

- [ ] Create a `LibraryEntry` model: `id, userId, bookId, status, createdAt, updatedAt`
- [ ] `status` is an enum: `WANT_TO_READ | READING | READ | OWNED | ABANDONED`
- [ ] Add unique constraint: one entry per user per book
- [ ] Run `npx prisma migrate dev --name library`

### 4.2 API

- [ ] `POST /api/library` — add or update a library entry for the logged-in user
- [ ] `DELETE /api/library/:bookId` — remove a book from the library
- [ ] `GET /api/library` — return the logged-in user's full library, filterable by `?status=READ`
- [ ] `GET /api/users/:username/library` — return a user's public library

### 4.3 UI — Detail Page Controls

- [ ] On `BookDetailPage.tsx`, replace the mock catalog buttons with real ones wired to the API
- [ ] Show the current status (if any) with the active button highlighted
- [ ] "Mark as Read", "Want to Read", "Currently Reading", "Owned", "Abandon" buttons
- [ ] Optimistically update the UI on click; revert on API error

### 4.4 UI — Library Page

- [ ] Create a `LibraryPage` at `/library` (requires auth)
- [ ] Show all books in the user's library grouped by status tab: Read / Reading / Want to Read / Owned
- [ ] Each book shows cover, title, author, rating (if reviewed), and status
- [ ] Add a search/filter bar to filter within the library
- [ ] Sort options: Date added / Title / Author / Your rating

**Phase 4 done when:** A user can mark any book with a status, view their full library, and filter it.

---

## PHASE 5 — Lists

> RYM's lists are a social + curatorial layer. Users make ranked lists of books.

### 5.1 Data Model

- [ ] Create `List` model: `id, userId, title, description, ranked (Boolean), createdAt`
- [ ] Create `ListItem` model: `id, listId, bookId, position (Int), note (String?)`
- [ ] Create `ListComment` model: `id, listId, userId, text, createdAt`
- [ ] Run `npx prisma migrate dev --name lists`

### 5.2 API

- [ ] `POST /api/lists` — create a list
- [ ] `PUT /api/lists/:id` — edit list title/description/ranked flag
- [ ] `DELETE /api/lists/:id` — delete a list (owner only)
- [ ] `POST /api/lists/:id/items` — add a book to a list
- [ ] `DELETE /api/lists/:id/items/:bookId` — remove a book from a list
- [ ] `PUT /api/lists/:id/items/reorder` — accept an array of `{ bookId, position }` and update order
- [ ] `GET /api/lists/:id` — fetch a list with all items and book metadata
- [ ] `GET /api/users/:username/lists` — fetch all lists by a user
- [ ] `GET /api/lists` — browse/discover lists (recent, popular)
- [ ] `POST /api/lists/:id/comments` — add a comment to a list
- [ ] `GET /api/lists/:id/comments` — get comments for a list

### 5.3 UI

- [ ] Create `ListDetailPage` at `/lists/:id` — shows list title, description, ranked items with covers
- [ ] Create `ListEditorPage` at `/lists/:id/edit` — drag-and-drop reordering of items, note per item
- [ ] Create `CreateListPage` at `/lists/new` — form for title, description, ranked toggle
- [ ] Add "Add to List" button on `BookDetailPage` — dropdown of user's lists + create new
- [ ] Add a "Lists" tab on `ProfilePage` showing the user's lists
- [ ] Create a lists discovery section on the home feed showing recent/popular lists

**Phase 5 done when:** A user can create a ranked list, add books, reorder them, publish it, and others can comment on it.

---

## PHASE 6 — Charts

> RYM's charts let users build custom "best of" views with filters. This is a power feature.

### 6.1 Chart Engine (Backend)

- [ ] Create `GET /api/charts` that accepts query params: `genre`, `yearFrom`, `yearTo`, `language`, `minRatings`, `sort` (`avg_rating | rating_count | weighted`)
- [ ] Implement weighted score (Bayesian average): `score = (v / (v + m)) * R + (m / (v + m)) * C`
  - `v` = number of ratings for the book
  - `m` = minimum ratings threshold (e.g. 10)
  - `R` = book's average rating
  - `C` = global average rating across all books
- [ ] Return top 100 books matching the filters, sorted by the chosen method

### 6.2 Saved Chart Configs

- [ ] Create `SavedChart` model: `id, userId, name, filters (Json), createdAt`
- [ ] `POST /api/charts/saved` — save a chart config
- [ ] `GET /api/charts/saved` — list the user's saved charts
- [ ] `DELETE /api/charts/saved/:id` — delete a saved chart

### 6.3 UI

- [ ] Create `ChartsPage` at `/charts`
- [ ] Build a filter panel: genre multiselect, year range slider, language dropdown, min ratings input, sort mode
- [ ] Render the chart as a numbered list with rank, cover, title, author, weighted score, rating count
- [ ] "Save this chart" button — prompts for a name and calls the save API
- [ ] "My saved charts" section showing saved configs as clickable presets
- [ ] Link to Charts from the main nav

**Phase 6 done when:** A user can configure a chart with filters, see a ranked list, and save their config.

---

## PHASE 7 — Social Graph

> RYM's social layer is follow-based. You see what your friends are reading/rating.

### 7.1 Data Model

- [ ] Create `Follow` model: `followerId, followingId, createdAt` (composite primary key)
- [ ] Create `Activity` model: `id, userId, type (REVIEW|CATALOG|LIST|FOLLOW), refId, createdAt`
- [ ] Run `npx prisma migrate dev --name social`

### 7.2 API

- [ ] `POST /api/follow/:username` — follow a user
- [ ] `DELETE /api/follow/:username` — unfollow a user
- [ ] `GET /api/users/:username/followers` — list followers
- [ ] `GET /api/users/:username/following` — list who they follow
- [ ] `GET /api/feed` — returns recent activity from users the logged-in user follows (reviews, catalog updates, new lists)
- [ ] Write an activity record automatically when a user: posts a review, updates library status, creates a list, follows someone

### 7.3 Compatibility Score

- [ ] `GET /api/users/:username/compatibility` — compare your rated books to another user's
- [ ] Algorithm: for books both users rated, compute average absolute difference in ratings; convert to 0–100 score (lower difference = higher score)
- [ ] Show compatibility score on `ProfilePage` when viewing another user

### 7.4 UI

- [ ] Create a `FeedPage` at `/feed` — shows activity from followed users, newest first
- [ ] Each feed item shows: who did what, which book, when, and a snippet (e.g. "Alice rated *Dune* 4.5 ★")
- [ ] Add Follow/Unfollow button on `ProfilePage`
- [ ] Show follower/following counts on `ProfilePage`
- [ ] Show compatibility score on other users' profile pages

**Phase 7 done when:** You can follow a user, see their activity in your feed, and get a compatibility score with any user.

---

## PHASE 8 — First-Party Search

> Right now search depends entirely on Open Library. Build your own index.

### 8.1 Search Index (Postgres full-text — no Elasticsearch needed yet)

- [ ] Add a generated `tsvector` column to the `Book` table combining `title + author + genres`
- [ ] Run `npx prisma migrate dev --name search-index`
- [ ] `GET /api/search?q=...` — use Postgres full-text search (`to_tsquery`) across books and users, return top 20
- [ ] `GET /api/search/suggest?q=...` — return top 5 title/author suggestions for typeahead (fast prefix query)

### 8.2 Frontend

- [ ] Replace the Open Library search call in `DiscoveryPage.tsx` with `GET /api/search?q=...`
- [ ] Keep Open Library as fallback only when your local DB returns zero results
- [ ] Add a global search bar in the nav that calls `/api/search/suggest` on every keystroke and shows a dropdown
- [ ] Dropdown shows: matching books (cover + title) and matching users (username)
- [ ] Pressing Enter or clicking a result navigates to the detail/profile page

**Phase 8 done when:** Search is powered by your own DB first. The nav has a working typeahead that finds books and users.

---

## PHASE 9 — Descriptors and Genre Governance

> RYM lets the community tag and vote on genres/descriptors for each item.

### 9.1 Data Model

- [ ] Create `Descriptor` model: `id, bookId, label, createdAt`
- [ ] Create `DescriptorVote` model: `id, descriptorId, userId, value (1 or -1)` with unique constraint on `(descriptorId, userId)`
- [ ] Run `npx prisma migrate dev --name descriptors`

### 9.2 API

- [ ] `GET /api/books/:id/descriptors` — return descriptors sorted by net votes (upvotes minus downvotes)
- [ ] `POST /api/books/:id/descriptors` — suggest a new descriptor (requires auth)
- [ ] `POST /api/descriptors/:id/vote` — cast or change a vote; toggling the same value removes the vote
- [ ] Descriptors with net votes below -5 are excluded from the public response automatically

### 9.3 Genre Suggestions (Admin-approved)

- [ ] Create `GenreSuggestion` model: `id, bookId, userId, genre, status (PENDING|ACCEPTED|REJECTED)`
- [ ] `POST /api/books/:id/genres/suggest` — submit a genre suggestion (requires auth)
- [ ] `PATCH /api/admin/genre-suggestions/:id` — accept or reject (admin only); on accept, update the book's genres

### 9.4 UI

- [ ] Show top descriptors on `BookDetailPage` with net vote count and up/down vote arrows
- [ ] "Suggest a descriptor" input below the descriptor list
- [ ] Clicking an arrow calls the vote API and updates the count optimistically
- [ ] Add a "Suggest genre" link on detail pages that opens a small form

**Phase 9 done when:** Any logged-in user can suggest and vote on descriptors for any book.

---

## PHASE 10 — Recommendations

> Show users books they'll probably love based on their ratings and library.

### 10.1 Collaborative Filtering (Simple Version)

- [ ] `GET /api/recommendations` — for the logged-in user, return 10 recommended books using this logic:
  1. Find the 10 users with highest compatibility scores with the current user
  2. Get their highest-rated books (rating >= 4.0)
  3. Exclude any book already in the current user's library
  4. Return the remaining books sorted by how many similar users rated them highly
- [ ] `GET /api/recommendations/challenge` — return 1 book the user hasn't read that is highly rated but in a genre they've never catalogued

### 10.2 Similar Books

- [ ] `GET /api/books/:id/similar` — find books sharing the most genre/descriptor tags, exclude the user's library, sort by rating
- [ ] Show a "Readers also enjoyed" section at the bottom of `BookDetailPage`

### 10.3 UI

- [ ] Create a `RecommendationsPage` at `/recommendations` (requires auth)
- [ ] Show 10 personalized picks in a grid with a short reason blurb ("Loved by readers similar to you")
- [ ] Show 1 "challenge" pick with different visual styling
- [ ] Add a "Similar books" section at the bottom of each `BookDetailPage`

**Phase 10 done when:** A user with 5+ ratings gets a personalized recommendation page that updates as their library grows.

---

## PHASE 11 — Community Discussions

> RYM has per-item discussion threads and general forum boards.

### 11.1 Data Model

- [ ] Create `Board` model: `id, name, description` — seed with: General, New Releases, Genre Talk, Lists & Charts
- [ ] Create `Thread` model: `id, boardId (nullable), bookId (nullable), userId, title, createdAt`
- [ ] Create `Post` model: `id, threadId, userId, text, createdAt, editedAt (nullable)`
- [ ] Run `npx prisma migrate dev --name discussions`

### 11.2 API

- [ ] `GET /api/boards` — list all boards
- [ ] `GET /api/boards/:id/threads` — list threads (paginated), sorted by latest post date
- [ ] `POST /api/boards/:id/threads` — create a new thread (requires auth)
- [ ] `GET /api/threads/:id` — get a thread with all posts
- [ ] `POST /api/threads/:id/posts` — reply to a thread (requires auth)
- [ ] `DELETE /api/posts/:id` — delete own post; admin can delete any
- [ ] `GET /api/books/:id/threads` — get threads attached to a specific book
- [ ] `POST /api/books/:id/threads` — start a thread about a specific book

### 11.3 UI

- [ ] Create `ForumsPage` at `/forums` showing the list of boards with post counts
- [ ] Create `BoardPage` at `/forums/:boardId` showing threads (title, author, reply count, last active time)
- [ ] Create `ThreadPage` at `/forums/thread/:id` showing all posts with a reply box at the bottom
- [ ] On `BookDetailPage`, add a "Discussions" tab showing recent threads about that book and a "Start a discussion" button

**Phase 11 done when:** Users can post in boards and start/reply to discussion threads on any book's page.

---

## PHASE 12 — Contribution System

> Let users propose metadata edits. You review and approve them.

### 12.1 Data Model

- [ ] Create `MetadataSubmission` model: `id, userId, bookId, field, oldValue, newValue, status (PENDING|ACCEPTED|REJECTED), reviewNote, reviewedAt`
- [ ] Run `npx prisma migrate dev --name contributions`

### 12.2 API

- [ ] `POST /api/submissions` — submit a metadata edit for any book field (requires auth)
- [ ] `GET /api/admin/submissions` — list all pending submissions (admin only)
- [ ] `PATCH /api/admin/submissions/:id` — accept or reject with optional note; on accept, apply the change to the `Book` record
- [ ] `GET /api/books/:id/history` — return accepted submissions for a book as a public edit log

### 12.3 UI

- [ ] Add an "Edit this page" link on `BookDetailPage` (only shown when logged in)
- [ ] Clicking it opens a form with all editable fields pre-filled (title, author, year, cover URL, description, genres)
- [ ] On submit, call `POST /api/submissions` and show a "Submitted for review" message
- [ ] Create an `AdminPage` at `/admin` (only accessible to admin-role users)
- [ ] Admin page lists pending submissions, each showing old vs new value as a diff with Accept / Reject buttons
- [ ] Show a "Contribution history" section on `BookDetailPage` with a log of accepted edits

**Phase 12 done when:** Any user can propose an edit; you can approve it from the admin page and the change is applied automatically.

---

## PHASE 13 — Subscriptions and Premium Features

> Optional paid tier, like RYM's subscription for advanced charts.

### 13.1 Stripe Integration

- [ ] Sign up for Stripe, get test API keys, add them to `backend/.env`
- [ ] Add `stripe` package to `backend/package.json`
- [ ] Add `stripeCustomerId`, `subscriptionStatus`, `subscriptionTier` fields to the `User` model
- [ ] Run `npx prisma migrate dev --name subscriptions`
- [ ] `POST /api/stripe/create-checkout` — create a Stripe Checkout session and return the URL
- [ ] `POST /api/stripe/webhook` — handle `checkout.session.completed` to flip `subscriptionTier` to `PREMIUM`; handle `customer.subscription.deleted` to flip it back to `FREE`

### 13.2 Feature Gating

- [ ] Write `requirePremium` middleware that returns 403 if `req.user.subscriptionTier !== 'PREMIUM'`
- [ ] Free tier: charts return top 50 only, max 10 saved charts, no language/country filters
- [ ] Premium tier: top 1000 chart results, unlimited saved charts, all filters unlocked
- [ ] Apply `requirePremium` to the advanced chart params on the backend

### 13.3 UI

- [ ] Create a `PricingPage` at `/premium` with a free vs premium comparison table
- [ ] "Upgrade" button calls `POST /api/stripe/create-checkout` and redirects to Stripe Checkout
- [ ] After successful payment, Stripe webhook updates the DB; user sees a premium badge on their profile
- [ ] Show an "Upgrade for more" nudge in the Charts UI when a free user hits the 50-result limit

**Phase 13 done when:** Stripe Checkout works in test mode end-to-end, premium features are gated on the backend, and the webhook correctly updates the user's tier.

---

## FINAL CHECKLIST — 100% Parity

> Only check these off after every task in the phase above is done.

- [ ] Phase 1 — Real database
- [ ] Phase 2 — User accounts and auth
- [ ] Phase 3 — Real ratings and reviews
- [ ] Phase 4 — Personal library / catalog
- [ ] Phase 5 — Lists
- [ ] Phase 6 — Charts with filters
- [ ] Phase 7 — Social graph and compatibility
- [ ] Phase 8 — First-party search
- [ ] Phase 9 — Descriptors and genre governance
- [ ] Phase 10 — Recommendations
- [ ] Phase 11 — Community discussions
- [ ] Phase 12 — Contribution system
- [ ] Phase 13 — Subscriptions

**All 13 phases complete = full RYM feature parity.**
