'use client'
import React from 'react'
import { EyeIcon } from '../../public/EyeIcon';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { Autocomplete, AutocompleteItem, Tooltip, Button } from '@heroui/react';

const columns = [
  { key: "date", label: "Date", width: '110px' },
  { key: "name", label: "Name", width: '150px' },
  { key: "purpose", label: "Purpose", width: '250px' },
  { key: "amount", label: "Amount", width: '110px' },
  { key: "category", label: "Category", width: '250px' },
  { key: "actions", label: "", width: '75px' }
];

const CategorySelector = ({ categories, selectedCategory, onChange, isDisabled }) => (
  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
    <Autocomplete
      className="max-w-xs"
      aria-label="Selected category"
      variant="bordered"
      defaultSelectedKey={selectedCategory.toString()}
      onChange={(e) => onChange(e.target.value)}
      isDisabled={isDisabled}
    >
      {categories.map((category) => (
        <AutocompleteItem key={category.id}>{category.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  </div>
);

const ActionButtons = ({ item, handleRowAllowed }) => (
  <div className='flex items-center justify-center h-full'>
    <Tooltip
      color={item.isAllowed ? 'secondary' : 'danger'}
      content={item.isAllowed ? 'Transaction is allowed' : 'Transaction will not be commited'}
    >
      <Button
        isIconOnly
        variant='light'
        color={item.isAllowed ? 'secondary' : 'danger'}
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
    const currency = '€';

    switch (columnKey) {
      case "date":
        const formattedDate = new Date(cellValue).toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        return item.isAllowed ? formattedDate : <s>{formattedDate}</s>;
      case "amount":
        return item.isAllowed ? (
          <span>{cellValue} {currency}</span>
        ) : (
          <s>{cellValue} {currency}</s>
        );
      case "category":
        return (
          <CategorySelector
            categories={categories}
            selectedCategory={item.category}
            onChange={(changedCategory) => handleCategoryChange(item.key, changedCategory)}
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
        {(column) => (
          <TableColumn style={{ width: column.width }} key={column.key}>
            {column.label} </TableColumn>)}
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