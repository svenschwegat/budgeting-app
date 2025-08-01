
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React from "react";

export default function TransactionTable({ transactions, subCategories }) {
    const [page, setPage] = React.useState(1);

    const visibleSubCategories = subCategories
        .filter((subCategory) => subCategory.is_visible === 1)
        .map((subCategory) => subCategory.key);
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(visibleSubCategories));

    const rowsPerPage = 12;
    const pages = Math.ceil(transactions.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return transactions.slice(start, end);
    }, [page, transactions]);

    const headerColumns = React.useMemo(() => {
        return subCategories.filter((subCategory) => visibleColumns.has(subCategory.key));
    }, [visibleColumns]);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "date":
                const datetime = new Date(cellValue);
                const formattedDate =
                    datetime.toLocaleString('de-DE', { month: 'short' })
                    + ' '
                    + datetime.getFullYear();
                return formattedDate;
            default:
                return isNaN(cellValue) ? '' : parseInt(cellValue, 10).toLocaleString('de-DE');
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <Select
                className="max-w-xs"
                label="Columns"
                placeholder="Select a column"
                disabledKeys={['date']}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
            >
                {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory.key} >
                        {subCategory.label}
                    </SelectItem>
                ))}
            </Select>
        );
    }, [visibleColumns]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
            </div>);
    }, [page, pages]);

    return (
        <div className="p-4">
            <Table
                isStriped
                style={{ tableLayout: 'fixed' }}
                topContent={topContent}
                topContentPlacement="inside"
                bottomContent={bottomContent}
                aria-label="Transaction table"
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            align="start"
                            style={{ height: "82px", backgroundColor: `#${column.sub_color}`, color: 'white' }}
                        >
                            <span style={{ transform: 'rotate(-45deg)', display: 'inline-block'}}>
                                {column.label}
                            </span>
                        </TableColumn>)}
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.date}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}