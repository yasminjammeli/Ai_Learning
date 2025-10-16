require('dotenv').config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const documentRoutes = require("./routes/documentRoutes.js");
const aiRoutes = require("./routes/aiRoutes.js");



const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Route test
app.get('/', (req, res) => {
    res.send('API AI Learning Assistant is running');
});

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
