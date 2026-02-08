import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useUser } from '../contexts/UserContext';
import authService from '../services/authService';
import '../styles/Auth.css';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { t, i18n } = useTranslation();
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("🚀 Attempting signup...");
        try {
            const userData = await authService.register({ name, email, password });
            console.log("✅ Signup successful!", userData);
            login(userData);
            navigate('/sorting');
        } catch (error) {
            console.error("❌ Signup Error Details:", error.response?.data || error.message);
            alert('Error registering: ' + (error.response?.data?.message || 'Please check your connection'));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box parchment">
                <h2>{t('welcome')}</h2>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>{t('name_placeholder')}</label>
                        <input
                            type="text"
                            placeholder="Harry Potter"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('email_placeholder')}</label>
                        <input
                            type="email"
                            placeholder="name@hogwarts.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('password_placeholder')}</label>
                        <input
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="magical-btn">{t('signup_btn')}</button>
                </form>
                <div className="auth-footer">
                    <p>Already a Wizard? <Link to="/login">{t('login_btn')}</Link></p>
                    <div className="lang-switch">
                        <button onClick={() => i18n.changeLanguage('en')}>🇬🇧 EN</button>
                        <button onClick={() => i18n.changeLanguage('fr')}>🇫🇷 FR</button>
                        <button onClick={() => i18n.changeLanguage('de')}>🇩🇪 DE</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
