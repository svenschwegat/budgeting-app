'use client'
import React, { useState } from 'react'
import InputTable from './InputTable';
import { Input, Button, Card, CardBody } from '@heroui/react';
import WriteToDb from './WriteToDb';

export default function ParsePdf({categories}) {
    const [file, setFile] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [disabledState, setDisabledState] = useState(true);

    const dropdownCategories =
        categories.map(category => ({
            id: category.id,
            textValue: category.sub_category,
            label: category.sub_category
        }));
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setDisabledState(false);
    };
    
    const handleFileClear = () => {
        setDisabledState(true);
    }

    const handleFileParse = async () => {
        setLoadingState(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/backend/parse-pdf', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setTransactions(data);
            setLoadingState(false);
        } catch (error) {
            console.error("Error adding parsing pdf", error);
        }    
    };

    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-left">
                <div className='flex flex-row items-center gap-4'>
                    <Input 
                        type="file" 
                        fullWidth="false" 
                        color="secondary" 
                        isClearable='true'
                        onChange={handleFileChange} 
                        onClear={handleFileClear}
                    />
                    <Button 
                        isDisabled={disabledState} 
                        isLoading={loadingState} 
                        color="secondary" 
                        onPress={handleFileParse}
                    >
                        Parse
                    </Button>
                    {transactions && <WriteToDb transactions={transactions} />}
                    <Button 
                        disableRipple='true' 
                        disableAnimation='true' 
                        variant='bordered'
                    >
                        Count of transactions: {transactions ? transactions.length : 0}
                    </Button>
                </div>
                <div style={{ marginBottom: '20px' }}></div>
                {transactions && 
                <InputTable 
                    transactions={transactions} 
                    categories={dropdownCategories}
                    setChangedTransactions={setTransactions}
                />}
            </main>
        </div>
    );
}