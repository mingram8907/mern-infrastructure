const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
//* DATABASE_URL is just a variable name. Can be named whatever like MONGO_URI in previous applications
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on('connected', function () {
  console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
});