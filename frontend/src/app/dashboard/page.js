'use client';
import React, { useEffect, useState } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import {Button, Input} from "@heroui/react";
import InputTable from '@/components/InputTable';

export default function Home() {
  const [sqlStatement, setSqlStatement] = useState('');
  const [result, setResult] = useState([]);
  
  const handleSelectChange = (event) => {
    setSqlStatement(event.target.value);
  }

  const fetchFromDb = async () => {
    const backendUrl = "http://localhost:8000";
    try {
        const response = await fetch(backendUrl + '/fetch-from-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sqlStatement: sqlStatement })
        });
        const data = await response.json();
        setResult(data);
        console.log('data', data);
    } catch (error) {
        console.error("Error select statement", error);
    }    
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CustomNavbar activePage={'dashboard'}/>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Dashboard</h1>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input label="Enter your SELECT" type="text" size="lg" isClearable onChange={handleSelectChange}/>
          <Button color="secondary" onPress={fetchFromDb}>Run</Button>
        </div>
        <div>{/*<InputTable data={result}/>*/}</div>
        <div><pre>{JSON.stringify(result, null, 2)}</pre></div>
      </main>
    </div>
  );
}