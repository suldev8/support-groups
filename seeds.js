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

const categories = ['Abuse', 'Cancer', 'Marriage'];

const dummyUser = {
  username: 'dummy',
  password: '123123123'
};



categories.forEach((category, index) => {
  const newCategory = new Category({
    name: category
  });

  newCategory.save();
});

// const dummyUserCreated = Promise.resolve(dummyUser)
//   .then(credentials => {
//     if (
//       !credentials ||
//       !credentials.password ||
//       credentials.password !== credentials.password_confirmation
//     ) {
//       throw new BadParamsError();
//     }
//   })
//   // generate a hash from the provided password, returning a promise
//   .then(() => bcryptjs.hash(req.body.credentials.password, bcryptSaltRounds))
//   .then(hash => {
//     // return necessary params to create a user
//     return {
//       username: req.body.credentials.username,
//       hashedPassword: hash
//     };
//   })
//   // create user with provided username and hashed password
//   .then(user => User.create(user).then(user => {
      
//   })
//   )


// console.log("dummyID:", dummyUserCreated.id);

















// Category.find({}).then(categories => {
//     categories.forEach(value => value.remove())
//     db.close();
// })
// Post.find({}).then(Document => {
//     posts.forEach(value => user.remove())
//     db.close();
// })
// User.find({}).then(users => {
//     users.forEach(value => user.remove())
//     db.close();
// })

// User.find({}).then(users => {
//     users.forEach(value => user.remove())
//     db.close();
// })
