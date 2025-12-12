import React, { useState, useEffect } from 'react';
import { User, BookOpen, Calendar, Star, Plus, X } from 'lucide-react';
import '../styles/MyProfile.css';

// Dummy API (replace with your actual API calls)
const fakeApi = {
  auth: {
    me: async () => ({
      id: 1,
      full_name: 'Student User',
      email: 'student@ateneo.edu',
      bio: 'BS CS Student interested in AI and Web Development.',
      user_type: 'both', // student, tutor, both
      department: 'Computer Science',
      year_level: '3rd Year',
      phone: '09123456789',
      subjects_learning: ['Calculus', 'Physics'],
      subjects_teaching: ['Programming', 'Web Dev'],
      hourly_rate: 300,
      rating_average: 4.8,
      total_reviews: 12,
      total_sessions: 45
    }),
    updateMe: async (data) => {
      console.log('Updating user:', data);
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, academic, tutor
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: '',
    user_type: 'student',
    department: '',
    year_level: '',
    phone: '',
    subjects_learning: [],
    subjects_teaching: [],
    hourly_rate: ''
  });
  
  const [newSubjectLearning, setNewSubjectLearning] = useState('');
  const [newSubjectTeaching, setNewSubjectTeaching] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // In a real app, use: const currentUser = await base44.auth.me();
      const currentUser = await fakeApi.auth.me();
      setUser(currentUser);
      setFormData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        user_type: currentUser.user_type || 'student',
        department: currentUser.department || '',
        year_level: currentUser.year_level || '',
        phone: currentUser.phone || '',
        subjects_learning: currentUser.subjects_learning || [],
        subjects_teaching: currentUser.subjects_teaching || [],
        hourly_rate: currentUser.hourly_rate || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, use: await base44.auth.updateMe(formData);
      await fakeApi.auth.updateMe(formData);
      setUser({ ...user, ...formData });
      setEditing(false);
      // alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addSubjectLearning = () => {
    if (newSubjectLearning.trim()) {
      setFormData({
        ...formData,
        subjects_learning: [...formData.subjects_learning, newSubjectLearning.trim()]
      });
      setNewSubjectLearning('');
    }
  };

  const removeSubjectLearning = (index) => {
    setFormData({
      ...formData,
      subjects_learning: formData.subjects_learning.filter((_, i) => i !== index)
    });
  };

  const addSubjectTeaching = () => {
    if (newSubjectTeaching.trim()) {
      setFormData({
        ...formData,
        subjects_teaching: [...formData.subjects_teaching, newSubjectTeaching.trim()]
      });
      setNewSubjectTeaching('');
    }
  };

  const removeSubjectTeaching = (index) => {
    setFormData({
      ...formData,
      subjects_teaching: formData.subjects_teaching.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
      </div>
    );
  }

  const showTutorTab = formData.user_type === 'tutor' || formData.user_type === 'both';

  return (
    <div className="profile-container">
      
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        {!editing && (
          <button 
            onClick={() => setEditing(true)}
            className="profile-btn profile-btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-card">
        <div className="profile-content">
          {/* User Header */}
          <div className="profile-user-header">
            <div className="profile-avatar">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div className="profile-user-info">
              <h2>{user?.full_name}</h2>
              <p className="profile-email">{user?.email}</p>
              {user?.user_type && (
                <span className="profile-badge">
                  {user.user_type === 'both' ? 'Student & Tutor' : 
                   user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              Academic
            </button>
            {showTutorTab && (
              <button 
                className={`profile-tab-btn ${activeTab === 'tutor' ? 'active' : ''}`}
                onClick={() => setActiveTab('tutor')}
              >
                Tutor Info
              </button>
            )}
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="profile-form-section">
              <div className="profile-grid-2">
                <div className="profile-field">
                  <label className="profile-label">Full Name</label>
                  <input
                    type="text"
                    className="profile-input"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <input
                    type="email"
                    className="profile-input"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label">Phone</label>
                  <input
                    type="tel"
                    className="profile-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label">Account Type</label>
                  <select
                    className="profile-select"
                    value={formData.user_type}
                    onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                    disabled={!editing}
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="both">Both Student & Tutor</option>
                  </select>
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Bio</label>
                <textarea
                  className="profile-textarea"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!editing}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <div className="profile-form-section">
              <div className="profile-grid-2">
                <div className="profile-field">
                  <label className="profile-label">Department</label>
                  <input
                    type="text"
                    className="profile-input"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={!editing}
                    placeholder="e.g., Engineering"
                  />
                </div>

                <div className="profile-field">
                  <label className="profile-label">Year Level</label>
                  <select
                    className="profile-select"
                    value={formData.year_level}
                    onChange={(e) => setFormData({...formData, year_level: e.target.value})}
                    disabled={!editing}
                  >
                    <option value="">Select year level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Subjects I'm Learning</label>
                {editing && (
                  <div className="profile-subjects-input">
                    <input
                      type="text"
                      className="profile-input"
                      value={newSubjectLearning}
                      onChange={(e) => setNewSubjectLearning(e.target.value)}
                      placeholder="Add a subject..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubjectLearning())}
                    />
                    <button 
                      type="button" 
                      className="profile-btn profile-btn-outline profile-btn-icon"
                      onClick={addSubjectLearning}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
                <div className="profile-tags">
                  {formData.subjects_learning.map((subject, idx) => (
                    <span key={idx} className="profile-tag">
                      {subject}
                      {editing && (
                        <button
                          type="button"
                          className="profile-tag-remove"
                          onClick={() => removeSubjectLearning(idx)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.subjects_learning.length === 0 && (
                    <span className="text-gray-400 text-sm italic">No subjects added</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tutor Tab */}
          {activeTab === 'tutor' && showTutorTab && (
            <div className="profile-form-section">
              <div className="profile-field">
                <label className="profile-label">Subjects I Can Teach</label>
                {editing && (
                  <div className="profile-subjects-input">
                    <input
                      type="text"
                      className="profile-input"
                      value={newSubjectTeaching}
                      onChange={(e) => setNewSubjectTeaching(e.target.value)}
                      placeholder="Add a subject..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubjectTeaching())}
                    />
                    <button 
                      type="button" 
                      className="profile-btn profile-btn-outline profile-btn-icon"
                      onClick={addSubjectTeaching}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
                <div className="profile-tags">
                  {formData.subjects_teaching.map((subject, idx) => (
                    <span key={idx} className="profile-tag">
                      {subject}
                      {editing && (
                        <button
                          type="button"
                          className="profile-tag-remove"
                          onClick={() => removeSubjectTeaching(idx)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                  {formData.subjects_teaching.length === 0 && (
                    <span className="text-gray-400 text-sm italic">No subjects added</span>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <label className="profile-label">Hourly Rate (₱)</label>
                <input
                  type="number"
                  className="profile-input"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({...formData, hourly_rate: parseFloat(e.target.value)})}
                  disabled={!editing}
                  placeholder="e.g., 250"
                />
              </div>

              {user && (user.user_type === 'tutor' || user.user_type === 'both') && (
                <div className="profile-stats">
                  <div className="profile-stat-item">
                    <div className="profile-stat-icon">
                      <Star size={32} className="text-yellow-400" fill="#FBBF24" stroke="#FBBF24" />
                    </div>
                    <p className="profile-stat-value">{user.rating_average?.toFixed(1) || 'N/A'}</p>
                    <p className="profile-stat-label">Average Rating</p>
                  </div>
                  <div className="profile-stat-item">
                    <div className="profile-stat-icon">
                      <BookOpen size={32} color="#2563EB" />
                    </div>
                    <p className="profile-stat-value">{user.total_reviews || 0}</p>
                    <p className="profile-stat-label">Reviews</p>
                  </div>
                  <div className="profile-stat-item">
                    <div className="profile-stat-icon">
                      <Calendar size={32} color="#16A34A" />
                    </div>
                    <p className="profile-stat-value">{user.total_sessions || 0}</p>
                    <p className="profile-stat-label">Sessions</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Actions */}
          {editing && (
            <div className="profile-actions">
              <button
                className="profile-btn profile-btn-outline"
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="profile-btn profile-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}