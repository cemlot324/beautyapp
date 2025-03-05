import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  filters: [{
    type: String,
    trim: true,
  }],
  isNew: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  ingredients: {
    type: String,
    trim: true,
    default: '',
  },
  volume: {
    type: String,
    trim: true,
    default: '',
  },
  howToUse: {
    type: String,
    trim: true,
    default: '',
  },
  benefits: {
    type: String,
    trim: true,
    default: '',
  },
  skinType: [{
    type: String,
    trim: true,
    enum: ['All Skin Types', 'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'],
  }],
}, {
  timestamps: true,
  strict: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

mongoose.models = {};

const Product = mongoose.model('Product', productSchema);

export default Product; 