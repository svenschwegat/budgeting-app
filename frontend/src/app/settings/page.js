import TestApi from '@/components/TestApi';

export default function Settings({ }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div style={{ marginBottom: '20px' }}></div>
            </main>
        </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <h2>Test for post and get API</h2>
          <TestApi />
        </main>
      </div>
    </div>
  );
}