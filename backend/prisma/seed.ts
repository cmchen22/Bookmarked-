import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const speculative = await prisma.genre.upsert({
    where: { name: 'Speculative' },
    update: {},
    create: { name: 'Speculative' }
  })

  const literary = await prisma.genre.upsert({
    where: { name: 'Literary' },
    update: {},
    create: { name: 'Literary' }
  })

  const maya = await prisma.user.upsert({
    where: { handle: '@pagefragments' },
    update: {},
    create: { name: 'Maya Chen', handle: '@pagefragments' }
  })

  const piranesi = await prisma.book.upsert({
    where: { slug: 'piranesi' },
    update: {},
    create: {
      slug: 'piranesi',
      title: 'Piranesi',
      author: 'Susanna Clarke',
      year: 2020,
      coverUrl:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      synopsis:
        'A man catalogs the tides, statues, and halls of an infinite House while uncovering the history of his own captivity.',
      featuredQuote: 'The Beauty of the House is immeasurable; its Kindness infinite.',
      avgRating: 4.5,
      ratingsCount: 1,
      genres: {
        connect: [{ id: speculative.id }, { id: literary.id }]
      }
    }
  })

  await prisma.review.upsert({
    where: { id: 'seed-review-piranesi' },
    update: {},
    create: {
      id: 'seed-review-piranesi',
      rating: 4.5,
      spoilerFree: true,
      body:
        'Reads like being gently lost in a museum built by the sea. The mystery works, but the atmosphere is the real drug.',
      userId: maya.id,
      bookId: piranesi.id
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })