import ParseFile from "@/components/ParseFile";

export default async function Upload({ }) {
  const dataFetch = await fetch(`${process.env.BACKEND_URL}/categories`, { cache: 'no-store' });
  const categories = await dataFetch.json();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Choose to upload and parse a PDF/CSV file</h1>
        <div style={{ marginBottom: '20px' }}>
          <ParseFile categories={categories}/>
        </div>
        </main>
      </div>
    </div>
  );
}