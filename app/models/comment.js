const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  likes: {
      type: Number,
      default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true 
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Comment', commentSchema)