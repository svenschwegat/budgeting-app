import DashboardFramework from '@/components/DashboardFramework';

export default async function Dashboard() {  
  const dataFetch = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetch.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DashboardFramework assets={assets}/>
      </main>
    </div>
  );
}