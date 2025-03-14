'use client'
import { Button } from '@heroui/react';

export default function WriteToDb({ transactions }) {
  const writeToDb = async () => {    
    try {
      const response = await fetch('/backend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( transactions )
      });

      const counter = await response.json();
      if (response.ok) {
        console.log('Inserted Transactions', counter);
      } else {
        console.error('Response not ok', response.status, counter);
      }
    } catch (error) {
      console.error("Error writing data to DB", error);
    }
  };

  return (
    <div>
      <main>
        <Button color="primary" onPress={writeToDb}>
          Commit
        </Button>
      </main>
    </div>
  );
}