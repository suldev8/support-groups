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

const categories = ['Abuse', 'Cancer', 'Marriage'];

categories.forEach((category, index) => {
  const newCategory = new Category({
    name: category
  });

  newCategory.save().then(category => {
    console.log(`Added ${category.name}`);
    connection.close();
  });
});
