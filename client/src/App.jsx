import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Loader from './components/Loader';
import BackgroundMusic from './components/BackgroundMusic';
import Chat from './pages/Chat';
import OwlPost from './pages/OwlPost';
import MaraudersMap from './pages/MaraudersMap';
import './index.css';

import Home from './pages/Home';
import Sorting from './pages/Sorting';
import Wand from './pages/Wand';
import Profile from './pages/Profile';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate Hogwarts Express journey time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <BackgroundMusic />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/wand" element={<Wand />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/owl-post" element={<OwlPost />} />
            <Route path="/marauders-map" element={<MaraudersMap />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
