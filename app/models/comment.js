const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
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
  },
  {
    timestamps: true,
    toObject: {
      transform: (_doc, comment) => {
        comment.likes = comment.likes.length;
        return comment;
      }
    }
  }
);

module.exports = mongoose.model('Comment', commentSchema);
