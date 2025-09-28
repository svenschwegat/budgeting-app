import { Select, SelectItem } from "@heroui/react";

export default function MonthSelector({ assets, handleMonthChange }) {
  return (
    <div className="flex w-full">
      <Select
        className=""
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