'use client'
import React, { useState } from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@heroui/react";

const columns = [
    { key: "date", label: "Date", editable: false },
    { key: "name", label: "Name", editable: false },
    { key: "purpose", label: "Purpose", editable: false },
    { key: "amount", label: "Amount", editable: false },
    { key: "category", label: "Category", editable: true },
];

export const emptyTable = () => {
    return (
        <Table aria-label="Example empty table">
          <TableHeader>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        </Table>
      );
}

export default function InputTable({ data }) {
    if(data === undefined) {
        return <emptyTable />;
    }
    return (
        <Table removeWrapper aria-label="Input table">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={data}>
                {(item) => (
                    <TableRow key={item.key}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

