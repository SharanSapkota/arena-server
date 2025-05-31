import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import arenaRoutes from '@/routes/arena.routes';
import paymentRoutes from '@/routes/payment.routes';
import commentRoutes from '@/routes/comment.routes';
import arenaViewRoutes from '@/routes/arena-view.routes';

// Middleware
import { errorHandler } from '@/middleware/error.middleware';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/arenas', arenaRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/arena-views', arenaViewRoutes);

// Error handling
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arena')
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 