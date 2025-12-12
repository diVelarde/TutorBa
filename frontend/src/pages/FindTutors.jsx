import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindTutors.css';

export default function FindTutors() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [departments, setDepartments] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const sampleTutors = [
      {
        id: 1,
        full_name: 'John Smith',
        department: 'Mathematics',
        bio: 'Experienced math tutor with 5+ years helping students excel.',
        subjects_teaching: ['Calculus', 'Algebra', 'Statistics', 'Geometry'],
        rating_average: 4.8,
        total_reviews: 24,
        total_sessions: 156,
        hourly_rate: 50
      },
      {
        id: 2,
        full_name: 'Sarah Johnson',
        department: 'Science',
        bio: 'Physics and Chemistry specialist with a passion for teaching.',
        subjects_teaching: ['Physics', 'Chemistry', 'Biology'],
        rating_average: 4.9,
        total_reviews: 31,
        total_sessions: 203,
        hourly_rate: 55
      },
      {
        id: 3,
        full_name: 'Michael Chen',
        department: 'Computer Science',
        bio: 'Software engineer turned educator. Makes coding fun and accessible.',
        subjects_teaching: ['Python', 'JavaScript', 'Data Structures', 'Algorithms', 'Web Development'],
        rating_average: 4.7,
        total_reviews: 18,
        total_sessions: 89,
        hourly_rate: 60
      },
      {
        id: 4,
        full_name: 'Emily Davis',
        department: 'Languages',
        bio: 'Native English speaker with TESOL certification.',
        subjects_teaching: ['English', 'Spanish', 'French'],
        rating_average: 4.6,
        total_reviews: 42,
        total_sessions: 312,
        hourly_rate: 40
      }
    ];

    setTutors(sampleTutors);
    setFilteredTutors(sampleTutors);
    
    const depts = [...new Set(sampleTutors.map(t => t.department).filter(Boolean))];
    setDepartments(depts);
    setLoading(false);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedDepartment, sortBy, tutors]);

  const applyFilters = () => {
    let filtered = [...tutors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tutor => 
        tutor.full_name?.toLowerCase().includes(query) ||
        tutor.department?.toLowerCase().includes(query) ||
        tutor.subjects_teaching?.some(s => s.toLowerCase().includes(query))
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(t => t.department === selectedDepartment);
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0));
    } else if (sortBy === 'sessions') {
      filtered.sort((a, b) => (b.total_sessions || 0) - (a.total_sessions || 0));
    } else if (sortBy === 'rate') {
      filtered.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
    }

    setFilteredTutors(filtered);
  };

  const toggleFavorite = (e, tutorId) => {
    e.stopPropagation();
    if (favorites.includes(tutorId)) {
      setFavorites(favorites.filter(id => id !== tutorId));
    } else {
      setFavorites([...favorites, tutorId]);
    }
  };

  const isFavorited = (tutorId) => favorites.includes(tutorId);

  const handleTutorClick = (tutorId) => {
    navigate(`/tutor-profile?id=${tutorId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="find-tutors-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Find Your Tutor</h1>
        <p className="page-subtitle">
          Browse {filteredTutors.length} available tutors
        </p>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search tutors, subjects, or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Highest Rated</option>
            <option value="sessions">Most Sessions</option>
            <option value="rate">Lowest Rate</option>
          </select>
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="empty-state">
          <p>No tutors found matching your criteria</p>
        </div>
      ) : (
        <div className="tutors-grid">
          {filteredTutors.map(tutor => (
            <div 
              key={tutor.id} 
              className="tutor-card"
              onClick={() => navigate(`/tutorprofile/${tutor.id}`)}
            >
              {/* Card Header */}
              <div className="card-header">
                <div className="tutor-info">
                  <div className="avatar">
                    {tutor.full_name?.[0] || 'T'}
                  </div>
                  <div className="tutor-details">
                    <h3 className="tutor-name">{tutor.full_name}</h3>
                    <p className="tutor-department">{tutor.department}</p>
                  </div>
                </div>
                <button
                  className={`favorite-btn ${isFavorited(tutor.id) ? 'favorited' : ''}`}
                  onClick={(e) => toggleFavorite(e, tutor.id)}
                >
                  <svg viewBox="0 0 24 24" fill={isFavorited(tutor.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Bio */}
              {tutor.bio && (
                <p className="tutor-bio">{tutor.bio}</p>
              )}

              {/* Subjects */}
              <div className="subjects-container">
                {tutor.subjects_teaching?.slice(0, 3).map((subject, idx) => (
                  <span key={idx} className="subject-badge">{subject}</span>
                ))}
                {tutor.subjects_teaching?.length > 3 && (
                  <span className="subject-badge more">
                    +{tutor.subjects_teaching.length - 3} more
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="card-stats">
                <div className="stat rating">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span className="stat-value">{tutor.rating_average?.toFixed(1) || 'New'}</span>
                  {tutor.total_reviews > 0 && (
                    <span className="stat-label">({tutor.total_reviews})</span>
                  )}
                </div>
                
                <div className="stat sessions">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{tutor.total_sessions || 0} sessions</span>
                </div>
                
                {tutor.hourly_rate && (
                  <div className="stat rate">
                    ${tutor.hourly_rate}/hr
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}