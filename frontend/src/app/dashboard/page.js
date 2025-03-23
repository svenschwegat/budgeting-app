import DashboardFramework from '@/components/DashboardFramework';

async function getAssets() {
  const dataFetchAssets = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetchAssets.json();
  return assets;
}

async function getTransactionsByMonth() {
  const date = new Date();
  const firstDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const startDate = `${firstDayOfPreviousMonth.getFullYear()}-${(firstDayOfPreviousMonth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-01`;

  const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0);
  const endDate = `${lastDayOfPreviousMonth.getFullYear()}-${(lastDayOfPreviousMonth.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${lastDayOfPreviousMonth.getDate().toString().padStart(2, '0')}`;

  const dataFetchTransactionsByMonth =
    await fetch(`${process.env.BACKEND_URL}/transactions-by-month?start_date=${startDate}&end_date=${endDate}`,
      { cache: 'no-store' }
    );

  const transactionsByMonth = await dataFetchTransactionsByMonth.json();
  return transactionsByMonth;
}

async function getTransactionsByCategoryMonth() {
  const data = await fetch(`${process.env.BACKEND_URL}/transactions-by-main-category-and-month`, { cache: 'no-store' });
  const transactionsByCategoryMonth = await data.json();
  return transactionsByCategoryMonth;
}

async function getMainCategories(){
  const data = await fetch(`${process.env.BACKEND_URL}/main-categories`, { cache: 'no-store' });
  const mainCategories = await data.json();
  return mainCategories;
}

export default async function Dashboard() {
  var assets = await getAssets();
  var transactionsByMonth = await getTransactionsByMonth();
  var transactionsByCategoryMonth = await getTransactionsByCategoryMonth();
  var mainCategories = await getMainCategories();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DashboardFramework 
          assets={assets} 
          transactionsByMonth={transactionsByMonth}
          transactionsByCategoryMonth={transactionsByCategoryMonth} 
          mainCategories={mainCategories}
        />
      </main>
    </div>
  );
}