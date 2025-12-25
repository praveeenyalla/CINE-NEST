
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#e50914', '#0071eb', '#22bb33', '#ff9900', '#8b5cf6', '#f43f5e'];

export default function CategoryAnalytics({ categoryData, topCategoryData }) {
    return (
        <div className="analytics-layout">
            {/* Bar Chart Section */}
            <section className="categories-card">
                <div className="header">
                    <h3>Categories</h3>
                    <div className="legend">
                        <span className="dot red"></span> This Month
                        <span className="dot blue"></span> Last Month
                    </div>
                </div>
                <div className="chart-box">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                cursor={{ fill: '#ffffff10' }}
                            />
                            <Bar dataKey="thisMonth" fill="#e50914" radius={[4, 4, 0, 0]} barSize={12} />
                            <Bar dataKey="lastMonth" fill="#0071eb" radius={[4, 4, 0, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Top Category List & Donut */}
            <section className="top-category-card">
                <div className="header">
                    <h3>Top Category</h3>
                    <button className="period-btn">Today</button>
                </div>
                <div className="top-body">
                    <div className="cat-list">
                        {topCategoryData?.slice(0, 5).map((cat, i) => (
                            <div key={i} className="cat-item">
                                <div className="left">
                                    <span className="dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                                    <span className="name">{cat.name}</span>
                                </div>
                                <span className={`trend ${cat.trend?.startsWith('-') ? 'down' : 'up'}`}>
                                    {cat.trend}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="donut-box">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={topCategoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {topCategoryData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .analytics-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                    grid-column: span 2;
                }
                section {
                    background: #191919;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                h3 { margin: 0; font-size: 1.1rem; color: #fff; }
                
                .legend { display: flex; gap: 12px; font-size: 0.75rem; color: #999; }
                .dot { width: 8px; height: 8px; border-radius: 2px; margin-right: 5px; display: inline-block; }
                .dot.red { background: #e50914; }
                .dot.blue { background: #0071eb; }
                
                .period-btn {
                    background: #000;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    cursor: pointer;
                }
                
                .top-body { display: flex; gap: 1rem; align-items: center; }
                .cat-list { flex: 1; display: flex; flex-direction: column; gap: 12px; }
                .cat-item { display: flex; justify-content: space-between; font-size: 0.8rem; }
                .left { display: flex; align-items: center; gap: 8px; color: #ccc; }
                .left .dot { border-radius: 50%; }
                .trend { font-weight: 700; font-size: 0.7rem; }
                .trend.up { color: #22bb33; }
                .trend.down { color: #e50914; }
                .donut-box { width: 140px; height: 160px; }

                @media (max-width: 1100px) {
                    .analytics-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
