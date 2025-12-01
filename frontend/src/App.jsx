import 'bootstrap/dist/css/bootstrap.min.css';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';


import Header from './components/Header.jsx';
import SideBar from './components/SideBar.jsx';
import PostCard from './components/PostCard.jsx';
import Booking from './components/Booking.jsx';
import FileSharing from './components/FileSharing.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/home.jsx';
import FindTutors from './pages/FindTutors.jsx';
import TutorProfile from './pages/TutorProfile.jsx';
import MySessions from './pages/MySessions.jsx';
import Chat from './pages/Chat.jsx';
import Forum from './pages/Forum.jsx';
import ForumPost from './pages/ForumPost.jsx';
import Favorites from './pages/Favorites.jsx';
import MyProfile from './pages/MyProfile.jsx';


function App() {
  return (
    <Router>
            <Layout>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-tutors" element={<FindTutors />} />
                <Route path="/tutorprofile/:id" element={<TutorProfile />} />
                <Route path="/sessions" element={<MySessions />} />
                <Route path="/messages" element={<Chat />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/forumpost/:id" element={<ForumPost />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<MyProfile />} />

                <Route path="*" element={<div>404 Page Not Found</div>} />
                </Routes>
            </Layout>
        </Router>
  );
}

export default App;