require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const cropRoutes = require('./routes/cropRoutes');
const mandiPriceRoutes = require('./routes/mandiPriceRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const cropDoctorRoutes = require('./routes/cropDoctorRoutes');
const cropGuideRoutes = require('./routes/cropGuideRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For now allow all to fix the immediate block
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('KisanMitra API is running...');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/mandi-prices', mandiPriceRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crop-doctor', cropDoctorRoutes);
app.use('/api/crop-guide', cropGuideRoutes);

// Serve static files (uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
