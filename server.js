require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

console.log('MONGO_URI:', process.env.MONGO_URI);

// MongoDB Connection
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => console.error('❌ Failed to connect to MongoDB:', err.message));

// Blog Schema
const blogSchema = new mongoose.Schema({
  heading: String,
  subheading: String,
  date: String,
  categories: String,
  cover: String,
  paragraphs: [{ text: String, image: String }]
});

const Blog = mongoose.model('Blog', blogSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes

// Create Blog
app.post('/api/blogs', upload.fields([{ name: 'cover' }, { name: 'paragraphImages' }]), async (req, res) => {
  try {
    const { heading, subheading, date, categories, paragraphs } = req.body;

    const newBlog = new Blog({
      heading,
      subheading,
      date,
      categories,
      cover: req.files['cover'] ? req.files['cover'][0].path : null,
      paragraphs: paragraphs ? JSON.parse(paragraphs) : []
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
});

// Get All Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});

// Delete Blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
});
// Test Route
app.get('/test', (req, res) => {
    res.send('Backend is working fine!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
