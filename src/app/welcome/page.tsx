'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const WelcomePage = () => {
  const [text, setText] = useState('');
  const fullText = "Plan your event with ease...";

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <header className="flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-[#FFD700]">PJ pakjimplanner</div>
        <Link href="/login" className="bg-[#FFD700] text-black font-bold py-2 px-4 rounded hover:bg-yellow-400">
          Login
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-5xl font-mono">
          {text}
          <span className="animate-ping">|</span>
        </h1>
      </main>
    </div>
  );
};

export default WelcomePage;