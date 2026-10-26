import './WeekFilter.css';

export default function WeekFilter({ range, onChange, max = 52 }) {
    const [from, to] = range;

    return (
        <section className="filter-card" aria-label="Week range filter">
            <label>
                From week {from}
                <input type="range" min={1} max={max} value={from}
                       onChange={(e) => onChange([Math.min(+e.target.value, to), to])} />
            </label>
            <label>
                To week {to}
                <input type="range" min={1} max={max} value={to}
                       onChange={(e) => onChange([from, Math.max(+e.target.value, from)])} />
            </label>
            <button className="reset-btn" onClick={() => onChange([1, max])}>Reset</button>
        </section>
    );
}