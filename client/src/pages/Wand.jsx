import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import userService from '../services/userService';
import '../styles/Wand.css';

const questions = [
    {
        text: "How would you describe yourself?",
        options: [
            { text: "Determined", wood: "Dragon Heartstring" },
            { text: "Kind", wood: "Unicorn Hair" },
            { text: "Creative", wood: "Phoenix Feather" }
        ]
    },
    {
        text: "What wood appeals to you?",
        options: [
            { text: "Holly", core: "Phoenix Feather" },
            { text: "Vine", core: "Dragon Heartstring" },
            { text: "Willow", core: "Unicorn Hair" }
        ]
    }
];

const Wand = () => {
    const { setWand } = useUser();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [wandData, setWandData] = useState({ core: '', wood: '' });
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (option) => {
        // Simplified logic for demo
        const newData = { ...wandData };
        if (option.wood) newData.core = option.wood; // Using wood map to core for simplicity in this example
        if (option.core) newData.wood = option.text;

        setWandData(newData);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            finalizeWand(newData);
        }
    };

    const finalizeWand = async (data) => {
        const finalWand = {
            wood: data.wood || 'Holly',
            core: data.core || 'Phoenix Feather',
            length: '11 inches',
            flexibility: 'Supple'
        };
        setWand(finalWand);
        setWandData(finalWand);
        setShowResult(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                await userService.updateProfile({ wand: finalWand }, user.token);
            }
        } catch (error) {
            console.error("Failed to save wand", error);
        }
    };

    const finishWandCeremony = () => {
        navigate('/'); // Go to Dashboard
    };

    return (
        <div className="wand-container">
            {!showResult ? (
                <div className="quiz-box parchment">
                    <h2>Ollivanders: Makers of Fine Wands</h2>
                    <div className="question-text">{questions[currentQuestion].text}</div>
                    <div className="options">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button key={index} className="option-btn" onClick={() => handleAnswer(option)}>
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="result-box parchment">
                    <h2>The Wand Chooses The Wizard!</h2>
                    <div className="wand-display">
                        <div className="wand-graphic"></div>
                    </div>
                    <div className="wand-details">
                        <p><strong>Wood:</strong> {wandData.wood}</p>
                        <p><strong>Core:</strong> {wandData.core}</p>
                        <p><strong>Length:</strong> {wandData.length}</p>
                        <p><strong>Flexibility:</strong> {wandData.flexibility}</p>
                    </div>
                    <button className="magical-btn" onClick={finishWandCeremony}>Enter World</button>
                </div>
            )}
        </div>
    );
};

export default Wand;
