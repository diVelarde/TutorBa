import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindTutors.css';

export default function FindTutors() {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('Highest Rated');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const tutorList = [
        {
          id: '691e9b29f206972795675179',
          name: 'Divina W. Velarde',
          department: 'Computer Science',
          subjects: ['OOP', 'Information Management'],
          rating: 4.1,
          reviews: 7,
          sessions: 9,
          rate: 113,
          currency: '₱',
        },
        {
          id: 'tutor2',
          name: 'Juan Dela Cruz',
          department: 'Mathematics',
          subjects: ['Calculus', 'Statistics'],
          rating: 4.7,
          reviews: 12,
          sessions: 20,
          rate: 120,
          currency: '₱',
        },
      ];
      setTutors(tutorList);
      setFilteredTutors(tutorList);
      setDepartments(['All', ...new Set(tutorList.map(t => t.department))]);
    }
    loadData();
  }, []);

  useEffect(() => {
    let results = tutors;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(tutor =>
        tutor.name.toLowerCase().includes(q) ||
        (tutor.department && tutor.department.toLowerCase().includes(q)) ||
        (tutor.subjects && tutor.subjects.some(subj => subj.toLowerCase().includes(q)))
      );
    }
    if (selectedDepartment !== 'All') {
      results = results.filter(tutor => tutor.department === selectedDepartment);
    }
    if (sortBy === 'Highest Rated') {
      results = [...results].sort((a, b) => b.rating - a.rating);
    }
    setFilteredTutors(results);
  }, [searchQuery, selectedDepartment, sortBy, tutors]);

  return (
    <div className="tutorba-container">
      <main className="main-content">
        <header>
          <h1>Find Your Tutor</h1>
        </header>
        <div className="browse-label">
          <span className="browse-title">Browse</span>
          <span className="available-tutors">{filteredTutors.length} available tutors</span>
        </div>
        <div className="searchbar-filter-container">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              <svg width="18" height="18" fill="none" stroke="#b3b8ca" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, subject, or department..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option>Highest Rated</option>
              <option>Most Sessions</option>
            </select>
          </div>
        </div>
        <section className="tutors-grid">
          {filteredTutors.length === 0 && (
            <div style={{ color: '#888', padding: '40px 0', textAlign: 'center' }}>
              No tutors found.
            </div>
          )}

          {filteredTutors.map(tutor => (  
            <div className="tutor-card" 
              key={tutor.id} 
              tabIndex={0} 
              onClick={() => navigate(`/tutorprofile/${tutor.id}`)}
              >
              {/* LEFT — Avatar + Name/Department */}
              <div className="card-left">
                <div className="avatar-info">
                  <div className="card-avatar">{tutor.name.charAt(0).toUpperCase()}</div>
                  <div className="card-name-department">
                    <h2 className="card-name">{tutor.name}</h2>
                    <p className="card-department">{tutor.department}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT — Main Content */}
              <div className="card-right">
                <p className="card-description">
                  Available for tutoring sessions in selected subjects.
                </p>

                <div className="card-subjects">
                  {tutor.subjects.map(s => (
                    <span className="subject-tag" key={s}>{s}</span>
                  ))}
                </div>

                <hr className="card-divider" />

                <div className="card-meta">
                  <span className="meta-rating">⭐ {tutor.rating.toFixed(1)}</span>
                  <span className="meta-sessions">{tutor.sessions} sessions</span>
                  <span className="meta-price">{tutor.currency}{tutor.rate}/hr</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}