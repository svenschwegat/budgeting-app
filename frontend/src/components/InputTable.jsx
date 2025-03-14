'use client'
import React from 'react'
import { DeleteIcon } from '../../public/DeleteIcon';
import { Tooltip, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Select, SelectItem } from '@heroui/react';

const columns = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "purpose", label: "Purpose" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "actions", label: "" }
];

const CategorySelector = ({ categories, selectedCategory }) => (
  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
    <Select
      className="max-w-xs"
      aria-label="Selected category"
      defaultSelectedKeys={[selectedCategory.toString()]}
    >
      {categories.map((category) => (
        <SelectItem key={category.id}>{category.label}</SelectItem>
      ))}
    </Select>
  </div>
);

const ActionButtons = () => (
  <div className='flex items-center justify-center h-full'>
    <Tooltip color="danger" content="Delete transaction">
      <span className="text-lg text-danger cursor-pointer active:opacity-50">
        <DeleteIcon />
      </span>
    </Tooltip>
  </div>
);

export default function InputTable({ data, categories }) {
  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "date":
        const formattedDate = new Date(cellValue).toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric' });
        return formattedDate;
      case "category":
        return <CategorySelector categories={categories} selectedCategory={item.category} />;
      case "actions":
        return <ActionButtons />;
      default:
        return cellValue;
    }
  }, []);
  
  return (
    <Table removeWrapper aria-label="Input table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn width='200' key={column.key}>{column.label} </TableColumn>}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}