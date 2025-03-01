import ItemList from '../components/Items';
//import ParsePdf from '../components/parsePdf';
import ParsePdf from '../components/ParsePdf';

import TestApi from '../components/TestApi';

export default function Home({ data }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Frontend</h1>
          <ParsePdf />
        <h2>Test for post and get API</h2>
        <TestApi />
        <h2>Items</h2>
          <ItemList />
        </main></div>
  );
}