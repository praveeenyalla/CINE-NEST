
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function UserActivityChart({ data }) {
    // Fallback data if API hasn't returned yet
    const safeData = data && data.length > 0 ? data : [
        { date: 'Jan 1', "Netflix": 40, "Prime Video": 20, "Hulu": 10, "Disney+": 30 },
        { date: 'Jan 2', "Netflix": 30, "Prime Video": 25, "Hulu": 15, "Disney+": 35 },
    ];

    const platforms = [
        { key: "Netflix", color: "#e50914" },
        { key: "Prime Video", color: "#0071eb" },
        { key: "Hulu", color: "#22bb33" },
        { key: "Disney+", color: "#113c66" } // Navy/Blue for Disney+
    ];

    return (
        <section className="chart-section">
            <div className="header">
                <h3>Platform Traffic</h3>
                <div className="controls">
                    <div className="legend">
                        {platforms.map(p => (
                            <span key={p.key} className="legend-item">
                                <span className="dot" style={{ background: p.color }}></span> {p.key}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={safeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            {platforms.map(p => (
                                <linearGradient key={p.key} id={`color${p.key.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={p.color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={p.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        {platforms.map(p => (
                            <Area
                                key={p.key}
                                type="monotone"
                                dataKey={p.key}
                                stroke={p.color}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#color${p.key.replace(/\s+/g, '')})`}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <style jsx>{`
                .chart-section {
                    background: #191919;
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid #333;
                    grid-column: span 2; /* Spans 2 cols in large grid */
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #fff; }
                .controls { display: flex; align-items: center; gap: 20px; }
                .legend { display: flex; gap: 15px; font-size: 0.8rem; color: #999; flex-wrap: wrap; }
                .legend-item { display: flex; align-items: center; gap: 6px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
                
                .range-select {
                    background: #000;
                    color: #fff;
                    border: 1px solid #333;
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    outline: none;
                    cursor: pointer;
                }
                @media (max-width: 1000px) {
                    .chart-section { grid-column: span 1; }
                }
            `}</style>
        </section>
    );
}
