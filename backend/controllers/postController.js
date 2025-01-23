const Post = require('../models/Post');
const { cache } = require('../services/cache');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user._id
    });
    await post.save();
    cache.del('posts'); // Invalider le cache
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      req.body,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    cache.del(`post_${req.params.id}`);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    cache.del(`post_${req.params.id}`);
    cache.del('posts');
    res.json({ message: 'Post supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }
    
    const upvoteIndex = post.upvotes.indexOf(req.user._id);
    if (upvoteIndex === -1) {
      post.upvotes.push(req.user._id);
    } else {
      post.upvotes.splice(upvoteIndex, 1);
    }
    
    await post.save();
    cache.del(`post_${req.params.id}`);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 