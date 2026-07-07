import Post from '../models/Post.js';

export const resolvers = {
  Query: {
    getPosts: async (_, { search, tag }) => {
      try {
        let filter = {};

        if (search && search.trim() !== '') {
          // Case-insensitive regex search across title and description
          const regex = new RegExp(search.trim(), 'i');
          filter.$or = [{ title: regex }, { description: regex }, { content: regex }];
        }

        if (tag && tag.trim() !== '' && tag !== 'All') {
          filter.tags = { $in: [tag] };
        }

        const posts = await Post.find(filter).sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch blog posts');
      }
    },

    getPost: async (_, { id }) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error('Post not found');
        }
        return post;
      } catch (error) {
        console.error('Error fetching single post:', error);
        throw new Error('Failed to fetch post details');
      }
    },
  },

  Mutation: {
    createPost: async (_, { title, description, content, author, coverImage, tags }) => {
      try {
        const newPost = new Post({
          title,
          description,
          content,
          author: author && author.trim() !== '' ? author : 'Anonymous Dev',
          coverImage:
            coverImage && coverImage.trim() !== ''
              ? coverImage
              : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          tags: tags && tags.length > 0 ? tags : ['Technology', 'General'],
        });

        const savedPost = await newPost.save();
        return savedPost;
      } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create new blog post');
      }
    },

    deletePost: async (_, { id }) => {
      try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete blog post');
      }
    },
  },

  // Resolver for custom field formatting (converting ObjectId and dates)
  Post: {
    id: (parent) => parent._id.toString(),
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },
};
