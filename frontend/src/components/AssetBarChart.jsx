import { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

export default class AssetBarChart extends PureComponent {
    render() {
        const { assets, referenceDate } = this.props;
        const requestedAssets = assets
            .filter((asset) => asset.date <= referenceDate)
            .slice(-13);

        return (
            <BarChart
                width={1000}
                height={500}
                data={requestedAssets}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={tick => {
                        const datetime = new Date(tick);
                        const formattedDate = datetime.toLocaleString('de-DE', { month: 'short' }) + ' ' + datetime.getFullYear();
                        return formattedDate;
                    }} />
                <YAxis tickFormatter={tick => {
                    return tick.toLocaleString('de-DE');
                }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="asset1" name="Konto" stackId="a" fill="#434be8" />
                <Bar dataKey="asset2" name="CC" stackId="a" fill="#05ffdd" />
                <Bar dataKey="asset3" name="Tagesgeld" stackId="a" fill="#e8435e" />
                <Bar dataKey="asset4" name="Depot" stackId="a" fill="#ffc805" />
                <Bar dataKey="asset5" name="Crypto" stackId="a" fill="#9b43e8" >
                    <LabelList position='top' formatter={(value) => parseInt(value).toLocaleString('de-DE')}></LabelList>
                </Bar>
            </BarChart>
        );
    }
}