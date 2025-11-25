import React, { useState } from 'react';
import '../styles/Home.css';
import { Search, Users, Calendar, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const stats = {
    tutors: 42,
    sessions: 120,
    subjects: 18
  };

  const handleSearch = () => {
    alert(`Search for: ${searchQuery}`);
  };

  const features = [
    {
      icon: Search,
      title: 'Find Your Tutor',
      description: 'Browse through qualified Ateneo tutors across all departments',
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule sessions that fit your timetable with just a few clicks',
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read honest reviews from fellow students to find the best match',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Join discussions and get help from the entire Ateneo community',
    }
  ];

  const navigate = (page) => alert(`Navigate to: ${page}`);

    return (
    <div className="container">
      <section className="hero-section">
        <h1 className="hero-title">
            Your Academic Success
            <span>Starts Here</span>
        </h1>
        <p className="hero-description">
            Connect with top-rated student tutors at Ateneo. Learn at your pace, excel in your subjects.
        </p>

        {/* Search */}
        <div className="hero-search-container">
            <input
            type="text"
            placeholder="Search by subject, department, or tutor name..."
            className="hero-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="hero-search-button" onClick={handleSearch}>
            Find Tutors
            </button>
        </div>

        {/* Stats */}
        <div className="hero-stats">
            <div className="hero-stat">
            <div className="hero-stat-number">{stats.tutors}+</div>
            <div className="hero-stat-label">Active Tutors</div>
            </div>
            <div className="hero-stat">
            <div className="hero-stat-number">{stats.sessions}+</div>
            <div className="hero-stat-label">Sessions Completed</div>
            </div>
            <div className="hero-stat">
            <div className="hero-stat-number">{stats.subjects}+</div>
            <div className="hero-stat-label">Subjects Offered</div>
            </div>
        </div>
        </section>

      <section className="features-section">
            <h2 className="features-title">Why Choose TutorBa?</h2>
            <div className="features-grid">
                {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div key={index} className="feature-box">
                    <Icon className="feature-icon" />
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    </div>
                );
                })}
            </div>
        </section>

            <section className="cta-section">
            <h2>Ready to Start Learning?</h2>
            <p>Join hundreds of Ateneo students already improving their grades with TutorBa</p>
            <div className="cta-buttons">
                <button className="cta-button" onClick={() => navigate('FindTutors')}>
                Browse Tutors <ArrowRight />
                </button>
                <button className="cta-button-outline" onClick={() => navigate('Forum')}>
                Visit Forum
                </button>
            </div>
        </section>
    </div>
  );
}
