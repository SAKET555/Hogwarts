import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import authService from '../services/authService';
import Snitch from '../components/Snitch';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { t, i18n } = useTranslation();
    const { login } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await authService.login({ email, password });
            login(userData);
            navigate('/');
        } catch (error) {
            alert('Invalid credentials');
            console.error(error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box parchment">
                <Snitch compact={true} />
                <h2>{t('welcome')}</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>{t('email_placeholder')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@hogwarts.edu"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('password_placeholder')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                        />
                    </div>
                    <button type="submit" className="magical-btn">{t('login_btn')}</button>
                </form>
                <div className="auth-footer">
                    <p>New to the Wizarding World? <Link to="/signup">{t('signup_btn')}</Link></p>
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

export default Login;
