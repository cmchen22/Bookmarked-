# Bookmarked vs Rate Your Music (RYM): Detailed Feature Gap Audit

Date: April 26, 2026

Scope: user-facing product features and platform capabilities

## How To Read This

Status color code:

- 🟢 GREEN: Implemented and wired end-to-end
- 🟠 AMBER: Partial, prototype, or UI-only
- 🔴 RED: Not implemented

Evidence basis:

- Current frontend routes and pages
- Current backend API and data flow
- Prisma schema and runtime usage

## Executive Summary

Bookmarked has strong MVP momentum in discovery UX and per-item page templating, but most RYM-defining systems are still missing.

The biggest gap is not visual polish. The biggest gap is platform depth:

- persistent user data
- catalog actions
- charts and lists
- social graph and moderation workflows

Current state by area:

- 🟢 Discovery UI flow, dynamic book page route format, basic review API validation
- 🟠 Metadata quality, review rendering on detail pages, profile/social pages, persistence readiness
- 🔴 Lists, charts, recommendation engine, follows/compatibility, moderation queue, contribution system

## 1. Feature Inventory: Exactly What Exists Now

### 1.1 Routing and page structure

- 🟢 Multi-page app routing exists (landing, home, dashboard, social, sign-in, discovery, detail route)
- 🟢 Dynamic item page route exists (`/discovery/:bookId`) using a reusable template

### 1.2 Discovery

- 🟢 External search via Open Library
- 🟢 Genre chip filtering, min-rating filtering, sorting, pagination
- 🟢 Rating source transparency (Google Books vs starter estimate)
- 🟠 Results per page are low by default; no infinite scroll; no prefetch

### 1.3 Detail page (RYM-inspired format)

- 🟢 Metadata grid, issues section, review block, rate/catalog UI controls
- 🟠 Friends rating, rank, and some descriptors are generated heuristics
- 🟠 Reviews shown on detail page are generated placeholders, not real user review records

### 1.4 Backend API and data

- 🟢 `/api/books`, `/api/reviews`, `POST /api/reviews` are implemented
- 🟢 Zod validation for review payload, rating range and increment constraints
- 🟠 Runtime data is in-memory arrays
- 🟠 Prisma schema exists but is not used by runtime endpoints

### 1.5 Social/profile/dashboard

- 🟠 Social feed page exists, but data is local static arrays
- 🟠 Dashboard/profile exists, but metrics and activity are mock
- 🟠 Sign-in surface exists without integrated auth/session backend

## 2. Detailed RYM Comparison Matrix

| RYM capability area | RYM baseline | Bookmarked status | Exact missing pieces |
| --- | --- | --- | --- |
| Core database depth | Multi-entity canonical graph (artists, labels, songs, issues, descriptors, films) | 🟠 Books-first MVP only | Internal canonical entity model, source-of-truth IDs, merge/dedupe, contribution audit trail |
| Ratings engine | Sitewide rating math + weighting + chart ranking | 🟠 Basic average/count updates | Weighted scoring rules, anti-manipulation thresholds, historical score tracking |
| Reviews system | Rich review ecosystem with sort modes, profile integration, moderation | 🟠 Create/read API + mock UI areas | Real review pagination, sort modes, vote helpfulness, spoiler controls, report/flag flow |
| Cataloging | Own/wishlist/listened/relisten states + profile/library views | 🔴 Not implemented | Catalog tables, per-user status actions, catalog filters, visibility/privacy settings |
| Lists | Ranked/unranked lists and list discovery | 🔴 Not implemented | List model, list item ordering, list comments, list search, list feed |
| Charts | Advanced multi-filter charts and saved chart configs | 🔴 Not implemented | Chart query engine, weighting modes, country/language/year filters, saved chart presets |
| Genre/descriptor governance | Community voting and taxonomy moderation | 🔴 Not implemented | Vote model, confidence scoring, moderation queue, taxonomy admin tools |
| Recommendations | Personalized + challenge recommendations | 🔴 Not implemented | Taste vectors, recommendation service, cold-start logic, feedback loop |
| Search | Fast first-party index with typeahead and relevance | 🟠 External API query only | Internal search index, autocomplete, cross-entity result ranking |
| Social graph | Follow graph, compatibility, social discovery | 🔴 Not implemented | Follow edges, compatibility math, activity feed service, notification system |
| Community/forums | Boards, threads, moderation and reporting | 🔴 Not implemented | Forum data model, moderation tooling, trust/role model, anti-abuse controls |
| Contribution workflow | User submissions with approval queues | 🔴 Not implemented | Submission forms, diff review queue, accepted/rejected audit logs |
| Subscription/ops features | Tiered features, sponsored pages, access controls | 🔴 Not implemented | Billing, feature gates, sponsorship logic, policy/admin tooling |

## 3. Gap Breakdown By System (Exact Missing Work)

### 3.1 Data and persistence

Current:

- Prisma schema exists for User, Book, Genre, Review
- Runtime API still reads/writes in-memory arrays

Missing exactly:

- Prisma client integration in runtime API
- DB-backed CRUD for books/reviews/users
- Proper migrations applied and seed strategy defined
- Stable internal IDs for externally sourced records
- Conflict resolution when external metadata changes
- Caching layer for Open Library and Google Books responses

Definition of done:

- API survives restarts with no data loss
- All write flows persist to Postgres
- Seed and migrate are reproducible in local and prod

### 3.2 Ratings and review integrity

Current:

- Rating value constraints are validated in API
- Aggregate rating/count update in memory

Missing exactly:

- One-rating-per-user-per-book policy
- Update/delete review paths and recompute logic
- Rating distribution histogram computation
- Time-windowed trend metrics
- Review vote usefulness model
- Spoiler and moderation controls

Definition of done:

- Ratings remain consistent after create/update/delete
- Abuse-resistant constraints are enforced
- Release pages show real distribution and trend data

### 3.3 Book pages vs RYM-style release pages

Current:

- Good template structure exists with sections resembling RYM layout

Missing exactly:

- Real issue data enrichment and pagination
- Real review list with sorting modes (votes/date/length)
- Track/edition-level metadata depth
- Related lists and related releases rails
- Real rank based on internal chart engine

Definition of done:

- Detail pages are fully data-driven, no heuristic placeholders

### 3.4 Catalog, lists, and charts

Current:

- Catalog controls are visible in UI

Missing exactly:

- User catalog table(s): want/read/reading/read/owned
- List creation, ordering, and comments
- Chart generation service and filter schema
- Saved chart configs per user
- Chart page UX and pagination depth

Definition of done:

- Users can maintain a personal canon and browse charts with persistent filters

### 3.5 Social graph and identity

Current:

- Social UI exists but mock-backed

Missing exactly:

- Authentication (register/login/session refresh/logout)
- User profile persistence and edit paths
- Follow/unfollow APIs and storage
- Activity feed generation from real events
- Notification delivery model

Definition of done:

- Users have real identities and interconnected timelines

### 3.6 Governance and moderation

Current:

- No contribution queue or moderation flow

Missing exactly:

- Submission queue for edits/new entries
- Moderator role and permissions
- Accept/reject workflow with rationale
- Report abuse flow and audit logs

Definition of done:

- Community edits are possible without sacrificing data quality

## 4. Color-Coded Priority Roadmap

### Phase 1: Foundation (must-have)

- 🔴 Wire runtime API to Postgres via Prisma
- 🔴 Add auth/session and real user IDs on writes
- 🔴 Replace detail-page mock reviews with DB-backed reviews

### Phase 2: Product core loop

- 🔴 Implement catalog states and user library pages
- 🔴 Implement user lists
- 🔴 Build v1 charts (year + genre + rating-count threshold)

### Phase 3: RYM-like differentiation

- 🔴 Descriptor voting and taxonomy governance
- 🔴 Compatibility + recommendation engine
- 🔴 Contribution queue and moderation tooling

## 5. Practical Scorecard (Bookmarked vs RYM)

Use this to track progress monthly.

| Area | Current score (0-5) | Why |
| --- | --- | --- |
| Discovery UX | 3.5 | Good browse/search/filter flow already exists |
| Data reliability | 1.5 | Runtime still in-memory; persistence not wired |
| Reviews and ratings depth | 2.0 | Basic create/read works, but advanced integrity missing |
| Cataloging power | 0.5 | Mostly UI-only controls today |
| Lists/charts ecosystem | 0.5 | Not yet implemented |
| Social graph | 1.0 | Social UI exists, graph and identity not persistent |
| Moderation/governance | 0.0 | No queue or role-based moderation yet |

Overall maturity vs RYM-style target: 1.3 / 5.0

## 6. Bottom Line

Bookmarked is on the right product path and now has a reusable RYM-like page format.

What is still missing is the actual platform layer behind the UI:

- persistent storage
- user identity
- catalog/list/chart engines
- moderation and contribution workflows

Once those are built, the product can shift from polished MVP to true RYM-style ecosystem for books.
