import DashboardFramework from '@/components/DashboardFramework';

async function getAssets() {
  const dataFetchAssets = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetchAssets.json();
  return assets;
}

async function getTransactionsPerMonth() {
  const date = new Date();
  const firstDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const startDate = `${firstDayOfPreviousMonth.getFullYear()}-${(firstDayOfPreviousMonth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-01`;

  const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0);
  const endDate = `${lastDayOfPreviousMonth.getFullYear()}-${(lastDayOfPreviousMonth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${lastDayOfPreviousMonth.getDate().toString().padStart(2, '0')}`;

  const dataFetchTransactionsPerMonth =
    await fetch(`${process.env.BACKEND_URL}/transactions-per-month?start_date=${startDate}&end_date=${endDate}`,
      { cache: 'no-store' }
    );

  const transactionsPerMonth = await dataFetchTransactionsPerMonth.json();
  return transactionsPerMonth;
}

export default async function Dashboard() {
  var assets = await getAssets();
  var transactionsPerMonth = await getTransactionsPerMonth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DashboardFramework assets={assets} transactionsPerMonth={transactionsPerMonth} />
      </main>
    </div>
  );
}