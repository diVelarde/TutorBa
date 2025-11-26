import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, MessageCircle, Star, User, LogOut, Menu, X } from 'lucide-react';
import '../styles/Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/find-tutors', label: 'Find Tutors', icon: Search },
    { to: '/sessions', label: 'My Sessions', icon: Calendar },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/forum', label: 'Forum', icon: MessageCircle },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="logo-container">
          <div className="logo-icon">T</div>
          <span className="logo-text">TutorBa</span>
        </NavLink>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button className="logout-button">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}