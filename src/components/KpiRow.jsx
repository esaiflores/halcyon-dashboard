import './KpiRow.css';

function KpiCard({ label, value, status }) {
    return (
        <div className={`kpi-card kpi-card--${status}`}>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
        </div>
    );
}

export default function KpiRow({ kpis }) {
    return (
        <section className="kpi-row" aria-label="Key performance indicators">
            <KpiCard label="Units delivered" value={`${kpis.units_delivered} / ${kpis.units_planned}`} status="good" />
            <KpiCard label="On schedule" value={`${kpis.on_schedule_pct}%`} status={kpis.on_schedule_pct >= 95 ? 'good' : 'warn'} />
            <KpiCard label="Defect rate" value={`${kpis.defect_rate_pct}%`} status={kpis.defect_rate_pct <= 3 ? 'good' : 'bad'} />
            <KpiCard label="Open supplier issues" value={`${kpis.open_supplier_issues} (${kpis.critical_open_issues} critical)`} status={kpis.critical_open_issues > 0 ? 'warn' : 'good'} />
        </section>
    );
}