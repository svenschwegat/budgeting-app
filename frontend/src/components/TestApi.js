'use client';
import React, { useState } from 'react';
import { Button } from '@heroui/react';

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
        <Button
          color='secondary'
          onPress={testFunctionForPython}
        >
          Test API
        </Button>
        <p>Response: {response}</p>
      </main>
    </div>
  );
}