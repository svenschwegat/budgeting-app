import DashboardFramework from '@/components/DashboardFramework';
import { getIsoDateString } from '@/utils/GetIsoDateString';

async function getAssets() {
  const dataFetchAssets = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetchAssets.json();
  return assets;
}

async function getTransactionsByMonth() {
  const firstDayOfPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const startDate = getIsoDateString(firstDayOfPreviousMonth);
  const endDate = getIsoDateString(firstDayOfPreviousMonth, true);

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

async function getSubCategories(){
  const data = await fetch(`${process.env.BACKEND_URL}/sub-categories`, { cache: 'no-store' });
  const subCategories = await data.json();
  return subCategories;
}

async function getTransactionsBySubCategoryMonth(){
  const data = await fetch(`${process.env.BACKEND_URL}/transactions-by-sub-category-and-month`, { cache: 'no-store' });
  const transactionsBySubCategoryMonth = await data.json();
  return transactionsBySubCategoryMonth;
}

export default async function Dashboard() {
  var assets = await getAssets();
  var transactionsByMonth = await getTransactionsByMonth();
  var transactionsByCategoryMonth = await getTransactionsByCategoryMonth();
  var mainCategories = await getMainCategories();
  var subCategories = await getSubCategories();
  var transactionsBySubCategoryMonth = await getTransactionsBySubCategoryMonth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DashboardFramework 
          assets={assets} 
          transactionsByMonth={transactionsByMonth}
          transactionsByCategoryMonth={transactionsByCategoryMonth}
          transactionsBySubCategoryMonth={transactionsBySubCategoryMonth}
          mainCategories={mainCategories}
          subCategories={subCategories}
        />
      </main>
    </div>
  );
}