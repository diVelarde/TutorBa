import express from "express";
import {
  createPost,
  editPost,
  deletePost,
  getPosts,
  getPostById,
  createComment,
  editComment,
  deleteComment,
  getCommentsByPost,
  votePost,
  voteComment
} from "../controllers/forumController.js";

const router = express.Router();

// Posts
router.post("/posts", createPost);
router.get("/posts", getPosts);          
router.get("/posts/:id", getPostById);
router.put("/posts/:id", editPost);
router.delete("/posts/:id", deletePost);

// Comments
router.post("/posts/:postId/comments", createComment);
router.get("/posts/:postId/comments", getCommentsByPost);
router.put("/comments/:id", editComment);
router.delete("/comments/:id", deleteComment);

router.post("/posts/:id/vote", votePost);
router.post("/comments/:id/vote", voteComment);

export default router;