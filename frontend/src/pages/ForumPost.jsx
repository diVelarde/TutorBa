import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  ThumbsUp,
  Award
} from 'lucide-react';
import '../styles/ForumPost.css';
import { useNavigate } from 'react-router-dom';

const fakeApi = {
  auth: {
    me: async () => ({ id: 1, full_name: 'Student User' })
  },
  entities: {
    ForumPost: {
      filter: async () => ([{
        id: 1,
        title: 'How to solve integration by parts?',
        content: 'I\'m having trouble understanding when to use integration by parts versus substitution. Can someone explain the general approach? I\'ve been practicing for hours but I still don\'t get it.',
        author_id: 'student1',
        author_name: 'Mark Tan',
        subject: 'Calculus',
        department: 'Mathematics',
        replies_count: 2,
        views_count: 45,
        is_resolved: false,
        created_date: '2025-01-20T10:30:00Z'
      }]),
      update: async () => true
    },
    ForumReply: {
      filter: async () => ([
        {
          id: 1,
          post_id: 1,
          author_id: 'tutor1',
          author_name: 'Maria Santos',
          content: 'Great question! Use integration by parts when you have a product of functions where one becomes simpler when differentiated. The formula is ∫u dv = uv - ∫v du. Choose u as the function that simplifies when differentiated!',
          is_helpful: true,
          upvotes: 12,
          created_date: '2025-01-20T11:00:00Z'
        },
        {
          id: 2,
          post_id: 1,
          author_id: 'tutor2',
          author_name: 'Juan dela Cruz',
          content: 'A good tip is to use LIATE rule: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. Pick u from whichever comes first in this list.',
          is_helpful: false,
          upvotes: 8,
          created_date: '2025-01-20T12:30:00Z'
        }
      ]),
      create: async (data) => ({ id: Date.now(), ...data, created_date: new Date().toISOString(), upvotes: 0 }),
      update: async () => true
    }
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function ForumPost() {
    const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [posts, allReplies, user] = await Promise.all([
        fakeApi.entities.ForumPost.filter({ id: 1 }),
        fakeApi.entities.ForumReply.filter({ post_id: 1 }),
        fakeApi.auth.me()
      ]);
      setPost(posts[0]);
      setReplies(allReplies);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setSubmitting(true);
    try {
      const reply = await fakeApi.entities.ForumReply.create({
        post_id: post.id,
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        content: newReply,
        is_helpful: false
      });
      setReplies([...replies, reply]);
      setNewReply('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (replyId) => {
    setReplies(replies.map(r =>
      r.id === replyId ? { ...r, is_helpful: !r.is_helpful } : r
    ));
    setPost({ ...post, is_resolved: true });
  };

  const handleUpvote = async (replyId) => {
    setReplies(replies.map(r =>
      r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
    ));
  };

  const handleBack = async (post) => {
    navigate('/forum');
  };

  if (loading) {
    return (
      <div className="forumpost-loading">
        <div className="forumpost-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="forumpost-container">
        <p>Post not found</p>
      </div>
    );
  }

  const isAuthor = currentUser?.id === post.author_id;

  return (
    <div className="forumpost-container">
      {/* Back Button */}
      <button className="forumpost-back" onClick={handleBack}>
        <ArrowLeft size={20} />
        <span>Back to Forum</span>
      </button>

      {/* Post */}
      <div className="forumpost-card forumpost-main">
        <div className="forumpost-header">
          <h1 className="forumpost-title">{post.title}</h1>
          {post.is_resolved && (
            <span className="forumpost-resolved">
              <CheckCircle size={16} />
              Resolved
            </span>
          )}
        </div>

        <div className="forumpost-content">
          <p>{post.content}</p>
        </div>

        <div className="forumpost-meta">
          <div className="forumpost-tags">
            {post.subject && <span className="forumpost-tag tag-subject">{post.subject}</span>}
            {post.department && <span className="forumpost-tag tag-dept">{post.department}</span>}
          </div>
          <div className="forumpost-stats">
            <span><MessageCircle size={14} /> {post.replies_count} replies</span>
            <span><Eye size={14} /> {post.views_count} views</span>
          </div>
        </div>

        <div className="forumpost-author-row">
          <div className="forumpost-avatar">{post.author_name?.[0]}</div>
          <div className="forumpost-author-info">
            <span className="forumpost-author-name">{post.author_name}</span>
            <span className="forumpost-date">
              <Clock size={12} />
              {formatDate(post.created_date)}
            </span>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="forumpost-replies-section">
        <h2 className="forumpost-replies-title">
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {replies.length === 0 ? (
          <div className="forumpost-no-replies">
            <p>No replies yet. Be the first to help!</p>
          </div>
        ) : (
          <div className="forumpost-replies-list">
            {replies.map(reply => (
              <div key={reply.id} className={`forumpost-card forumpost-reply ${reply.is_helpful ? 'helpful' : ''}`}>
                {reply.is_helpful && (
                  <div className="forumpost-helpful-badge">
                    <Award size={14} />
                    <span>Helpful Answer</span>
                  </div>
                )}

                <div className="forumpost-reply-content">
                  <p>{reply.content}</p>
                </div>

                <div className="forumpost-reply-footer">
                  <div className="forumpost-reply-author">
                    <div className="forumpost-avatar forumpost-avatar-sm">
                      {reply.author_name?.[0]}
                    </div>
                    <span className="forumpost-author-name">{reply.author_name}</span>
                    <span className="forumpost-date">
                      <Clock size={12} />
                      {formatDate(reply.created_date)}
                    </span>
                  </div>

                  <div className="forumpost-reply-actions">
                    <button
                      className={`forumpost-action-btn ${reply.upvotes > 0 ? 'has-votes' : ''}`}
                      onClick={() => handleUpvote(reply.id)}
                    >
                      <ThumbsUp size={14} />
                      <span>{reply.upvotes}</span>
                    </button>

                    {isAuthor && !reply.is_helpful && (
                      <button
                        className="forumpost-action-btn forumpost-mark-helpful"
                        onClick={() => handleMarkHelpful(reply.id)}
                      >
                        <Award size={14} />
                        <span>Mark Helpful</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <div className="forumpost-card forumpost-reply-form">
        <h3>Your Reply</h3>
        <form onSubmit={handleSubmitReply}>
          <textarea
            placeholder="Share your knowledge or ask for clarification..."
            rows={4}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            disabled={submitting}
          />
          <div className="forumpost-form-actions">
            <button
              type="submit"
              className="forumpost-btn forumpost-btn-primary"
              disabled={submitting || !newReply.trim()}
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}