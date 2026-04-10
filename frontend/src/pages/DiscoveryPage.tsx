import { Link } from 'react-router-dom'

type DiscoveryBook = {
	id: string
	title: string
	author: string
	genre: string
	rating: string
	reviews: string
	image: string
	trending?: boolean
	subtitle?: string
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

const discoveryBooks: DiscoveryBook[] = [
	{
		id: 'midnight-library',
		title: 'The Midnight Library',
		author: 'Matt Haig',
		genre: 'Fiction',
		rating: '4.5',
		reviews: '1247',
		image:
			'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'gone-girl',
		title: 'Gone Girl',
		author: 'Gillian Flynn',
		genre: 'Mystery',
		rating: '4.8',
		reviews: '2103',
		image:
			'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'moby-dick',
		title: 'Moby Dick',
		author: 'Herman Melville',
		genre: 'Fiction',
		rating: '4.3',
		reviews: '905',
		image:
			'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
		subtitle: 'Herman Melville'
	},
	{
		id: 'project-hail-mary',
		title: 'Project Hail Mary',
		author: 'Andy Weir',
		genre: 'Science Fiction',
		rating: '4.9',
		reviews: '1856',
		image:
			'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'house-of-dragons',
		title: 'House of Dragons',
		author: 'Jessica Cluess',
		genre: 'Fantasy',
		rating: '4.6',
		reviews: '1234',
		image:
			'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'all-the-light',
		title: 'All the Light We Cannot See',
		author: 'Anthony Doerr',
		genre: 'Historical',
		rating: '4.7',
		reviews: '3421',
		image:
			'https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=900&q=80'
	},
	{
		id: 'they-both-die',
		title: 'They Both Die at the End',
		author: 'Adam Silvera',
		genre: 'Young Adult',
		rating: '4.4',
		reviews: '1567',
		image:
			'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80'
	},
	{
		id: 'educated',
		title: 'Educated',
		author: 'Tara Westover',
		genre: 'Biography',
		rating: '4.8',
		reviews: '2890',
		image:
			'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'atomic-habits',
		title: 'Atomic Habits',
		author: 'James Clear',
		genre: 'Self-Help',
		rating: '4.9',
		reviews: '4123',
		image:
			'https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=900&q=80',
		trending: true
	},
	{
		id: 'mexican-gothic',
		title: 'Mexican Gothic',
		author: 'Silvia Moreno-Garcia',
		genre: 'Horror',
		rating: '4.2',
		reviews: '1098',
		image:
			'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
	},
	{
		id: 'into-the-wild',
		title: 'Into the Wild',
		author: 'Jon Krakauer',
		genre: 'Adventure',
		rating: '4.5',
		reviews: '2345',
		image:
			'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80'
	},
	{
		id: 'milk-and-honey',
		title: 'Milk and Honey',
		author: 'Rupi Kaur',
		genre: 'Poetry',
		rating: '4.3',
		reviews: '1976',
		image:
			'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=900&q=80'
	}
]

export function DiscoveryPage() {
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
					<button className="discovery-market-action-pill discovery-market-action-pill-active" type="button">
						6 Trending
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
				<div className="discovery-market-chip-row">
					{genres.map((genre, index) => (
						<button
							className={`discovery-market-chip ${index === 0 ? 'is-active' : ''}`}
							key={genre}
							type="button"
						>
							{genre}
						</button>
					))}
				</div>
			</section>

			<section className="discovery-market-board">
				<div className="discovery-market-summary card-surface">
					<span>Showing 12 books</span>
					<span>Sorted by user ratings and reviews</span>
				</div>

				<div className="discovery-market-grid">
					{discoveryBooks.map((book) => (
						<article className="discovery-market-card" key={book.id}>
							<div className="discovery-market-cover-wrap">
								{book.trending ? <span className="discovery-market-trending-badge">Trending</span> : null}
								<img alt={`${book.title} cover`} className="discovery-market-cover" src={book.image} />
							</div>

							<div className="discovery-market-card-body">
								<h2>{book.title}</h2>
								<p>{book.subtitle ?? book.author}</p>

								<div className="discovery-market-stats">
									<span>{`Rating ${book.rating}`}</span>
									<span>{book.reviews}</span>
								</div>

								<span className="discovery-market-genre-tag">{book.genre}</span>
							</div>
						</article>
					))}
				</div>
			</section>

			<footer className="discovery-market-footer">
				Discover your next favorite book - Driven by community reviews
			</footer>
		</main>
	)
}
