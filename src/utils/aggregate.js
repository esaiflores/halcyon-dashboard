export function aggregateByStation(rows, [from, to]) {
    const byStation = new Map();

    for (const r of rows) {
        if (r.week < from || r.week > to) continue;
        const s = byStation.get(r.station) ?? { station: r.station, planned: 0, actual: 0, defects: 0 };
        s.planned += r.planned_units;
        s.actual += r.actual_units;
        s.defects += r.defects;
        byStation.set(r.station, s);
    }

    return [...byStation.values()].map((s) => ({
        ...s,
        defectRate: s.actual ? +((100 * s.defects) / s.actual).toFixed(2) : 0,
        attainment: s.planned ? +((100 * s.actual) / s.planned).toFixed(1) : 0,
    }));
}