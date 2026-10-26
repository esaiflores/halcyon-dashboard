import { useMemo, useState } from 'react';
import { scaleLinear } from 'd3';
import { TARGET } from '../config';
import './TrendChart.css'; // reuses .chart-card, .chart-header, .toggle styles
import './Heatmap.css';

const COOL = '#164e63';
const AMBER = '#fbbf24';
const RED = '#ef4444';

// A D3 scale maps a data value to a color, like mapping a value to pixels
const METRICS = {
    defects: {
        label: 'Defect rate',
        value: (r) => (r.actual_units ? (100 * r.defects) / r.actual_units : 0),
        scale: scaleLinear().domain([0, TARGET, 10]).range([COOL, AMBER, RED]).clamp(true),
        min: 0,
        max: 10,
    },
    output: {
        label: 'Output vs plan',
        value: (r) => (r.planned_units ? (100 * r.actual_units) / r.planned_units : 0),
        scale: scaleLinear().domain([60, 85, 100]).range([RED, AMBER, COOL]).clamp(true),
        min: 60,
        max: 100,
    },
};

const W = 1000;
const LABEL_W = 170;
const CELL_H = 30;
const AXIS_H = 28;

export default function Heatmap({ rows, range }) {
    const [metricKey, setMetricKey] = useState('defects');
    const metric = METRICS[metricKey];
    const [from, to] = range;

    const weeks = useMemo(
        () => Array.from({ length: to - from + 1 }, (_, i) => from + i),
        [from, to]
    );
    const stations = useMemo(() => [...new Set(rows.map((r) => r.station))], [rows]);
    const lookup = useMemo(
        () => new Map(rows.map((r) => [`${r.station}|${r.week}`, r])),
        [rows]
    );

    const cellW = (W - LABEL_W) / weeks.length;
    const tickStep = weeks.length > 26 ? 4 : weeks.length > 13 ? 2 : 1;
    const height = stations.length * CELL_H + AXIS_H;

    const legendStops = Array.from({ length: 11 }, (_, i) =>
        metric.scale(metric.min + ((metric.max - metric.min) * i) / 10)
    );

    return (
        <section className="chart-card" aria-label="Station health heatmap">
            <div className="chart-header">
                <h2>Station health by week</h2>
                <div className="toggle" role="group" aria-label="Heatmap metric">
                    {Object.entries(METRICS).map(([key, m]) => (
                        <button
                            key={key}
                            className={key === metricKey ? 'toggle-btn active' : 'toggle-btn'}
                            onClick={() => setMetricKey(key)}
                            aria-pressed={key === metricKey}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            <svg viewBox={`0 0 ${W} ${height}`} width="100%" role="img"
                 aria-label={`${metric.label} by station and week, weeks ${from} to ${to}`}>
                {stations.map((station, row) => (
                    <g key={station}>
                        <text x={LABEL_W - 10} y={row * CELL_H + CELL_H / 2} textAnchor="end"
                              dominantBaseline="middle" fill="var(--color-text-muted)" fontSize="13">
                            {station}
                        </text>
                        {weeks.map((w, col) => {
                            const r = lookup.get(`${station}|${w}`);
                            if (!r) return null;
                            const v = metric.value(r);
                            return (
                                <rect key={w} x={LABEL_W + col * cellW} y={row * CELL_H}
                                      width={Math.max(cellW - 1, 1)} height={CELL_H - 2} rx="2"
                                      fill={metric.scale(v)}>
                                    <title>{`${station}, week ${w}: ${v.toFixed(1)}% ${metric.label.toLowerCase()}`}</title>
                                </rect>
                            );
                        })}
                    </g>
                ))}
                {weeks.map((w, col) =>
                    (w - from) % tickStep === 0 ? (
                        <text key={w} x={LABEL_W + col * cellW + cellW / 2} y={stations.length * CELL_H + 16}
                              textAnchor="middle" fill="var(--color-text-muted)" fontSize="11">
                            {w}
                        </text>
                    ) : null
                )}
            </svg>

            <div className="legend">
                <span>{metric.min}%</span>
                <div className="legend-bar" style={{ background: `linear-gradient(to right, ${legendStops.join(',')})` }} />
                <span>{metric.max}%</span>
            </div>
        </section>
    );
}