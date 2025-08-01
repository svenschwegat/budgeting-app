'use client'
import React from "react";
import { parseDate } from "@internationalized/date";
import { addToast, Tabs, Tab, DatePicker, NumberInput, Button } from '@heroui/react'
import ParseFile from "@/components/ParseFile";

function showToast(title, description, color) {
    addToast({
        title: title,
        description: description,
        color: color,
        timeout: "7000"
    });
};

function getFirstDayOfPreviousMonth(){
    const date = new Date();
    const firstDayOfPreviousMonth = parseDate(new Date(date.getFullYear(), date.getMonth() - 1, 2).toISOString().slice(0, 10));
    return firstDayOfPreviousMonth;
};

let title, description, color;
const commitAssets = async ({ assetDate, assets }) => {
    const formattedDate = `${assetDate.year}-${String(assetDate.month).padStart(2, '0')}-${String(assetDate.day).padStart(2, '0')}`;
    assets.date = formattedDate;

    try {
        const response = await fetch('/backend/assets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([assets])
        });

        if (response.ok) {
            title = "Success";
            description = `Successfully inserted assets.`;
            color = "success";
        } else {
            title = "Failed to insert assets";
            description = `Error: ${response.status}}`;
            color = "danger";
        }
    } catch (error) {
        title = "Failed writing to database";
        description = `Error: ${error}`;
        color = "danger";
    }

    showToast(title, description, color);
};

export default function AddDataModal({ categories }) {
    const [assetDate, setAssetDate] = React.useState(getFirstDayOfPreviousMonth());
    const [assets, setAssets] = React.useState({ asset1: null, asset2: null, asset3: null, asset4: null, asset5: null });
    const assetNames = { asset1: "Konto", asset2: "CC", asset3: "Tagesgeld", asset4: "Depot", asset5: "Crypto" };

    const updateAssets = (key, value) => {
        setAssets((prevAssets) => ({
            ...prevAssets,
            [key]: value ? value : null,
        }));
    };

    return (
        <div className="flex w-full flex-col items-center">
            <Tabs aria-label="Upload options">
                <Tab key="uploadFile" title="Upload File">
                    <h1>Choose to upload and parse a PDF/CSV file</h1>
                    <div style={{ marginBottom: '20px' }}>
                        <ParseFile categories={categories} />
                    </div>
                </Tab>
                <Tab key="addAssets" title="Add Assets">
                    <div className="flex flex-row items-center justify-center gap-4 mb-4">
                        <DatePicker
                            aria-label="Select date"
                            label="Date"
                            labelPlacement="outside"
                            isRequired={true}
                            value={assetDate}
                            onChange={setAssetDate}
                        />
                        {Object.entries(assetNames).map(([key, name]) => (
                            <div key={key} className="flex items-center justify-center">
                                <NumberInput
                                    hideStepper
                                    aria-label={`Asset ${key} amount`}
                                    label={name}
                                    labelPlacement="outside"
                                    placeholder="0"
                                    onValueChange={(newValue) => updateAssets(key, newValue)}
                                    formatOptions={{
                                        style: "currency",
                                        currency: "EUR",
                                        currencyDisplay: "symbol",
                                        currencySign: "accounting",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: '20px' }}></div>
                    <Button
                        color="secondary"
                        onPress={() => commitAssets({ assetDate, assets })}
                    >
                        Commit Assets
                    </Button>
                </Tab>
            </Tabs>
        </div>
    );
}