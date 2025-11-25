import 'bootstrap/dist/css/bootstrap.min.css';  
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import SideBar from './components/SideBar.jsx';
import PostCard from './components/PostCard.jsx';
import Booking from './components/Booking.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/home.jsx';

function App() {
    return(
        <Router>
            <Layout>
                <Routes>
                <Route path="/" element={<Home />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App;
