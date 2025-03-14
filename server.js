require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;  // Make sure you are using 'MONGO_URI' and not 'MONGO_URL'

mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ Failed to connect to MongoDB:', error));

// Your routes and server setup
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Server running on port ${port}`));
