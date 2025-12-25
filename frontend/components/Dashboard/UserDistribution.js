
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#e50914', '#0071eb', '#ff9900', '#22bb33'];

export default function UserDistribution({ userData }) {
    return (
        <section className="dist-card">
            <h3>User Distribution</h3>
            <div className="content-wrapper">
                <div className="chart-area">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={userData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {userData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="center-text">
                        <span className="total">Stats</span>
                    </div>
                </div>

                <div className="legend-grid">
                    {userData?.map((item, i) => (
                        <div key={i} className="legend-item">
                            <span className="bar" style={{ background: COLORS[i % COLORS.length] }}></span>
                            <div className="info">
                                <span className="label">{item.name}</span>
                                <span className="value">{item.value?.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .dist-card {
                    background: #191919;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                h3 { margin: 0 0 1.5rem 0; font-size: 1.1rem; color: #fff; }
                
                .content-wrapper { display: flex; flex-direction: column; gap: 1rem; }
                
                .chart-area { position: relative; height: 200px; }
                .center-text {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    color: #fff;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                }
                
                .legend-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-top: 10px;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #000;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #222;
                }
                .bar { width: 4px; height: 24px; border-radius: 2px; }
                .info { display: flex; flex-direction: column; }
                .label { font-size: 0.7rem; color: #777; font-weight: 600; }
                .value { font-size: 0.9rem; color: #eee; font-weight: 700; }
            `}</style>
        </section>
    );
}
