import { PureComponent } from 'react'
import { PieChart, Pie, Cell } from 'recharts';

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

export default class TransactionPieChart extends PureComponent {
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
            </PieChart>
        );
    }
}