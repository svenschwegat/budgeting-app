'use client'
import React, { useState } from 'react'
import InputTable from './InputTable';
import { Input, Button } from '@heroui/react';

export default function ParsePdf({categories}) {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const dropdownCategories =
        categories.map(category => ({
            id: category.id,
            textValue: category.sub_category,
            label: category.sub_category
        }));
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileParse = async () => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/backend/parse-pdf', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
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
                <Button color="secondary" onPress={handleFileParse}>
                Parse bank statement PDF
                </Button>
                <div style={{ marginBottom: '20px' }}></div>
                {result && <InputTable data={result} categories={dropdownCategories}/>}
            </main>
        </div>
    );
}