import { useCallback } from 'react';

// FIX: Implement the useSound hook to resolve the module error.
// This is a placeholder for sound playing functionality. In a real app, this could be
// implemented with the Web Audio API or a library like 'howler.js'.
export const useSound = () => {
  const play = useCallback((sound: string) => {
    // eslint-disable-next-line no-console
    console.log(`Playing sound: ${sound}`);
  }, []);

  return play;
};
