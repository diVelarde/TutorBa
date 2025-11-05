import ForumPost from "../models/Post.js";
import Comment from "../models/Comment.js";

/* Posts */
export const createPost = async (data) => {
  const post = await ForumPost.create(data);
  return post;
};

export const getPosts = async ({ subject, q, page = 1, limit = 10 } = {}) => {
  const query = {};
  if (subject) query.subject = { $regex: subject, $options: "i" };
  if (q) query.$or = [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }];

  const pageNum = Math.max(1, parseInt(page, 10));
  const lim = Math.max(1, parseInt(limit, 10));

  const [data, total] = await Promise.all([
    ForumPost.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * lim).limit(lim).lean(),
    ForumPost.countDocuments(query)
  ]);
  return { data, meta: { total, page: pageNum, limit: lim, pages: Math.ceil(total / lim) } };
};

export const getPostById = async (id) => {
  return ForumPost.findById(id).populate("author", "name profileImage");
};

export const updatePost = async (id, data, user) => {
  const post = await ForumPost.findById(id);
  if (!post) throw new Error("Post not found");
  if (!user || post.author.toString() !== user.id) throw new Error("Unauthorized");
  post.title = data.title ?? post.title;
  post.content = data.content ?? post.content;
  post.updatedAt = new Date();
  await post.save();
  return post;
};

export const deletePost = async (id, user) => {
  const post = await ForumPost.findById(id);
  if (!post) throw new Error("Post not found");
  if (!user || post.author.toString() !== user.id) throw new Error("Unauthorized");
  await post.remove();
};

/* Comments */
export const createComment = async (postId, data) => {
  const comment = await Comment.create({ postId, ...data });
  return comment;
};

export const getCommentsByPost = async (postId) => {
  return Comment.find({ postId }).sort({ createdAt: 1 }).populate("author", "name profileImage");
};

export const updateComment = async (id, data, user) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");
  if (!user || comment.author.toString() !== user.id) throw new Error("Unauthorized");
  comment.content = data.content ?? comment.content;
  await comment.save();
  return comment;
};

export const deleteComment = async (id, user) => {
  const comment = await Comment.findById(id);
  if (!comment) throw new Error("Comment not found");
  if (!user || comment.author.toString() !== user.id) throw new Error("Unauthorized");
  await comment.remove();
};

/* Upvote / Downvote helpers */
export const votePost = async (postId, type = "up") => {
  const inc = type === "up" ? { upvotes: 1 } : { downvotes: 1 };
  return ForumPost.findByIdAndUpdate(postId, { $inc: inc }, { new: true });
};

export const voteComment = async (commentId, type = "up") => {
  const inc = type === "up" ? { upvotes: 1 } : { downvotes: 1 };
  return Comment.findByIdAndUpdate(commentId, { $inc: inc }, { new: true });
};
