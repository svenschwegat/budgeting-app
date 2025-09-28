import DashboardAssets from '@/components/DashboardAssets';

async function getAssets() {
  const dataFetchAssets = await fetch(`${process.env.BACKEND_URL}/assets`, { cache: 'no-store' });
  const assets = await dataFetchAssets.json();
  return assets;
}

export default async function Assets() {
  const assets = await getAssets();
  return (
    <DashboardAssets
      assets={assets}
    />
  )
}