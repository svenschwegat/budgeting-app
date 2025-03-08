'use client';
import React, { useEffect, useState } from 'react';
import ParsePdf from '@/components/ParsePdf';
import InputTable from '@/components/InputTable';
import OnLoad from '@/components/OnLoad';
import CustomNavbar from '@/components/CustomNavbar';

export default function Home({ }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const result = await OnLoad();
      console.log('page result', result);
      if (result) {
        setData(result.items);
      }
    }
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar activePage={'input'}/>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Choose to upload and parse a PDF/CSV file</h1>
        <div style={{ marginBottom: '20px' }}>
          <ParsePdf />
        </div>
        {data.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <InputTable data={data} />
          </div>)}
        </main>
        </div>
        </div>
  );
}