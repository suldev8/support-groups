// Express docs: http://expressjs.com/en/api.html
const express = require('express');
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport');

// pull in Mongoose model for posts
const Comment = require('../models/comment');

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors');

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { comment: { title: '', text: 'foo' } } -> { comment: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields');
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();


// Show all comments of a comment
// GET categories/:id/posts
router.get('/posts/:id/comments', (req, res, next) => {
  
  // Option 1 get user's posts
  Comment.find({post: req.params.id}).populate('owner').sort('-createdAt')
    .then(comments => res.status(200).json({comments: comments.map(comment => ({
        id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        likes: comment.likes,
        owner: {
            username: comment.owner.username,
            photo: comment.owner.photo
        }
    })
    )}))
    .catch(next);
  
  // // Option 2 get user's posts
  // // must import User model and User model must have virtual for posts
  // User.findById(req.user.id) 
    // .populate('posts')
    // .then(user => res.status(200).json({ posts: user.posts }))
    // .catch(next)
});




// SHOW
// GET /posts/5a7db6c74d55bc51bdf39793
router.get('/comments/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Comment.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "comment" JSON
    .then(comment => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      //requireOwnership(req, comment)
    
      res.status(200).json({ comment: comment.toObject() })
    })
    // if an error occurs, pass it to the handler
    .catch(next);
});

// CREATE
// POST /posts/:id/comments
router.post('/posts/:id/comments', requireToken, (req, res, next) => {
  // set owner of new comment to be current user
  const { comment } = req.body;
  comment.owner = req.user.id;
  comment.post = req.params.id;

  Comment.create(comment)
    // respond to successful `create` with status 201 and JSON of new "comment"
    .then(comment => {
      comment.populate('owner')
          .execPopulate()
          .then(comment => res.status(201).json({ comment: comment.toObject() }))
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next);
});

// UPDATE
// PATCH /comments/5a7db6c74d55bc51bdf39793
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair


  delete req.body.comment.owner;

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, comment)

      // pass the result of Mongoose's `.update` to the next `.then`
      return comment.update(req.body.comment)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});


// Add a like to a comment
// Patch /comments/5a7db6c74d55bc51bdf39793/like
router.patch('/comments/:id/like', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
  .then(handle404)
  .then(comment => {
    if(comment.likes.indexOf(req.user.id) !== -1) {
      //It's there, so remove it
      comment.likes.pull(req.user);
    } else {
      //Not there, so add it
      comment.likes.unshift(req.user);
    }
    comment.save().catch(err => console.error(err))
  }
    )
  .then(() => res.sendStatus(204))
  .catch(next);
});


// DESTROY
// DELETE /comments/5a7db6c74d55bc51bdf39793
router.delete('/comments/:id', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // throw an error if current user doesn't own `comment`
      requireOwnership(req, comment)
      // delete the comment ONLY IF the above didn't throw
      comment.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});


module.exports = router;
