const mongoose = require('mongoose');


// const MONGODB_URI = 'mongodb://localhost:27017/persons';
// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log('MongoDB database connection established successfully');
//     })
//     .catch((error) => {
//         console.error('MongoDB connection error: ', error);
//     });

// const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/adminpanel';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database.');
});



