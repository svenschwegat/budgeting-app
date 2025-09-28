'use client';
import MonthSelector from './MonthSelector';
import AssetKpiCard from './AssetKpiCard';
import AssetBarChart from './AssetBarChart';
import { useState } from 'react';

export default function DashboardAssets({ assets }) {
  const sortedAssets = [...assets].sort((a, b) => b.id - a.id); // Latest to earliest
  const [referenceDate, setReferenceDate] = useState(sortedAssets[0].date);

  const handleMonthChange = async (e) => {
    setReferenceDate(e.target.value);
  }

  return (
    <div id="DashboardAssets">
      <div id="assetHeader" className="flex w-full flex-row items-center justify-start gap-4 p-4">
        <MonthSelector
          assets={sortedAssets}
          handleMonthChange={handleMonthChange}
        />
        <AssetKpiCard
          assets={sortedAssets}
          referenceDate={referenceDate}
        />
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
    </div>
  );
}