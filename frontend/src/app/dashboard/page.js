'use client';
import React, { useEffect, useState } from 'react';
import CustomNavbar from '@/components/CustomNavbar';
import {Button, Input} from "@heroui/react";
import fetchFromDb from '@/components/FetchFromDb';

export default function Dashboard() {
  const [sqlStatement, setSqlStatement] = useState('');
  const [result, setResult] = useState([]);
  
  const handleSelectChange = (event) => {
    setSqlStatement(event.target.value);
  }

  const fetchAnyFromDb = async () => {
    const data = await fetchFromDb(sqlStatement);
    setResult(data);
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CustomNavbar activePage={'dashboard'}/>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Dashboard</h1>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input label="Enter your SELECT" type="text" size="lg" isClearable onChange={handleSelectChange}/>
          <Button color="secondary" onPress={fetchAnyFromDb}>Run</Button>
        </div>
        <div>{/*<InputTable data={result}/>*/}</div>
        <div><pre>{JSON.stringify(result, null, 2)}</pre></div>
      </main>
    </div>
  );
}