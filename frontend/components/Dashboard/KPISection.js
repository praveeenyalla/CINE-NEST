
import { FaEye, FaStar, FaDownload, FaUsers } from 'react-icons/fa';

export default function KPISection({ stats }) {
    const cards = [
        {
            title: "Total Views",
            value: stats?.total_views || "+24K", // Fallback/Real mapping needed
            trend: "-50%",
            trendUp: false,
            icon: <FaEye />,
            color: "#e50914"
        },
        {
            title: "Rated This App",
            value: "+55K", // Hardcoded per Image 3 constraint if not in stats
            trend: "-50%",
            trendUp: false,
            icon: <FaStar />,
            color: "#ff9900"
        },
        {
            title: "Downloaded",
            value: "+1M",
            trend: "-80%",
            trendUp: false,
            icon: <FaDownload />,
            color: "#0071eb"
        },
        {
            title: "Visitors",
            value: "+2M",
            trend: "-80%",
            trendUp: false,
            icon: <FaUsers />,
            color: "#22bb33"
        }
    ];

    return (
        <section className="kpi-grid">
            {cards.map((card, idx) => (
                <div key={idx} className="kpi-card">
                    <div className="card-header">
                        <span className="title">{card.title}</span>
                        <span className={`trend-badge ${card.trendUp ? 'up' : 'down'}`}>
                            {card.trend}
                        </span>
                    </div>
                    <div className="card-body">
                        <h2 className="value">{card.value}</h2>
                        <div className="icon-box" style={{ background: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
            <style jsx>{`
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .kpi-card {
                    background: #191919;
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid #333;
                    transition: transform 0.2s;
                }
                .kpi-card:hover {
                    transform: translateY(-2px);
                    border-color: #555;
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .title {
                    color: #9ca3af;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .trend-badge {
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-weight: 700;
                }
                .trend-badge.down {
                    background: rgba(229, 9, 20, 0.2);
                    color: #e50914;
                }
                .trend-badge.up {
                    background: rgba(34, 187, 51, 0.2);
                    color: #22bb33;
                }
                .card-body {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .value {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin: 0;
                    color: #fff;
                }
                .icon-box {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
            `}</style>
        </section>
    );
}
