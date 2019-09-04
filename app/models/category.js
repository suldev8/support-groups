const mongoose = require('mongoose')
const Post = require('./post');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Category', categorySchema)