'use client'
import React, { PureComponent } from 'react'
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, transactionsPerMonth}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const transaction = transactionsPerMonth[index];
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
        const { transactionsPerMonth } = this.props;
        return (
            <PieChart width={800} height={500}>
                <Pie
                    dataKey="total_amount"
                    nameKey="main_category"
                    isAnimationActive={false}
                    data={transactionsPerMonth}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={150}
                    paddingAngle={1}
                    label={(props) => renderCustomizedLabel({...props, transactionsPerMonth})}
                >
                    {transactionsPerMonth.map((entry, index) => {
                        return (
                            <Cell key={`cell-${index}`} fill={`#${entry.main_color}`} />
                        )
                    })}
                </Pie>
            </PieChart>);
    }
}

export default function DashboardTransactions({ transactionsPerMonth }) {
    return (
        <div style={{ marginTop: '20px' }}>
            <div className="flex w-full flex-col items-center">
                <TransactionCircleChart transactionsPerMonth={transactionsPerMonth} />
            </div>
        </div>
    )
}
