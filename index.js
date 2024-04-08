
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./network/mongodb');

const app = express();
const port = 3000;



// Connect to MongoDB
connectDB();


// Parse JSON bodies
app.use(express.json());
app.use('/api/product/', require('./api/product'));   // Use the API router middleware
app.use('/api/product/migrate', require('./api/product_migrate'));   // Use the API router middleware

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
