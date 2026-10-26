import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceLine, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import './TrendChart.css'; // reuses .chart-card styles
import { TARGET } from '../config';


function colorFor(rate) {
    if (rate > TARGET * 1.5) return 'var(--color-bad)';
    if (rate > TARGET) return 'var(--color-warn)';
    return 'var(--color-good)';
}

export default function DefectsChart({ stations, range }) {
    const sorted = [...stations].sort((a, b) => b.defectRate - a.defectRate);

    return (
        <section className="chart-card" aria-label="Defect rate by station">
            <div className="chart-header">
                <h2>Defect rate by station</h2>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Weeks {range[0]} to {range[1]}
        </span>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 48, bottom: 8, left: 8 }}>
                    <CartesianGrid stroke="var(--color-grid)" strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 'dataMax + 2']} unit="%" stroke="var(--color-text-muted)" />
                    <YAxis type="category" dataKey="station" width={160} stroke="var(--color-text-muted)" />
                    <Tooltip
                        cursor={{ fill: 'rgba(148,163,184,0.1)' }}
                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-grid)' }}
                        formatter={(v) => [`${v}%`, 'Defect rate']}
                    />
                    <ReferenceLine x={TARGET} stroke="var(--color-text-muted)" strokeDasharray="6 4"
                                   label={{ value: `Target ${TARGET}%`, fill: 'var(--color-text-muted)', position: 'top' }} />
                    <Bar dataKey="defectRate" radius={[0, 4, 4, 0]}>
                        {sorted.map((d) => <Cell key={d.station} fill={colorFor(d.defectRate)} />)}
                        <LabelList dataKey="defectRate" position="right" formatter={(v) => `${v}%`}
                                   fill="var(--color-text)" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
}