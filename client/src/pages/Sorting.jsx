import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import userService from '../services/userService';
import '../styles/Sorting.css';

const questions = [
  {
    text: "Which trait do you value the most?",
    options: [
      { text: "Bravery", house: "Gryffindor", color: "#AE0001" },
      { text: "Ambition", house: "Slytherin", color: "#2A623D" },
      { text: "Intelligence", house: "Ravenclaw", color: "#222F5B" },
      { text: "Loyalty", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What would you do if someone wronged you?",
    options: [
      { text: "Confront them boldly", house: "Gryffindor", color: "#AE0001" },
      { text: "Plan your revenge carefully", house: "Slytherin", color: "#2A623D" },
      { text: "Analyze their motives", house: "Ravenclaw", color: "#222F5B" },
      { text: "Try to forgive them", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which class excites you the most?",
    options: [
      { text: "Defense Against the Dark Arts", house: "Gryffindor", color: "#AE0001" },
      { text: "Potions", house: "Slytherin", color: "#2A623D" },
      { text: "Charms", house: "Ravenclaw", color: "#222F5B" },
      { text: "Care of Magical Creatures", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "How do you approach danger?",
    options: [
      { text: "Rush in without fear", house: "Gryffindor", color: "#AE0001" },
      { text: "Turn it to your advantage", house: "Slytherin", color: "#2A623D" },
      { text: "Study it first", house: "Ravenclaw", color: "#222F5B" },
      { text: "Protect others from it", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Your friends describe you as…",
    options: [
      { text: "Fearless", house: "Gryffindor", color: "#AE0001" },
      { text: "Driven", house: "Slytherin", color: "#2A623D" },
      { text: "Clever", house: "Ravenclaw", color: "#222F5B" },
      { text: "Trustworthy", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which magical object would you want?",
    options: [
      { text: "A sword", house: "Gryffindor", color: "#AE0001" },
      { text: "A powerful artifact", house: "Slytherin", color: "#2A623D" },
      { text: "An ancient book", house: "Ravenclaw", color: "#222F5B" },
      { text: "A protective charm", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What motivates you most?",
    options: [
      { text: "Doing what's right", house: "Gryffindor", color: "#AE0001" },
      { text: "Achieving greatness", house: "Slytherin", color: "#2A623D" },
      { text: "Understanding the world", house: "Ravenclaw", color: "#222F5B" },
      { text: "Helping others", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "How do you handle failure?",
    options: [
      { text: "Try again immediately", house: "Gryffindor", color: "#AE0001" },
      { text: "Learn how to avoid it next time", house: "Slytherin", color: "#2A623D" },
      { text: "Study what went wrong", house: "Ravenclaw", color: "#222F5B" },
      { text: "Seek support and persevere", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which animal do you admire most?",
    options: [
      { text: "Lion", house: "Gryffindor", color: "#AE0001" },
      { text: "Snake", house: "Slytherin", color: "#2A623D" },
      { text: "Eagle", house: "Ravenclaw", color: "#222F5B" },
      { text: "Badger", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What is your greatest strength?",
    options: [
      { text: "Courage under pressure", house: "Gryffindor", color: "#AE0001" },
      { text: "Strategic thinking", house: "Slytherin", color: "#2A623D" },
      { text: "Problem-solving", house: "Ravenclaw", color: "#222F5B" },
      { text: "Endurance", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What would you risk everything for?",
    options: [
      { text: "Justice", house: "Gryffindor", color: "#AE0001" },
      { text: "Power", house: "Slytherin", color: "#2A623D" },
      { text: "Truth", house: "Ravenclaw", color: "#222F5B" },
      { text: "Family", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which role fits you best?",
    options: [
      { text: "Leader", house: "Gryffindor", color: "#AE0001" },
      { text: "Planner", house: "Slytherin", color: "#2A623D" },
      { text: "Advisor", house: "Ravenclaw", color: "#222F5B" },
      { text: "Supporter", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "How do you prepare for challenges?",
    options: [
      { text: "Trust your instincts", house: "Gryffindor", color: "#AE0001" },
      { text: "Control every detail", house: "Slytherin", color: "#2A623D" },
      { text: "Research deeply", house: "Ravenclaw", color: "#222F5B" },
      { text: "Practice patiently", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which spell appeals to you?",
    options: [
      { text: "Expelliarmus", house: "Gryffindor", color: "#AE0001" },
      { text: "Imperio", house: "Slytherin", color: "#2A623D" },
      { text: "Alohomora", house: "Ravenclaw", color: "#222F5B" },
      { text: "Protego", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What do you value in friends?",
    options: [
      { text: "Courage", house: "Gryffindor", color: "#AE0001" },
      { text: "Loyalty to you", house: "Slytherin", color: "#2A623D" },
      { text: "Intellect", house: "Ravenclaw", color: "#222F5B" },
      { text: "Kindness", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "How do you solve conflicts?",
    options: [
      { text: "Face them openly", house: "Gryffindor", color: "#AE0001" },
      { text: "Manipulate outcomes", house: "Slytherin", color: "#2A623D" },
      { text: "Debate logically", house: "Ravenclaw", color: "#222F5B" },
      { text: "Compromise peacefully", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Which place feels like home?",
    options: [
      { text: "A battlefield", house: "Gryffindor", color: "#AE0001" },
      { text: "A throne room", house: "Slytherin", color: "#2A623D" },
      { text: "A library", house: "Ravenclaw", color: "#222F5B" },
      { text: "A warm hall", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "What do you fear most?",
    options: [
      { text: "Cowardice", house: "Gryffindor", color: "#AE0001" },
      { text: "Failure", house: "Slytherin", color: "#2A623D" },
      { text: "Ignorance", house: "Ravenclaw", color: "#222F5B" },
      { text: "Being alone", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "Your ideal victory is…",
    options: [
      { text: "Heroic", house: "Gryffindor", color: "#AE0001" },
      { text: "Total domination", house: "Slytherin", color: "#2A623D" },
      { text: "Earned through wit", house: "Ravenclaw", color: "#222F5B" },
      { text: "Shared with others", house: "Hufflepuff", color: "#FFDB00" }
    ]
  },
  {
    text: "How do you want to be remembered?",
    options: [
      { text: "As a hero", house: "Gryffindor", color: "#AE0001" },
      { text: "As powerful", house: "Slytherin", color: "#2A623D" },
      { text: "As wise", house: "Ravenclaw", color: "#222F5B" },
      { text: "As kind", house: "Hufflepuff", color: "#FFDB00" }
    ]
  }
];

const Sorting = () => {
  const { setHouse } = useUser();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [sortedHouse, setSortedHouse] = useState(null);
  const [animationStage, setAnimationStage] = useState('thinking');
  const [hatVisible, setHatVisible] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.3 + 0.1,
        color: ['#AE0001', '#2A623D', '#222F5B', '#FFDB00'][Math.floor(Math.random() * 4)]
      });
    }
    setParticles(newParticles);
  }, []);

  const handleAnswer = (house) => {
    const updated = { ...scores, [house]: scores[house] + 1 };
    setScores(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      determineHouse(updated);
    }
  };

  const determineHouse = async (finalScores) => {
    const house = Object.keys(finalScores)
      .reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);

    setSortedHouse(house);
    setHouse(house);
    setAnimationStage('deciding');
    
    setTimeout(() => {
      setAnimationStage('announcing');
      setTimeout(() => {
        setShowResult(true);
        setHatVisible(false);
      }, 2000);
    }, 2000);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.token) {
        await userService.updateProfile({ house }, user.token);
      }
    } catch (err) {
      console.error('Failed to save house', err);
    }
  };

  const getHouseQuote = (house) => {
    const quotes = {
      Gryffindor: "Where dwell the brave at heart, their daring, nerve and chivalry set Gryffindors apart.",
      Slytherin: "Or perhaps in Slytherin, you'll make your real friends, those cunning folk use any means to achieve their ends.",
      Ravenclaw: "Or yet in wise old Ravenclaw, if you've a ready mind, where those of wit and learning will always find their kind.",
      Hufflepuff: "You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil."
    };
    return quotes[house];
  };

  const getHouseMascot = (house) => {
    return {
      Gryffindor: "🦁",
      Slytherin: "🐍",
      Ravenclaw: "🦅",
      Hufflepuff: "🦡"
    }[house];
  };

  return (
    <div className={`sorting-container ${sortedHouse ? sortedHouse : ''}`}>
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
              animationDuration: `${particle.speed * 10}s`
            }}
          />
        ))}
      </div>

      {hatVisible && (
        <div className="sorting-hat-container">
          <div className="sorting-hat">
            <div className="hat-brim"></div>
            <div className="hat-point"></div>
            <div className="hat-face">
              <div className="hat-eyes"></div>
              <div className="hat-mouth"></div>
            </div>
          </div>
          <div className="hat-shadow"></div>
        </div>
      )}

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
        <div className="quiz-container">
          <div className="magic-circle"></div>
          <div className="quiz-box">
            <div className="ceremony-header">
              <h1 className="ceremony-title">
                The Sorting Ceremony
              </h1>
              <div className="house-icons">
                <span className="house-icon gryffindor-icon">🦁</span>
                <span className="house-icon slytherin-icon">🐍</span>
                <span className="house-icon ravenclaw-icon">🦅</span>
                <span className="house-icon hufflepuff-icon">🦡</span>
              </div>
            </div>

            <div className="title-spacer">
              <div className="spacer-line left"></div>
              <div className="spacer-ornament">✨</div>
              <div className="spacer-line right"></div>
            </div>

            <div className="question-header">
              <div className="question-number">Q{currentQuestion + 1}</div>
              <div className="question-text">{questions[currentQuestion].text}</div>
            </div>

            <div className="options-grid">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleAnswer(option.house)}
                  style={{ '--option-color': option.color }}
                >
                  <span className="option-glow"></span>
                  <span className="option-text">{option.text}</span>
                  <span className="option-house">{option.house.charAt(0)}</span>
                </button>
              ))}
            </div>

            <div className="ceremony-quote">
              "I'll put you on the right track!"
            </div>
          </div>
        </div>
      ) : (
        <div className="result-container">
          <div className="house-reveal-animation">
            <div className="house-banner"></div>
            <div className="house-glow"></div>
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="confetti" style={{
                  '--delay': `${Math.random() * 2}s`,
                  '--x': `${Math.random() * 100}vw`,
                  backgroundColor: sortedHouse === 'Gryffindor' ? '#AE0001' :
                                  sortedHouse === 'Slytherin' ? '#2A623D' :
                                  sortedHouse === 'Ravenclaw' ? '#222F5B' : '#FFDB00'
                }}></div>
              ))}
            </div>
          </div>

          <div className="result-box">
            <div className="house-emblem">
              <div className="emblem-circle">
                <span className="emblem-mascot">{getHouseMascot(sortedHouse)}</span>
              </div>
            </div>

            <h1 className="house-announce">
              <span className="house-name">{sortedHouse.toUpperCase()}</span>
              <span className="house-subtitle">!</span>
            </h1>

            <div className="house-quote">
              "{getHouseQuote(sortedHouse)}"
            </div>

            <div className="house-traits">
              {sortedHouse === 'Gryffindor' && (
                <div className="traits-list">
                  <span className="trait">Courage</span>
                  <span className="trait">Bravery</span>
                  <span className="trait">Chivalry</span>
                  <span className="trait">Nerve</span>
                </div>
              )}
              {sortedHouse === 'Slytherin' && (
                <div className="traits-list">
                  <span className="trait">Ambition</span>
                  <span className="trait">Cunning</span>
                  <span className="trait">Resourcefulness</span>
                  <span className="trait">Determination</span>
                </div>
              )}
              {sortedHouse === 'Ravenclaw' && (
                <div className="traits-list">
                  <span className="trait">Intelligence</span>
                  <span className="trait">Creativity</span>
                  <span className="trait">Wisdom</span>
                  <span className="trait">Wit</span>
                </div>
              )}
              {sortedHouse === 'Hufflepuff' && (
                <div className="traits-list">
                  <span className="trait">Loyalty</span>
                  <span className="trait">Patience</span>
                  <span className="trait">Fairness</span>
                  <span className="trait">Hard Work</span>
                </div>
              )}
            </div>

            <div className="house-description">
              <p>
                Welcome to {sortedHouse}! You've been sorted into one of the four 
                prestigious houses of Hogwarts School of Witchcraft and Wizardry. 
                This house will be your home and family during your magical education.
              </p>
            </div>

            <button 
              className="continue-btn"
              onClick={() => navigate('/wand')}
            >
              <span className="btn-sparkles">✦✦✦</span>
              <span className="btn-text">CONTINUE TO WAND SELECTION</span>
              <span className="btn-sparkles">✦✦✦</span>
            </button>
          </div>
        </div>
      )}

      {animationStage === 'deciding' && (
        <div className="hat-deciding">
          <div className="deciding-glow"></div>
          <div className="deciding-text">
            "I can see your qualities... where to put you?"
          </div>
        </div>
      )}

      {animationStage === 'announcing' && (
        <div className="hat-announcing">
          <div className="announcing-flash"></div>
          <div className="announcing-text">
            "BETTER BE... {sortedHouse}!"
          </div>
        </div>
      )}
    </div>
  );
};

export default Sorting;