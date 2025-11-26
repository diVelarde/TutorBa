import 'bootstrap/dist/css/bootstrap.min.css';  
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import SideBar from './components/SideBar.jsx';
import PostCard from './components/PostCard.jsx';
import Booking from './components/Booking.jsx';
import FileSharing from './components/FileSharing.jsx';


function App() {
    const LayoutWrapper = ({ ContentComponent }) => (
    <div className="app-layout">
      <Header />
      <div className="main-area">
        <SideBar />
        <main className="content-panel">
          {/* This is the dynamic component */}
          <ContentComponent /> 
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LayoutWrapper ContentComponent={PostCard} />} />
        <Route path="/posts" element={<LayoutWrapper ContentComponent={PostCard} />} />
        <Route path="/booking" element={<LayoutWrapper ContentComponent={Booking} />} />
        <Route path="/sharing" element={<LayoutWrapper ContentComponent={FileSharing} />} />
        
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;