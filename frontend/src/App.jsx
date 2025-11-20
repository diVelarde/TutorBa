import 'bootstrap/dist/css/bootstrap.min.css';  
import './App.css';

import Header from './components/Header.jsx';
import SideBar from './components/SideBar.jsx';
import PostCard from './components/PostCard.jsx';

function App() {
    return(
        <>
            <Header />
            <SideBar />

            <div className="feed-container">
                <PostCard />
                <Booking />
            </div>
        </>
    )
}

export default App;
 