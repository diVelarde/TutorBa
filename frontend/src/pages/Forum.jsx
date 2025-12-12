import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Eye, 
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import '../styles/Forum.css';

// Dummy API (replace with your actual API calls)
const fakeApi = {
  auth: {
    me: async () => ({ id: 1, full_name: 'Student User' })
  },
  entities: {
    ForumPost: {
      list: async () => ([
        {
          id: 1,
          title: 'How to solve integration by parts?',
          content: 'I\'m having trouble understanding when to use integration by parts versus substitution. Can someone explain the general approach?',
          author_id: 'student1',
          author_name: 'Mark Tan',
          subject: 'Calculus',
          department: 'Mathematics',
          replies_count: 3,
          views_count: 45,
          is_resolved: true,
          created_date: '2025-01-20T10:30:00Z'
        },
        {
          id: 2,
          title: 'Best study techniques for Physics exams?',
          content: 'Finals are coming up and I\'m struggling with Physics 2. What study methods work best for you guys?',
          author_id: 'student2',
          author_name: 'Lisa Ong',
          subject: 'Physics',
          department: 'Physics',
          replies_count: 5,
          views_count: 78,
          is_resolved: false,
          created_date: '2025-01-21T14:00:00Z'
        },
        {
          id: 3,
          title: 'Looking for study group - Organic Chemistry',
          content: 'Anyone interested in forming a study group for Orgo? We can meet at the library twice a week.',
          author_id: 'student3',
          author_name: 'Paolo Cruz',
          subject: 'Organic Chemistry',
          department: 'Chemistry',
          replies_count: 7,
          views_count: 120,
          is_resolved: false,
          created_date: '2025-01-22T09:15:00Z'
        }
      ]),
      update: async () => true,
      create: async (data) => ({ id: Date.now(), ...data, created_date: new Date().toISOString(), replies_count: 0, views_count: 0 })
    }
  }
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CreatePostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="forum-modal-overlay">
      <div className="forum-modal">
        <div className="forum-modal-header">
          <h2>Ask a Question</h2>
          <button className="forum-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="forum-modal-form">
          <div className="forum-form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What's your question?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="forum-form-group">
            <label>Details *</label>
            <textarea
              placeholder="Provide more details about your question..."
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <div className="forum-form-row">
            <div className="forum-form-group">
              <label>Subject (optional)</label>
              <input
                type="text"
                placeholder="e.g., Calculus"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="forum-form-group">
              <label>Department (optional)</label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>
          <div className="forum-modal-actions">
            <button type="button" className="forum-btn forum-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="forum-btn forum-btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Forum() {
    const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, sortBy, posts]);

  const loadData = async () => {
    try {
      const [allPosts, user] = await Promise.all([
        fakeApi.entities.ForumPost.list(),
        fakeApi.auth.me()
      ]);
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.subject?.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.views_count - a.views_count);
    } else if (sortBy === 'unanswered') {
      filtered = filtered.filter(p => p.replies_count === 0);
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (formData) => {
    const newPost = await fakeApi.entities.ForumPost.create({
      ...formData,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      is_resolved: false
    });
    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
  };

  const viewPost = async (post) => {
    navigate(`/forumpost/${post.id}`);
  };

  if (loading) {
    return (
      <div className="forum-loading">
        <div className="forum-spinner"></div>
      </div>
    );
  }

  return (
    <div className="forum-container">
      {/* Header */}
      <div className="forum-header">
        <div>
          <h1 className="forum-title">Discussion Forum</h1>
          <p className="forum-subtitle">Ask questions and help fellow students</p>
        </div>
        <button className="forum-btn forum-btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          <span>Ask Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="forum-filters">
        <div className="forum-search">
          <Search className="forum-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            className="forum-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="forum-sort-buttons">
          {['recent', 'popular', 'unanswered'].map(sort => (
            <button
              key={sort}
              className={`forum-sort-btn ${sortBy === sort ? 'active' : ''}`}
              onClick={() => setSortBy(sort)}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="forum-posts">
        {filteredPosts.length === 0 ? (
          <div className="forum-empty">
            <MessageCircle size={48} />
            <p>No posts found</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="forum-post-card"
              onClick={() => viewPost(post)}
            >
              <div className="forum-post-stats">
                <div className="forum-stat">
                  <MessageCircle size={16} />
                  <span>{post.replies_count}</span>
                </div>
                <div className="forum-stat">
                  <Eye size={16} />
                  <span>{post.views_count}</span>
                </div>
              </div>
              
              <div className="forum-post-content">
                <div className="forum-post-header">
                  <h3 className="forum-post-title">{post.title}</h3>
                  {post.is_resolved && (
                    <span className="forum-resolved-badge">
                      <CheckCircle size={14} />
                      Resolved
                    </span>
                  )}
                </div>
                <p className="forum-post-excerpt">{post.content}</p>
                
                <div className="forum-post-meta">
                  <div className="forum-post-tags">
                    {post.subject && (
                      <span className="forum-tag forum-tag-subject">{post.subject}</span>
                    )}
                    {post.department && (
                      <span className="forum-tag forum-tag-dept">{post.department}</span>
                    )}
                  </div>
                  <div className="forum-post-author">
                    <div className="forum-avatar">
                      {post.author_name?.[0] || 'U'}
                    </div>
                    <span className="forum-author-name">{post.author_name}</span>
                    <span className="forum-post-date">
                      <Clock size={12} />
                      {formatDate(post.created_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}