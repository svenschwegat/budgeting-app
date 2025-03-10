'use client'
import React, { useState } from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/react";
import { Select, SelectItem } from '@heroui/react';

const columns = [
    { key: "date", label: "Date", editable: false },
    { key: "name", label: "Name", editable: false },
    { key: "purpose", label: "Purpose", editable: false },
    { key: "amount", label: "Amount", editable: false },
    { key: "category", label: "Category", editable: true },
];

export const CategorySelector = ({categories, selectedCategory, onChange}) => {
  console.log('categories', categories, selectedCategory);
  /* defaultSelectedKeys={[selectedCategory]} in the select todo*/
  return(
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select className="max-w-xs" label="Select a category"  > 
      {categories.map((category) => (
          <SelectItem key={category.id}>{category.label}</SelectItem>
      ))}
      </Select>
    </div>
  )
}

export default function InputTable({ data, categories }) {
    const [selectedCategories, setSelectedCategories] = useState({});

    const handleCategoryChange = (key, value) => {
        setSelectedCategories((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
      <Table removeWrapper aria-label="Input table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn width='200' key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
        {(item) => (
            <TableRow key={item.key}>
            {(columnKey) => (
                <TableCell>
                {columnKey === 'category' ? (
                    <CategorySelector
                    categories = {categories}
                    selectedCategory = {item.category}
                    onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                    />) : (getKeyValue(item, columnKey))}
                </TableCell>
            )}
            </TableRow>
        )}
        </TableBody>
      </Table>
    );
}

