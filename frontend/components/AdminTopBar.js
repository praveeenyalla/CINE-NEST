export default function AdminTopBar() {
  return (
    <header className="topbar">
      <div className="top-nav-links">
        <span className="home-icon">🏠</span>
        <span className="link active">Home</span>
        <span className="link">Movie List</span>
        <span className="link dropdown">TV Shows <span className="chevron-mini">›</span></span>
      </div>

      <div className="topbar-actions">
        <div className="action-icons">
          <span className="icon">🔍</span>
          <span className="icon relative">
            🔔
            <span className="dot"></span>
          </span>
          <span className="icon relative">
            💬
            <span className="dot"></span>
          </span>
          <span className="icon">🌙</span>
          <span className="icon">⚙️</span>
        </div>

        <div className="user-profile">
          <div className="profile-info">
            <span className="user-name">Austin Robertson</span>
            <span className="user-role">Marketing Administrator</span>
          </div>
          <div className="user-avatar">
            <img src="https://i.pravatar.cc/150?u=austin" alt="Avatar" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          height: 70px;
          background: #000;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: fixed;
          top: 0;
          left: 260px;
          right: 0;
          z-index: 900;
        }

        .top-nav-links {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          color: #999;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .home-icon {
            background: #e50914;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            color: #fff;
        }

        .link { cursor: pointer; transition: 0.3s; }
        .link.active { color: #e50914; }
        .link:hover { color: #fff; }

        .chevron-mini { font-size: 0.9rem; margin-bottom: 2px; }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .action-icons {
          display: flex;
          gap: 1.5rem;
          color: #9ca3af;
          align-items: center;
        }

        .icon {
          font-size: 1.2rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .relative { position: relative; }
        .dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #e50914;
          border-radius: 50%;
          border: 2px solid #000;
        }

        .icon:hover {
          color: #fff;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .user-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: #fff;
        }

        .user-role {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 500;
        }

        .user-avatar img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #333;
          object-fit: cover;
        }
      `}</style>
    </header>
  );
}
