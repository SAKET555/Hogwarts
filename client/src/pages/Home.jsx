import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/Home.css';

const Home = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const house = user?.house || 'Hogwarts';

    const handleLogout = () => {
        logout();
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="ww-container">
            {/* Top Utility Bar */}
            <div className="ww-topbar">
                <div className="ww-socials">
                    <a href="https://www.harrypotter.com/" target="_blank" rel="noopener noreferrer" title="Wizarding World">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M4 12 L8 12 M16 12 L20 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M3 10 L2 8 L4 7 M21 10 L22 8 L20 7" stroke="currentColor" strokeWidth="1" fill="none" />
                            <path d="M3 14 L2 16 L4 17 M21 14 L22 16 L20 17" stroke="currentColor" strokeWidth="1" fill="none" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/harrypotter/" target="_blank" rel="noopener noreferrer" title="Instagram">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@harrypotter" target="_blank" rel="noopener noreferrer" title="YouTube">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#000" />
                        </svg>
                    </a>
                </div>
                <div className="ww-actions">
                    <div className="ww-search">
                        <input placeholder="Search" />
                        <span>🔍</span>
                    </div>
                    {user ? (
                        <button className="ww-login" onClick={handleLogout}>LOGOUT</button>
                    ) : (
                        <>
                            <Link to="/login"><button className="ww-login">LOG IN</button></Link>
                            <Link to="/signup"><button className="ww-signup">SIGN UP</button></Link>
                        </>
                    )}
                </div>
            </div>

            {/* Main Header */}
            <header className="ww-header">
                <h1 className="ww-logo">Hogwarts Messenger</h1>
                <nav className="ww-nav">
                    <Link to="/owl-post">OWL POST</Link>
                    <Link to="/chat">COMMON ROOM</Link>
                    <Link to="/marauders-map">MARAUDER'S MAP</Link>
                    <Link to="/profile">PROFILE</Link>
                    <Link to="/wand">WAND</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="ww-hero">
                <div className="ww-overlay" />
                <div className="ww-hero-container">
                    <div className="ww-hero-content">
                        <h2>Welcome Home, {user?.name || 'Young Wizard'}</h2>
                        <p>The castle is alive. Messages await you.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link to="/chat"><button>Enter the Common Room</button></Link>
                            <Link to="/marauders-map"><button className="magical-btn">Reveal the Map</button></Link>
                        </div>
                    </div>
                    <div className="ww-hero-right-image">
                        <div className="ww-hero-showcase">
                            <img src="https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&q=80&w=800" alt="Hogwarts Exterior" className="ww-hero-img img-1" />
                            <img src="/images/GreatHall.jpg" alt="Great Hall" className="ww-hero-img img-2" />
                            <img src="/images/LibraryHogwarts.jpg" alt="Library" className="ww-hero-img img-3" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Hagrid Welcome Section */}
            <section className="hagrid-welcome-section">
                <div className="hagrid-content">
                    <div className="hagrid-text">
                        <h2>Welcome to Hogwarts!</h2>
                        <p>"Yer a wizard, {user?.name || 'friend'}!"</p>
                        <p className="hagrid-quote">— Hagrid</p>
                    </div>
                    <div className="hagrid-image-container">
                        <img src="/images/hagrid.png" alt="Hagrid" className="hagrid-img" />
                    </div>
                </div>
            </section>

            {/* Feature Cards (Same features, new layout) */}
            <section className="ww-cards">
                <div className="ww-card">
                    <h3>🦉 Owl Post</h3>
                    <p>Send and receive enchanted messages.</p>
                </div>
                <div className="ww-card">
                    <h3>🏰 Common Room</h3>
                    <p>Chat with fellow house members.</p>
                </div>
                <div className="ww-card">
                    <h3>🪄 Wand</h3>
                    <p>Customize your magical identity.</p>
                </div>
            </section>

            <footer className="ww-footer">
                I solemnly swear that I am up to no good.
            </footer>
        </div>
    );
};

export default Home;
