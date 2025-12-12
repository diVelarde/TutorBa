import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Award, Calendar, MessageSquare, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import '../styles/TutorProfile.css';

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [activeTab, setActiveTab] = useState('subjects');
  const navigate = useNavigate();

  useEffect(() => {
    setTutor({
      id,
      name: 'Divina W. Velarde',
      email: 'divelarde@gbox.adnu.edu.ph',
      phone: '09xxxxxxxxxxxx',
      department: 'Computer Science',
      year: '3rd Year',
      rating: 4.1,
      reviews: 7,
      sessions: 9,
      rate: 113,
      currency: '₱',
      bio: "Passionate about helping students understand complex topics with simple explanations.",
      subjects: ['OOP', 'Information Management'],
      availability: [
        { day: 'Monday', times: [{ start: '10:00 am', end: '1:00 pm' }] },
        { day: 'Wednesday', times: [{ start: '2:00 pm', end: '5:00 pm' }] },
      ],
      reviewsList: [
        { reviewer: 'Juan Dela Cruz', rating: 5, text: 'Great tutor!', date: '2023-10-04' },
        { reviewer: 'Maria Santos', rating: 4, text: 'Very helpful and clear.', date: '2023-09-22' },
      ],
    });
  }, [id]);

  if (!tutor) return <div style={{ padding: 50 }}>Loading...</div>;

  return (
    <div className="tutor-profile-container">
      <main className="main-profile-content">
        {/* PROFILE CARD */}
        <div className="profile-card-b44">
          <div className="profile-top-row">
            <div className="avatar-large-b44">
              {tutor.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <h2>{tutor.name}</h2>
              <div className="profile-row">
                {tutor.department} <span className="dot">•</span> {tutor.year}
              </div>

              <div className="profile-rating-row">
                <Star className="star-icon" />
                <span className="profile-rating">{tutor.rating.toFixed(1)}</span>
                <span>({tutor.reviews} reviews)</span>
                <span className="profile-dot">|</span>
                <div className="sessions-badge">
                  <Award className="award-icon" />
                  <span>{tutor.sessions} sessions completed</span>
                </div>
              </div>

              <div className="profile-rate">
                {tutor.currency}{tutor.rate}
                <span className="profile-hour">/hr</span>
              </div>

              {tutor.bio && <div className="profile-bio">{tutor.bio}</div>}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="profile-actions">
            <button 
              className="book-session"
              onClick={() => navigate("/booking")}
            >
              <Calendar className="button-icon" />
              Book Session
            </button>
            <button 
              className="send-message"
              onClick={() => navigate(`/messages?tutor=${tutor.id}`)}
            >
              <MessageSquare className="button-icon" />
              Send Message
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="profile-tabs">
          <button
            className={activeTab === 'subjects' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('subjects')}
          >
            Subjects & Availability
          </button>
          <button
            className={activeTab === 'reviews' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button
            className={activeTab === 'contact' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('contact')}
          >
            Contact Info
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content-b44">
          {activeTab === 'subjects' && (
            <div className="subjects-card-b44">
              <h3 className="subjects-card-title-b44">Subjects Taught</h3>
              <ul className="subjects-card-list-b44">
                {tutor.subjects.map((s) => (
                  <li key={s}>
                    <BookOpen className="book-icon" />
                    {s}
                  </li>
                ))}
              </ul>

              <h3 className="subjects-card-title-b44" style={{ marginTop: 16 }}>
                Weekly Availability
              </h3>
              {tutor.availability.map((slot) => (
                <div key={slot.day} className="availability-day-block-b44">
                  <span className="availability-day-b44">{slot.day}</span>
                  <ul className="availability-times-b44">
                    {slot.times.map((time, idx) => (
                      <li key={idx}>
                        <Clock className="clock-icon" />
                        {time.start} - {time.end}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <>
              <h3 className="tab-section-title">Reviews</h3>
              {!tutor.reviewsList || tutor.reviewsList.length === 0 ? (
                <div className="no-reviews">No reviews yet</div>
              ) : (
                <ul className="reviews-list">
                  {tutor.reviewsList.map((review, idx) => (
                    <li key={idx} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.reviewer}</span>
                        <span className="review-rating">{review.rating.toFixed(1)} ★</span>
                      </div>
                      <div className="review-body">{review.text}</div>
                      <div className="review-date">{review.date}</div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <h3 className="tab-section-title">Contact Information</h3>
              <div className="contact-info-item"><strong>Email:</strong> {tutor.email}</div>
              <div className="contact-info-item"><strong>Phone:</strong> {tutor.phone}</div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
