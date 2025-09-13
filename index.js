const express = require('express');
const db = require('./db/config');
const route = require('./controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,      // deployed frontend
  'http://localhost:3000'        // local frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman/server-side requests
    if(!allowedOrigins.includes(origin)){
      return callback(new Error('CORS policy does not allow access from this origin'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// API routes
app.use('/api', route);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to my world...');
});

// Start server
const server = app.listen(port, () => {
  const protocol = (process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production') ? 'https' : 'http';
  const { address, port } = server.address();
  const host = address === '::' ? '127.0.0.1' : address;
  console.log(`✅ Server listening at ${protocol}://${host}:${port}/`);
});

// MongoDB connection
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017';
const DATABASE = process.env.DB || 'Prolink';
db(DATABASE_URL, DATABASE);
