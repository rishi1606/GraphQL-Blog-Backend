import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
      maxlength: [300, 'Description cannot be more than 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide full blog post content'],
    },
    author: {
      type: String,
      default: 'Anonymous Dev',
      trim: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for keyword searching on title and description
postSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
