import * as service from "../services/forumService.js";

/* Posts */
export const createPost = async (req, res) => {
  try {
    const post = await service.createPost(req.body);
    res.status(201).json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getPosts = async (req, res) => {
  try {
    const result = await service.getPosts(req.query);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getPostById = async (req, res) => {
  try {
    const post = await service.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const editPost = async (req, res) => {
  try {
    const updated = await service.updatePost(req.params.id, req.body, req.user);
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deletePost = async (req, res) => {
  try {
    await service.deletePost(req.params.id, req.user);
    res.json({ message: "Post deleted" });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

/* Comments */
export const createComment = async (req, res) => {
  try {
    const comment = await service.createComment(req.params.postId, req.body);
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const comments = await service.getCommentsByPost(req.params.postId);
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const editComment = async (req, res) => {
  try {
    const updated = await service.updateComment(req.params.id, req.body, req.user);
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteComment = async (req, res) => {
  try {
    await service.deleteComment(req.params.id, req.user);
    res.json({ message: "Comment deleted" });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
