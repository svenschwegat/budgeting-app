import DashboardFramework from '@/components/DashboardFramework';

export default async function Dashboard() {  
  const dataFetchAssets = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetchAssets.json();

  const startDate = '2025-02-01';
  const endDate = '2025-02-28';
  const dataFetchTransactionsPerMonth = 
    await fetch(`${process.env.BACKEND_URL}/transactions-per-month?start_date=${startDate}&end_date=${endDate}`, 
      { cache: 'no-store' }
    );
  
  const transactionsPerMonth = await dataFetchTransactionsPerMonth.json();

  
  /*const transactionsPerMonth = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 },
    { name: 'Group F', value: 189 },
  ];*/

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DashboardFramework assets={assets} transactionsPerMonth={transactionsPerMonth}/>
      </main>
    </div>
  );
}