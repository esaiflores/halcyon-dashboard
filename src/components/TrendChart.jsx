import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './TrendChart.css';

const VIEWS = {
    cumulative: { plan: 'cum_planned', actual: 'cum_actual', label: 'Cumulative units' },
    weekly: { plan: 'planned_units', actual: 'actual_units', label: 'Units per week' },
};

export default function TrendChart({ data }) {
    const [view, setView] = useState('cumulative');
    const keys = VIEWS[view];

    return (
        <section className="chart-card" aria-label="Planned versus actual output">
            <div className="chart-header">
                <h2>Planned vs. actual output</h2>
                <div className="toggle" role="group" aria-label="Chart view">
                    {Object.keys(VIEWS).map((v) => (
                        <button
                            key={v}
                            className={v === view ? 'toggle-btn active' : 'toggle-btn'}
                            onClick={() => setView(v)}
                            aria-pressed={v === view}
                        >
                            {v === 'cumulative' ? 'Cumulative' : 'Weekly'}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid stroke="var(--color-grid)" strokeDasharray="3 3" />
                    <XAxis dataKey="week" stroke="var(--color-text-muted)"
                           label={{ value: 'Week', position: 'insideBottom', offset: -4, fill: 'var(--color-text-muted)' }} />
                    <YAxis stroke="var(--color-text-muted)"
                           label={{ value: keys.label, angle: -90, position: 'insideLeft', fill: 'var(--color-text-muted)' }} />
                    <Tooltip
                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-grid)' }}
                        labelFormatter={(w) => `Week ${w}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey={keys.plan} name="Planned"
                          stroke="var(--color-series-planned)" strokeDasharray="6 4" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey={keys.actual} name="Actual"
                          stroke="var(--color-series-actual)" dot={false} strokeWidth={2.5} />
                </LineChart>
            </ResponsiveContainer>
        </section>
    );
}