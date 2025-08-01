import { PureComponent } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

export default class TransactionBarChart extends PureComponent {
    render() {
        const { transactionsByCategoryMonth, mainCategories, referenceDate } = this.props;
        const requestedTransactions = transactionsByCategoryMonth
            .filter((transaction) => transaction.date <= referenceDate)
            .slice(-13);
            
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