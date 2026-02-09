import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import userService from '../services/userService';
import '../styles/Wand.css';

const questions = [
    {
        id: 1,
        text: "When faced with an impossible challenge, what is your instinct?",
        options: [
            { text: "Charge ahead with unwavering determination", core: "Dragon Heartstring", color: "#C62828" },
            { text: "Find a clever, unconventional solution", core: "Phoenix Feather", color: "#E65100" },
            { text: "Seek wisdom from trusted allies", core: "Unicorn Hair", color: "#1565C0" },
            { text: "Wait for the perfect moment to act", core: "Veela Hair", color: "#6A1B9A" }
        ]
    },
    {
        id: 2,
        text: "Which natural element feels most like home to you?",
        options: [
            { text: "Ancient, gnarled forests", wood: "Elder", color: "#2E7D32" },
            { text: "Stormy coastal cliffs", wood: "Hawthorn", color: "#455A64" },
            { text: "Sun-dappled meadows", wood: "Ash", color: "#827717" },
            { text: "Mountain peaks touching clouds", wood: "Fir", color: "#37474F" }
        ]
    },
    {
        id: 3,
        text: "What quality do others admire most in you?",
        options: [
            { text: "My unwavering loyalty", length: "10-11 inches", color: "#0288D1" },
            { text: "My sharp intellect", length: "12-13 inches", color: "#7B1FA2" },
            { text: "My compassionate heart", length: "9-10 inches", color: "#D32F2F" },
            { text: "My boundless creativity", length: "11.5-12.5 inches", color: "#F57C00" }
        ]
    },
    {
        id: 4,
        text: "Which mythical creature resonates with your soul?",
        options: [
            { text: "The Phoenix - reborn from ashes", flexibility: "Unyielding", color: "#D84315" },
            { text: "The Dragon - ancient power", flexibility: "Quite Bendy", color: "#C2185B" },
            { text: "The Unicorn - pure magic", flexibility: "Supple", color: "#303F9F" },
            { text: "The Thunderbird - wild storms", flexibility: "Surprisingly Swishy", color: "#00796B" }
        ]
    },
    {
        id: 5,
        text: "What time of day ignites your spirit?",
        options: [
            { text: "Dawn - new beginnings", trait: "Particularly good for charms", color: "#FF9800" },
            { text: "Midnight - deep mysteries", trait: "Excellent for advanced magic", color: "#673AB7" },
            { text: "Twilight - transition", trait: "Adapts well to multiple disciplines", color: "#0097A7" },
            { text: "High noon - clear vision", trait: "Specializes in defensive magic", color: "#388E3C" }
        ]
    },
    {
        id: 6,
        text: "Which path through an enchanted forest calls to you?",
        options: [
            { text: "The moonlit riverbank", handle: "Smooth polished bone", color: "#BDBDBD" },
            { text: "The overgrown ancient trail", handle: "Carved runic patterns", color: "#5D4037" },
            { text: "The crystal-clear stream", handle: "Pearlescent inlay", color: "#80DEEA" },
            { text: "The hidden mountain pass", handle: "Leather-wrapped grip", color: "#8D6E63" }
        ]
    },
    {
        id: 7,
        text: "What type of magic feels most natural to you?",
        options: [
            { text: "Transformation - changing form and substance", aura: "Warm golden glow", color: "#FFB300" },
            { text: "Illusion - bending perception", aura: "Shimmering silver mist", color: "#90A4AE" },
            { text: "Elemental - commanding nature", aura: "Deep blue electricity", color: "#2962FF" },
            { text: "Divination - seeing beyond", aura: "Purple nebula swirls", color: "#AA00FF" }
        ]
    }
];

const Wand = () => {
    const { setWand } = useUser();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [wandData, setWandData] = useState({ 
        wood: '', 
        core: '', 
        length: '', 
        flexibility: '', 
        trait: '',
        handle: '',
        aura: ''
    });
    const [showResult, setShowResult] = useState(false);
    const [particles, setParticles] = useState([]);
    const [selectionHistory, setSelectionHistory] = useState([]);

    useEffect(() => {
        // Create floating particles
        const newParticles = [];
        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                color: ['#FFD700', '#C62828', '#1565C0', '#6A1B9A'][Math.floor(Math.random() * 4)]
            });
        }
        setParticles(newParticles);
    }, []);

    const handleAnswer = (option) => {
        const newData = { ...wandData };
        const newHistory = [...selectionHistory, option];
        
        // Map selection to wand properties
        if (option.core) newData.core = option.core;
        if (option.wood) newData.wood = option.wood;
        if (option.length) newData.length = option.length;
        if (option.flexibility) newData.flexibility = option.flexibility;
        if (option.trait) newData.trait = option.trait;
        if (option.handle) newData.handle = option.handle;
        if (option.aura) newData.aura = option.aura;

        setWandData(newData);
        setSelectionHistory(newHistory);

        // Add selection animation
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                finalizeWand(newData);
            }
        }, 800);
    };

    const finalizeWand = async (data) => {
        // Generate wand name based on selections
        const wandNames = {
            "Dragon Heartstring": ["Inferno's Will", "Draconic Fury", "Scaleheart"],
            "Phoenix Feather": ["Rising Sun", "Eternal Flame", "Phoenix's Grace"],
            "Unicorn Hair": ["Purest Heart", "Moonbeam", "Ivory Touch"],
            "Veela Hair": ["Enchantress", "Siren's Call", "Graceful Tempest"]
        };
        
        const wandName = wandNames[data.core] 
            ? wandNames[data.core][Math.floor(Math.random() * wandNames[data.core].length)]
            : "The Chosen One";

        const finalWand = {
            name: wandName,
            wood: data.wood || 'Elder',
            core: data.core || 'Phoenix Feather',
            length: data.length || '11.5 inches',
            flexibility: data.flexibility || 'Supple',
            specialTrait: data.trait || 'Adapts to its wizard',
            handle: data.handle || 'Intricately carved wood',
            magicalAura: data.aura || 'Golden luminescence',
            age: `${Math.floor(Math.random() * 200) + 50} years`,
            rarity: ['Ultra Rare', 'Very Rare', 'Rare'][Math.floor(Math.random() * 3)]
        };

        setWand(finalWand);
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
        navigate('/');
    };

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <div className="wand-container">
            {/* Animated Background Particles */}
            <div className="particle-background">
                {particles.map(particle => (
                    <div 
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            animationDuration: `${particle.speed * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Question Progress */}
            <div className="progress-container">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <div className="progress-text">
                    Question {currentQuestion + 1} of {questions.length}
                </div>
            </div>

            {!showResult ? (
                <div className="quiz-box">
                    <div className="magic-circle"></div>
                    <div className="parchment-content">
                        <h2 className="shop-title">
                            <span className="title-glow">Ollivanders</span>
                            <span className="title-sub">Makers of Fine Wands Since 382 B.C.</span>
                        </h2>
                        
                        {/* SPACER DIV ADDED HERE */}
                        <div className="title-spacer">
                            <div className="spacer-line left"></div>
                            <div className="spacer-ornament">⚡</div>
                            <div className="spacer-line right"></div>
                        </div>
                        
                        <div className="question-header">
                            <div className="question-number">0{currentQuestion + 1}</div>
                            <div className="question-text">{questions[currentQuestion].text}</div>
                        </div>

                        <div className="options-grid">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    className="option-btn"
                                    onClick={() => handleAnswer(option)}
                                    style={{ '--option-color': option.color }}
                                >
                                    <span className="option-glow"></span>
                                    <span className="option-text">{option.text}</span>
                                    <span className="option-sparkle">✨</span>
                                </button>
                            ))}
                        </div>

                        <div className="navigation-buttons">
                            <button 
                                className="nav-btn back-btn" 
                                onClick={goBack}
                                disabled={currentQuestion === 0}
                            >
                                ← Previous
                            </button>
                            <div className="wand-legend">
                                "The wand chooses the wizard..."
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="result-container">
                    <div className="ceremony-effect">
                        <div className="light-beam"></div>
                        <div className="magic-orb"></div>
                    </div>
                    
                    <div className="result-box">
                        <h1 className="result-title">
                            <span className="title-magic">The Wand Has Chosen!</span>
                        </h1>
                        
                        <div className="wand-reveal">
                            <div className="wand-graphic">
                                <div className="wand-glow"></div>
                                <div className="wand-core-glow"></div>
                                <div className="wand-handle"></div>
                                <div className="wand-tip"></div>
                            </div>
                            
                            <div className="wand-name-plate">
                                <div className="wand-name">{wandData.name}</div>
                                <div className="wand-creator">Crafted by Garrick Ollivander</div>
                            </div>
                        </div>

                        <div className="wand-details-grid">
                            <div className="detail-card" style={{ '--card-color': '#C62828' }}>
                                <span className="detail-label">Wood</span>
                                <span className="detail-value">{wandData.wood}</span>
                            </div>
                            <div className="detail-card" style={{ '--card-color': '#E65100' }}>
                                <span className="detail-label">Core</span>
                                <span className="detail-value">{wandData.core}</span>
                            </div>
                            <div className="detail-card" style={{ '--card-color': '#1565C0' }}>
                                <span className="detail-label">Length</span>
                                <span className="detail-value">{wandData.length}</span>
                            </div>
                            <div className="detail-card" style={{ '--card-color': '#6A1B9A' }}>
                                <span className="detail-label">Flexibility</span>
                                <span className="detail-value">{wandData.flexibility}</span>
                            </div>
                            <div className="detail-card" style={{ '--card-color': '#2E7D32' }}>
                                <span className="detail-label">Special Trait</span>
                                <span className="detail-value">{wandData.trait}</span>
                            </div>
                            <div className="detail-card" style={{ '--card-color': '#D84315' }}>
                                <span className="detail-label">Magical Aura</span>
                                <span className="detail-value">{wandData.aura}</span>
                            </div>
                        </div>

                        <div className="wand-description">
                            <p className="wand-lore">
                                "This wand possesses a unique connection to its wizard. 
                                Its {wandData.core.toLowerCase()} core resonates with your magical signature, 
                                while the {wandData.wood.toLowerCase()} wood provides {wandData.flexibility.toLowerCase()} 
                                flexibility perfect for {wandData.trait?.toLowerCase()}. A truly remarkable pairing."
                            </p>
                        </div>

                        <button 
                            className="enter-world-btn"
                            onClick={finishWandCeremony}
                        >
                            <span className="btn-sparkles">✦✦✦</span>
                            <span className="btn-text">ENTER THE WIZARDING WORLD</span>
                            <span className="btn-sparkles">✦✦✦</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wand;