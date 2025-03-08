import React, { useState } from 'react';
import { Button } from '@heroui/react';


export default function GetCategoriesButton() {
    const [categories, setCategories] = useState({});
    

    const getCategories = async () => {
        try {
            const backendUrl = "http://localhost:8000";
            const response = await fetch(backendUrl + '/get-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            
            const data = await response.json();
            setCategories(data);
            console.log('categories', data);
        } catch (error) {
            console.error("Error getting categories", error);
        }    
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