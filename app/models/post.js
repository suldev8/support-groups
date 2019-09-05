const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)
