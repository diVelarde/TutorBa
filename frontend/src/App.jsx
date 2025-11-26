import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import SideBar from './components/SideBar.jsx';
import PostCard from './components/PostCard.jsx';
import Booking from './components/Booking.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/home.jsx';
import FindTutors from './pages/FindTutors.jsx';
import TutorProfile from './pages/TutorProfile.jsx';

function App() {
    return(
        <Router>
            <Layout>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-tutors" element={<FindTutors />} />
                <Route path="/tutorprofile/:id" element={<TutorProfile />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App;
