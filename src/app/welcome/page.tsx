'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const WelcomePage = () => {
  const [text, setText] = useState('');
  const [initialTypingDone, setInitialTypingDone] = useState(false); // New state for initial completion
  const [showStartButton, setShowStartButton] = useState(false);
  const fullText = "Plan your event with ease...";

  useEffect(() => {
    const i = 0;
    let currentInterval: NodeJS.Timeout;

    const startTyping = (isInitial: boolean) => {
      let charIndex = 0;
      let isDeleting = false;
      let currentText = '';

      const type = () => {
        currentText = fullText.substring(0, charIndex);
        setText(currentText);

        if (!isDeleting && charIndex < fullText.length) {
          charIndex++;
        } else if (isDeleting && charIndex > 0) {
          charIndex--;
        }

        if (charIndex === fullText.length && !isDeleting) {
          if (isInitial) {
            setInitialTypingDone(true);
          }
          isDeleting = true;
          setTimeout(type, 2000); // Pause before backspacing
        } else if (charIndex === 0 && isDeleting) {
          isDeleting = false;
          setTimeout(type, 1000); // Pause before re-typing
        } else {
          setTimeout(type, isDeleting ? 50 : 100); // Typing speed
        }
      };

      type(); // Start the typing/backspacing sequence
    };

    startTyping(true); // Start the initial typing animation

    return () => {}; // No cleanup needed for setInterval as it's handled internally by setTimeout
  }, [fullText]); // Depend on fullText to restart if it changes

  useEffect(() => {
    if (initialTypingDone && !showStartButton) { // Only trigger if initial typing is done and button not yet shown
      const timer = setTimeout(() => {
        setShowStartButton(true);
      }, 100); // 0.1 second delay
      return () => clearTimeout(timer);
    }
  }, [initialTypingDone, showStartButton]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <header className="flex justify-between items-center p-4">
        <div className="leading-tight text-center">
          <Link href="/" className="inline-block text-[#FFD700]">
            <span className="block text-xl font-bold italic ">PJ</span>
            <span className="block text-xs italic font-light">
              pakjim planner
            </span>
          </Link>
        </div>
        <Link href="/login" className="text-white font-bold p-2 hover:underline">
          Login
        </Link>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-5xl font-mono mb-8">
          {text}
          <span className="animate-ping">|</span>
          </h1>
          {showStartButton && (
            <Link href="/login" className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-full text-2xl transition-opacity duration-1000 ease-in-out hover:bg-yellow-400 opacity-0 animate-fade-in">
              Start
            </Link>
          )}
        </main>
    </div>
  );
};

export default WelcomePage;