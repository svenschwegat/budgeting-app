'use client'
import { Button } from '@heroui/react';

export default function WriteToDb({ transactions }) {
    const writeToDb = async () => {
        console.log('writeToDb', transactions); // todo set endpoint
        /*try { 
            const response = await fetch('/backend/write-to-db', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ transactions: transactions })
            });
            const data = await response.json();
            console.log('what you get back', data);
          } catch (error) {
            console.error("Error writing data to DB", error);
          }*/
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