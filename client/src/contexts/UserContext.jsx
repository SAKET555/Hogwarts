import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name, email, house, wand }
    const [language, setLanguage] = useState('en');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Hogwarts');

    React.useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const login = (userData) => {
        setUser(userData);
        if (userData?.house) {
            setTheme(userData.house);
        }
    };

    const logout = () => {
        setUser(null);
        setTheme('Hogwarts');
    };

    const setHouse = (house) => {
        setUser((prev) => ({ ...prev, house }));
        setTheme(house);
    };

    const setWand = (wand) => {
        setUser((prev) => ({ ...prev, wand }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, setHouse, setWand, language, setLanguage, theme, setTheme }}>
            {children}
        </UserContext.Provider>
    );
};
