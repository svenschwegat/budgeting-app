'use client'
import React from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Checkbox, Textarea, Autocomplete, AutocompleteItem, Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { ChromePicker } from 'react-color';

const columns = [
    { key: "id", label: "ID", width: '50px' },
    { key: "main_category", label: "Main Category", width: '175px' },
    { key: "main_color", label: "Main Color", width: '100px' },
    { key: "sub_category", label: "Sub Category", width: '175px' },
    { key: "mapping", label: "Mapping", width: '250px' },
    { key: "is_visible", label: "Is Visible?", width: '100px' },
];

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
                    >
                        {categories.map((category) => (
                            <AutocompleteItem key={category.id}>{category[columnKey]}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                );
            case "main_color":
                return (
                    <Popover>
                        <PopoverTrigger>
                            <Button>{cellValue}</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <ChromePicker
                                color={cellValue}
                                onChangeComplete={(color) => {
                                    console.log("Selected color:", color.hex);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                );
            case "mapping":
                return (
                    <Textarea
                        defaultValue={cellValue}
                        minRows={1}
                        variant="bordered"
                    />
                );
            case "is_visible":
                return (
                    <div className='flex items-center justify-center h-full'>
                        <Checkbox isSelected={cellValue} />
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

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