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

const CategorySelector = ({ categories, selectedCategory, onChange }) => (
  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
    <Select
      className="max-w-xs"
      aria-label="Selected category"
      variant="bordered"
      defaultSelectedKeys={[selectedCategory.toString()]}
      onChange={(e) => onChange(e.target.value)}
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

export default function InputTable({ transactions, categories, setChangedTransactions }) {
  const handleCategoryChange = (changedTransactions) => {
    setChangedTransactions(changedTransactions);
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "date":
        const formattedDate = new Date(cellValue).toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        return formattedDate;
      case "category":
        return (
          <CategorySelector
            categories={categories}
            selectedCategory={item.category}
            onChange={(changedTransaction) => {
              const changedTransactions = transactions.map((row) =>
                row.key === item.key ? { ...row, category: changedTransaction } : row
              );
              handleCategoryChange(changedTransactions);
            }}
          />
        );
      case "actions":
        return <ActionButtons />;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table isStriped aria-label="Input table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn width='200' key={column.key}>{column.label} </TableColumn>}
      </TableHeader>
      <TableBody items={transactions}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}