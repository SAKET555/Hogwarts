import React from 'react';
import './WizardTypes.css';

/**
 * WizardTypes Component
 * A professional, high-end showcase of Harry Potter character archetypes.
 * Designed with a minimalist, MBTI-style aesthetic.
 */

const characters = [
    {
        id: 'harry',
        title: 'The Chosen One',
        code: 'ISFP-H',
        description: 'Brave, impulsive, and guided by love. Rises to challenges with instinctive courage and unwavering loyalty.',
        image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=600&auto=format&fit=crop',
        color: '#740001'
    },
    {
        id: 'hermione',
        title: 'The Brilliant Mind',
        code: 'INTJ-H',
        description: 'Unmatched intellect and meticulous preparation. Logic, knowledge, and reason are the ultimate magic.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop',
        color: '#ae0001'
    },
    {
        id: 'ron',
        title: 'The Loyal Strategist',
        code: 'ESFP-H',
        description: 'Tactical intuition born from years of wizarding chess. Fiercely protective, humorous, and underestimated.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
        color: '#ecb939'
    },
    {
        id: 'dumbledore',
        title: 'The Elder Sage',
        code: 'INFJ-H',
        description: 'Sees patterns where others see chaos. Operates on a grand chessboard of redemption and greater good.',
        image: 'https://images.unsplash.com/photo-1532192155392-2aab9a5b7b3d?q=80&w=600&auto=format&fit=crop',
        color: '#372e29'
    },
    {
        id: 'snape',
        title: 'The Shadow Guardian',
        code: 'ISTJ-H',
        description: 'Complex, misunderstood, and irrevocably devoted. Love disguised as loathing, protection masked as cruelty.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
        color: '#1a472a'
    },
    {
        id: 'voldemort',
        title: 'The Dark Ascendant',
        code: 'ENTJ-H',
        description: 'Charismatic terror who shattered mortality itself. Ambition without conscience, power without humanity.',
        image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=600&auto=format&fit=crop',
        color: '#2a623d'
    },
    {
        id: 'mcgonagall',
        title: 'The Disciplined Architect',
        code: 'ESTJ-H',
        description: 'Precise, authoritative, and deeply just. Transforms raw potential into refined excellence.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
        color: '#0e1a2b'
    },
    {
        id: 'luna',
        title: 'The Mystic Seer',
        code: 'ENFP-H',
        description: 'Sees what others dismiss. Belief in the unbelievable makes the impossible manifest.',
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=600&auto=format&fit=crop',
        color: '#5d5d6d'
    }
];

const WizardTypes = () => {
    return (
        <section className="wizard-types-section">
            <div className="wizard-types-container">
                <header className="wizard-types-header">
                    <h2 className="section-subtitle">Hogwarts Archetypes</h2>
                    <p className="section-description">Discover the magical essence of the wizarding world's most legendary figures.</p>
                </header>

                <div className="wizard-grid">
                    {characters.map((character) => (
                        <div key={character.id} className="wizard-card">
                            <div className="wizard-image-wrapper">
                                <img src={character.image} alt={character.title} className="wizard-image" />
                                <div className="wizard-image-overlay" style={{ backgroundColor: character.color }} />
                            </div>
                            <div className="wizard-content">
                                <span className="wizard-code">{character.code}</span>
                                <h3 className="wizard-title">{character.title}</h3>
                                <p className="wizard-description">{character.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WizardTypes;