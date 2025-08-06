import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import accountsRoutes from './routes/accounts.js';
import bookingRoutes from './routes/booking.js';
import driverRoutes from './routes/driver.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/chat', chatRoutes);

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('Loadify Backend is running.');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
