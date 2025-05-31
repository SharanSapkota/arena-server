import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes';
import arenaRoutes from './routes/arena.routes';
import paymentRoutes from './routes/payment.routes';
import { AppError } from './utils/appError';

// Load environment variables
config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/arenas', arenaRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production mode
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
});

// Handle 404 routes
app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app; 