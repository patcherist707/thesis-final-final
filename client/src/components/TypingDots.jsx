import React from 'react';

const TypingDots = () => {
  return (
    <div className="flex space-x-2 mt-2">
      <span className="w-1 h-1 bg-gray-700 rounded-full animate-[typing_1.5s_infinite_ease-in-out]"></span>
      <span className="w-1 h-1 bg-gray-700 rounded-full animate-[typing_1.5s_infinite_ease-in-out] delay-150"></span>
      <span className="w-1 h-1 bg-gray-700 rounded-full animate-[typing_1.5s_infinite_ease-in-out] delay-300"></span>
    </div>
  );
};

export default TypingDots;