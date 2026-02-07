import React, { useState, useEffect, useRef } from 'react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Audio source: Hedwig's Theme (Preview URL or similar royalty-free version for demo)
    // Using a reliable CDN link for Hedwig's theme or similar magical atmosphere
    // Using a reliable external URL. 
    // Ideally, download 'hedwig-theme.mp3' to public/audio/ folder.
    // 1. Rename your piano file to "harry-potter-piano.mp3"
    // 2. Put it inside: client/public/audio/
    const AUDIO_URL = "/audio/Harry.mp4";
    // const AUDIO_URL = "/audio/hedwigs_theme.mp3"; // Once you download it

    useEffect(() => {
        // Build the audio element
        audioRef.current = new Audio(AUDIO_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Start Volume lower

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
        }}>
            <button
                onClick={togglePlay}
                className="magical-btn"
                style={{
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px var(--hogwarts-gold)'
                }}
            >
                {isPlaying ? '🔊' : '🔇'}
            </button>
        </div>
    );
};

export default BackgroundMusic;
