import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Booking.css';

function TimePicker({ value, onChange, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const generateTimeOptions = () => {
    const times = [];
    const amPmOptions = ['AM', 'PM'];
    
    for (let amPm of amPmOptions) {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const hourStr = hour.toString();
          const minuteStr = minute.toString().padStart(2, '0');
          times.push(`${hourStr}:${minuteStr} ${amPm}`);
        }
      }
    }
    
    return times;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTimeSelect = (time) => {
    onChange({ target: { name, value: time } });
    setIsOpen(false);
  };

  const formatValue = (val) => {
    if (!val) return '';
    const str = val.toString().trim();
    // Normalize formats like "1:00AM" or "01:00 AM" to "1:00 AM"
    const m = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (m) {
      return `${parseInt(m[1], 10)}:${m[2]} ${m[3].toUpperCase()}`;
    }
    return str;
  };

  return (
    <div className="time-picker-wrapper" ref={pickerRef}>
      <div className="time-input-wrapper">
        <input
          type="text"
          className="form-control time-input"
          value={formatValue(value)}
            readOnly
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
          onPaste={(e) => e.preventDefault()}
          onInput={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
          required
        />
      </div>
      {isOpen && (
        <div className="time-picker-dropdown-simple">
          {timeOptions.map((time) => (
            <div
              key={time}
              className={`time-picker-option ${formatValue(value) === time ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Booking() {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    topic: '',
    date: '',
    startTime: '',
    endTime: '',
    tutor: '',
    student: ''
  });
  const [selectedSession, setSelectedSession] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.topic.trim() || 
        !formData.date || 
        !formData.startTime.trim() || 
        !formData.endTime.trim() || 
        !formData.tutor.trim() || 
        !formData.student.trim()) {
      alert('Please fill in all fields before creating a session.');
      return;
    }

    const newSession = {
      ...formData,
      startTimeDisplay: formData.startTime,
      endTimeDisplay: formData.endTime,
      id: Date.now()
    };
    
    setSessions(prev => [...prev, newSession]);
    setFormData(prev => ({ 
      ...prev,
      topic: '',
      date: '',
      startTime: '',
      endTime: '',
      tutor: '',
      student: ''
    }));
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const handleFinish = () => {
    setSessions(prev => prev.filter(session => session.id !== selectedSession.id));
    setSelectedSession(null);
  };

  const handleNotYet = () => {
    setSelectedSession(null);
  };

  return (
    <div className="container-fluid">
      <div className="booking-container">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body p-4">
              <h2 className="card-title">Make a Session</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Topic</label>
                  <input
                    type="text"
                    className="form-control"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <div className="d-flex gap-2">
                    <TimePicker
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                    <TimePicker
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Tutor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tutor"
                    value={formData.tutor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Student</label>
                  <input
                    type="text"
                    className="form-control"
                    name="student"
                    value={formData.student}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Create</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Your Session/s:</h2>
              <div className="sessions-list">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="session-card p-3 mb-3 bg-light rounded"
                    onClick={() => handleSessionClick(session)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h5>{session.topic}</h5>
                    <p className="mb-1">{new Date(session.date).toLocaleDateString()}</p>
                    <p className="mb-1">
                      {session.startTimeDisplay} - {session.endTimeDisplay}
                    </p>
                    <p className="mb-1 text-danger">Tutor: {session.tutor}</p>
                    <p className="mb-0 text-primary">Student: {session.student}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedSession && (
        <div className="modal-overlay" onClick={handleNotYet}>
          <div className="session-modal" onClick={e => e.stopPropagation()}>
            <h4>{selectedSession.topic}</h4>
            <p>{new Date(selectedSession.date).toLocaleDateString()}</p>
            <p>
              {selectedSession.startTimeDisplay} - {selectedSession.endTimeDisplay}
            </p>
            <p className="text-danger">Tutor: {selectedSession.tutor}</p>
            <p className="text-primary">Student: {selectedSession.student}</p>
            <div className="button-group">
              <button className="btn btn-primary" onClick={handleFinish}>Finish</button>
              <button className="btn btn-danger" onClick={handleNotYet}>Not yet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;