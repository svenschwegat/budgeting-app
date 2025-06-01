'use client'
import React from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Checkbox, Textarea, Autocomplete, AutocompleteItem } from "@heroui/react";
import { addToast } from '@heroui/react';

const columns = [
    { key: "id", label: "ID", width: '50px' },
    { key: "main_category", label: "Main Category", width: '175px' },
    { key: "main_color", label: "Main Color", width: '100px' },
    { key: "sub_category", label: "Sub Category", width: '175px' },
    { key: "mapping", label: "Mapping", width: '250px' },
    { key: "is_visible", label: "Is Visible?", width: '100px' },
];

function showToast(title, description, color) {
  addToast({
    title: title,
    description: description,
    color: color,
    timeout: "7000"
  });
};

export default function CategoryTable({ categories }) {
    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "main_category":
            case "sub_category":
                return (
                    <Autocomplete
                        aria-label="Select category"
                        defaultSelectedKey={item.id.toString()}
                        allowsCustomValue={true}
                        isRequired={true}
                        variant="bordered"
                        onInputChange={(inputValue) => { updateCategory(item.id, columnKey, inputValue); }}
                    >
                        {categories.map((category) => (
                            <AutocompleteItem key={category.id}>{category[columnKey]}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                );
            case "main_color":
                return (
                    <div className="flex items-center justify-center h-full">
                        <input type="color"
                            defaultValue={`#${cellValue}`}
                            onBlur={(e) => { updateCategory(item.id, columnKey, e.target.value.substring(1,7)) }}
                            style={{
                                width: '100%'
                            }}
                        />
                    </div>
                );
            case "mapping":
                return (
                    <Textarea
                        defaultValue={cellValue}
                        minRows={1}
                        variant="bordered"
                        onBlur={(e) => updateCategory(item.id, columnKey, e.target.value)}
                    />
                );
            case "is_visible":
                return (
                    <div className='flex items-center justify-center h-full'>
                        <Checkbox 
                            defaultSelected={cellValue} 
                            onChange={(e) => updateCategory(item.id, columnKey, e.target.checked ? 1 : 0)}
                        />
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const updateCategory = async (category_id, column, value) => {
        let title, description, color;

        try {
            const response = await fetch(`/backend/categories/${category_id}?column=${column}&value=${value}`, {
                method: 'PUT'
            });

            if (response.ok) {
                title = "Success";
                description = `Updated category id ${category_id} with ${column} = ${value}.`;
                color = "success";
            } else {
                title = `Failed to update category id ${category_id} with ${column} = ${value}`;
                description = `Error: ${response.status} ${await response.text()}`;
                color = "danger";
            }
        } catch (error) {
            title = "Failed writing to database";
            description = `Error: ${error}`;
            color = "danger";
        }

        showToast(title, description, color);
    };

    return (
        <Table isStriped aria-label="Category table">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn style={{ width: column.width }} key={column.key}>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={categories}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}