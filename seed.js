import dotenv from 'dotenv';
import connectDB, { disconnectDB } from './config/db.js';
import Post from './models/Post.js';

dotenv.config();

const samplePosts = [
  {
    title: 'The Architecture of Modern Full-Stack Web Applications',
    description: 'An in-depth exploration of how React, GraphQL, and MongoDB combine to deliver lightning-fast, scalable user experiences.',
    content: `When building modern web applications, choosing the right technology stack is paramount. The React + GraphQL + Node.js + MongoDB stack has emerged as one of the most powerful paradigms for full-stack developers.

### Why GraphQL Over REST?
In traditional REST architectures, clients often suffer from over-fetching or under-fetching data. GraphQL solves this by allowing the frontend to specify the exact shape of the data required. With a single query, a React component can request a blog post's title, content, author, and associated tags without multiple network roundtrips.

### The Role of Apollo Client
Integrating Apollo Client on the frontend brings declarative data fetching, intelligent caching, and optimistic UI updates out of the box. When a user submits a new blog post, Apollo automatically updates its in-memory cache, causing the UI to re-render instantaneously without reloading the page.

### Schema Design in MongoDB
MongoDB's document-oriented model pairs naturally with GraphQL schemas. Since both represent structured data as JSON-like documents, mapping GraphQL types directly to Mongoose models results in clean, maintainable backend code.`,
    author: 'Elena Rostova',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'GraphQL', 'Architecture'],
  },
  {
    title: 'Mastering Glassmorphism & UI Aesthetics in Modern CSS',
    description: 'How to design visually stunning web interfaces using translucent backgrounds, vibrant gradients, and subtle micro-animations.',
    content: `First impressions matter. When users land on a web application, visual aesthetics dictate their perception of quality and trustworthiness within milliseconds.

### Designing for Depth
Glassmorphism leverages backdrop filters (\`backdrop-filter: blur(16px)\`) combined with semi-transparent borders and multi-layered shadows to simulate frosted glass. When positioned over rich, vibrant ambient gradients, it creates a sense of depth and hierarchy that flat design cannot match.

### Micro-Animations & Engagement
Interactive interfaces feel alive. By adding subtle hover transformations—such as elevating cards by 4 pixels and shifting gradient hues—developers can provide tactile feedback that guides user intent and encourages continuous exploration.

### Dark Mode as a First-Class Citizen
Modern applications must support high-contrast dark themes. Using CSS custom properties (variables), developers can effortlessly toggle between obsidian dark palettes and crisp light modes while maintaining harmonious contrast ratios.`,
    author: 'Marcus Vance',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design', 'CSS', 'Frontend'],
  },
  {
    title: 'Optimizing MongoDB Queries for Scalable GraphQL APIs',
    description: 'Best practices for indexing, pagination, and preventing the N+1 problem in high-throughput Node.js servers.',
    content: `As your database grows from hundreds to millions of records, query performance becomes the defining bottleneck of backend scalability.

### The Power of Compound & Text Indexes
Without proper indexing, MongoDB must perform full-collection scans for every query. By establishing text indexes on high-frequency search fields like blog titles and descriptions, search queries execute in sub-millisecond timeframes even under heavy load.

### Solving the N+1 Query Problem
One common gotcha in GraphQL servers is the N+1 problem, where nested field resolvers trigger individual database queries for every item in a list. To mitigate this, experienced backend developers leverage DataLoader to batch and cache database requests within a single GraphQL execution cycle.

### Graceful Fallbacks in Development
To ensure frictionless developer workflows, robust backends should automatically detect local database availability and seamlessly fall back to in-memory instances when necessary.`,
    author: 'David Chen',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['MongoDB', 'Backend', 'Performance'],
  },
  {
    title: 'Why React 19 & Vite are Revolutionizing Frontend Development',
    description: 'Say goodbye to slow webpack bundlers and complex configuration. Discover how Vite accelerates developer productivity.',
    content: `The modern frontend ecosystem moves fast. Over the past three years, build tooling has undergone a seismic shift away from traditional JavaScript bundlers toward native ESM-powered tools.

### Instant Server Start with Vite
Unlike older tools that bundled your entire application before starting the development server, Vite serves source code over native ES modules. This means your dev server starts up in under 300 milliseconds regardless of how large your codebase grows.

### Hot Module Replacement (HMR) That Actually Works
With Vite, edits to CSS or React components are reflected in the browser instantly without losing component state or refreshing the page. When combined with modern React state management and Apollo GraphQL caching, the developer feedback loop becomes frictionless.`,
    author: 'Sarah Jenkins',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'Vite', 'Tooling'],
  },
];

export const seedDatabase = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log(`ℹ️ Database already contains ${postCount} posts. Skipping auto-seed.`);
      return;
    }

    console.log('🌱 Seeding database with high-quality sample blog posts...');
    await Post.insertMany(samplePosts);
    console.log('✅ Sample blog posts seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// If run directly via command line (`npm run seed` or `node seed.js`)
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await Post.deleteMany({}); // Clear existing posts when explicitly running script
    console.log('🗑️ Existing posts cleared.');
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  })();
}
