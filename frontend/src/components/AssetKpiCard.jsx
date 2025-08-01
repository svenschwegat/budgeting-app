"use client"
import { Card, Chip } from "@heroui/react";
import { getPreviousMonthIsoDateString } from "@/utils/GetIsoDateString";

const TrendCard = ({ title, value, change, changeType, trendChipVariant = "flat" }) => {
    return (
        <Card className="border border-transparent dark:border-default-100">
            <div className="flex p-4">
                <div className="flex flex-col gap-y-2">
                    <dt className="text-small font-medium text-default-500">{title}</dt>
                    <dd className="text-2xl font-semibold text-default-700">{value}</dd>
                </div>
                <Chip
                    color={changeType}
                    radius="sm"
                    size="sm"
                    variant={trendChipVariant}
                >
                    {change}
                </Chip>
            </div>
        </Card>
    );
};

const calculateAssetSum = ({ assets, referenceDate}) => {
    console.log(referenceDate);
    const dataLatestMonth = assets.find((asset) => asset.date === referenceDate);
    const firstDayOfPreviousMonth = getPreviousMonthIsoDateString(referenceDate);
    const dataPreviousMonth = assets.find((asset) => asset.date === firstDayOfPreviousMonth);
    
    const latestMonthSum = Object.keys(dataLatestMonth)
        .filter((key) => key.startsWith('asset'))
        .reduce((sum, key) => sum + (dataLatestMonth[key] || 0), 0);

    const previousMonthSum = Object.keys(dataPreviousMonth)
        .filter((key) => key.startsWith('asset'))
        .reduce((sum, key) => sum + (dataPreviousMonth[key] || 0), 0);

    const value = latestMonthSum.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    const change = (latestMonthSum - previousMonthSum).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

    const changeType = latestMonthSum > previousMonthSum ? 'success' : latestMonthSum < previousMonthSum ? 'danger' : 'warning';

    const assetsSumData = {
        title: 'Total Assets',
        value: value,
        change: change,
        changeType: changeType,
    };

    return assetsSumData;
}

export default function AssetKpiCard({ assets, referenceDate }) {
    const data = calculateAssetSum({ assets, referenceDate });

    return (
        <TrendCard
            title={data.title}
            value={data.value}
            change={data.change}
            changeType={data.changeType}
        />
    );
}