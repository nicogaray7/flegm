const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const comment = new Comment({
      post: req.params.id,
      user: req.user.id,
      content: req.body.content
    });

    await comment.save();
    await comment.populate('user', 'username avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 