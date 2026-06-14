const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
// Middleware
app.use(cors({
  origin:'https://elearning-platform-5s9b.vercel.app/'
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const sparePartRoutes = require('./routes/sparePartRoutes');
const stockInRoutes = require('./routes/stockInRoutes');
const stockOutRoutes = require('./routes/stockOutRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use('/api/stock-in', stockInRoutes);
app.use('/api/stock-out', stockOutRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
      console.log(`Server running http://localhost:${PORT}`);
    });