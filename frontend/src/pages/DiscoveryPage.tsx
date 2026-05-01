
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom'

type RatingSource = 'google-books' | 'starter'

type DiscoveryBook = {
	id: string
	title: string
	author: string
	genre: string
	rating: number
	reviews: number
	ratingSource: RatingSource
	image: string
	year?: number
	publisher?: string
	editionCount?: number
	trending?: boolean
	subtitle?: string
}

type OpenLibraryDoc = {
	key?: string
	cover_edition_key?: string
	edition_key?: string[]
	isbn?: string[]
	title?: string
	author_name?: string[]
	subject?: string[]
	cover_i?: number
	subtitle?: string
	first_publish_year?: number
	publisher?: string[]
	edition_count?: number
}

type OpenLibrarySearchResponse = {
	docs?: OpenLibraryDoc[]
	numFound?: number
}

type GoogleBooksResponse = {
	items?: Array<{
		volumeInfo?: {
			averageRating?: number
			ratingsCount?: number
		}
	}>
}

const genres = [
	'All',
	'Fiction',
	'Mystery',
	'Romance',
	'Science Fiction',
	'Fantasy',
	'Historical',
	'Young Adult',
	'Biography',
	'Self-Help',
	'Horror',
	'Adventure',
	'Poetry'
]
const pageSize = 12

const starterRatingFromSeed = (seed: string) => {
	let hash = 0
	for (let index = 0; index < seed.length; index += 1) {
		hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
	}

	const rating = 3.6 + (hash % 10) * 0.09
	const reviews = 160 + (hash % 2200)

	return {
		rating: Number(rating.toFixed(1)),
		reviews
	}
}

const getGoogleBooksRating = async (
	title: string,
	author: string,
	isbn: string | undefined,
	signal: AbortSignal
) => {
	const attempts = [
		isbn ? `isbn:${isbn}` : null,
		`intitle:${title} inauthor:${author}`,
		`intitle:${title}`
	].filter((query): query is string => Boolean(query))

	for (const query of attempts) {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&printType=books`,
			{ signal }
		)

		if (!response.ok) {
			continue
		}

		const data = (await response.json()) as GoogleBooksResponse
		const volumeInfo = data.items?.[0]?.volumeInfo
		if (typeof volumeInfo?.averageRating === 'number' && typeof volumeInfo?.ratingsCount === 'number') {
			return {
				rating: Number(volumeInfo.averageRating.toFixed(1)),
				reviews: volumeInfo.ratingsCount
			}
		}
	}

	return null
}



// Fetch books from Open Library API with genre and search
const useOpenLibraryBooks = (searchTerm = 'bestseller', genre = 'All', page = 1) => {
	const [books, setBooks] = useState<DiscoveryBook[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [numFound, setNumFound] = useState(0);
	const queryKey = `${searchTerm}|${genre}|${page}`
	const [loadedQueryKey, setLoadedQueryKey] = useState('')
	const loading = loadedQueryKey !== queryKey

	useEffect(() => {
		const controller = new AbortController()

		let query = searchTerm || 'bestseller';
		if (genre && genre !== 'All') {
			query += `+subject:${encodeURIComponent(genre)}`;
		}
		fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${pageSize}&page=${page}`, {
			signal: controller.signal
		})
			.then((res) => res.json() as Promise<OpenLibrarySearchResponse>)
			.then(async (data) => {
				// Sort by edition_count descending (proxy for popularity)
				const sorted = (data.docs || []).sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0));
				setNumFound(data.numFound || 0);

				const top = sorted.slice(0, pageSize)
				const mapped = await Promise.all(
					top.map(async (doc, index): Promise<DiscoveryBook> => {
						const id = doc.key || doc.cover_edition_key || doc.edition_key?.[0] || `book-${page}-${index}`
						const title = doc.title || 'Untitled'
						const author = doc.author_name ? doc.author_name[0] : 'Unknown'
						const starter = starterRatingFromSeed(id)
						const googleRating = await getGoogleBooksRating(title, author, doc.isbn?.[0], controller.signal).catch(
							() => null
						)

						return {
							id,
							title,
							author,
							genre: doc.subject ? doc.subject[0] : genre || 'Unknown',
							rating: googleRating?.rating ?? starter.rating,
							reviews: googleRating?.reviews ?? starter.reviews,
							ratingSource: googleRating ? 'google-books' : 'starter',
							image: doc.cover_i
								? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
								: 'https://via.placeholder.com/150x220?text=No+Cover',
							trending: index < 4 || (doc.edition_count ?? 0) > 240,
							subtitle: doc.subtitle,
							year: doc.first_publish_year,
							publisher: doc.publisher ? doc.publisher[0] : undefined,
							editionCount: doc.edition_count,
						}
					})
				)

				if (controller.signal.aborted) {
					return
				}

				setBooks(mapped);
				setError(null);
				setLoadedQueryKey(queryKey)
			})
			.catch((fetchError: unknown) => {
				if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
					return
				}

				setError('Failed to load books. Please try again later.');
				setLoadedQueryKey(queryKey)
			});

		return () => {
			controller.abort()
		}
	}, [searchTerm, genre, page, queryKey]);

	return { books, loading, error, numFound };
};

export function DiscoveryPage() {
	const [selectedGenre, setSelectedGenre] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');
	const [inputValue, setInputValue] = useState('');
		const [minRating, setMinRating] = useState(0)
		const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'reviews' | 'newest'>('popularity')
		const [page, setPage] = useState(1);
		const [trendingOnly, setTrendingOnly] = useState(false);
		const [allBooks, setAllBooks] = useState<DiscoveryBook[]>([]);
		const { books, loading, error, numFound } = useOpenLibraryBooks(searchTerm, selectedGenre, page);

		// Infinite scroll: append books as pages load
		// Remove setAllBooks from useEffect to avoid React anti-pattern
		// Instead, append books in the scroll handler below

		const visibleBooks = useMemo(() => {
			const filtered = (page === 1 ? books : allBooks)
				.filter((book) => book.rating >= minRating)
				.filter((book) => !trendingOnly || book.trending)
			const sorted = [...filtered]
			switch (sortBy) {
				case 'rating':
					sorted.sort((left, right) => right.rating - left.rating)
					break
				case 'reviews':
					sorted.sort((left, right) => right.reviews - left.reviews)
					break
				case 'newest':
					// Newest by year
					sorted.sort((left, right) => (right.year ?? 0) - (left.year ?? 0))
					break
				case 'popularity':
				default:
					sorted.sort((left, right) => (right.editionCount ?? 0) - (left.editionCount ?? 0))
			}
			return sorted
		}, [books, allBooks, minRating, sortBy, trendingOnly, page])

		const starterCount = visibleBooks.filter((book) => book.ratingSource === 'starter').length

	// Handle search submit
		const handleSearch = (e: FormEvent) => {
			e.preventDefault();
			setSearchTerm(inputValue);
			setPage(1);
			setAllBooks([]);
		};

	// Handle genre click
		const handleGenreClick = (genre: string) => {
			setSelectedGenre(genre);
			setPage(1);
			setAllBooks([]);
		};

		// Pagination controls (for fallback, but infinite scroll is default)
		const handlePrevPage = () => {
			setPage((p) => Math.max(1, p - 1));
		};
		const handleNextPage = () => {
			setPage((p) => p + 1);
		};

		// Infinite scroll: load next page when near bottom and append books
		// Infinite scroll: load next page when near bottom (debounced, less sensitive)
		useEffect(() => {
			let debounce: number | null = null;
			const onScroll = () => {
				if (loading) return;
				if (debounce) clearTimeout(debounce);
				debounce = setTimeout(() => {
					const scrollY = window.scrollY || window.pageYOffset;
					const windowH = window.innerHeight;
					const docH = document.documentElement.scrollHeight;
					if (docH - (scrollY + windowH) < 120 && visibleBooks.length < numFound) {
						setPage((p) => p + 1);
						setAllBooks(prev => {
							const ids = new Set(prev.map(b => b.id))
							return [...prev, ...books.filter(b => !ids.has(b.id))]
						})
					}
				}, 200);
			};
			window.addEventListener('scroll', onScroll);
			return () => {
				window.removeEventListener('scroll', onScroll);
				if (debounce) clearTimeout(debounce);
			};
		}, [loading, visibleBooks.length, numFound, books]);

			const handleResetFilters = () => {
				setSelectedGenre('All')
				setInputValue('')
				setSearchTerm('')
				setMinRating(0)
				setSortBy('popularity')
				setTrendingOnly(false)
				setPage(1)
				setAllBooks([])
			}

	return (
		<main className="discovery-market-shell">
			<section className="discovery-market-topbar card-surface">
				<div className="discovery-market-brand-row">
					<Link className="discovery-market-brand" to="/">
						<span className="brandmark-icon">◫</span>
						<div>
							<strong>BookMarked</strong>
							<span>Explore trending books curated by our community</span>
						</div>
					</Link>
				</div>

				<div className="discovery-market-actions">
					<button
						className={`discovery-market-action-pill${trendingOnly ? ' discovery-market-action-pill-active' : ''}`}
						type="button"
						onClick={() => { setTrendingOnly((v) => !v); setPage(1); setAllBooks([]); }}
						title="Show only trending books"
					>
						{trendingOnly ? 'Trending Only' : `${books.filter((book) => book.trending).length} Trending`}
					</button>
					<Link className="discovery-market-post-button" to="/social">
						Post
					</Link>
					<Link aria-label="Open dashboard" className="discovery-market-avatar" to="/dashboard">
						U
					</Link>
				</div>
			</section>


						<section className="discovery-market-filter-bar">
							<form className="discovery-market-search-form" onSubmit={handleSearch}>
								<input
									className="discovery-market-search-input"
									type="text"
									placeholder="Search books or authors..."
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
								/>
								<button className="discovery-market-search-submit" type="submit">Search</button>
								<button className="discovery-market-reset-button prominent" onClick={handleResetFilters} type="button" title="Clear all filters and search">
									🧹 Clear All
								</button>
								<button className="discovery-market-random-button" type="button" title="Jump to a random book" onClick={() => {
										const pool = visibleBooks.length > 0 ? visibleBooks : books;
										if (pool.length === 0) return;
										const idx = Math.floor(Math.random() * pool.length);
										const book = pool[idx];
										window.location.href = `/discovery/${encodeURIComponent(book.id)}`;
									}}>
									🎲 Random Book
								</button>
							</form>
							<div className="discovery-market-controls-row">
								<label className="discovery-market-control">
									<span>Sort</span>
									<select
										className="discovery-market-select"
										value={sortBy}
										onChange={(event) => setSortBy(event.target.value as 'popularity' | 'rating' | 'reviews' | 'newest')}
									>
										<option value="popularity">Most popular</option>
										<option value="rating">Highest rating</option>
										<option value="reviews">Most rated</option>
										<option value="newest">Newest first</option>
									</select>
								</label>
								<label className="discovery-market-control">
									<span>Minimum rating</span>
									<select
										className="discovery-market-select"
										value={minRating}
										onChange={(event) => setMinRating(Number(event.target.value))}
									>
										<option value={0}>Any</option>
										<option value={3.5}>3.5+</option>
										<option value={4}>4.0+</option>
										<option value={4.3}>4.3+</option>
									</select>
								</label>
							</div>
							<div className="discovery-market-chip-row">
								{genres.map((genre) => (
									<button
										className={`discovery-market-chip${selectedGenre === genre ? ' is-active' : ''}`}
										key={genre}
										type="button"
										onClick={() => handleGenreClick(genre)}
									>
										{genre}
									</button>
								))}
							</div>
						</section>



						<section className="discovery-market-board">
							<div className="discovery-market-summary card-surface">
								<span>
									{loading
										? 'Loading books...'
										: error
										? 'Error loading books'
										: `Showing ${visibleBooks.length} of ${numFound} books`}
								</span>
								<span>
									{loading
										? 'Fetching rating data...'
										: starterCount > 0
										? <>
											{starterCount} books use <span title="Starter estimate: fallback rating when no Google Books data is available. These are deterministic but not real user ratings.">starter estimate</span> scores
										</>
										: <>
											All shown ratings sourced from <span title="Google Books: real user ratings from Google Books API.">Google Books</span>
										</>}
								</span>
							</div>

							{error ? (
								<div className="discovery-market-error-state">{error}</div>
							) : (
								<>
									<div className="discovery-market-grid">
										{loading ? (
											Array.from({ length: 12 }).map((_, i) => (
												<div key={i} className="skeleton-card">
													<div className="skeleton-cover" />
													<div className="skeleton-body">
														<div className="skeleton-line skeleton-line-title" />
														<div className="skeleton-line skeleton-line-sub" />
														<div className="skeleton-line skeleton-line-short" />
													</div>
												</div>
											))
										) : visibleBooks.length === 0 ? (
											<div className="discovery-market-empty-state">No books match these filters yet.</div>
										) : (
											visibleBooks.map((book) => (
												<Link
													className="discovery-market-card-link"
													key={book.id}
													state={{ book }}
													to={`/discovery/${encodeURIComponent(book.id)}`}
												>
												<article className="discovery-market-card">
													<div className="discovery-market-cover-wrap">
														{book.trending ? (
															<span className="discovery-market-trending-badge">Trending</span>
														) : null}
														<img
															alt={`${book.title} cover`}
															className="discovery-market-cover"
															src={book.image}
														/>
													</div>

													<div className="discovery-market-card-body">
														<h2>{book.title}</h2>
														<p>{book.subtitle ?? book.author}</p>
														<div className="discovery-market-meta-row">
															{book.author && <span>By {book.author}</span>}
															{book.year && <span>{`• ${book.year}`}</span>}
															{book.publisher && <span>{`• ${book.publisher}`}</span>}
															{book.editionCount && <span>{`• ${book.editionCount} editions`}</span>}
														</div>
														<div className="discovery-market-stats">
															<span>{`Rating ${book.rating.toFixed(1)}`}</span>
															<span>{`${book.reviews.toLocaleString()} ratings`}</span>
														</div>
														<span className={`discovery-market-rating-source discovery-market-rating-source-${book.ratingSource}`}
															title={book.ratingSource === 'google-books'
																? 'Google Books: real user ratings from Google Books API.'
																: 'Starter estimate: fallback rating when no Google Books data is available. These are deterministic but not real user ratings.'}
														>
															{book.ratingSource === 'google-books' ? 'Google Books' : 'Starter estimate'}
															<span style={{marginLeft: 4, cursor: 'help'}} title={book.ratingSource === 'google-books'
																? 'Google Books: real user ratings from Google Books API.'
																: 'Starter estimate: fallback rating when no Google Books data is available. These are deterministic but not real user ratings.'}>ℹ️</span>
														</span>
														{Array.isArray(book.genre)
															? book.genre.map((g, i) => (
																<span key={g + i} className="discovery-market-genre-tag">{g}</span>
															))
															: <span className="discovery-market-genre-tag">{book.genre}</span>
														}
													</div>
												</article>
												</Link>
											))
										)}
									</div>
									{/* Pagination Controls */}
									<div className="discovery-market-pagination">
										<button
											onClick={handlePrevPage}
											disabled={page === 1 || loading}
											className="discovery-market-page-button"
										>
											Previous
										</button>
										<span className="discovery-market-page-label">Page {page}</span>
										<button
											onClick={handleNextPage}
											disabled={loading || (page * pageSize >= numFound)}
											className="discovery-market-page-button"
										>
											Next
										</button>
									</div>
								</>
							)}
						</section>

			<footer className="discovery-market-footer">
				Discover your next favorite book - Driven by community reviews
			</footer>
		</main>
	)
}
