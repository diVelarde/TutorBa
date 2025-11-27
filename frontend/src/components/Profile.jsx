import React from 'react';
import '../styles/Profile.css';

function Profile() {
  return (
    <main className="profile-page">
      <div className="profile-wrapper">
        <section className="profile-left card">
          <div className="profile-top">
            <img
              className="profile-avatar"
              src="https://i.pravatar.cc/300"
              alt="Profile avatar"
            />
            <div className="profile-meta">
              <h2 className="profile-name">Ed Sumalangit</h2>
              <div className="profile-role">BSIT</div>
              <div className="profile-rating">Rating: <span className="stars">★★★★☆</span> 4.0</div>
            </div>
          </div>

          <div className="skills-container">
            <div className="skill-box">
              <div className="skill-title">Proficiencies</div>
              <div className="skill-list">
                {/* Add items here; kept empty to match the screenshot */}
              </div>
            </div>

            <div className="skill-box">
              <div className="skill-title">Deficiencies</div>
              <div className="skill-list">
                {/* Add items here; kept empty to match the screenshot */}
              </div>
            </div>
          </div>
        </section>

        <aside className="profile-right about-card">
          <h3 className="about-title">About Me</h3>
          <ul className="about-list">
            <li>
              I am an Information Technology student with a deep enthusiasm for
              technical problem-solving and understanding system architecture.
            </li>
            <li>
              My primary areas of interest and study include network security and
              full-stack development, which I actively explore outside of my
              coursework.
            </li>
            <li>
              I excel in challenging projects that require both analytical
              precision and creative application of new frameworks and tools.
            </li>
            <li>
              I am always eager to collaborate on innovative tech solutions and
              contribute to projects that make a real-world impact.
            </li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default Profile;
