'use client'
import React from 'react'
import { EyeIcon } from '../../public/EyeIcon';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Select, SelectItem, Tooltip, Button } from '@heroui/react';

const columns = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "purpose", label: "Purpose" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "actions", label: "" }
];

const CategorySelector = ({ categories, selectedCategory, onChange, isDisabled }) => (
  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
    <Select
      className="max-w-xs"
      aria-label="Selected category"
      variant="bordered"
      defaultSelectedKeys={[selectedCategory.toString()]}
      onChange={(e) => onChange(e.target.value)}
      isDisabled={isDisabled}
    >
      {categories.map((category) => (
        <SelectItem key={category.id}>{category.label}</SelectItem>
      ))}
    </Select>
  </div>
);

const ActionButtons = ({ item, handleRowAllowed }) => (
  <div className='flex items-center justify-center h-full'>
    <Tooltip 
      color={ item.isAllowed ? 'secondary' : 'danger' } 
      content={ item.isAllowed ? 'Transaction is allowed' : 'Transaction will not be commited' } 
    >
    <Button 
      isIconOnly 
      variant='light' 
      color={ item.isAllowed ? 'secondary' : 'danger' } 
      onPress={() => handleRowAllowed(item.key)}>
      <EyeIcon />
    </Button>
    </Tooltip>
  </div>
);

export default function InputTable({ transactions, categories, setTransactions }) {
  const handleCategoryChange = (itemKey, changedCategory) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.key === itemKey
          ? { ...transaction, category: parseInt(changedCategory) }
          : transaction
      )
    );
  };

  const handleRowAllowed = (itemKey) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.key === itemKey
          ? { ...transaction, isAllowed: !transaction.isAllowed }
          : transaction
      )
    );
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "date":
        const formattedDate = new Date(cellValue).toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        return item.isAllowed ? formattedDate : <s>{formattedDate}</s>;
      case "category":
        return (
          <CategorySelector
            categories={categories}
            selectedCategory={item.category}
            onChange={(changedCategory) => handleCategoryChange(item.key, changedCategory) }
            isDisabled={!item.isAllowed}
          />
        );
      case "actions":
        return <ActionButtons item={item} handleRowAllowed={handleRowAllowed} />;
      default:
        return item.isAllowed ? cellValue : <s>{cellValue}</s>;
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