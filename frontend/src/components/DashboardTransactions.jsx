'use client'
import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, transactionsByMonth }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const transaction = transactionsByMonth[index];
    return (
        <text
            x={x}
            y={y}
            fill="black"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
        >
            {transaction.main_category}
            <tspan
                x={x}
                dy="1.2em"
            >
                {`${transaction.total_amount.toLocaleString('de-DE')} €`}
            </tspan>
        </text>
    );
};

class TransactionCircleChart extends PureComponent {
    render() {
        const { transactionsByMonth } = this.props;
        return (
            <PieChart
                width={800}
                height={500}
            >
                <Pie
                    dataKey="total_amount"
                    nameKey="main_category"
                    isAnimationActive={false}
                    data={transactionsByMonth}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={150}
                    paddingAngle={1}
                    label={(props) => renderCustomizedLabel({ ...props, transactionsByMonth })}
                >
                    {transactionsByMonth.map((entry, index) => {
                        return (
                            <Cell key={`cell-${index}`} fill={`#${entry.main_color}`} />
                        )
                    })}
                </Pie>
            </PieChart>);
    }
}

export class BarChartByMainCategoryAndMonth extends PureComponent {
    render() {
        const { transactionsByCategoryMonth, mainCategories } = this.props;
        const requestedTransactions = transactionsByCategoryMonth.slice(-13);

        const allBars = mainCategories.map((mainCategory, index) => {
            return (
                <Bar
                    key={index}
                    dataKey={mainCategory.main_category}
                    stackId="stack"
                    fill={`#${mainCategory.main_color}`}
                />
            );
        });

        return (
            <BarChart
                width={800}
                height={500}
                data={requestedTransactions}
                stackOffset="sign"
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={tick => {
                        const datetime = new Date(tick);
                        const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
                        return formattedDate;
                    }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                {allBars}
            </BarChart>
        );
    }
}



export function TransactionTable({ transactions, subCategories }) {
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 12;
    const pages = Math.ceil(transactions.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return transactions.slice(start, end);
    }, [page, transactions]);

    const renderCell = React.useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "date":
                const datetime = new Date(cellValue);
                const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
                return formattedDate;
            default:
                return cellValue;
        }
    }, []);

    return (
            <Table
                isStriped
                style={{ tableLayout: 'fixed' }}
                bottomContent={
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
                    </div>
                }
                aria-label="Transaction table"
            >
                <TableHeader columns={subCategories}>
                    {(column) => (
                        <TableColumn 
                            key={column.key}
                            style={column.key === 'date' ? 
                                { position: 'sticky', left: 0, zIndex: 1 } : {}}
                        >
                            {column.label}
                        </TableColumn>)}
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.date}>
                            {(columnKey) => (
                                <TableCell
                                    style={columnKey === 'date' ? { position: 'sticky', left: 0, zIndex: 1 } : {}}
                                >{renderCell(item, columnKey)}</TableCell>)}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
    )
}

export default function DashboardTransactions({
    transactionsByMonth, transactionsByCategoryMonth, transactionsBySubCategoryMonth,
    mainCategories, subCategories
}) {
    return (
        <div style={{ marginTop: '20px' }}>
            <div className="flex w-full justify-center items-start gap-8">
                <BarChartByMainCategoryAndMonth
                    transactionsByCategoryMonth={transactionsByCategoryMonth}
                    mainCategories={mainCategories}
                />
                <TransactionCircleChart
                    transactionsByMonth={transactionsByMonth}
                />
            </div>
            <div className='flex w-full items-start gap-8'>
                <TransactionTable
                    transactions={transactionsBySubCategoryMonth}
                    subCategories={subCategories}
                />
            </div>
        </div>
    )
}
