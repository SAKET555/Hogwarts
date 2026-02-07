import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Profile = () => {
    const { user, theme, setTheme, logout } = useUser();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const themes = [
        { id: 'Hogwarts', name: 'General Hogwarts', icon: '🏰' },
        { id: 'Romantic', name: 'Romantic Love', icon: '🌹' },
        { id: 'Gryffindor', name: 'Gryffindor', icon: '🦁' },
        { id: 'Slytherin', name: 'Slytherin', icon: '🐍' },
        { id: 'Ravenclaw', name: 'Ravenclaw', icon: '🦅' },
        { id: 'Hufflepuff', name: 'Hufflepuff', icon: '🦡' },
    ];

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://localhost:3000/api/users/delete', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Logout and redirect
            logout();
            localStorage.removeItem('user');
            navigate('/login');
            alert('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box parchment profile-box">
                <h2 className="profile-title">Wizarding Passport</h2>

                {/* Divider */}
                <div className="gold-divider" />

                {/* Profile Info */}
                <div className="profile-details">
                    <div className="profile-row">
                        <span className="label">Name</span>
                        <span className="value">{user?.name || 'Unknown Wizard'}</span>
                    </div>

                    <div className="profile-row">
                        <span className="label">House</span>
                        <span className="value">{user?.house || 'Unsorted'}</span>
                    </div>

                    <div className="profile-row">
                        <span className="label">Wand</span>
                        <span className="value">
                            {user?.wand?.wood
                                ? `${user.wand.wood}, ${user.wand.core}`
                                : 'No Wand Assigned'}
                        </span>
                    </div>
                </div>

                {/* Themes */}
                <div className="theme-section">
                    <h3 className="theme-title">Magical Themes</h3>

                    <div className="theme-grid">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                                onClick={() => setTheme(t.id)}
                            >
                                <span className="theme-icon">{t.icon}</span>
                                <span>{t.name}</span>
                            </button>
                        ))}
                    </div>
                </div>


                <button className="magical-btn back-btn" onClick={() => navigate('/')}>
                    Back to Dashboard
                </button>

                {/* Delete Account Section */}
                <div className="danger-zone">
                    <button
                        className="delete-btn"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        🗑️ Delete Account
                    </button>
                </div>

                {/* Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>⚠️ Delete Account?</h3>
                            <p>This action cannot be undone. All your data will be permanently deleted.</p>
                            <div className="modal-actions">
                                <button
                                    className="confirm-delete-btn"
                                    onClick={handleDeleteAccount}
                                >
                                    Yes, Delete Forever
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
