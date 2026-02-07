import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import userService from '../services/userService';
import '../styles/Sorting.css';

const questions = [
  {
    text: "Which trait do you value the most?",
    options: [
      { text: "Bravery", house: "Gryffindor" },
      { text: "Ambition", house: "Slytherin" },
      { text: "Intelligence", house: "Ravenclaw" },
      { text: "Loyalty", house: "Hufflepuff" }
    ]
  },
  {
    text: "What would you do if someone wronged you?",
    options: [
      { text: "Confront them boldly", house: "Gryffindor" },
      { text: "Plan your revenge carefully", house: "Slytherin" },
      { text: "Analyze their motives", house: "Ravenclaw" },
      { text: "Try to forgive them", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which class excites you the most?",
    options: [
      { text: "Defense Against the Dark Arts", house: "Gryffindor" },
      { text: "Potions", house: "Slytherin" },
      { text: "Charms", house: "Ravenclaw" },
      { text: "Care of Magical Creatures", house: "Hufflepuff" }
    ]
  },
  {
    text: "How do you approach danger?",
    options: [
      { text: "Rush in without fear", house: "Gryffindor" },
      { text: "Turn it to your advantage", house: "Slytherin" },
      { text: "Study it first", house: "Ravenclaw" },
      { text: "Protect others from it", house: "Hufflepuff" }
    ]
  },
  {
    text: "Your friends describe you as…",
    options: [
      { text: "Fearless", house: "Gryffindor" },
      { text: "Driven", house: "Slytherin" },
      { text: "Clever", house: "Ravenclaw" },
      { text: "Trustworthy", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which magical object would you want?",
    options: [
      { text: "A sword", house: "Gryffindor" },
      { text: "A powerful artifact", house: "Slytherin" },
      { text: "An ancient book", house: "Ravenclaw" },
      { text: "A protective charm", house: "Hufflepuff" }
    ]
  },
  {
    text: "What motivates you most?",
    options: [
      { text: "Doing what’s right", house: "Gryffindor" },
      { text: "Achieving greatness", house: "Slytherin" },
      { text: "Understanding the world", house: "Ravenclaw" },
      { text: "Helping others", house: "Hufflepuff" }
    ]
  },
  {
    text: "How do you handle failure?",
    options: [
      { text: "Try again immediately", house: "Gryffindor" },
      { text: "Learn how to avoid it next time", house: "Slytherin" },
      { text: "Study what went wrong", house: "Ravenclaw" },
      { text: "Seek support and persevere", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which animal do you admire most?",
    options: [
      { text: "Lion", house: "Gryffindor" },
      { text: "Snake", house: "Slytherin" },
      { text: "Eagle", house: "Ravenclaw" },
      { text: "Badger", house: "Hufflepuff" }
    ]
  },
  {
    text: "What is your greatest strength?",
    options: [
      { text: "Courage under pressure", house: "Gryffindor" },
      { text: "Strategic thinking", house: "Slytherin" },
      { text: "Problem-solving", house: "Ravenclaw" },
      { text: "Endurance", house: "Hufflepuff" }
    ]
  },

  /* -------- Questions 11–30 -------- */

  {
    text: "What would you risk everything for?",
    options: [
      { text: "Justice", house: "Gryffindor" },
      { text: "Power", house: "Slytherin" },
      { text: "Truth", house: "Ravenclaw" },
      { text: "Family", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which role fits you best?",
    options: [
      { text: "Leader", house: "Gryffindor" },
      { text: "Planner", house: "Slytherin" },
      { text: "Advisor", house: "Ravenclaw" },
      { text: "Supporter", house: "Hufflepuff" }
    ]
  },
  {
    text: "How do you prepare for challenges?",
    options: [
      { text: "Trust your instincts", house: "Gryffindor" },
      { text: "Control every detail", house: "Slytherin" },
      { text: "Research deeply", house: "Ravenclaw" },
      { text: "Practice patiently", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which spell appeals to you?",
    options: [
      { text: "Expelliarmus", house: "Gryffindor" },
      { text: "Imperio", house: "Slytherin" },
      { text: "Alohomora", house: "Ravenclaw" },
      { text: "Protego", house: "Hufflepuff" }
    ]
  },
  {
    text: "What do you value in friends?",
    options: [
      { text: "Courage", house: "Gryffindor" },
      { text: "Loyalty to you", house: "Slytherin" },
      { text: "Intellect", house: "Ravenclaw" },
      { text: "Kindness", house: "Hufflepuff" }
    ]
  },
  {
    text: "How do you solve conflicts?",
    options: [
      { text: "Face them openly", house: "Gryffindor" },
      { text: "Manipulate outcomes", house: "Slytherin" },
      { text: "Debate logically", house: "Ravenclaw" },
      { text: "Compromise peacefully", house: "Hufflepuff" }
    ]
  },
  {
    text: "Which place feels like home?",
    options: [
      { text: "A battlefield", house: "Gryffindor" },
      { text: "A throne room", house: "Slytherin" },
      { text: "A library", house: "Ravenclaw" },
      { text: "A warm hall", house: "Hufflepuff" }
    ]
  },
  {
    text: "What do you fear most?",
    options: [
      { text: "Cowardice", house: "Gryffindor" },
      { text: "Failure", house: "Slytherin" },
      { text: "Ignorance", house: "Ravenclaw" },
      { text: "Being alone", house: "Hufflepuff" }
    ]
  },
  {
    text: "Your ideal victory is…",
    options: [
      { text: "Heroic", house: "Gryffindor" },
      { text: "Total domination", house: "Slytherin" },
      { text: "Earned through wit", house: "Ravenclaw" },
      { text: "Shared with others", house: "Hufflepuff" }
    ]
  },
  {
    text: "How do you want to be remembered?",
    options: [
      { text: "As a hero", house: "Gryffindor" },
      { text: "As powerful", house: "Slytherin" },
      { text: "As wise", house: "Ravenclaw" },
      { text: "As kind", house: "Hufflepuff" }
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
    setShowResult(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.token) {
        await userService.updateProfile({ house }, user.token);
      }
    } catch (err) {
      console.error('Failed to save house', err);
    }
  };

  return (
    <div className={`sorting-container ${showResult ? sortedHouse : ''}`}>
      {!showResult ? (
        <div className="quiz-box parchment">
          <h2 className="sorting-title">The Sorting Hat Speaks</h2>

          <div className="progress">
            Question {currentQuestion + 1} / {questions.length}
          </div>

          <p className="question-text">
            {questions[currentQuestion].text}
          </p>

          <div className="options">
            {questions[currentQuestion].options.map((o, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(o.house)}
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-box">
          <h1 className="house-announce">
            BETTER BE… {sortedHouse.toUpperCase()}!
          </h1>
          <button className="magical-btn" onClick={() => navigate('/wand')}>
            Continue Your Journey
          </button>
        </div>
      )}
    </div>
  );
};

export default Sorting;
