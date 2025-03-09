import React, { useState } from 'react';
import { Button } from '@heroui/react';
import fetchFromDb from './FetchFromDb';


export default function GetCategoriesButton() {
    const [categories, setCategories] = useState({});
    const [sqlStatement, setSqlStatement] = useState('');

    const getCategories = async () => {
        setSqlStatement('SELECT * FROM categories');
        const data = await fetchFromDb(sqlStatement);
        setCategories(data);
    };

    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div style={{ marginBottom: '20px' }}></div>
                <Button color="secondary" onPress={getCategories}>
                    Get categories from db
                </Button>
            </main>
        </div>
    );
};