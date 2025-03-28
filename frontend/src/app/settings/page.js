import CategoryTable from "@/components/CategoryTable";

async function getCategories() {
  const data = await fetch(`${process.env.BACKEND_URL}/categories`, { cache: 'no-store' });
  const categories = await data.json();
  return categories;
}

export default async function Settings({ }) {
  const categories = await getCategories();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div style={{ marginBottom: '20px' }}></div>
          <h2>Settings</h2>
          <CategoryTable categories={categories} />
        </main>
      </div>
    </div>
  );
}