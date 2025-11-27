import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import '../styles/MySession.css';

// Dummy API & Data (replace with your actual API calls)
const fakeApi = {
  auth: {
    me: async () => ({ id: 1, name: 'Student User' })
  },
  entities: {
    Session: {
      list: async () => ([
        {
          id: 1,
          student_id: 1,
          tutor_id: 2,
          tutor_name: "Jane Tutor",
          student_name: "Student User",
          subject: "Mathematics",
          status: "pending",
          date: new Date().toISOString(),
          time_start: "09:00 AM",
          time_end: "10:00 AM",
          location: "Zoom",
          rate: 400,
          notes: "Bring calculator."
        },
        {
          id: 2,
          student_id: 1,
          tutor_id: 3,
          tutor_name: "Mark Tutor",
          student_name: "Student User",
          subject: "Science",
          status: "completed",
          date: new Date().toISOString(),
          time_start: "10:00 AM",
          time_end: "11:00 AM",
          location: "School",
          rate: 350,
          notes: "Chapters 3-5."
        }
      ]),
      update: async (id, { status }) => true
    }
  }
};

function ReviewModal({ session, onClose }) {
  // You can customize this modal
  return (
    <div style={{position:'fixed', zIndex:10, left:0, top:0, width:'100vw', height:'100vh', background:'#0008', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', padding:20, borderRadius:8}}>
        <p>Review Session "{session.subject}"</p>
        <button className="sessions-btn gray" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const loadSessions = async () => {
      const user = await fakeApi.auth.me();
      setCurrentUser(user);
      const allSessions = await fakeApi.entities.Session.list();
      const userSessions = allSessions.filter(s => s.student_id === user.id || s.tutor_id === user.id);
      setSessions(userSessions);
      setLoading(false);
    };
    loadSessions();
  }, []);

  const updateSessionStatus = async (sessionId, newStatus) => {
    await fakeApi.entities.Session.update(sessionId, { status: newStatus });
    setSessions(sessions.map(s =>
      s.id === sessionId ? { ...s, status: newStatus } : s
    ));
  };

  const filterSessions = status => {
    if (status === 'upcoming') {
      return sessions.filter(s => s.status === 'pending' || s.status === 'confirmed');
    } else if (status === 'ongoing') {
      return sessions.filter(s => s.status === 'ongoing');
    } else if (status === 'completed') {
      return sessions.filter(s => s.status === 'completed');
    } else if (status === 'cancelled') {
      return sessions.filter(s => s.status === 'cancelled');
    }
    return sessions;
  };

  const getStatusBadge = status => {
    const configs = {
      pending: { class: 'sessions-status-badge sessions-status-pending', icon: AlertCircle, label: 'Pending' },
      confirmed: { class: 'sessions-status-badge sessions-status-confirmed', icon: CheckCircle, label: 'Confirmed' },
      ongoing: { class: 'sessions-status-badge sessions-status-ongoing', icon: AlertCircle, label: 'Ongoing' },
      completed: { class: 'sessions-status-badge sessions-status-completed', icon: CheckCircle, label: 'Completed' },
      cancelled: { class: 'sessions-status-badge sessions-status-cancelled', icon: XCircle, label: 'Cancelled' }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={config.class}>
        <Icon size={14} style={{ marginRight: 2 }} />
        {config.label}
      </span>
    );
  };

  const SessionCard = ({ session }) => {
  const isStudent = currentUser?.id === session.student_id;
  const otherUser = isStudent ? session.tutor_name : session.student_name;
  const canReview = isStudent && session.status === 'completed';
  
  return (
    <div className="sessions-card">
      <div className="sessions-card-content">
        <div className="sessions-card-layout">
          <div className="sessions-card-info">
            <div className="sessions-header">
              <h3 className="sessions-subject">{session.subject}</h3>
              {getStatusBadge(session.status)}
            </div>
            <p className="sessions-other-user">
              {isStudent ? 'with' : 'teaching'} {otherUser}
            </p>
            
            <div className="sessions-details-grid">
              <div className="sessions-detail-item">
                <Calendar size={16} />
                <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="sessions-detail-item">
                <Clock size={16} />
                <span>{session.time_start} - {session.time_end}</span>
              </div>
              <div className="sessions-detail-item">
                <MapPin size={16} />
                <span>{session.location}</span>
              </div>
              {session.rate && (
                <div className="sessions-detail-item sessions-rate">
                  <span>₱{session.rate}/hr</span>
                </div>
              )}
            </div>
            
            {session.notes && (
              <p className="sessions-notes">{session.notes}</p>
            )}
          </div>
          
          <div className="sessions-actions">
            {session.status === 'pending' && (
              <>
                {!isStudent && (
                  <button className="sessions-btn sessions-btn-primary" onClick={() => updateSessionStatus(session.id, 'confirmed')}>
                    Accept
                  </button>
                )}
                <button className="sessions-btn sessions-btn-danger" onClick={() => updateSessionStatus(session.id, 'cancelled')}>
                  Cancel
                </button>
              </>
            )}
            {session.status === 'confirmed' && (
              <button className="sessions-btn sessions-btn-gold" onClick={() => updateSessionStatus(session.id, 'ongoing')}>
                Start Session
              </button>
            )}
            {session.status === 'ongoing' && (
              <button className="sessions-btn sessions-btn-primary" onClick={() => updateSessionStatus(session.id, 'completed')}>
                Complete
              </button>
            )}
            {canReview && (
              <button className="sessions-btn sessions-btn-outline" onClick={() => { setSelectedSession(session); setShowReviewModal(true); }}>
                Write Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="sessions-loading"><span>⏳</span></div>
    );
  }

  return (
    <div className="sessions-container">
      <div>
        <h1 className="sessions-title">My Sessions</h1>
        <p className="sessions-subtitle">Manage your tutoring sessions</p>
      </div>
      <div>
        <div className="sessions-tabs-list">
          {['upcoming', 'ongoing', 'completed', 'cancelled'].map(tab => (
            <button
              key={tab}
              className={`sessions-tabs-trigger${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({filterSessions(tab).length})
            </button>
          ))}
        </div>
        {['upcoming', 'ongoing', 'completed', 'cancelled'].map(tab => (
          activeTab === tab && (
            <div key={tab} style={{ marginTop: 24 }}>
              {filterSessions(tab).length === 0 ? (
                <div className="sessions-card">
                  <div className="sessions-card-content sessions-no-data">
                    <Calendar size={32} className="mb-4" />
                    <p>No {tab} sessions</p>
                  </div>
                </div>
              ) : (
                filterSessions(tab).map(session => (
                  <SessionCard key={session.id} session={session} />
                ))
              )}
            </div>
          )
        ))}
      </div>
      {showReviewModal && selectedSession && (
        <ReviewModal
          session={selectedSession}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
}