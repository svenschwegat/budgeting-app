'use client'
import TransactionBarChart from './TransactionBarChart';
import TransactionPieChart from './TransactionPieChart';
import TransactionTable from './TransactionTable';

export default function DashboardTransactions({
    transactionsByMonth, transactionsByCategoryMonth, transactionsBySubCategoryMonth,
    mainCategories, subCategories
}) {
    return (
        <div style={{ marginTop: '20px' }}>
            <div className="flex w-full justify-center items-start gap-8">
                <TransactionBarChart
                    transactionsByCategoryMonth={transactionsByCategoryMonth}
                    mainCategories={mainCategories}
                />
                <TransactionPieChart
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
