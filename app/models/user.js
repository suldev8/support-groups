const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    default: 'Default'
  },
  hashedPassword: {
    type: String,
    required: true
  },
  token: String
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

// userSchema.set('toObject', { virtuals: true });
// userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'owner'
});

module.exports = mongoose.model('User', userSchema)
