const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/JobPortal')
.then(() => console.log('DB connected successfully'))
.catch((err) => console.log('DB connection error:', err.message));