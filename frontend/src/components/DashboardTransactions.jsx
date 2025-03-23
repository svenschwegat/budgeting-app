'use client'
import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

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

export default function DashboardTransactions({ transactionsByMonth, transactionsByCategoryMonth, mainCategories }) {
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
        </div>
    )
}
