'use client';
import React, { useState } from 'react';

export default function TestApi({}) {
    const [response, setResponse] = useState(null);
    
    const testFunctionForPython = async () => {
    try {
      const backendUrl = "http://localhost:8000"; // process.env.BACKEND_URL; // `${process.env.BACKEND_URL}/test`
      var result = await fetch(backendUrl + '/addNumbers');
      const data = await result.json();
      setResponse(data.result);
    } catch (error) {
      console.error("Error testing", error);
    }    
  };

  return (
    <div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          onClick={testFunctionForPython}
        >
          Test API
        </button>
        <p>Response: {response}</p>
      </main>
    </div>
  );
}