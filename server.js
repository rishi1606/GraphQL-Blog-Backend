import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import connectDB from './config/db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (or fallback to in-memory db if local daemon is not running)
await connectDB();

// Automatically seed sample data if database is empty
await seedDatabase();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    console.error('GraphQL Error:', formattedError.message);
    return formattedError;
  },
});

await server.start();

// Express Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apollo GraphQL Endpoint
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization }),
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'GraphQL Blog Backend Server is Running' });
});

// Start listening
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
});
