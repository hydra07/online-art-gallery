import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';
import { detectLanguage } from '@/app/utils';

interface UseSpeechSynthesisOptions {
  text?: string;
  onStateChange?: (isPlaying: boolean) => void;
}

export function useSpeechSynthesis({ text, onStateChange }: UseSpeechSynthesisOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();
  const intentionalCancelRef = useRef(false);

  // Update external state if provided
  useEffect(() => {
    if (onStateChange) {
      onStateChange(isPlaying);
    }
  }, [isPlaying, onStateChange]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Try to load voices immediately
    loadVoices();

    // Set up event listener for Chrome which loads voices asynchronously
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  // Clean up speech synthesis when hook unmounts
  useEffect(() => {
    return () => {
      intentionalCancelRef.current = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback((textToSpeak: string = text || "") => {
    if (!window.speechSynthesis) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
      return false;
    }

    if (!textToSpeak) {
      toast({
        title: "No text",
        description: "No text available to play",
        variant: "destructive"
      });
      return false;
    }

    const detectedLanguage = detectLanguage(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = detectedLanguage;

    // Find a matching voice for the detected language
    const matchingVoice = voices.find(voice =>
      voice.lang.startsWith(detectedLanguage.split('-')[0])
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      
      if (!intentionalCancelRef.current) {
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive"
        });
      }
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    return true;
  }, [text, voices, toast]);

  const stop = useCallback(() => {
    if (!isPlaying) return;
    
    intentionalCancelRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      intentionalCancelRef.current = false;
    }, 100);
  }, [isPlaying]);

  const toggle = useCallback((textToSpeak?: string) => {
    if (isPlaying) {
      stop();
      return false;
    } else {
      return play(textToSpeak);
    }
  }, [isPlaying, play, stop]);

  return {
    isPlaying,
    play,
    stop,
    toggle,
    supported: 'speechSynthesis' in window
  };
}