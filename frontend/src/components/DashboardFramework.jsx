'use client'
import { Tabs, Tab, Select, SelectItem } from '@heroui/react'
import React, { PureComponent, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DashboardTransactions from './DashboardTransactions';

export class AssetColumnChart extends PureComponent {
  render() {
    const { assets, referenceMonthId } = this.props;
    const requestedAssets = assets
      .filter((asset) => asset.id <= referenceMonthId)
      .slice(-13);
    
    return (
      <BarChart
        width={1000}
        height={500}
        data={requestedAssets}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={tick => {
            const datetime = new Date(tick);
            const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
            return formattedDate;
          }} />
        <YAxis tickFormatter={tick => {
          return tick.toLocaleString('de-DE');
        }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="asset1" name="Konto" stackId="a" fill="#434be8" />
        <Bar dataKey="asset2" name="CC" stackId="a" fill="#05ffdd" />
        <Bar dataKey="asset3" name="Tagesgeld" stackId="a" fill="#e8435e" />
        <Bar dataKey="asset4" name="Depot" stackId="a" fill="#ffc805" />
        <Bar dataKey="asset5" name="Crypto" stackId="a" fill="#9b43e8" />
      </BarChart>
    );
  }
}

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

export default function DashboardFramework({ assets, transactionsPerMonth }) {
  const sortedAssets = [...assets].sort((a, b) => b.id - a.id); // Latest to earliest
  const [referenceMonthId, setReferenceMonthId] = useState(sortedAssets[0].id);

  const handleMonthChange = (e) => {
    setReferenceMonthId(e.target.value);
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="flex w-full flex-col items-center">
        <Tabs aria-label="Options">
          <Tab key="assets" title="Assets">
            <MonthSelector assets={sortedAssets} handleMonthChange={handleMonthChange} />
            <AssetColumnChart assets={assets} referenceMonthId={referenceMonthId} />
          </Tab>
          <Tab key="transactions" title="Transactions">
            <MonthSelector assets={sortedAssets} handleMonthChange={handleMonthChange} />
            <DashboardTransactions transactionsPerMonth={transactionsPerMonth}/>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}