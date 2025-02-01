import { useState,useEffect } from "react";

export const useSoundEffects = () => {
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
    const [sounds, setSounds] = useState<{ [key: string]: HTMLAudioElement }>({});


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadedSounds = {
                correct: new Audio('/sounds/correct.mp3'),
                incorrect: new Audio('/sounds/incorrect.mp3'),
                complete: new Audio('/sounds/complete.mp3'),
                click: new Audio('/sounds/click.mp3')
            };
            setSounds(loadedSounds); // Store the sounds in the state
        }
    }, []);

    const playSound = (soundName: keyof typeof sounds) => {
        if (isSoundEnabled) {
            sounds[soundName].currentTime = 0; // Reset sound to start
            sounds[soundName].play().catch(error => console.log('Sound playback failed', error));
        }
    };

    return { playSound, isSoundEnabled, setIsSoundEnabled };
};
