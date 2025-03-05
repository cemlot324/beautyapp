import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove the unique index since we're not tracking users anymore
// ratingSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

export default Rating; 