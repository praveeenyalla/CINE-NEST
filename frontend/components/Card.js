export default function Card({ title, value, icon, trend }) {
    return (
        <div className="card">
            <div className="card-content">
                <div className="card-info">
                    <h3>{title}</h3>
                    <p className="card-value">{value}</p>
                    {trend && <span className={`trend ${trend.startsWith('+') ? 'up' : 'down'}`}>{trend}</span>}
                </div>
                <div className="card-icon">{icon}</div>
            </div>
            <style jsx>{`
        .card {
          background: #111;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          flex: 1;
          min-width: 200px;
        }
        .card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h3 {
          margin: 0;
          color: #9ca3af;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .card-value {
          margin: 8px 0;
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
        }
        .trend {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .down { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .card-icon {
          font-size: 2rem;
          opacity: 0.5;
        }
      `}</style>
        </div>
    );
}
