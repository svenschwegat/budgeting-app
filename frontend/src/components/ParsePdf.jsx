'use client'
import React, { useState } from 'react'
import InputTable from './InputTable';
import { Input, Button } from '@heroui/react';

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
                <Input type="file" color="secondary" onChange={handleFileChange} />
                <div style={{ marginBottom: '20px' }}></div>
                <Button color="secondary" onPress={handleFileParse}
                >
                Parse bank statement PDF
                </Button>
                {result && <InputTable data={result} />}
            </main>
        </div>
    );
}