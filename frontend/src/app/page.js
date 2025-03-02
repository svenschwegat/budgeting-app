'use client';
import React, { useEffect, useState } from 'react';
import ParsePdf from '../components/ParsePdf';
import TestApi from '../components/TestApi';
import InputTable from '../components/InputTable';
import OnLoad from '../components/OnLoad';

export default function Home({ }) {
  const [data, setData] = useState([]);
  /*useEffect(() => {
    OnLoad().then((data) => {
      setData(data);
    });
  },
  []);*/

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Frontend</h1>
        <div style={{ marginBottom: '20px' }}>
          <ParsePdf />
        </div>
        <h2>Input</h2>
        <div style={{ marginBottom: '20px' }}>
          <InputTable data={data}/>
        </div>
        <h2>Test for post and get API</h2>
          <TestApi />
        </main></div>
  );
}