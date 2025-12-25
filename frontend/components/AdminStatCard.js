export default function AdminStatCard({ title, value, trend, trendValue, icon, color }) {
  return (
    <div className="stat-card">
      <div className="card-top">
        <div className="card-info">
          <span className="card-title">{title}</span>
          <h2 className="card-value">{value}</h2>
        </div>
        <div className="icon-circle" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
      </div>
      <div className="card-bottom">
        <div className={`trend ${trend}`}>
          <span className="trend-val">{trend === 'down' ? `- ${trendValue}` : `+ ${trendValue}`}</span>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background: #0f0f0f;
          padding: 1.2rem;
          border-radius: 12px;
          border: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 120px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .card-title {
          font-size: 0.75rem;
          color: #fff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-value {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
        }

        .icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .card-bottom {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .trend {
          font-size: 0.75rem;
          font-weight: 800;
        }

        .trend.up { color: #10b981; }
        .trend.down { color: #f43f5e; }
      `}</style>
    </div>
  );
}
