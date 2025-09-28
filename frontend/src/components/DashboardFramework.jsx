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
        defaultSelectedKeys={[assets[0].date]}
        onChange={handleMonthChange}
      >
        {assets.map((asset) => {
          const datetime = new Date(asset.date);
          const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
          return (
            <SelectItem key={asset.date}>{formattedDate}</SelectItem>
          )
        })}
      </Select>
    </div>
  );
}

async function getTransactionsForSelectedMonth(sortedAssets, referenceDate) {
  const asset = sortedAssets.find((asset) => asset.date === referenceDate);
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
  const [referenceDate, setReferenceDate] = useState(sortedAssets[0].date);
  const [transactionsByMonthState, setTransactionsByMonthState] = useState(transactionsByMonth);
  const [transactionsByCategoryMonthState, setTransactionsByCategoryMonthState] = useState(transactionsByCategoryMonth);

  const handleMonthChange = async (e) => {
    setReferenceDate(e.target.value);

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
                referenceDate={referenceDate}
              />
            </div>
          </div>
          <div
            id="AssetBarChartContainer"
            style={{ width: '100vw', height: '40vh' }}
          >
            <AssetBarChart
              assets={assets}
              referenceDate={referenceDate}
            />
          </div>
        </Tab>
        <Tab key="transactions" title="Transactions">
          <div id="TransactionMonthSelector" className="p-4">
            <MonthSelector
              assets={sortedAssets}
              handleMonthChange={handleMonthChange}
            />
          </div>
          <DashboardTransactions
            transactionsByMonth={transactionsByMonthState}
            transactionsByCategoryMonth={transactionsByCategoryMonthState}
            transactionsBySubCategoryMonth={transactionsBySubCategoryMonth}
            mainCategories={mainCategories}
            subCategories={subCategories}
            referenceDate={referenceDate}
          />
        </Tab>
      </Tabs>
    </div>
  )
}