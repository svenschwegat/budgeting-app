'use client'
import { Tabs, Tab, Select, SelectItem } from '@heroui/react'
import { useState } from 'react';
import { getIsoDateString } from '@/utils/GetIsoDateString';
import DashboardTransactions from './DashboardTransactions';
import AssetKpiCard from './AssetKpiCard';
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
  const startDate = asset ? getIsoDateString(asset.date) : getIsoDateString(sortedAssets[0].date);
  const endDate = asset ? getIsoDateString(asset.date, true) : getIsoDateString(sortedAssets[0].date, true);

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
    setReferenceMonthId(parseInt(e.target.value, 10));

    const newTransactionsByMonth = await getTransactionsForSelectedMonth(sortedAssets, e.target.value);
    setTransactionsByMonthState(newTransactionsByMonth);
  }

  return (
    <div className="flex w-full flex-col items-center" style={{ marginTop: '20px' }}>
      <Tabs aria-label="Options">
        <Tab key="assets" title="Assets">
          <div className="flex w-full flex-row items-center justify-start gap-4">
            <MonthSelector
              assets={sortedAssets}
              handleMonthChange={handleMonthChange}
            />
            <div className="flex-grow">
              <AssetKpiCard
                assets={sortedAssets}
                referenceMonthId={referenceMonthId}
              />
            </div>
          </div>
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
  )
}