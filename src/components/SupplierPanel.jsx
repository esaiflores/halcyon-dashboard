import { useMemo, useState } from 'react';
import './TrendChart.css'; // reuses .chart-card, .chart-header, .toggle styles
import './SupplierPanel.css';

const SEV_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function SeverityBadge({ level }) {
    return <span className={`badge badge--${level.toLowerCase()}`}>{level}</span>;
}

export default function SupplierPanel({ issues, range }) {
    const [openOnly, setOpenOnly] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [from, to] = range;

    const suppliers = useMemo(() => {
        const inRange = issues.filter(
            (i) => i.opened_week >= from && i.opened_week <= to && (!openOnly || i.status === 'Open')
        );
        const map = new Map();
        for (const i of inRange) {
            const s = map.get(i.supplier) ?? { name: i.supplier, issues: [], critical: 0 };
            s.issues.push(i);
            if (i.severity === 'Critical') s.critical += 1;
            map.set(i.supplier, s);
        }
        return [...map.values()]
            .map((s) => ({
                ...s,
                issues: [...s.issues].sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]),
            }))
            .sort((a, b) => b.critical - a.critical || b.issues.length - a.issues.length);
    }, [issues, from, to, openOnly]);

    const total = suppliers.reduce((n, s) => n + s.issues.length, 0);

    return (
        <section className="chart-card" aria-label="Supplier issues">
            <div className="chart-header">
                <h2>Supplier issues</h2>
                <div className="toggle" role="group" aria-label="Issue status filter">
                    <button
                        className={openOnly ? 'toggle-btn active' : 'toggle-btn'}
                        onClick={() => setOpenOnly(true)}
                        aria-pressed={openOnly}
                    >
                        Open
                    </button>
                    <button
                        className={!openOnly ? 'toggle-btn active' : 'toggle-btn'}
                        onClick={() => setOpenOnly(false)}
                        aria-pressed={!openOnly}
                    >
                        All
                    </button>
                </div>
            </div>

            <p className="panel-note">
                {total} {openOnly ? 'open' : ''} issues opened in weeks {from} to {to}
            </p>

            {suppliers.length === 0 ? (
                <p className="empty">No issues match this filter.</p>
            ) : (
                <table className="supplier-table">
                    <thead>
                    <tr>
                        <th>Supplier</th>
                        <th className="num">Issues</th>
                        <th className="num">Critical</th>
                        <th aria-label="Expand" />
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((s) => {
                        const isOpen = expanded === s.name;
                        return (
                            <FragmentRow key={s.name} supplier={s} isOpen={isOpen}
                                         onToggle={() => setExpanded(isOpen ? null : s.name)} />
                        );
                    })}
                    </tbody>
                </table>
            )}
        </section>
    );
}

function FragmentRow({ supplier, isOpen, onToggle }) {
    return (
        <>
            <tr className="supplier-row">
                <td>{supplier.name}</td>
                <td className="num">{supplier.issues.length}</td>
                <td className="num">
                    {supplier.critical > 0 ? <SeverityBadge level="Critical" /> : '–'}
                    {supplier.critical > 1 ? ` × ${supplier.critical}` : ''}
                </td>
                <td className="num">
                    <button className="expand-btn" onClick={onToggle} aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} issues for ${supplier.name}`}>
                        {isOpen ? '▾' : '▸'}
                    </button>
                </td>
            </tr>
            {isOpen && (
                <tr className="detail-row">
                    <td colSpan={4}>
                        <ul className="issue-list">
                            {supplier.issues.map((i) => (
                                <li key={i.id}>
                                    <SeverityBadge level={i.severity} />
                                    <span className="issue-id">{i.id}</span>
                                    <span>opened week {i.opened_week}</span>
                                    <span className="issue-status">{i.status} · {i.days_open} days</span>
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
            )}
        </>
    );
}