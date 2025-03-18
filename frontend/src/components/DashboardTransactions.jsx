'use client'
import React, { PureComponent } from 'react'
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

class TransactionCircleChart extends PureComponent {
    render() {
        const { transactionsPerMonth } = this.props;
        console.log(transactionsPerMonth);
        return (
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="total_amount"
                    nameKey="main_category"
                    isAnimationActive={false}
                    data={transactionsPerMonth}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={150}
                />
                {transactionsPerMonth.map((entry, index) => {
                    console.log(entry.main_color);
                    return(
                        <Cell key={`cell-${index}`} fill={`#${entry.main_color}`} />
                    )
                    
                })}
                <Tooltip />
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
