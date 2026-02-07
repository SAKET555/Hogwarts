import React, { useState } from 'react';
import '../styles/OwlPost.css';

const OwlPost = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [letterContent, setLetterContent] = useState('');

    const toggleScroll = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="owl-post-container">
            <div className={`scroll-wrapper ${isOpen ? 'open' : ''}`}>
                <div className="scroll-top" onClick={toggleScroll}>
                    <div className="seal">H</div>
                </div>
                <div className="scroll-content">
                    <textarea
                        placeholder="Write your magical letter here..."
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                    ></textarea>
                    <button className="magical-btn send-owl-btn">Send via Owl</button>
                </div>
                <div className="scroll-bottom" onClick={toggleScroll}></div>
            </div>
            {!isOpen && <h2 className="open-instruction">Tap the Seal to Open Your Scroll</h2>}
        </div>
    );
};

export default OwlPost;
