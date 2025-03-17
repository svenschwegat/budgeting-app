'use client'
import { addToast, Button } from '@heroui/react';

function showToast(title, description, color) {
  addToast({
    title: title,
    description: description,
    color: color,
    timeout: "7000"
  });
};

export default function WriteToDb({ transactions }) {
  let title, description, color;

  const writeToDb = async () => {
    try {
      const response = await fetch('/backend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactions)
      });

      const counter = await response.json();
      if (response.ok) {
        title = "Success";
        description = `Successfully inserted ${counter} transactions.`;
        color = "success";
      } else {
        title = "Failed to insert transactions";
        description = `Error: ${response.status} ${counter.detail.toString()}`;
        color = "danger";
      }
    } catch (error) {
      title = "Failed writing to database";
      description = `Error: ${error}`;
      color = "danger";
    }

    showToast(title, description, color);
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