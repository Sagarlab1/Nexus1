import { useCallback, useEffect } from 'react';

// A simple map to hold Audio instances
const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(url: string): HTMLAudioElement {
  if (audioCache.has(url)) {
    return audioCache.get(url)!;
  }
  const audio = new Audio(url);
  audioCache.set(url, audio);
  return audio;
}

// Pre-defined sound effects with new, stable URLs
const sounds = {
    select: 'https://storage.googleapis.com/static.aistudio.google.com/sounds/v1/actions/select.mp3',
    send: 'https://storage.googleapis.com/static.aistudio.google.com/sounds/v1/actions/send.mp3',
    unlock: 'https://storage.googleapis.com/static.aistudio.google.com/sounds/v1/actions/unlock.mp3',
    rankUp: 'https://storage.googleapis.com/static.aistudio.google.com/sounds/v1/actions/rank_up.mp3',
    premium: 'https://storage.googleapis.com/static.aistudio.google.com/sounds/v1/actions/premium_access.mp3'
};

export type SoundEffect = keyof typeof sounds;

export const useSound = () => {
  const playSound = useCallback((effect: SoundEffect, volume = 0.3) => {
    try {
      const audio = getAudio(sounds[effect]);
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(e => console.error(`Failed to play sound '${effect}':`, e));
    } catch (error) {
        console.error("Error playing sound:", error);
    }
  }, []);

  useEffect(() => {
    // Preload sounds
    Object.values(sounds).forEach(url => {
        getAudio(url).preload = 'auto';
    });

    return () => {
      // Cleanup audio objects on component unmount
      audioCache.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.clear();
    };
  }, []);

  return playSound;
};