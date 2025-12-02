import React, { useEffect, useRef } from 'react';
import '../styles/Chat.css';

function Chat({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(evt) {
      if (ref.current && !ref.current.contains(evt.target)) {
        onClose && onClose();
      }
    }

    // Listen for clicks outside the overlay to close it
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const contacts = [
    { id: 1, name: 'Discussion Forum', subtitle: 'All for One, One for All!' },
    { id: 2, name: 'Dwine', subtitle: 'Lorem ipsum dolor ...' },
    { id: 3, name: 'Dwine', subtitle: 'Lorem ipsum dolor ...' },
    { id: 4, name: 'Dwine', subtitle: 'Lorem ipsum dolor ...' },
    { id: 5, name: 'Dwine', subtitle: 'Lorem ipsum dolor ...' }
  ];

  return (
    <aside className="chat-overlay" ref={ref} role="dialog" aria-label="Chat contacts">
      <div className="chat-header">
        <div className="chat-title">Contacts pop up</div>
        <button aria-label="Close chat" className="chat-close" onClick={() => onClose && onClose()}>×</button>
      </div>

      <div className="chat-body">
        <div className="chat-brand">TutorBa?</div>

        <div className="chat-list">
          {contacts.map(c => (
            <div key={c.id} className="chat-item" tabIndex={0}>
              <div className="chat-avatar" />
              <div className="chat-meta">
                <div className="chat-name">{c.name}</div>
                <div className="chat-sub">{c.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Chat;
