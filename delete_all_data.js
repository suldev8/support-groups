const mongoose = require('mongoose');

const Category = require('./app/models/category');
const User = require('./app/models/user');
const Post = require('./app/models/post');
const Comment = require('./app/models/comment');

const db = require('./config/db');

// establish database connection
mongoose.Promise = global.Promise;
mongoose.connect(db, {
  useMongoClient: true
});

connection = mongoose.connection;

Category.deleteMany({}, error => {
  error ? console.error(error) : console.log('Removed all Categories');
  connection.close();
});
Post.deleteMany({}, error => {
  error ? console.error(error) : console.log('Removed all Posts');
  connection.close();
});
Comment.deleteMany({}, error => {
  error ? console.error(error) : console.log('Removed all Comments');
  connection.close();
});
User.deleteMany({}, error => {
  error ? console.error(error) : console.log('Removed all Users');
  connection.close();
});
