import { useMemo, useState } from 'react';
import data from './data/program_health.json';
import KpiRow from './components/KpiRow';
import TrendChart from './components/TrendChart';
import WeekFilter from './components/WeekFilter';
import DefectsChart from './components/DefectsChart';
import { aggregateByStation } from './utils/aggregate';
import Heatmap from './components/Heatmap';
import SupplierPanel from './components/SupplierPanel';

export default function App() {
  const [range, setRange] = useState([1, data.program.weeks]);

  const stations = useMemo(
      () => aggregateByStation(data.station_weeks, range),
      [range]
  );

  return (
      <main style={{ padding: 'var(--space-6)' }}>
        <h1>{data.program.name}</h1>
        <KpiRow kpis={data.summary.kpis} />
        <TrendChart data={data.summary.weekly_output} />
        <WeekFilter range={range} onChange={setRange} max={data.program.weeks} />
        <DefectsChart stations={stations} range={range} />
        <Heatmap rows={data.station_weeks} range={range} />
        <SupplierPanel issues={data.supplier_issues} range={range} />
      </main>
  );
}