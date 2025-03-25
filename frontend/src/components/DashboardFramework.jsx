'use client'
import { Tabs, Tab, Select, SelectItem } from '@heroui/react'
import { useState } from 'react';
import DashboardTransactions from './DashboardTransactions';
import AssetBarChart from './AssetBarChart';

const MonthSelector = ({ assets, handleMonthChange }) => {
  return (
    <div className="flex w-full justify-between items-center">
      <Select
        className="max-w-xs"
        aria-label="Selected month"
        label="Select a month"
        defaultSelectedKeys={[assets[0].id.toString()]}
        onChange={handleMonthChange}
      >
        {assets.map((asset) => {
          const datetime = new Date(asset.date);
          const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
          return (
            <SelectItem key={asset.id}>{formattedDate}</SelectItem>
          )
        })}
      </Select>
    </div>
  );
}

async function getTransactionsForSelectedMonth(sortedAssets, monthId) {
  const asset = sortedAssets.find((asset) => asset.id === parseInt(monthId, 10));
  let endDate = sortedAssets[0].date;
  if (asset) {
    endDate = asset.date;
  }

  const startDate = `${new Date(endDate).getFullYear()}-${(new Date(endDate).getMonth() + 1).toString()
    .padStart(2, '0')}-01`;
  const dataFetchTransactionsByMonth =
    await fetch(`/backend/transactions-by-month?start_date=${startDate}&end_date=${endDate}`,
      { cache: 'no-store' }
    );

  const transactionsByMonth = await dataFetchTransactionsByMonth.json();
  return transactionsByMonth;
}

export default function DashboardFramework({ assets, transactionsByMonth, transactionsByCategoryMonth, transactionsBySubCategoryMonth, mainCategories, subCategories }) {
  const sortedAssets = [...assets].sort((a, b) => b.id - a.id); // Latest to earliest
  const [referenceMonthId, setReferenceMonthId] = useState(sortedAssets[0].id);
  const [transactionsByMonthState, setTransactionsByMonthState] = useState(transactionsByMonth);
  const [transactionsByCategoryMonthState, setTransactionsByCategoryMonthState] = useState(transactionsByCategoryMonth);

  const handleMonthChange = async (e) => {
    setReferenceMonthId(e.target.value);

    const newTransactionsByMonth = await getTransactionsForSelectedMonth(sortedAssets, e.target.value);
    setTransactionsByMonthState(newTransactionsByMonth);
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="flex w-full flex-col items-center">
        <Tabs aria-label="Options">
          <Tab key="assets" title="Assets">
            <MonthSelector
              assets={sortedAssets}
              handleMonthChange={handleMonthChange}
            />
            <AssetBarChart
              assets={assets}
              referenceMonthId={referenceMonthId}
            />
          </Tab>
          <Tab key="transactions" title="Transactions">
            <MonthSelector
              assets={sortedAssets}
              handleMonthChange={handleMonthChange}
            />
            <DashboardTransactions
              transactionsByMonth={transactionsByMonthState}
              transactionsByCategoryMonth={transactionsByCategoryMonthState}
              transactionsBySubCategoryMonth={transactionsBySubCategoryMonth}
              mainCategories={mainCategories}
              subCategories={subCategories}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}