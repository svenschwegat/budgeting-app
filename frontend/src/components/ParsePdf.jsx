'use client'
import React, { useState } from 'react'
import InputTable from './InputTable';

export default function ParsePdf({}) {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileParse = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const backendUrl = "http://localhost:8000";
        try {
            const response = await fetch(backendUrl + '/parse/parse-pdf', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log('parse-pdf',result, data);
            setResult(data);
        } catch (error) {
            console.error("Error adding parsing pdf", error);
        }    
    };

    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <input type="file" onChange={handleFileChange} />
                <div style={{ marginBottom: '20px' }}></div>
                <button
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                onClick={handleFileParse}
                >
                Parse bank statement PDF
                </button>
                {result && <InputTable data={result} />}
            </main>
        </div>
    );
}