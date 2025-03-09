'use client';
import React, { useEffect, useState } from 'react';
import ParsePdf from '@/components/ParsePdf';
import InputTable from '@/components/InputTable';
import OnLoad from '@/components/OnLoad';
import CustomNavbar from '@/components/CustomNavbar';
import { getCategories } from '@/components/FetchFromDb';

export default function Upload({ }) {
  const [data, setData] = useState([]);
  const [tableCategories, setTableCategories] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      const result = await OnLoad();
      if (result) {
        setData(result.items);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories();
      setTableCategories(categories);
    }
    fetchCategories();
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
            <InputTable data={data} categories={tableCategories} />
          </div>)}
        </main>
        </div>
        </div>
  );
}