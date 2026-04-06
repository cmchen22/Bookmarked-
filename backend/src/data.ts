export type Review = {
  id: string
  userName: string
  handle: string
  bookId: string
  rating: number
  spoilerFree: boolean
  review: string
  createdAt: string
}

export type Book = {
  id: string
  title: string
  author: string
  year: number
  coverUrl: string
  genres: string[]
  synopsis: string
  avgRating: number
  ratingsCount: number
  featuredQuote: string
}

export const books: Book[] = [
  {
    id: 'piranesi',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    year: 2020,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    genres: ['Fantasy', 'Mystery', 'Literary'],
    synopsis:
      'A man catalogs the tides, statues, and halls of an infinite House while uncovering the history of his own captivity.',
    avgRating: 4.42,
    ratingsCount: 12843,
    featuredQuote: 'The Beauty of the House is immeasurable; its Kindness infinite.'
  },
  {
    id: 'never-let-me-go',
    title: 'Never Let Me Go',
    author: 'Kazuo Ishiguro',
    year: 2005,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    genres: ['Speculative', 'Drama', 'Literary'],
    synopsis:
      'A reflective boarding-school novel that quietly reveals the moral cost of a society built on human disposability.',
    avgRating: 4.18,
    ratingsCount: 20311,
    featuredQuote: 'Memories, even your most precious ones, fade surprisingly quickly.'
  },
  {
    id: 'the-left-hand-of-darkness',
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    year: 1969,
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    genres: ['Science Fiction', 'Politics', 'Classic'],
    synopsis:
      'An envoy to a frozen world navigates alien politics, friendship, and gender in one of science fiction’s defining novels.',
    avgRating: 4.31,
    ratingsCount: 16802,
    featuredQuote: 'Light is the left hand of darkness.'
  }
]

export const reviews: Review[] = [
  {
    id: 'review-1',
    userName: 'Maya Chen',
    handle: '@pagefragments',
    bookId: 'piranesi',
    rating: 4.5,
    spoilerFree: true,
    review:
      'Reads like being gently lost in a museum built by the sea. The mystery works, but the atmosphere is the real drug.',
    createdAt: '2026-04-03T18:42:00.000Z'
  },
  {
    id: 'review-2',
    userName: 'Jon Park',
    handle: '@dogearedjon',
    bookId: 'never-let-me-go',
    rating: 5,
    spoilerFree: true,
    review:
      'Devastating in the least performative way possible. It never raises its voice, which makes the ending hit harder.',
    createdAt: '2026-04-02T09:15:00.000Z'
  },
  {
    id: 'review-3',
    userName: 'Ari Flores',
    handle: '@marginnotes',
    bookId: 'the-left-hand-of-darkness',
    rating: 4,
    spoilerFree: true,
    review:
      'Dense early on, then suddenly intimate. The political worldbuilding is excellent, but the friendship is what lingers.',
    createdAt: '2026-04-01T14:05:00.000Z'
  }
]