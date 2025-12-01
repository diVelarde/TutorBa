import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  BookOpen, 
  MessageSquare, 
  User,
  Trash2
} from 'lucide-react';
import '../styles/Favorites.css';

// Dummy API
const fakeApi = {
  auth: {
    me: async () => ({ id: 1, full_name: 'Student User' })
  },
  entities: {
    User: {
      list: async () => ([
        {
          id: 'tutor1',
          full_name: 'Maria Santos',
          department: 'Mathematics',
          subjects_teaching: ['Calculus', 'Algebra', 'Trigonometry'],
          rating_average: 4.8,
          total_reviews: 24,
          hourly_rate: 500,
          bio: 'Math enthusiast with 3 years of tutoring experience.'
        },
        {
          id: 'tutor2',
          full_name: 'Juan dela Cruz',
          department: 'Physics',
          subjects_teaching: ['Physics 1', 'Physics 2'],
          rating_average: 4.9,
          total_reviews: 15,
          hourly_rate: 450,
          bio: 'Making physics easy to understand for everyone.'
        }
      ])
    },
    Favorite: {
      filter: async ({ student_id }) => ([
        { id: 1, student_id: 1, tutor_id: 'tutor1', tutor_name: 'Maria Santos' },
        { id: 2, student_id: 1, tutor_id: 'tutor2', tutor_name: 'Juan dela Cruz' }
      ]),
      delete: async (id) => true
    }
  }
};

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [user, favs, allUsers] = await Promise.all([
        fakeApi.auth.me(),
        fakeApi.entities.Favorite.filter({ student_id: 1 }), // Mock ID
        fakeApi.entities.User.list()
      ]);

      setCurrentUser(user);
      setFavorites(favs);
      setTutors(allUsers);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId, e) => {
    e.stopPropagation();
    if (window.confirm('Remove this tutor from favorites?')) {
      await fakeApi.entities.Favorite.delete(favoriteId);
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    }
  };

  const getTutorDetails = (tutorId) => {
    return tutors.find(t => t.id === tutorId);
  };

  const navigateToTutor = (tutorId) => {
    console.log('Navigate to tutor:', tutorId);
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="favorites-spinner"></div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">My Favorites</h1>
        <p className="favorites-subtitle">
          Your saved tutors ({favorites.length})
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <Heart size={48} strokeWidth={1} />
          <h3>No favorites yet</h3>
          <p>Browse tutors and click the heart icon to save them here.</p>
          <button className="favorites-btn favorites-btn-primary">
            Find Tutors
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(fav => {
            const tutor = getTutorDetails(fav.tutor_id);
            if (!tutor) return null;

            return (
              <div 
                key={fav.id} 
                className="favorites-card"
                onClick={() => navigateToTutor(tutor.id)}
              >
                <div className="favorites-card-content">
                  <div className="favorites-tutor-header">
                    <div className="favorites-avatar">
                      {tutor.full_name?.[0]}
                    </div>
                    <div className="favorites-tutor-info">
                      <h3 className="favorites-tutor-name">{tutor.full_name}</h3>
                      <p className="favorites-tutor-dept">{tutor.department}</p>
                    </div>
                    <button 
                      className="favorites-remove-btn"
                      onClick={(e) => removeFavorite(fav.id, e)}
                      title="Remove from favorites"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="favorites-tutor-bio">{tutor.bio}</p>

                  <div className="favorites-subjects">
                    {tutor.subjects_teaching?.slice(0, 3).map((subject, idx) => (
                      <span key={idx} className="favorites-badge">
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects_teaching?.length > 3 && (
                      <span className="favorites-badge favorites-badge-outline">
                        +{tutor.subjects_teaching.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="favorites-stats"> 
                    <div className="favorites-stat-item">
                      <Star size={16} className="star-icon" />
                      <span className="stat-value">{tutor.rating_average}</span>
                      <span className="stat-label">({tutor.total_reviews})</span>
                    </div>
                    <div className="favorites-stat-item">
                      <span className="favorites-price">₱{tutor.hourly_rate}/hr</span>
                    </div>
                  </div>

                  <div className="favorites-actions">
                    <button className="favorites-btn favorites-btn-outline full-width">
                      <User size={18} />
                      View Profile
                    </button>
                    <button className="favorites-btn favorites-btn-primary full-width">
                      <MessageSquare size={18} />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}