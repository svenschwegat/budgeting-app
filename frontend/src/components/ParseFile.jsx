'use client'
import React, { useState } from 'react'
import InputTable from './InputTable';
import { Input, Button } from '@heroui/react';
import WriteToDb from './WriteToDb';

export default function ParseFile({categories}) {
    const [file, setFile] = useState(null);
    const [transactions, setTransactions] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [disabledState, setDisabledState] = useState(true);
    
    const [parseButtonLabel, setParseButtonLabel] = useState('Parse');
    const [parseFetchRequest, setParseFetchRequest] = useState(null);

    const dropdownCategories =
        categories.map(category => ({
            id: category.id,
            textValue: category.sub_category,
            label: category.sub_category
        }));
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        const fileType = event.target.files[0].type.substr(-3);

        if(['csv', 'pdf'].includes(fileType)){
            setDisabledState(false);
            setParseButtonLabel('Parse ' + fileType.toUpperCase());
            setParseFetchRequest('parse-' + fileType);
        } else {
            setDisabledState(true);
            setParseButtonLabel('Parse');
        }
    };
    
    const handleFileClear = () => {
        setDisabledState(true);
        setParseButtonLabel('Parse');
        setParseFetchRequest(null);
    }

    const handleFileParse = async () => {
        setLoadingState(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/backend/' + parseFetchRequest, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setTransactions(data);
            setLoadingState(false);
        } catch (error) {
            console.error("Error parsing file", error);
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
                        {parseButtonLabel}
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
                    setTransactions={setTransactions}
                />}
            </main>
        </div>
    );
}