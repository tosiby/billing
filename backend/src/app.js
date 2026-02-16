import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import saleRoutes from './routes/sales.js';
import staffRoutes from './routes/staff.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'] }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

export default app;
